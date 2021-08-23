<template>
  <v-dialog v-model="opened" :max-width="id ? '1200' : '800'" persistent>
    <user-wizard
      ref="wizard"
      :close="close"
      :change="stepChanged"
      v-if="id"
      :can-change-password="canChangePassword"
    >
      <div v-if="step == 1">
        <v-form
          ref="form"
          v-model="valid"
          :readonly="!canEdit"
          @submit.prevent="save()"
        >
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="6">
                <v-text-field
                  label="Nama Lengkap"
                  required
                  dense
                  outlined
                  v-model="data.name"
                  :rules="rules.name"
                ></v-text-field>
                <v-text-field
                  label="Email"
                  dense
                  outlined
                  v-model="data.email"
                  :rules="rules.email"
                ></v-text-field>
                <v-text-field
                  label="Username"
                  dense
                  outlined
                  v-model="data.username"
                  :rules="rules.username"
                ></v-text-field>
                <v-checkbox v-model="data.active" label="Aktif"></v-checkbox>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="No. Telp"
                  dense
                  outlined
                  v-model="data.phone"
                  :rules="rules.phone"
                ></v-text-field>
                <v-textarea
                  label="Address"
                  dense
                  outlined
                  v-model="data.address"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" align="center">
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
          </v-container>
        </v-form>
      </div>
      <div v-else-if="step == 2">
        <list-user-role
          ref="listrole"
          :id="id"
          :can-edit="canEdit"
        ></list-user-role>
      </div>
      <div v-else-if="step == 3 && canChangePassword">
        <form-change-password
          ref="formChangePassword"
          :id="id"
          :close="close"
        ></form-change-password>
      </div>
      <div v-else-if="step == 4">
        <list-user-log
          ref="listrole"
          :id="id"
        ></list-user-log>
      </div>
    </user-wizard>
    <template v-else>
      <v-form ref="formNewUser" v-model="valid">
        <v-card>
          <v-card-title class="headline">Tambah Pengguna</v-card-title>
          <v-card-text>
            <v-container>
              <v-row justify="center">
                <v-col cols="6">
                  <v-text-field
                    label="Nama Lengkap"
                    required
                    dense
                    outlined
                    v-model="data.name"
                    :rules="rules.name"
                  ></v-text-field>
                  <v-text-field
                    label="No. Telp"
                    dense
                    outlined
                    v-model="data.phone"
                    :rules="rules.phone"
                  ></v-text-field>
                  <v-textarea
                    label="Address"
                    dense
                    outlined
                    v-model="data.address"
                  ></v-textarea>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Username"
                    dense
                    outlined
                    v-model="data.username"
                    :rules="rules.username"
                  ></v-text-field>
                  <v-text-field
                    label="Email"
                    required
                    dense
                    outlined
                    v-model="data.email"
                    :rules="rules.email"
                  ></v-text-field>
                  <v-text-field
                    label="Password"
                    type="password"
                    required
                    dense
                    outlined
                    v-model="data.password"
                    :rules="rules.password"
                  ></v-text-field>
                  <v-text-field
                    label="Ketik Ulang Password"
                    type="password"
                    required
                    dense
                    outlined
                    v-model="confirmPassword"
                    :rules="rules.confirmPassword"
                  ></v-text-field>
                  <v-checkbox v-model="data.active" label="Aktif"></v-checkbox>
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
                  @click="saveNewUser()"
                >
                  <v-icon small left>mdi-content-save</v-icon>
                  Simpan
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </template>
  </v-dialog>
</template>

<script>
import ApiService from "@/core/services/api.service";
import UserWizard from "./UserWizard";
import ListUserRole from "./user-role/ListUserRole";
import ListUserLog from "./user-log/ListUserLog";
import FormChangePassword from "./change-password/FormChangePassword";

export default {
  mounted() {
    if (this.data.active == null) {
      this.data.active = true;
    }
  },
  data() {
    return {
      id: null,
      step: 1,
      opened: false,
      loading: false,
      loadingData: false,
      valid: true,
      confirmPassword: null,
      data: {
        name: null,
        email: null,
        password: null,
        active: true,
      },
      rules: {
        username: [
          (v) => !!v || "Username is required",
          (v) =>
            /^(?=[a-zA-Z0-9._]{3,100}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(v) ||
            "Username only contains alphanumeric characters, underscore, dot and must between 3 to 100 character.",
        ],
        name: [
          (v) => !!v || "Name is required",
          (v) =>
            (v && v.length <= 100) || "Name must be less than 100 characters",
        ],
        email: [
          (v) => {
            if(v && !(/.+@.+\..+/.test(v))){
              return "E-mail must be valid";
            }
            return true;
          },
        ],
        phone: [
          (v) => {
            if (!!v && v.length > 20) {
              return "Phone must be less than 20 characters";
            }

            return true;
          },
        ],
        password: [
          (v) => !!v || "Password is required",
          (v) =>
            (v &&
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*~+=[\](){}])(?=.{8,})/.test(
                v
              )) ||
            "Password should have minimum 8 characters, at least one letter, one number and one special character",
        ],
        confirmPassword: [
          (v) => !!v || "Please make sure your passwords match.",
          (v) =>
            (v && v == this.data.password) ||
            "Please make sure your passwords match.",
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
      if (id) {
        this.step = 1;

        this.id = id;
        setTimeout(() => {
          this.$refs.form.reset();
          this.$refs.wizard.init();
          if (id) {
            this.getData(id);
          }
        }, 1);
      }
      this.opened = true;
    },
    async getData(id) {
      this.loadingData = true;
      this.id = id;
      await ApiService.get("user?id=" + id)
        .then(({ data }) => {
          this.data = {
            name: data.name,
            email: data.email,
            username: data.username,
            phone: data.phone,
            address: data.address,
            active: data.active,
            password: null,
          };
          this.loadingData = false;
        })
        .catch(({ response }) => {
          if (response.data) {
            this.handleError(response.data);
          }
          this.loadingData = false;
        });
      return true;
    },
    async save() {
      this.$refs.form.validate();
      if (this.valid && this.id) {
        this.loading = true;

        ApiService.update("user?id=" + this.id, this.data)
          .then(({ data }) => {
            if (data.id) {
              this.loading = false;
              this.success(data);
              this.$bvToast.toast("Records has been saved!", {
                title: "Saved",
                variant: "success",
                solid: true,
              });
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
    async saveNewUser() {
      this.$refs.formNewUser.validate();
      if (this.valid) {
        this.loading = true;

        ApiService.post("user", this.data)
          .then(({ data }) => {
            if (data.id) {
              this.$refs.formNewUser.reset();
              this.getData(data.id).then(() => {
                this.$refs.wizard.init();
                this.success(data);
                this.$bvToast.toast("Records has been saved!", {
                  title: "Saved",
                  variant: "success",
                  solid: true,
                });
                this.loading = false;
              });
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
    stepChanged(step) {
      this.step = step;
    },
    close() {
      this.opened = false;
      this.id = null;
      this.step = 1;
      this.data = {};
      this.$refs.form && this.$refs.form.reset();
      this.$refs.formNewUser && this.$refs.formNewUser.reset();
    },
  },
  components: {
    UserWizard,
    ListUserRole,
    ListUserLog,
    FormChangePassword,
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
    canChangePassword() {
      if (
        this.id &&
        this.$store.getters.hasPermission(this.module, "change-password")
      ) {
        return true;
      }

      return false;
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/sass/pages/wizard/wizard-2.scss";
</style>
