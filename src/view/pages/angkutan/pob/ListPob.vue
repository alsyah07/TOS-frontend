<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          module="pob"
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
    <form-pob ref="form" module="pob" :success="formSuccess" />
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
import FormPob from "./FormPob.vue";

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Operasional Terminal", route: "" },
      { title: "Perusahaan Otobus" },
    ]);
  },
  data() {
    return {
      title: "Perusahaan Otobus",
      url: "pob/data",
      columns: [
        {
          value: "id",
        },
        {
          text: "Nama",
          value: "nama",
          sortable: true,
          searchable: true,
        },
        {
          text: "No. Izin",
          value: "no_izin",
          sortable: true,
          searchable: true,
        },
        {
          text: "Alamat",
          value: "alamat",
          sortable: true,
          searchable: true,
          width: 400,
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
    FormPob,
  },
};
</script>
