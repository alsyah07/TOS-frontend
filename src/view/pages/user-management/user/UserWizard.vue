<template>
  <div class="card card-custom">
    <div class="card-body p-0">
      <div
        class="wizard wizard-2"
        id="kt_wizard_v2"
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
                    Pengaturan User
                  </h3>
                  <div class="wizard-desc">
                    Atur data pengguna
                  </div>
                </div>
              </div>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-wrapper">
                <div class="wizard-icon">
                  <span class="svg-icon svg-icon-2x">
                    <inline-svg :src="asset('/media/svg/icons/Home/Key.svg')" />
                  </span>
                </div>
                <div class="wizard-label">
                  <h3 class="wizard-title">
                    Pengaturan Role
                  </h3>
                  <div class="wizard-desc">
                    Atur Role dan Wilayah
                  </div>
                </div>
              </div>
            </div>
            <div
              class="wizard-step"
              data-wizard-type="step"
              v-if="canChangePassword"
            >
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
                    Ganti Password
                  </h3>
                  <div class="wizard-desc">
                    Ubah password user
                  </div>
                </div>
              </div>
            </div>
            <div
              class="wizard-step"
              data-wizard-type="step"
            >
              <div class="wizard-wrapper">
                <div class="wizard-icon">
                  <span class="svg-icon svg-icon-2x">
                    <inline-svg
                      :src="asset('/media/svg/icons/Files/File.svg')"
                    />
                  </span>
                </div>
                <div class="wizard-label">
                  <h3 class="wizard-title">
                    Riwayat Login
                  </h3>
                  <div class="wizard-desc">
                    Data riwayat login
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
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { asset } from "@/core/utils";
import KTUtil from "@/assets/js/components/util";
import KTWizard from "@/assets/js/components/wizard";
export default {
  props: {
    change: {
      type: Function,
      default: function() {},
    },
    close: {
      type: Function,
      default: function() {},
    },
    canChangePassword: Boolean,
  },
  data() {
    return {
      currentStep: 1,
    };
  },
  methods: {
    init() {
      // Initialize form wizard
      const wizard = new KTWizard("kt_wizard_v2", {
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
    },
    asset,
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/pages/wizard/wizard-2.scss";
</style>
