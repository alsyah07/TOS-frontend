<template>
  <v-dialog v-model="opened" max-width="600" persistent>
    <v-form ref="formUserRole" v-model="valid" @submit.prevent="save()">
      <v-card :loading="loadingData" :disabled="loadingData">
        <v-card-title class="headline">
          {{ !id ? "Tambah" : "Edit" }} Role
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center" no-gutters>
              <v-col cols="12" md="10">
                <v-autocomplete
                  v-model="data.zone_id"
                  :items="listZone"
                  :loading="isLoadingZone"
                  :search-input.sync="search"
                  item-text="name"
                  item-value="id"
                  label="Wilayah"
                  placeholder="Ketik nama Wilayah"
                  prepend-icon="mdi-database-search"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Wilayah harus diisi']"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters>
              <v-col cols="12" md="10">
                <v-select
                  label="Role"
                  required
                  dense
                  outlined
                  v-model="data.roles"
                  prepend-icon="mdi-key"
                  :items="listRole"
                  multiple
                  item-text="name"
                  item-value="slug"
                  :rules="[
                    (v) => !!v || 'Role harus diisi',
                    (v) => (v && v.length > 0) || 'Roles is required',
                  ]"
                ></v-select>
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
  </v-dialog>
</template>

<script>
import ApiService from "@/core/services/api.service";

let timeout = null;
export default {
  async mounted() {
    const { data } = await ApiService.get("role/list");
    this.listRole = data;
  },
  data() {
    return {
      action: "create",
      id: null,
      opened: false,
      loading: false,
      loadingData: false,
      valid: true,
      listZone: [],
      isLoadingZone: false,
      listRole: [],
      search: "",
      data: {
        user_id: null,
        zone_id: null,
        roles: null,
      },
    };
  },
  props: {
    success: {
      type: Function,
      default: function() {},
    },
  },
  methods: {
    open(userId, id) {
      if (!userId) {
        return;
      }
      this.data.user_id = userId;
      this.opened = true;
      setTimeout(() => {
        this.$refs.formUserRole.reset();
        if (id) {
          this.getData(id);
        }
      }, 1);
    },
    async getData(id) {
      this.loadingData = true;
      ApiService.get("user-role?id=" + id)
        .then(({ data }) => {
          this.data = {
            user_id: data.user_id,
            zone_id: data.zone_id,
            roles: data.roles,
          };
          this.id = id;
          this.loadingData = false;
          this.getListZone(data.zone_id, true);
        })
        .catch(({ response }) => {
          if (response.data) {
            this.handleError(response.data);
          }
          this.loadingData = false;
        });
    },
    async save() {
      this.$refs.formUserRole.validate();
      if (this.valid) {
        this.loading = true;
        const action = !this.id ? "post" : "update";
        let url = "user-role";
        if (this.id) {
          url = url + "?id=" + this.id;
        }
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
    close() {
      this.opened = false;
      this.id = null;
      this.data.user_id = null;
      (this.listZone = []), (this.isLoadingZone = false);
      this.search = "";
      this.$refs.formUserRole.reset();
    },
    async getListZone(val, isID) {
      this.isLoadingZone = "warning";
      const params = {
        columns: [
          { data: "id", searchable: false },
          { data: "name", searchable: true },
        ],
        perPage: 10,
      };
      if (isID) {
        params.filter = [
          {
            column: "id",
            value: val,
          },
        ];
      } else {
        params.search = { value: val };
      }
      const { data } = await ApiService.post("zone/data", params);

      this.listZone = data.data;
      this.isLoadingZone = false;
    },
  },
  watch: {
    search(val) {
      if (!val) {
        return;
      }
      clearTimeout(timeout);

      timeout = setTimeout(async () => {
        this.getListZone(val, false);
      }, 200);
    },
  },
};
</script>
