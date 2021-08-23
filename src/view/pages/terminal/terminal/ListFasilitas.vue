<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <v-row>
          <v-col cols="12" align="right">
            <v-btn
              depressed
              class="ma-1"
              color="primary"
              small
              @click="onClickCreate()"
              right
            >
              <v-icon small left>mdi-plus</v-icon>
              Tambah Fasilitas
            </v-btn>
          </v-col>
        </v-row>
        <datatable
          ref="datatable"
          module="terminal"
          :title="title"
          :url="url"
          :columns="columns"
          :on-click-create="onClickCreate"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
          disable-create
          :disable-action="!canEdit"
        >
          <template v-slot:item.kategori="{ item }">
            {{
              item.kategori == "fasilitas-utama"
                ? "Fasilitas Utama"
                : "Fasilitas Penunjang"
            }}
          </template>
          <template v-slot:item.gambar="{ item }">
            <div
              v-if="item.gambar != null && item.gambar.length > 0"
              style="margin: 10px 0;"
            >
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
    <form-fasilitas
      ref="form"
      module="terminal"
      :success="formSuccess"
      :terminal="terminal"
    />
    <delete-dialog
      ref="delete"
      url="fasilitas"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormFasilitas from "./FormFasilitas.vue";

export default {
  props: {
    terminal: String,
    canEdit: Boolean,
  },
  mounted() {},
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
          value: "gambar",
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
    FormFasilitas,
  },
};
</script>
