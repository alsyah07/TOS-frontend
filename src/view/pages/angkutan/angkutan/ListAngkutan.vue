<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          module="angkutan"
          :title="title"
          :url="url"
          :columns="columns"
          :on-click-create="onClickCreate"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
        >
          <template v-slot:item.nama="{ item }">
            <strong>{{ item.nama }}</strong>
          </template>
        </datatable>
      </div>
    </div>
    <form-angkutan ref="form" module="angkutan" :success="formSuccess" />
    <delete-dialog
      ref="delete"
      url="pob"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormAngkutan from "./FormAngkutan.vue";

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Operasional Terminal", route: "" },
      { title: "Data Kendaraan" },
    ]);
  },
  data() {
    return {
      title: "Data Kendaraan",
      url: "angkutan/data",
      columns: [
        {
          value: "id",
        },
        {
          text: "No. Kendaraan",
          value: "no_kendaraan",
          sortable: true,
          searchable: true,
        },
        {
          text: "Trayek",
          value: "nama_trayek",
          sortable: true,
          searchable: true,
        },
        {
          text: "Pob",
          value: "nama_pob",
          sortable: true,
          searchable: true,
        },
        {
          text: "No. Uji",
          value: "no_uji",
          sortable: true,
          searchable: true,
        },
        {
          text: "Tahun Buat",
          value: "tahun_buat",
          sortable: true,
          searchable: true,
        },
        {
          text: "Kapasitas",
          value: "kapasitas",
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
    FormAngkutan,
  },
};
</script>
