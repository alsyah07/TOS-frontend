<template>
  <v-form ref="form" v-model="valid" @submit.prevent="save()">
    <v-container>
      <v-row justify="center" no-gutters>
        <v-col cols="12" md="6">
          <v-text-field
            label="Password Baru"
            type="password"
            required
            dense
            outlined
            v-model="data.new_password"
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
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="12" md="6" align="center">
          <v-btn depressed class="ma-1" :disabled="loading" @click="close()">
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
            @click.prevent="save()"
          >
            <v-icon small left>mdi-content-save</v-icon>
            Simpan
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import ApiService from "@/core/services/api.service";

export default {
  data() {
    return {
      loading: false,
      loadingData: false,
      valid: true,
      data: {
        new_password: null,
      },
      confirmPassword: "",
      rules: {
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
            (v && v == this.data.new_password) ||
            "Please make sure your passwords match.",
        ],
      },
    };
  },
  props: {
    id: String,
    success: {
      type: Function,
      default: function() {},
    },
    close: {
      type: Function,
      default: function() {},
    },
  },
  methods: {
    reset() {
      this.id = null;
      this.$refs.form.reset();
    },
    async save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;

        let url = "user?id=" + this.id;
        ApiService.update(url, {
          password: this.data.new_password
        })
          .then(({ data }) => {
            if (data.id) {
              this.loading = false;
              this.success(data);
              this.$bvToast.toast("Password has been changed!", {
                title: "Saved",
                variant: "success",
                solid: true,
              });
              this.$refs.form.reset();
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
  },
};
</script>
