<template>
  <v-dialog v-model="opened" :max-width="1000" persistent>
    <div class="card card-custom">
      <div class="card-body p-0">
        <div
          class="wizard wizard-2"
          id="kt_wizard_profile"
          data-wizard-state="step-first"
          data-wizard-clickable="true"
        >
          <div class="wizard-nav border-right py-5 px-5 py-lg-5 px-lg-5">
            <div class="wizard-steps">
              <div
                class="wizard-step"
                data-wizard-type="step"
                data-wizard-state="current"
              >
                <div class="wizard-wrapper">
                  <div class="wizard-icon">
                    <span class="svg-icon svg-icon-2x">
                      <inline-svg
                        :src="asset('/media/svg/icons/General/User.svg')"
                      />
                    </span>
                  </div>
                  <div class="wizard-label">
                    <h3 class="wizard-title">
                      Akun Saya
                    </h3>
                    <div class="wizard-desc">
                      Akun Detil
                    </div>
                  </div>
                </div>
              </div>
              <div class="wizard-step" data-wizard-type="step">
                <div class="wizard-wrapper">
                  <div class="wizard-icon">
                    <span class="svg-icon svg-icon-2x">
                      <inline-svg
                        :src="asset('/media/svg/icons/General/Lock.svg')"
                      />
                    </span>
                  </div>
                  <div class="wizard-label">
                    <h3 class="wizard-title">
                      Ubah Password
                    </h3>
                    <div class="wizard-desc">
                      Ubah Password saat ini
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="wizard-body py-5 px-5 py-lg-5 px-lg-5">
            <v-row justify="end" no-gutters>
              <v-col cols="12" align="right">
                <v-btn icon @click="close()">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <div v-if="currentStep == 1">
              <v-form ref="form" v-model="valid">
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
                        required
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
                        type="submit"
                        color="success"
                        depressed
                        class="ma-1"
                        :loading="loading"
                        :disabled="loading"
                        @click="save()"
                      >
                        <v-icon small left>mdi-content-save</v-icon>
                        Simpan
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </div>
            <div v-else-if="currentStep == 2">
              <form-change-password
                ref="formChangePassword"
                :close="close"
              ></form-change-password>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { asset } from "@/core/utils";
import KTUtil from "@/assets/js/components/util";
import KTWizard from "@/assets/js/components/wizard";
import ApiService from "@/core/services/api.service";
import { VERIFY_AUTH } from "@/core/services/store/auth.module";
import FormChangePassword from "@/view/pages/auth/ChangePassword";

export default {
  props: {
    change: {
      type: Function,
      default: function() {},
    },
  },
  data() {
    return {
      loading: false,
      loadingData: false,
      currentStep: 1,
      opened: false,
      data: {
        name: null,
      },
      rules: {
        username: [
          (v) => !!v || "Username is required",
          (v) =>
            /^(?=[a-zA-Z0-9._]{3,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(v) ||
            "Username only contains alphanumeric characters, underscore, dot and must between 3 to 30 character.",
        ],
        email: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
        phone: [
          (v) => {
            if (!!v && v.length > 20) {
              return "Phone must be less than 20 characters";
            }

            return true;
          },
        ],
        name: [
          (v) => !!v || "Name is required",
          (v) =>
            (v && v.length <= 100) || "Name must be less than 100 characters",
        ],
      },
    };
  },
  methods: {
    init() {
      // Initialize form wizard
      const wizard = new KTWizard("kt_wizard_profile", {
        startStep: 1, // initial active step number
        clickableSteps: true, // allow step clicking
      });
      wizard.goTo(1);

      // Change event
      wizard.on("change", (obj) => {
        this.currentStep = obj.currentStep;
        this.change(this.currentStep);
        setTimeout(() => {
          KTUtil.scrollTop();
        }, 500);
      });
      this.loadingData = true;
      ApiService.get("user/info")
        .then(({ data }) => {
          this.data = {
            name: data.name,
            email: data.email,
            username: data.username,
            phone: data.phone,
            address: data.address
          };
          this.loadingData = false;
        })
        .catch(({ response }) => {
          if (response.data) {
            this.handleError(response.data);
          }
          this.loadingData = false;
        });
      // const user = this.$store.state.auth.user;
      // this.data = {
      //   name: user.name,
      //   email: user.email,
      //   username: user.username,
      //   phone: user.phone,
      //   address: user.address,
      //   nip: user.nip,
      // };
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        ApiService.update("user/update-profile", {
          name: this.data.name,
          email: this.data.email,
          username: this.data.username,
          phone: this.data.phone,
          address: this.data.address,
          nip: this.data.nip,
        })
          .then(({ data }) => {
            if (data.id) {
              this.$store.dispatch(VERIFY_AUTH).then(() => {
                this.$bvToast.toast("Profile has been updated!", {
                  title: "Saved",
                  variant: "success",
                  solid: true,
                });
                this.close();
                this.$refs.form.reset();
              });
            }
            this.loading = false;
          })
          .catch(({ response }) => {
            this.reset();
            this.loading = false;
            if (response.data) {
              this.handleError(response.data);
            }
          });
      }
    },
    open() {
      this.opened = true;
      setTimeout(() => {
        this.init();
      }, 100);
    },
    close() {
      this.opened = false;
      this.data = {};
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
    asset,
  },
  components: {
    FormChangePassword,
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/pages/wizard/wizard-2.scss";
</style>
