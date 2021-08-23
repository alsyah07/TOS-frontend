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
          <template v-slot:item.allowed_extension="{ item }">
            <v-chip
              color="grey lighten-3"
              small
              v-for="(val, idx) in item.allowed_extension"
              :key="idx"
              class="mr-1"
            >
              {{ val }}
            </v-chip>
          </template>
        </datatable>
      </div>
    </div>
    <form-file-category
      ref="form"
      module="file-category"
      :success="formSuccess"
    />
    <delete-dialog
      ref="delete"
      url="file-category"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormFileCategory from "./FormFileCategory";

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Dokumen", route: "" },
      { title: "Kategori" },
    ]);
  },
  data() {
    return {
      title: "Kategori",
      url: "file-category/data",
      columns: [
        {
          value: "id",
        },
        {
          text: "Slug",
          value: "slug",
          sortable: true,
          searchable: true,
        },
        {
          text: "Nama Kategori",
          value: "name",
          sortable: true,
          searchable: true,
        },
        {
          text: "Extensi yang diizinkan",
          value: "allowed_extension",
          sortable: false,
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
      this.$refs.form.open(item.id);
    },
    onClickDelete(item) {
      this.$refs.delete.open(item.id);
    },
    formSuccess() {
      this.$refs.datatable.getData();
    },
    deleteSuccess() {
      this.$refs.datatable.getData();
    },
  },
  components: {
    Datatable,
    DeleteDialog,
    FormFileCategory,
  },
};
</script>
