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
          {{ !id ? "Tambah" : "Edit" }} SDM
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="6">
                <v-text-field
                  label="NIP"
                  dense
                  outlined
                  v-model="data.nip"
                ></v-text-field>
                <v-text-field
                  label="Nama"
                  required
                  dense
                  outlined
                  v-model="data.nama"
                  :rules="rules.name"
                ></v-text-field>
                <v-text-field
                  label="Jabatan"
                  dense
                  outlined
                  v-model="data.jabatan"
                ></v-text-field>
                <v-select
                  v-model="data.tipe"
                  :items="listTipe"
                  item-text="text"
                  item-value="id"
                  placeholder="Tipe SDM"
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
                <v-autocomplete
                  v-model="data.zone_id"
                  :items="listZone"
                  :loading="isLoadingZone"
                  :search-input.sync="searchZone"
                  item-text="name"
                  item-value="id"
                  label="Wilayah"
                  placeholder="Ketik nama Wilayah"
                  outlined
                  clearable
                  dense
                  :rules="[(v) => !!v || 'Wilayah harus diisi']"
                ></v-autocomplete>
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
import { slugify } from "@/core/utils";

let timeout = null;
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
      listTipe: [
        { id: "pns", text: "PNS" },
        { id: "non-pns", text: "Non PNS" },
      ],
      listZone: [],
      isLoadingZone: false,
      searchZone: "",
      listRegion: [],
      isLoadingRegion: false,
      searchRegion: "",
      data: {
        zone_id: "",
        nip: "",
        nama: "",
        jabatan: "",
        tipe: "",
        alamat: "",
        kode_pos: "",
        telepon: "",
        village_id: "",
      },
      rules: {
        name: [
          (v) => !!v || "Nama harus diisi",
          (v) =>
            (v && v.length <= 150) || "Nama harus kurang dari 150 karakter",
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
    async getData(id) {
      this.loadingData = true;
      this.id = id;
      ApiService.get("sdm?id=" + id)
        .then(({ data }) => {
          this.data = {
            zone_id: data.zone_id,
            nip: data.nip,
            nama: data.nama,
            jabatan: data.jabatan,
            tipe: data.tipe,
            alamat: data.alamat,
            kode_pos: data.kode_pos,
            telepon: data.telepon,
            village_id: data.village_id,
          };
          this.loadingData = false;
          if (this.data.zone_id) {
            this.getListZone(data.zone_id, true);
          }
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
        const sdm = !this.id ? "post" : "update";
        let url = "sdm";
        if (this.id) {
          url = url + "?id=" + this.id;
        }
        ApiService[sdm](url, this.data)
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
      this.listZone = [];
      this.isLoadingZone = false;
      this.$refs.form.reset();
      this.search = "";
      this.isLoadingRegion = false;
      this.searchRegion = "";
      this.listRegion = [];
    },
  },
  watch: {
    ["data.name"](value) {
      this.data.slug = value ? slugify(value) : null;
    },
    searchZone(val) {
      if (!val) {
        return;
      }
      clearTimeout(timeout);

      timeout = setTimeout(async () => {
        this.getListZone(val, false);
      }, 200);
    },
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
  },
};
</script>
