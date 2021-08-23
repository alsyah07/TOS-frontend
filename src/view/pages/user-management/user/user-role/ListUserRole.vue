<template>
  <div>
    <div class="card card-custom gutter-b">
      <div class="card-body">
        <datatable
          ref="datatable"
          :title="title"
          :url="url"
          :columns="columns"
          :on-click-update="onClickUpdate"
          :on-click-delete="onClickDelete"
          disable-create
          disable-search
          :disable-action="!canEdit"
        >
          <template v-if="canEdit" v-slot:action>
            <v-btn
              depressed
              class="ma-1"
              color="primary"
              small
              @click="onClickCreate()"
            >
              <v-icon small left>mdi-plus</v-icon>
              Tambah Role
            </v-btn>
          </template>
          <template v-slot:item.roles="{ item }">
            {{ item.roles_name.join(", ") }}
          </template>
        </datatable>
      </div>
    </div>
    <form-user-role ref="formRole" :success="formSuccess" />
    <delete-dialog
      ref="delete"
      url="user-role"
      :success="deleteSuccess"
    ></delete-dialog>
  </div>
</template>

<script>
import Datatable from "@/view/component/Datatable.vue";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import FormUserRole from "./FormUserRole";

export default {
  data() {
    return {
      title: "User",
      url: "user-role/data?id=" + this.id,
      columns: [
        {
          value: "id",
        },
        {
          text: "Wilayah",
          value: "zone_name",
          sortable: true,
          searchable: true,
        },
        {
          text: "Role",
          value: "roles",
          sortable: false,
          searchable: true,
        },
      ],
    };
  },
  props: {
    id: String,
    canEdit: Boolean,
  },
  methods: {
    onClickCreate() {
      this.$refs.formRole.open(this.id);
    },
    onClickUpdate(item) {
      this.$refs.formRole.open(this.id, item.id);
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
    FormUserRole,
  },
};
</script>
