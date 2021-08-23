<template>
  <v-dialog v-model="opened" max-width="1000" persistent>
    <v-form
      ref="form"
      v-model="valid"
      :readonly="!canEdit"
      @submit.prevent="save()"
    >
      <v-card :loading="loadingData" :disabled="loadingData">
        <v-card-title class="headline">
          {{ !id ? "Tambah" : "Edit" }} Role
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Slug"
                  required
                  dense
                  outlined
                  :disabled="true"
                  v-model="data.slug"
                  :rules="rules.slug"
                ></v-text-field>
                <v-text-field
                  label="Nama Role"
                  required
                  dense
                  outlined
                  v-model="data.name"
                  :rules="rules.name"
                ></v-text-field>
                <v-text-field
                  label="Default Route"
                  required
                  dense
                  outlined
                  v-model="data.default_route"
                  :rules="rules.default_route"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row
              v-for="(permission, index) in listPermissions"
              :key="'permission-' + index"
            >
              <v-col cols="12" md="5">
                <v-select
                  v-model="permission.module"
                  :items="listModule"
                  label="Modul"
                  item-text="name"
                  item-value="slug"
                  required
                  dense
                  outlined
                  hide-details
                  @change="checkDuplicate(index)"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="permission.actions"
                  :items="listAction"
                  label="Tindakan"
                  item-text="name"
                  item-value="slug"
                  dense
                  outlined
                  small-chips
                  multiple
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-btn small icon color="red" @click="confirmDelete(index)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn color="info" small @click="addPermission()">
                  <v-icon small left>mdi-plus</v-icon>Tambah Akses
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-row no-gutters>
            <v-col cols="12" align="end">
              <v-btn
                depressed
                class="ma-1"
                :disabled="loading"
                @click="close()"
              >
                <v-icon small left>mdi-close</v-icon>
                Tutup
              </v-btn>
              <v-btn
                v-if="canEdit"
                type="submit"
                color="success"
                depressed
                class="ma-1"
                :loading="loading"
                :disabled="loading"
                @click.prevent="save()"
              >
                <v-icon small left>mdi-content-save</v-icon>
                Simpan
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
    <delete-dialog ref="deletePermission" :success="onDeleteConfirmed">
    </delete-dialog>
  </v-dialog>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { slugify } from "@/core/utils";
import DeleteDialog from "@/view/component/DeleteDialog.vue";
import { GET_PERMISSION } from "@/core/services/store/auth.module";
import _ from "lodash";

export default {
  data() {
    return {
      action: "create",
      id: null,
      opened: false,
      loading: false,
      loadingData: false,
      listModule: null,
      listAction: null,
      listPermissions: [],
      valid: true,
      data: {
        slug: null,
        name: null,
        default_route: null,
        permissions: null,
      },
      rules: {
        slug: [(v) => !!v || "Slug is required"],
        name: [
          (v) => !!v || "Name is required",
          (v) =>
            (v && v.length <= 100) || "Name must be less than 10 characters",
        ],
        default_route: [(v) => !!v || "Default Route is required"],
      },
    };
  },
  props: {
    module: {
      type: String,
    },
    success: {
      type: Function,
      default: function() {},
    },
  },
  async mounted() {
    const listModule = await ApiService.get("module/list");
    const listAction = await ApiService.get("action/list");

    this.listModule = listModule.data;
    this.listAction = listAction.data;
  },
  methods: {
    open(id) {
      this.opened = true;
      setTimeout(() => {
        this.$refs.form.reset();
        this.listPermissions = [];
        if (id) {
          this.getData(id);
        }
      }, 1);
    },
    async getData(id) {
      this.loadingData = true;
      this.id = id;
      ApiService.get("role?id=" + id)
        .then(({ data }) => {
          this.data = {
            slug: data.slug,
            name: data.name,
            default_route: data.default_route,
            permissions: data.permissions,
          };
          this.permissionToArray();
          this.loadingData = false;
        })
        .catch(({ response }) => {
          if (response.data) {
            this.handleError(response.data);
          }
          this.loadingData = false;
        });
    },
    permissionToArray() {
      const arrPermissions = [];
      for (var md in this.data.permissions) {
        arrPermissions.push({
          module: md,
          actions: _.sortBy(this.data.permissions[md]),
        });
      }

      this.listPermissions = arrPermissions;
    },
    permissionToObject() {
      const objPermission = {};
      for (var pr in this.listPermissions) {
        const mod = this.listPermissions[pr].module;
        const act = this.listPermissions[pr].actions;

        if (mod != null && act && act.length > 0) {
          objPermission[mod] = act;
        }
      }

      this.data.permissions = objPermission;
    },
    async save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const action = !this.id ? "post" : "update";
        let url = "role";
        if (this.id) {
          url = url + "?id=" + this.id;
        }
        this.permissionToObject();

        ApiService[action](url, this.data)
          .then(({ data }) => {
            if (data.id) {
              this.loading = false;
              this.success(data);
              this.$bvToast.toast("Records has been saved!", {
                title: "Saved",
                variant: "success",
                solid: true,
              });
              this.close();
              this.$store.dispatch(GET_PERMISSION);
            }
          })
          .catch(({ response }) => {
            if (response.data) {
              this.handleError(response.data);
            }

            this.loading = false;
          });
      }
    },
    handleError(data) {
      if (data.error) {
        this.$bvToast.toast(data.error, {
          title: "Oops",
          variant: "danger",
          solid: true,
        });
      }
    },
    confirmDelete(index) {
      this.$refs.deletePermission.open(index);
    },
    onDeleteConfirmed(index) {
      this.listPermissions.splice(index, 1);
    },
    addPermission() {
      this.listPermissions.push({
        module: null,
        permissions: [],
      });
    },
    close() {
      this.opened = false;
      this.id = null;
      this.$refs.form.reset();
      this.listPermissions = [];
    },
    checkDuplicate(index) {
      const currPermission = this.listPermissions[index];
      let exists = false;
      this.listPermissions.forEach((val, idx) => {
        if (val.module == currPermission.module && idx != index) {
          exists = true;
        }
      });
      if (exists) {
        setTimeout(() => {
          const msg =
            "Module " + currPermission.module + " is already defined!";
          this.listPermissions[index].module = null;
          this.$bvToast.toast(msg, {
            title: "Warning",
            variant: "warning",
            solid: true,
          });
        }, 1);
      }
    },
  },
  watch: {
    ["data.name"](value) {
      this.data.slug = value ? slugify(value) : null;
    },
  },
  computed: {
    canEdit() {
      if (
        this.id &&
        !this.$store.getters.hasPermission(this.module, "update")
      ) {
        return false;
      }

      return true;
    },
  },
  components: {
    DeleteDialog,
  },
};
</script>
