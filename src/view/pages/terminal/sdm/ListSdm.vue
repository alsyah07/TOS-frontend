<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          module="sdm"
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
    <form-sdm ref="form" module="sdm" :success="formSuccess" />
    <delete-dialog
      ref="delete"
      url="sdm"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormSdm from "./FormSdm.vue";

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "SDM", route: "" },
      { title: "Data SDM" },
    ]);
  },
  data() {
    return {
      title: "SDM",
      url: "sdm/data",
      columns: [
        {
          value: "id",
        },
        {
          text: "NIP",
          value: "nip",
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
          text: "Jabatan",
          value: "jabatan",
          sortable: true,
          searchable: true,
        },
        {
          text: "Tipe",
          value: "tipe",
          sortable: true,
          searchable: true,
        },
        {
          text: "Alamat",
          value: "alamat",
          sortable: true,
          searchable: true,
        },
        {
          text: "Telepon",
          value: "telepon",
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
    FormSdm
  },
};
</script>
