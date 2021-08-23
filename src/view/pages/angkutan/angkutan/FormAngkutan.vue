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
          {{ !id ? "Tambah" : "Edit" }} Kendaraan
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="6">
                <v-text-field
                  label="No. Kendaraan"
                  required
                  dense
                  outlined
                  v-model="data.no_kendaraan"
                  :rules="rules.no_kendaraan"
                ></v-text-field>
                <v-text-field
                  label="No. Rangka"
                  dense
                  outlined
                  v-model="data.no_rangka"
                ></v-text-field>
                <v-text-field
                  label="No. Mesin"
                  dense
                  outlined
                  v-model="data.no_mesin"
                ></v-text-field>
                <v-text-field
                  label="Merek"
                  dense
                  outlined
                  v-model="data.merek"
                ></v-text-field>
                <v-select
                  v-model="data.tahun_buat"
                  :items="listYear"
                  placeholder="Tahun Buat"
                  outlined
                  dense
                  clearable
                  label="Tahun"
                ></v-select>
                <v-text-field
                  label="Kapasitas"
                  dense
                  outlined
                  v-model="data.kapasitas"
                  type="number"
                  suffix="Orang"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="data.pob_id"
                  :items="listPob"
                  :loading="isLoadingPob"
                  :search-input.sync="searchPob"
                  item-text="nama"
                  item-value="id"
                  label="Perusahaan"
                  placeholder="Ketik nama perusahaan"
                  outlined
                  clearable
                  dense
                ></v-autocomplete>
                <v-autocomplete
                  v-model="data.trayek_id"
                  :items="listTrayek"
                  :loading="isLoadingTrayek"
                  :search-input.sync="searchTrayek"
                  item-text="nama"
                  item-value="id"
                  label="Trayek"
                  placeholder="Ketik nama trayek"
                  outlined
                  clearable
                  dense
                ></v-autocomplete>
                <v-text-field
                  label="No. Uji"
                  dense
                  outlined
                  v-model="data.no_uji"
                ></v-text-field>
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      label="Tanggal Kadaluarsa Uji"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                      outlined
                      :value="dateFormatTglUji"
                      @click:clear="data.tgl_kadaluarsa_uji = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="data.tgl_kadaluarsa_uji"
                    scrollable
                    @change="menu1 = false"
                  >
                  </v-date-picker>
                </v-menu>
                <v-text-field
                  label="No. KPS"
                  dense
                  outlined
                  v-model="data.no_kps"
                ></v-text-field>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      label="Tanggal Kadaluarsa KPS"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                      outlined
                      :value="dateFormatTglKps"
                      @click:clear="data.tgl_kadaluarsa_kps = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="data.tgl_kadaluarsa_kps"
                    scrollable
                    @change="menu2 = false"
                  >
                  </v-date-picker>
                </v-menu>
                <v-text-field
                  label="No. SRUT"
                  dense
                  outlined
                  v-model="data.no_srut"
                ></v-text-field>
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
import moment from "moment";

let timeoutPob = null;
let timeoutTrayek = null;
export default {
  mounted() {
    let currYear = moment().format("YYYY");
    for (var i = currYear - 100; i <= currYear; i++) {
      this.listYear.push(i);
    }
  },
  data() {
    return {
      action: "create",
      id: null,
      opened: false,
      loading: false,
      loadingData: false,
      valid: true,
      listYear: [],
      menu1: false,
      menu2: false,
      listPob: [],
      isLoadingPob: false,
      searchPob: "",
      listTrayek: [],
      isLoadingTrayek: false,
      searchTrayek: "",
      data: {
        trayek_id: null,
        pob_id: null,
        no_kendaraan: null,
        no_uji: null,
        tgl_kadaluarsa_uji: null,
        no_kps: null,
        tgl_kadaluarsa_kps: null,
        no_srut: null,
        no_rangka: null,
        no_mesin: null,
        merek: null,
        tahun_buat: null,
        kapasitas: null,
        deskripsi: null,
        aktif: null,
      },
      rules: {
        no_kendaraan: [
          (v) => !!v || "No. Kendaraan harus diisi",
          (v) => (v && v.length <= 100) || "No. Kendaraan terlalu panjang",
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
    open(id) {
      this.opened = true;
      setTimeout(() => {
        this.$refs.form.reset();
        if (id) {
          this.getData(id);
        } else {
          this.data.tahun_buat = moment().format("YYYY") - 5;
        }
      }, 1);
    },
    async getListTrayek(val, isID) {
      this.isLoadingTrayek = "warning";
      const params = {
        columns: [
          { data: "id", searchable: false },
          { data: "nama", searchable: true },
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
      const { data } = await ApiService.post("trayek/data", params);

      this.listTrayek = data.data;
      this.isLoadingTrayek = false;
    },
    async getListPob(val, isID) {
      this.isLoadingPob = "warning";
      const params = {
        columns: [
          { data: "id", searchable: false },
          { data: "nama", searchable: true },
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
      const { data } = await ApiService.post("pob/data", params);

      this.listPob = data.data;
      this.isLoadingPob = false;
    },
    async getData(id) {
      this.loadingData = true;
      this.id = id;
      ApiService.get("angkutan?id=" + id)
        .then(({ data }) => {
          this.data = {
            trayek_id: data.trayek_id,
            pob_id: data.pob_id,
            no_kendaraan: data.no_kendaraan,
            no_uji: data.no_uji,
            tgl_kadaluarsa_uji: data.tgl_kadaluarsa_uji,
            no_kps: data.no_kps,
            tgl_kadaluarsa_kps: data.tgl_kadaluarsa_kps,
            no_srut: data.no_srut,
            no_rangka: data.no_rangka,
            no_mesin: data.no_mesin,
            merek: data.merek,
            tahun_buat: data.tahun_buat,
            kapasitas: data.kapasitas,
            deskripsi: data.deskripsi,
            aktif: data.aktif,
          };
          this.loadingData = false;
          if (this.data.pob_id) {
            this.getListPob(data.pob_id, true);
          }
          if (this.data.trayek_id) {
            this.getListTrayek(data.trayek_id, true);
          }
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
        let url = "angkutan";
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
      this.data.tgl_kadaluarsa_uji = null;
      this.data.tgl_kadaluarsa_kps = null;
    },
  },
  watch: {
    searchPob(val) {
      if (!val) {
        return;
      }
      clearTimeout(timeoutPob);

      timeoutPob = setTimeout(async () => {
        this.getListPob(val, false);
      }, 200);
    },
    searchTrayek(val) {
      if (!val) {
        return;
      }
      clearTimeout(timeoutTrayek);

      timeoutTrayek = setTimeout(async () => {
        this.getListTrayek(val, false);
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
    dateFormatTglUji() {
      return this.data.tgl_kadaluarsa_uji
        ? moment(this.data.tgl_kadaluarsa_uji).format("dddd, Do MMMM YYYY")
        : "";
    },
    dateFormatTglKps() {
      return this.data.tgl_kadaluarsa_kps
        ? moment(this.data.tgl_kadaluarsa_kps).format("dddd, Do MMMM YYYY")
        : "";
    },
  },
};
</script>
