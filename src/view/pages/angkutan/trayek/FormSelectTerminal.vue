<template>
  <v-dialog v-model="opened" max-width="400" persistent>
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title class="headline">
          Pilih Terminal
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center" no-gutters>
              <v-col cols="12" md="12">
                <v-autocomplete
                  v-model="terminal"
                  :items="listZone"
                  :loading="isLoadingZone"
                  :search-input.sync="searchZone"
                  item-text="name"
                  item-value="id"
                  label="Terminal"
                  placeholder="Ketik nama Terminal"
                  outlined
                  clearable
                  dense
                  :rules="[(v) => !!v || 'Terminal harus diisi']"
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
                type="submit"
                color="success"
                depressed
                class="ma-1"
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
      action: "create",
      id: null,
      opened: false,
      valid: true,
      listZone: [],
      isLoadingZone: false,
      searchZone: "",
      terminal: null,
      rules: {
        terminal: [(v) => !!v || "Terminal is required"],
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
    open() {
      this.opened = true;
      setTimeout(() => {
        this.$refs.form.reset();
      }, 1);
    },
    async getListZone(val) {
      this.isLoadingZone = "warning";
      const params = {
        filter: [
          {
            column: "level",
            value: "terminal",
          },
        ],
        columns: [
          { data: "id", searchable: false },
          { data: "name", searchable: true },
        ],
        perPage: 10,
        search: { value: val },
      };

      const { data } = await ApiService.post("zone/data", params);

      this.listZone = data.data;
      this.isLoadingZone = false;
    },
    async save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.success(this.terminal);
        this.close();
      }
    },
    close() {
      this.opened = false;
      this.$refs.form.reset();
      this.listZone = [];
      this.isLoadingZone = false;
      this.searchZone = "";
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
  },
};
</script>
