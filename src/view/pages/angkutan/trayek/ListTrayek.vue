<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          module="trayek"
          :title="title"
          :url="url"
          :columns="columns"
          :on-click-create="onClickCreate"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
        >
        </datatable>
      </div>
    </div>
    <form-trayek ref="form" module="trayek" :success="formSuccess" />
    <delete-dialog
      ref="delete"
      url="trayek"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormTrayek from "./FormTrayek.vue";

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Angkutan", route: "" },
      { title: "Trayek" },
    ]);
  },
  data() {
    return {
      title: "Trayek",
      url: "trayek/data",
      columns: [
        {
          value: "id",
        },
        {
          text: "Kode",
          value: "kode",
          sortable: true,
          searchable: true,
        },
        {
          text: "Nama",
          value: "nama",
          sortable: true,
          searchable: true,
        },
        {
          text: "Deskripsi",
          value: "deskripsi",
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
    FormTrayek,
  },
};
</script>
