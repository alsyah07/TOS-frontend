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
          {{ !id ? "Tambah" : "Edit" }} Trayek
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="left" no-gutters>
              <v-col cols="12" md="8">
                <v-text-field
                  label="Kode Trayek"
                  required
                  dense
                  outlined
                  v-model="data.kode"
                ></v-text-field>
                <v-text-field
                  label="Nama Trayek"
                  required
                  dense
                  outlined
                  v-model="data.nama"
                  :rules="rules.nama"
                ></v-text-field>
                <v-textarea
                  label="Deskripsi"
                  required
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
            <v-divider></v-divider>
            <form-select-terminal
              ref="select"
              :success="formSelectTerminalSuccess"
            />
            <v-row>
              <v-col cols="12" md="6">
                <v-data-table
                  :headers="headerTerminal"
                  :items="listTerminal"
                  hide-default-header
                  hide-default-footer
                  :loading="loadingTableTerminal"
                  class="elevation-1 mb-5"
                >
                  <template v-slot:item.id="{ item }">
                    <v-btn
                      icon
                      color="pink"
                      @click="removeListTerminal(item.id)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
                <v-btn
                  v-if="canEdit"
                  type="button"
                  color="primary"
                  depressed
                  class="ma-1"
                  @click.prevent="openTerminalDialog()"
                  small
                >
                  <v-icon small left>mdi-plus</v-icon>
                  Tambah Terminal
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
  </v-dialog>
</template>

<script>
import ApiService from "@/core/services/api.service";
import FormSelectTerminal from "./FormSelectTerminal.vue";

export default {
  data() {
    return {
      action: "create",
      id: null,
      opened: false,
      loading: false,
      loadingData: false,
      valid: true,
      listTerminal: [],
      loadingTableTerminal: false,
      headerTerminal: [
        {
          text: "Nama Terminal",
          align: "start",
          value: "name",
        },
        {
          text: "Nama Terminal",
          align: "end",
          value: "id",
        },
      ],
      data: {
        kode: null,
        nama: null,
        deskripsi: null,
        aktif: null,
        terminal: null,
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
          this.data.aktif = true;
        }
      }, 1);
    },
    async getData(id) {
      this.loadingData = true;
      this.id = id;
      ApiService.get("trayek?id=" + id)
        .then(({ data }) => {
          this.data = {
            kode: data.kode,
            nama: data.nama,
            deskripsi: data.deskripsi,
            aktif: data.aktif,
            terminal: data.terminal,
          };
          this.loadingData = false;
          this.refreshListTerminal();
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
        let url = "trayek";
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
      this.listTerminal = [];
      this.data.terminal = null;
    },
    openTerminalDialog() {
      this.$refs.select.open();
    },
    removeListTerminal(id) {
      this.data.terminal.splice(this.data.terminal.indexOf(id), 1);
      this.refreshListTerminal();
    },
    formSelectTerminalSuccess(terminal) {
      if (this.data.terminal == null) {
        this.data.terminal = [];
      }

      if (this.data.terminal.indexOf(terminal) == -1) {
        this.data.terminal.push(terminal);
      } else {
        this.$bvToast.toast("Terminal sudah terdaftar!", {
          title: "Gagal",
          variant: "danger",
          solid: true,
        });
      }
      this.refreshListTerminal();
    },
    async refreshListTerminal() {
      if (this.data.terminal == null || this.data.terminal.length <= 0) {
        this.listTerminal = [];
        return;
      }
      this.loadingTableTerminal = true;
      const params = {
        filter: [
          {
            column: "level",
            value: "terminal",
          },
          {
            column: "id",
            operator: "in",
            value: this.data.terminal,
          },
        ],
        columns: [
          { data: "id", searchable: false },
          { data: "name", searchable: true },
        ],
        perPage: 10,
      };

      const { data } = await ApiService.post("zone/data", params);
      this.listTerminal = data.data;
      this.loadingTableTerminal = false;
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
    FormSelectTerminal,
  },
};
</script>
