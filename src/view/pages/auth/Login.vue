<template>
  <div>
    <!--begin::Content header-->
    <div
      class="position-absolute top-0 right-0 text-right mt-5 mb-15 mb-lg-0 flex-column-auto justify-content-center py-5 px-10"
    >
      <span class="font-weight-bold font-size-3 text-dark-60">
        Belum memiliki akun?
      </span>
      <router-link
        class="font-weight-bold font-size-3 ml-2"
        :to="{ name: 'register' }"
      >
        Daftar Disini!
      </router-link>
    </div>
    <!--end::Content header-->

    <!--begin::Signin-->
    <div class="login-form login-signin">
      <div class="text-center mb-10 mb-10">
        <h3 class="font-size-h1">Sign In</h3>
        <p class="text-muted font-weight-semi-bold">
          Ketik Email dan Password
        </p>
      </div>

      <!--begin::Form-->
      <b-form class="form" @submit.stop.prevent="onSubmit">
        <div
          role="alert"
          v-bind:class="{ show: errors.length }"
          v-show="errors.length"
          class="alert fade alert-danger"
        >
          <div class="alert-text" v-for="(error, i) in errors" :key="i">
            {{ error }}
          </div>
        </div>

        <b-form-group label="" label-for="input-email">
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6"
            id="input-email"
            name="input-email"
            v-model="$v.form.email.$model"
            :state="validateState('email')"
            aria-describedby="input-1-live-feedback"
            placeholder="Email Anda"
          ></b-form-input>

          <b-form-invalid-feedback id="input-1-live-feedback">
            Email harus diisi, mohon isi email yang valid!
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="" label-for="input-password">
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6"
            type="password"
            id="input-password"
            name="input-password"
            v-model="$v.form.password.$model"
            :state="validateState('password')"
            aria-describedby="input-2-live-feedback"
            placeholder="Password"
          ></b-form-input>

          <b-form-invalid-feedback id="input-2-live-feedback">
            Password harus diisi
          </b-form-invalid-feedback>
        </b-form-group>

        <!--begin::Action-->
        <div
          class="form-group d-flex flex-wrap justify-content-between align-items-center"
        >
          <a
            href="#"
            class="text-dark-60 text-hover-primary my-3 mr-2"
            id="kt_login_forgot"
          >
            Lupa Password ?
          </a>
          <button
            ref="kt_login_signin_submit"
            class="btn btn-primary font-weight-bold px-9 py-4 my-3 font-size-3"
          >
            Masuk
          </button>
        </div>
        <!--end::Action-->
      </b-form>
      <!--end::Form-->
    </div>
    <!--end::Signin-->
  </div>
</template>

<style lang="scss" scoped>
.spinner.spinner-right {
  padding-right: 3.5rem !important;
}
</style>

<script>
import { mapState } from "vuex";
import { LOGIN, LOGOUT } from "@/core/services/store/auth.module";

import { validationMixin } from "vuelidate";
import { minLength, required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "login",
  data() {
    return {
      // Remove this dummy login info
      form: {
        email: "",
        password: "",
      },
    };
  },
  validations: {
    form: {
      email: {
        required,
        // email,
      },
      password: {
        required,
        minLength: minLength(3),
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        email: null,
        password: null,
      };

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      const email = this.$v.form.email.$model;
      const password = this.$v.form.password.$model;

      // clear existing errors
      this.$store.dispatch(LOGOUT);

      // set spinner to submit button
      const submitButton = this.$refs["kt_login_signin_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");

      // send login request
      setTimeout(() => {
        this.$store
          .dispatch(LOGIN, { email, password })
          // go to which page after successfully login
          .then((data) => {
            this.$router.push({ path: data.to });
            submitButton.classList.remove(
              "spinner",
              "spinner-light",
              "spinner-right"
            );
          })
          .catch(() => {
            submitButton.classList.remove(
              "spinner",
              "spinner-light",
              "spinner-right"
            );
          });
      }, 1000);
    },
  },
  computed: {
    ...mapState({
      errors: (state) => state.auth.errors,
    }),
  },
};
</script>
