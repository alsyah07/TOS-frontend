<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          :title="title"
          :url="url"
          :columns="columns"
          :on-click-create="onClickCreate"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
          module="zone"
        >
          <template v-slot:item.level="{ item }">
            {{ findLevel(item.level) }}
          </template>
          <template v-slot:item.active="{ item }">
            {{ item.active ? "Aktif" : "Tidak Aktif"  }}
          </template>
        </datatable>
      </div>
    </div>
    <form-zone ref="form" module="zone" :success="formSuccess" />
    <delete-dialog
      ref="delete"
      url="zone"
      module="zone"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormZone from "./FormZone";
import { filter } from "lodash";
import ApiService from "@/core/services/api.service";

export default {
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Manajemen User", route: "" },
      { title: "Wilayah" },
    ]);

    ApiService.get("zone/level").then(({ data }) => {
      this.listLevel = data;
    });
  },
  data() {
    return {
      title: "Wilayah",
      url: "zone/data",
      columns: [
        {
          value: "id",
        },
        {
          text: "Kode",
          value: "code",
          sortable: true,
          searchable: true,
        },
        {
          text: "Level",
          value: "level",
          sortable: true,
          searchable: true,
        },
        {
          text: "Nama Wilayah / SKPD",
          value: "name",
          sortable: true,
          searchable: true,
          width: 400,
        },
        {
          text: "Status",
          value: "active",
          sortable: true,
          searchable: false,
          
        },
      ],
      listLevel: [],
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
    findLevel(level) {
      const filtered = filter(this.listLevel, (v) => {
        return v.value == level;
      });
      if (filtered.length > 0) {
        return filtered[0].text;
      } else {
        return "";
      }
    },
  },
  components: {
    Datatable,
    DeleteDialog,
    FormZone,
  },
};
</script>
