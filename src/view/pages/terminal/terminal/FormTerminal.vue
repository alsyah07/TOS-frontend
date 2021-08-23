<template>
  <v-dialog v-model="opened" max-width="1200" persistent>
    <v-form
      ref="form"
      v-model="valid"
      :readonly="!canEdit"
      @submit.prevent="save()"
    >
      <v-card :loading="loadingData" :disabled="loadingData">
        <v-card-title class="headline">
          {{ !id ? "Tambah" : "Edit" }} Terminal
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="6">
                <v-text-field
                  label="Kode Terminal"
                  required
                  dense
                  outlined
                  v-model="data.code"
                ></v-text-field>
                <v-text-field
                  label="Nama Terminal"
                  required
                  dense
                  outlined
                  v-model="data.name"
                  :rules="rules.name"
                ></v-text-field>
                <v-text-field
                  label="No. Telepon"
                  dense
                  outlined
                  v-model="data.phone"
                ></v-text-field>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Lat"
                      dense
                      outlined
                      v-model="data.lat"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Lng"
                      dense
                      outlined
                      v-model="data.lng"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-textarea
                  label="Alamat"
                  dense
                  outlined
                  v-model="data.address"
                ></v-textarea>
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
              <v-col cols="12" md="6">
                <v-row class="mb-5">
                  <v-col cols="12" md="6">
                    <span class="subtitle">Gambar Terminal</span>
                    <file-upload
                      v-model="data.gambar"
                      max-files="1"
                      category="gambar"
                      :multiple="true"
                    ></file-upload>
                  </v-col>
                </v-row>
                <v-autocomplete
                  v-model="data.parent"
                  :items="listZone"
                  :loading="isLoadingZone"
                  :search-input.sync="searchZone"
                  item-text="name"
                  item-value="id"
                  label="BPTD"
                  placeholder="Ketik nama BPTD"
                  outlined
                  clearable
                  dense
                  :rules="[(v) => !!v || 'BPTD harus diisi']"
                ></v-autocomplete>
                <v-select
                  v-model="data.tipe"
                  :items="['A', 'B', 'C']"
                  placeholder="Tipe Terminal"
                  outlined
                  dense
                  clearable
                  label="Tipe"
                ></v-select>
                <v-text-field
                  label="Status P3D"
                  dense
                  outlined
                  v-model="data.status_p3d"
                ></v-text-field>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Luas Lahan"
                      type="number"
                      suffix="㎡"
                      dense
                      outlined
                      v-model="data.luas_lahan"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Luas Bangunan"
                      type="number"
                      suffix="㎡"
                      dense
                      outlined
                      v-model="data.luas_bangunan"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Luas Area Pengembangan"
                      type="number"
                      suffix="㎡"
                      dense
                      outlined
                      v-model="data.luas_area_pengembangan"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row v-if="id">
              <v-col cols="12">
                <v-tabs v-model="tab" background-color="transparent">
                  <v-tab v-for="item in tabItems" :key="item">
                    {{ item }}
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                  <v-tab-item :key="0">
                    <v-card color="basil" flat>
                      <list-trayek :terminal="id"></list-trayek>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item :key="1">
                    <v-card color="basil" flat>
                      <list-fasilitas
                        :terminal="id"
                        :can-edit="canEdit"
                      ></list-fasilitas>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
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
import FileUpload from "@/view/component/FileUpload.vue";
import ListTrayek from "./ListTrayek.vue";
import ListFasilitas from "./ListFasilitas.vue";

let timeoutZone = null;
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
      listZone: [],
      isLoadingZone: false,
      searchZone: "",
      listRegion: [],
      isLoadingRegion: false,
      searchRegion: "",
      tab: null,
      tabItems: ["Trayek", "Fasilitas"],
      data: {
        code: null,
        name: null,
        phone: null,
        address: null,
        lat: null,
        lng: null,
        parent: null,
        active: null,
        deskripsi: null,
        gambar: null,
        luas_lahan: null,
        luas_bangunan: null,
        luas_area_pengembangan: null,
        tipe: null,
        status_p3d: null,
        village_id: null,
      },
      rules: {
        name: [
          (v) => !!v || "Name is required",
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
        } else {
          this.data.gambar = null;
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
        filter: [
          {
            column: "level",
            value: "bptd",
          },
        ],
        columns: [
          { data: "id", searchable: false },
          { data: "name", searchable: true },
        ],
        perPage: 10,
      };
      if (isID) {
        params.filter = [
          ...params.filter,
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
      ApiService.get("terminal?id=" + id)
        .then(({ data }) => {
          this.data = {
            code: data.code,
            name: data.name,
            phone: data.phone,
            address: data.address,
            lat: data.lat,
            lng: data.lng,
            parent: data.parent,
            active: data.active,
            deskripsi: data.deskripsi,
            gambar: data.gambar,
            luas_lahan: data.luas_lahan,
            luas_bangunan: data.luas_bangunan,
            luas_area_pengembangan: data.luas_area_pengembangan,
            tipe: data.tipe,
            status_p3d: data.status_p3d,
            village_id: data.village_id,
          };
          this.loadingData = false;
          if (this.data.parent) {
            this.getListZone(data.parent, true);
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
        const action = !this.id ? "post" : "update";
        let url = "terminal";
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
      this.listZone = [];
      this.isLoadingZone = false;
      this.searchZone = "";
      this.isLoadingRegion = false;
      this.searchRegion = "";
      this.listRegion = [];
      this.data.gambar = null;
    },
  },
  watch: {
    searchZone(val) {
      if (!val) {
        return;
      }
      clearTimeout(timeoutZone);

      timeoutZone = setTimeout(async () => {
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
  components: {
    FileUpload,
    ListTrayek,
    ListFasilitas,
  },
};
</script>
