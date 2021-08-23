<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          module="file-category"
          :title="title"
          :url="url"
          :columns="columns"
          :on-click-create="onClickCreate"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
        >
          <template v-slot:item.size="{ item }">
            {{ bytesToSize(item.size) }}
          </template>
        </datatable>
      </div>
    </div>
    <form-file ref="form" module="file" :success="formSuccess" />
    <delete-dialog
      ref="delete"
      url="file/delete"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormFile from "./FormFile";

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Pengaturan Dokumen", route: "" },
      { title: "Dokumen" },
    ]);
  },
  data() {
    return {
      title: "Dokumen",
      url: "file/data",
      columns: [
        {
          value: "id",
        },
        {
          value: "category_slug",
        },
        {
          text: "Nama File",
          value: "name",
          sortable: true,
          searchable: true,
        },
        {
          text: "Kategori",
          value: "category_name",
          sortable: true,
          searchable: true,
        },
        {
          text: "Extensi",
          value: "extension",
          sortable: true,
          searchable: true,
        },
        {
          text: "Ukuran File",
          value: "size",
          sortable: true,
          searchable: false,
        },
      ],
    };
  },
  methods: {
    onClickCreate() {
      this.$refs.form.open();
    },
    onClickUpdate(item) {
      this.$refs.form.open(item);
    },
    onClickDelete(item) {
      this.$refs.delete.open(item.id);
    },
    formSuccess() {
      this.$refs.datatable.refresh();
    },
    deleteSuccess() {
      this.$refs.datatable.refresh();
    },
    bytesToSize(bytes) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },
  },
  components: {
    Datatable,
    DeleteDialog,
    FormFile,
  },
};
</script>
