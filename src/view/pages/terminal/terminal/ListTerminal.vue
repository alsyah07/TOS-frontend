<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          module="terminal"
          :title="title"
          :url="url"
          :columns="columns"
          :on-click-create="onClickCreate"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
        >
          <template v-slot:item.gambar="{ item }">
            <div
              v-if="item.gambar && item.gambar.length > 0"
              style="margin: 10px 0;"
            >
              <v-img
                :lazy-src="item.gambar[0].url"
                max-height="100"
                max-width="120"
                :src="item.gambar[0].url"
                style="border-radius: 8px;"
              ></v-img>
            </div>
          </template>
        </datatable>
      </div>
    </div>
    <form-terminal ref="form" module="terminal" :success="formSuccess" />
    <delete-dialog
      ref="delete"
      url="terminal"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormTerminal from "./FormTerminal.vue";

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Terminal", route: "" },
      { title: "Data Terminal" },
    ]);
  },
  data() {
    return {
      title: "Terminal",
      url: "terminal/data",
      columns: [
        {
          value: "id",
        },
        // {
        //   text: "Gambar",
        //   value: "gambar",
        // },
        {
          text: "Nama Terminal",
          value: "name",
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
          value: "address",
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
    FormTerminal,
  },
};
</script>
