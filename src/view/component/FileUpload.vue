<template>
  <div>
    <div v-if="label != null" class="text-subtitle-1">{{ label }}</div>
    <file-pond
      name="file"
      ref="pond"
      label-idle="Drop files here... or <span class='filepond--label-action badge badge-primary ml-2'>Browse</span>"
      v-bind:files="files"
      v-on:init="handleFilePondInit"
      :allow-multiple="multiple"
      :max-files="maxFiles"
      :max-file-size="maxFileSize"
      :server="server"
      :onprocessfile="uploaded"
      :onprocessfiles="onFinish"
      :onactivatefile="fileClicked"
      :onremovefile="removeFile"
      :required="required"
      :accepted-file-types="acceptedFileTypes"
    />
  </div>
</template>

<script>
import vueFilePond, { setOptions } from "vue-filepond";

// Import plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js";
import FilePondPluginImagePreview from "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

// Import styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import JwtService from "@/core/services/jwt.service";
import ApiService from "@/core/services/api.service";

import { isArray, forEach, find, floor } from "lodash";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
);

export default {
  props: {
    value: [Array, String],
    category: {
      type: String,
      default: null,
    },
    acceptedFileTypes: {
      type: String,
      default: null,
    },
    maxFileSize: {
      type: String,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    maxFiles: {
      type: Number,
      default: 5,
    },
    onSuccess: {
      type: Function,
      default: function() {},
    },
    onSuccessDelete: {
      type: Function,
      default: function() {},
    },
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: null,
    },
  },
  async mounted() {
    this.fetchInput();
    this.fetchCategory();
  },
  data() {
    return {
      serverId: null,
      ids: [],
      filesData: [],
      files: [],
      fileUrl: null,
      inside: false,
      server: {
        url: process.env.VUE_APP_SERVER_URL,
        instantUpload: false,
        process: {
          url: "/file/upload",
          method: "POST",
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JwtService.getToken()}`,
          },
        },
        load: async (uniqueFileId, load, error, progress, abort) => {
          const objfile = find(this.filesData, { id: uniqueFileId });
          if (objfile) {
            await fetch(objfile.url)
              .then(async (res) => await res.blob())
              .then(async (fl) => {
                fl.name = objfile.name;
                await load(fl);
              })
              .catch(() => {
                abort();
              });
          }
        },
        revert: async (source, load, error) => {
          try {
            await ApiService.delete(
              "file/delete?id=" + source + "&action=revert"
            );
            this.removeFile(source);
          } catch (err) {
            error(err);
          }
        },
      },
    };
  },
  methods: {
    getFileID(serverId){
      return serverId ? JSON.parse(serverId).id : null;
    },
    handleFilePondInit: function() {
      // console.log("FilePond has initialized");
      // example of instance method call on pond reference
      //   this.$refs.pond.getFiles();
    },
    fileClicked(file) {
      const objfile = find(this.filesData, { id: this.getFileID(file.serverId) });
      window.open(objfile.url);
    },
    async uploaded(err, file) {
      
      this.ids.push(this.getFileID(file.serverId));
      this.bindInput();
    },
    async onFinish() {
      this.onSuccess();
    },
    async refresh() {
      if (this.ids.length <= 0) {
        this.files = [];
        this.filesData = [];
        return;
      }
      const { data } = await ApiService.post("file/load", {
        fileId: this.ids,
      });

      let _filesData = [];
      let _files = [];
      forEach(data, (value) => {
        _filesData.push(value); // id, name, size, type, url
        _files.push({
          source: value.id,
          options: {
            type: "local",
          },
        });
      });

      this.files = _files;
      this.filesData = _filesData;
    },
    async removeFile(err, file) {
      if (!file) {
        return;
      }

      const id = this.getFileID(file.serverId);
      if (id) {
        await ApiService.delete("file/delete?id=" + id);
        this.ids.splice(this.ids.indexOf(id), 1);
        this.bindInput();
        this.onSuccessDelete();
      }
    },
    bindInput() {
      const ids = this.ids;
      this.inside = true;
      if (!this.multiple) {
        if (ids.length > 0) {
          this.$emit("input", ids[0]);
        } else {
          this.$emit("input", null);
        }
      } else {
        this.$emit("input", ids);
      }
    },
    fetchInput() {
      if (this.value) {
        let ids = [];
        if (!isArray(this.value)) {
          ids = [this.value];
        } else {
          ids = this.value;
        }

        this.ids = ids;
        this.refresh();
      } else {
        this.ids = [];
        this.refresh();
      }
    },
    async fetchCategory() {
      if (this.category) {
        // fetch category obj
        const { data } = await ApiService.get(
          "file/category?slug=" + this.category
        );
        this.acceptedFileTypes = data.allowed_extension.join(",");

        this.server.process.url = "/file/upload/" + data.slug;
        if (data.maxFileSize) {
          this.maxFileSize = data.max_file_size + "KB";
        } else {
          this.maxFileSize = null;
        }
      } else {
        const { data } = await ApiService.get("file/default");
        this.server.process.url = "/file/upload";
        this.maxFileSize = floor(data.max_file_size / 1024 / 1024) + "MB";
        this.acceptedFileTypes = data.allowed_extension;
      }

      setOptions({
        server: this.server,
      });
    },
  },
  components: {
    FilePond,
  },
  watch: {
    category() {
      this.fetchCategory();
    },
    value() {
      if (!this.inside) {
        this.fetchInput();
      }
      this.inside = false;
    },
  },
};
</script>

<style lang="scss">
.filepond--root .filepond--drop-label {
  background-color: transparent !important;
}
.filepond--label-action {
  text-decoration: none;
  cursor: pointer;
}
.filepond--root {
  background-color: transparent !important;
  margin-bottom: 10px;
}
.filepond--panel {
  background-color: transparent !important;
}
.filepond--panel-root {
  background-color: transparent !important;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.filepond--panel-bottom.filepond--panel-root {
  padding-bottom: 10px;
}
</style>
