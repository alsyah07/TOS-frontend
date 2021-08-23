<template>
  <v-dialog v-model="opened" max-width="600" persistent>
    <v-form
      ref="form"
      v-model="valid"
      :readonly="!canEdit"
      @submit.prevent="save()"
    >
      <v-card :loading="loadingData" :disabled="loadingData">
        <v-card-title class="headline">
          {{ !id ? "Tambah" : "Edit" }} Fasilitas
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center" no-gutters>
              <v-col cols="12" md="10">
                <v-row class="mb-5">
                  <v-col cols="12" md="6">
                    <span class="subtitle">Gambar</span>
                    <file-upload
                      v-model="data.gambar"
                      max-files="1"
                      category="gambar"
                      :multiple="true"
                    ></file-upload>
                  </v-col>
                </v-row>
                <v-text-field
                  label="Nama Fasilitas"
                  required
                  dense
                  outlined
                  v-model="data.nama"
                  :rules="rules.nama"
                ></v-text-field>
                <v-select
                  v-model="data.kategori"
                  :items="listKategori"
                  item-text="text"
                  item-value="id"
                  placeholder="Kategori"
                  outlined
                  dense
                  clearable
                  label="Kategori"
                ></v-select>
                <v-textarea
                  label="Deskripsi"
                  dense
                  outlined
                  v-model="data.deskripsi"
                ></v-textarea>
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
import FileUpload from "@/view/component/FileUpload.vue";

export default {
  data() {
    return {
      action: "create",
      id: null,
      opened: false,
      loading: false,
      loadingData: false,
      valid: true,
      listKategori: [
        { id: "fasilitas-utama", text: "Fasilitas Utama" },
        { id: "fasilitas-penunjang", text: "Fasilitas Penunjang" },
      ],
      data: {
        zone_id: null,
        nama: null,
        deskripsi: null,
        kategori: null,
        gambar: null,
        aktif: null,
      },
      rules: {
        nama: [(v) => !!v || "Nama fasilitas harus diisi"],
      },
    };
  },
  props: {
    terminal: {
      type: String,
    },
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
          this.data.aktif = true;
        }
      }, 1);
    },
    async getData(id) {
      this.loadingData = true;
      this.id = id;
      ApiService.get("fasilitas?id=" + id)
        .then(({ data }) => {
          this.data = {
            zone_id: data.zone_id,
            nama: data.nama,
            deskripsi: data.deskripsi,
            kategori: data.kategori,
            gambar: data.gambar,
            aktif: data.aktif,
          };
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
        let url = "fasilitas";
        if (this.id) {
          url = url + "?id=" + this.id;
        }
        this.data.zone_id = this.terminal;
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
  watch: {},
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
  },
};
</script>
