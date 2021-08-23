<template>
  <v-dialog v-model="opened" max-width="400" persistent>
    <v-form
      ref="form"
      v-model="valid"
      :readonly="!canEdit"
      @submit.prevent="save()"
    >
      <v-card :loading="loadingData" :disabled="loadingData">
        <v-card-title class="headline">
          {{ !id ? "Tambah" : "Edit" }} Tindakan
          <v-btn icon @click="close()" class="ml-auto">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center" no-gutters>
              <v-col cols="12" md="10">
                <v-text-field
                  label="Slug"
                  required
                  dense
                  outlined
                  :disabled="true"
                  v-model="data.slug"
                  :rules="rules.slug"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters>
              <v-col cols="12" md="10">
                <v-text-field
                  label="Nama Tindakan"
                  required
                  dense
                  outlined
                  v-model="data.name"
                  :rules="rules.name"
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
import { slugify } from "@/core/utils";

export default {
  data() {
    return {
      action: "create",
      id: null,
      opened: false,
      loading: false,
      loadingData: false,
      valid: true,
      data: {
        slug: null,
        name: null,
      },
      rules: {
        slug: [(v) => !!v || "Slug is required"],
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
        }
      }, 1);
    },
    async getData(id) {
      this.loadingData = true;
      this.id = id;
      ApiService.get("action?id=" + id)
        .then(({ data }) => {
          this.data = {
            slug: data.slug,
            name: data.name,
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
        let url = "action";
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
};
</script>
