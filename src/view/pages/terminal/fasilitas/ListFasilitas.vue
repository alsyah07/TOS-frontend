<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          module="fasilitas"
          :title="title"
          :url="url"
          :columns="columns"
          :on-click-create="onClickCreate"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
          disableAction
        >
          <template v-slot:item.gambar="{ item }">
            <div v-if="item.gambar.length > 0" style="margin: 10px 0;">
              <v-img
                :lazy-src="item.gambar[0].url"
                max-height="120"
                max-width="160"
                :src="item.gambar[0].url"
                style="border-radius: 8px;"
              ></v-img>
            </div>
          </template>
        </datatable>
      </div>
    </div>
    <delete-dialog
      ref="delete"
      url="fasilitas"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Fasilitas", route: "" },
      { title: "Data Fasilitas" },
    ]);
  },
  data() {
    return {
      title: "Fasilitas",
      url: "fasilitas/data",
      columns: [
        {
          value: "id",
        },
        {
          text: "Gambar",
          value: "gambar"
        },
        {
          text: "Kategori",
          value: "kategori",
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
  },
};
</script>
