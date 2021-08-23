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
          {{ !id ? "Tambah" : "Edit" }} PO Bus
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="6">
                <v-text-field
                  label="Kode PO"
                  dense
                  outlined
                  v-model="data.kode"
                ></v-text-field>
                <v-text-field
                  label="Nama PO"
                  required
                  dense
                  outlined
                  v-model="data.nama"
                  :rules="rules.nama"
                ></v-text-field>
                <v-text-field
                  label="Nama Direktur"
                  dense
                  outlined
                  v-model="data.nama_direktur"
                ></v-text-field>
                <v-text-field
                  label="No. Izin"
                  dense
                  outlined
                  v-model="data.no_izin"
                ></v-text-field>
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      label="Tanggal Kadaluarsa Izin"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                      outlined
                      :value="computedDateFormattedMomentjs"
                      @click:clear="data.tgl_kadaluarsa_izin = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="data.tgl_kadaluarsa_izin"
                    scrollable
                    @change="menu1 = false"
                  >
                  </v-date-picker>
                </v-menu>
                <v-select
                  v-model="data.tipe"
                  :items="listTipe"
                  item-text="text"
                  item-value="id"
                  placeholder="Tipe"
                  outlined
                  dense
                  clearable
                  label="Tipe"
                ></v-select>
                <v-text-field
                  label="No. Telepon"
                  dense
                  outlined
                  v-model="data.telepon"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  label="Alamat"
                  placeholder="Ketik Nama Jalan / Blok / Nomor Rumah"
                  dense
                  outlined
                  v-model="data.alamat"
                ></v-textarea>
                <v-text-field
                  label="Kode Pos"
                  dense
                  outlined
                  v-model="data.kode_pos"
                ></v-text-field>
                <v-autocomplete
                  autocomplete="off"
                  v-model="data.village_id"
                  :items="listRegion"
                  :loading="isLoadingRegion"
                  :search-input.sync="searchRegion"
                  hide-selected
                  item-text="name"
                  item-value="id"
                  label="Kelurahan / Kecamatan / Kota"
                  placeholder="Ketik nama kelurahan atau kecamatan"
                  dense
                  clearable
                  outlined
                ></v-autocomplete>
                <v-checkbox
                  label="Aktif"
                  dense
                  outlined
                  v-model="data.aktif"
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
import moment from "moment";

let timeoutRegion = null;
export default {
  data() {
    return {
      action: "create",
      id: null,
      opened: false,
      loading: false,
      loadingData: false,
      valid: true,
      menu1: false,
      listTipe: [
        { id: "akap", text: "AKAP" },
        { id: "akdp", text: "AKDP" },
        { id: "pariwisata", text: "Pariwisata" },
      ],
      listRegion: [],
      isLoadingRegion: false,
      searchRegion: "",
      data: {
        kode: null,
        nama: null,
        nama_direktur: null,
        no_izin: null,
        tgl_kadaluarsa_izin: null,
        telepon: null,
        kode_pos: null,
        village_id: null,
        alamat: null,
        tipe: null,
        aktif: true,
      },
      rules: {
        nama: [
          (v) => !!v || "Nama POB harus diisi",
          (v) =>
            (v && v.length <= 100) || "Name must be less than 10 characters",
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
        }
      }, 1);
    },
    async getListRegion(val, isID) {
      this.isLoadingRegion = "warning";

      const { data } = await ApiService.post("region/list", {
        search: val,
        id: isID || false,
      });

      this.listRegion = data;
      this.isLoadingRegion = false;
    },
    async getData(id) {
      this.loadingData = true;
      this.id = id;
      ApiService.get("pob?id=" + id)
        .then(({ data }) => {
          this.data = {
            kode: data.kode,
            nama: data.nama,
            nama_direktur: data.nama_direktur,
            no_izin: data.no_izin,
            tgl_kadaluarsa_izin: data.tgl_kadaluarsa_izin,
            telepon: data.telepon,
            kode_pos: data.kode_pos,
            village_id: data.village_id,
            alamat: data.alamat,
            tipe: data.tipe,
            aktif: data.aktif,
          };
          this.loadingData = false;
          if (this.data.village_id) {
            this.getListRegion(data.village_id, true);
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
        let url = "pob";
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
      this.isLoadingRegion = false;
      this.searchRegion = "";
      this.listRegion = [];
      this.data.tgl_kadaluarsa_izin = null;
    },
  },
  watch: {
    async searchRegion(val) {
      if (!val || val.length < 2) {
        return;
      }
      clearTimeout(timeoutRegion);

      timeoutRegion = setTimeout(async () => {
        this.getListRegion(val, false);
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
    computedDateFormattedMomentjs() {
      return this.data.tgl_kadaluarsa_izin
        ? moment(this.data.tgl_kadaluarsa_izin).format("dddd, Do MMMM YYYY")
        : "";
    },
  },
};
</script>
