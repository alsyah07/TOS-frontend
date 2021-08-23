<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          module="user"
          :title="title"
          :url="url"
          :columns="columns"
          :filter="filter"
          :on-click-create="onClickCreate"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
        >
        <template v-slot:action>
          <v-col md="3">
            <v-select
                  label="Role"
                  required
                  dense
                  outlined
                  v-model="filterRole"
                  :items="listRole"
                  item-text="name"
                  item-value="id"
                  clearable
                ></v-select>
          </v-col>
        </template>
          <template v-slot:item.active="{ item }">{{
            item.active ? "Aktif" : "Tidak Aktif"
          }}</template>
        </datatable>
      </div>
    </div>
    <form-user ref="form" module="user" :success="formSuccess" />
    <delete-dialog
      ref="delete"
      url="user"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormUser from "./FormUser";
import ApiService from "@/core/services/api.service";

export default {
  async mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Manajemen User", route: "" },
      { title: "User" },
    ]);

    const { data } = await ApiService.get("role/list");
    this.listRole = data;
  },
  data() {
    return {
      title: "User",
      url: "user/data",
      columns: [
        {
          value: "id",
        },
        {
          text: "Username",
          value: "username",
          sortable: true,
          searchable: true,
        },
        {
          text: "Nama Lengkap",
          value: "name",
          sortable: true,
          searchable: true,
        },
        {
          text: "Email",
          value: "email",
          sortable: true,
          searchable: true,
        },
        {
          text: "Role",
          value: "role_name",
          sortable: true,
          searchable: true,
        },
        {
          text: "Wilayah",
          value: "zone_name",
          sortable: true,
          searchable: true,
        },
        {
          text: "Aktif",
          value: "active",
          sortable: true,
          searchable: false,
        },
      ],
      listRole: [],
      filterRole: null,
      filter: null
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
  watch:{
    filterRole(v) {
      if(v){
        this.filter = [{
          "column": "active_role",
          "value": v
        }];
      }else{
        this.filter = null
      }
    }
  },
  components: {
    Datatable,
    DeleteDialog,
    FormUser,
  },
};
</script>
