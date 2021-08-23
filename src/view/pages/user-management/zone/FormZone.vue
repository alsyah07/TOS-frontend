<template>
  <v-dialog v-model="opened" max-width="800" persistent>
    <v-form
      ref="form"
      v-model="valid"
      :readonly="!canEdit"
      @submit.prevent="save()"
    >
      <v-card :loading="loadingData" :disabled="loadingData">
        <v-card-title class="headline">
          {{ !id ? "Tambah" : "Edit" }} Wilayah
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Kode Wilayah"
                  required
                  dense
                  outlined
                  v-model="data.code"
                  :rules="rules.code"
                ></v-text-field>
                <v-text-field
                  label="Nama Wilayah"
                  required
                  dense
                  outlined
                  v-model="data.name"
                  :rules="rules.name"
                ></v-text-field>
                <v-autocomplete
                  v-model="data.parent"
                  :items="listZone"
                  :loading="isLoadingZone"
                  :search-input.sync="searchZone"
                  item-text="name"
                  item-value="id"
                  label="Induk Wilayah"
                  placeholder="Ketik nama Wilayah"
                  outlined
                  dense
                ></v-autocomplete>
                <v-select
                  label="Level"
                  required
                  dense
                  outlined
                  v-model="data.level"
                  :rules="rules.level"
                  :items="listLevel"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Telepon"
                  required
                  dense
                  outlined
                  v-model="data.phone"
                ></v-text-field>
                <v-textarea
                  label="Alamat"
                  required
                  dense
                  outlined
                  v-model="data.address"
                ></v-textarea>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      type="number"
                      label="Latitude"
                      required
                      dense
                      outlined
                      v-model="data.lat"
                      :rules="rules.lat"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Longitude"
                      required
                      dense
                      outlined
                      v-model="data.lng"
                      :rules="rules.lng"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-checkbox
                  label="Aktif"
                  dense
                  outlined
                  v-model="data.active"
                ></v-checkbox>
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
  </v-dialog>
</template>

<script>
import ApiService from "@/core/services/api.service";

let timeoutZone = null;
export default {
  data() {
    return {
      id: null,
      opened: false,
      loading: false,
      loadingData: false,
      valid: true,
      data: {
        code: null,
        name: null,
        phone: null,
        address: null,
        lat: null,
        lng: null,
        level: null,
        parent: null,
        active: true
      },
      listLevel: [],
      // Zone
      listZone: [],
      isLoadingZone: false,
      searchZone: "",
      rules: {
        code: [(v) => !!v || "Kode wilayah haris diisi"],
        name: [
          (v) => !!v || "Nama harus diisi",
          (v) =>
            (v && v.length <= 100) || "Name must be less than 10 characters",
        ],
        level: [(v) => !!v || "Level harus diisi"],
        lat: [
          (v) =>
            !v ||
            (v && v.toString().match(/^-?\d*(\.\d+)?$/) != null) ||
            "Invalid Latitude",
        ],
        lng: [
          (v) =>
            !v ||
            (v && v.toString().match(/^-?\d*(\.\d+)?$/) != null) ||
            "Invalid Latitude",
        ],
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
  methods: {
    async open(id) {
      this.opened = true;
      setTimeout(async () => {
        this.$refs.form.reset();
        await this.getListLevel();
        if (id) {
          this.getData(id);
        }else{
          this.data.active = true;
        }
      }, 1);
    },
    async getListLevel() {
      ApiService.get("zone/level").then(({ data }) => {
        this.listLevel = data;
      });
    },
    async getListZone(val, isID) {
      this.isLoadingZone = "warning";
      const params = {
        columns: [
          { data: "id", searchable: false },
          { data: "name", searchable: true },
          { data: "active", searchable: false },
        ],
        perPage: 5,
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
    async getData(id) {
      this.loadingData = true;
      this.id = id;
      ApiService.get("zone?id=" + id)
        .then(async ({ data }) => {
          this.data = {
            code: data.code,
            name: data.name,
            phone: data.phone,
            address: data.address,
            lat: data.lat,
            lng: data.lng,
            level: data.level,
            parent: data.parent,
            active: data.active || true
          };
          await this.getListZone(data.parent, true);
          this.loadingData = false;
        })
        .catch(({ response }) => {
          if (response.data) {
            this.handleError(response.data);
          }
          this.loadingData = false;
        });
    },
    async save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const action = !this.id ? "post" : "update";
        let url = "zone";
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
      this.$refs.form.reset();
    },
  },
  watch: {
    searchZone(val) {
      if (!val) {
        return;
      }
      clearTimeout(timeoutZone);

      timeoutZone = setTimeout(async () => {
        this.getListZone(val);
      }, 200);
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
};
</script>
