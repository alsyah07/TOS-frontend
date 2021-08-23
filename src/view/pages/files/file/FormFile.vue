<template>
  <v-dialog v-if="opened" v-model="opened" max-width="400">
    <v-card>
      <v-card-title class="headline">
        <v-btn icon @click="close()" class="ml-auto">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row class="mb-10">
          <v-col cols="12">
            <v-select
              v-if="action == 'create'"
              label="Kategori"
              placeholder="Pilih Kategori"
              clearable
              dense
              outlined
              v-model="category"
              :items="listCategory"
              item-text="name"
              item-value="slug"
            ></v-select>
            <file-upload
              v-model="dataFile"
              :category="category"
              :multiple="action == 'create'"
              :on-success="success"
              :on-success-delete="success"
            ></file-upload>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FileUpload from "@/view/component/FileUpload.vue";
import ApiService from "@/core/services/api.service";

export default {
  async mounted() {
    const categories = await ApiService.get("file-category/list");
    this.listCategory = categories.data;
  },
  props: {
    success: {
      type: Function,
      default: function() {},
    },
  },
  data: function() {
    return {
      action: "create",
      opened: false,
      dataFile: null,
      category: null,
      listCategory: [],
    };
  },
  methods: {
    open(item) {
      if (item) {
        this.dataFile = item.id;
        this.category = item.categorySlug;
        this.action = "update";
      } else {
        this.action = "create";
        this.dataFile = null;
      }
      this.opened = true;
    },
    close() {
      this.opened = false;
      this.category = null;
    },
  },
  components: {
    FileUpload,
  },
};
</script>

<style></style>
