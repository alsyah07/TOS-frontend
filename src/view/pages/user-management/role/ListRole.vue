<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          module="role"
          :title="title"
          :url="url"
          :columns="columns"
          :on-click-create="onClickCreate"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
        ></datatable>
      </div>
    </div>
    <form-role ref="form" module="role" :success="formSuccess" />
    <delete-dialog
      ref="delete"
      url="role"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormRole from "./FormRole";

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Manajemen User", route: "" },
      { title: "Role" },
    ]);
  },
  data() {
    return {
      title: "Role",
      url: "role/data",
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
          text: "Nama Role",
          value: "name",
          sortable: true,
          searchable: true,
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
    FormRole,
  },
};
</script>
