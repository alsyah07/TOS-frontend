<template>
  <v-dialog v-model="opened" max-width="290" persistent>
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        {{ subtitle }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="grey darken-1" text :disabled="loading" @click="close()">
          <v-icon small left>mdi-close</v-icon>
          Batal
        </v-btn>

        <v-btn
          color="red darken-1"
          text
          :disabled="loading"
          :loading="loading"
          @click="deleteAction()"
        >
          <v-icon small left>mdi-delete</v-icon>
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ApiService from "@/core/services/api.service";

export default {
  data() {
    return {
      opened: false,
      loading: false,
      id: null,
    };
  },
  props: {
    url: {
      type: String,
    },
    title: {
      type: String,
      default: "Apakah anda yakin?",
    },
    subtitle: {
      type: String,
      default:
        "Apakah anda yakin ingin menghapus file ini? file tidak dapat dikembalikan setelah dihapus.",
      //Do you really want to delete this records? This process cannot be undone
    },
    success: {
      type: Function,
      default: function() {},
    },
  },
  methods: {
    open(id) {
      if (typeof id == "undefined" || id === null) {
        return;
      }
      this.opened = true;
      this.id = id;
    },
    deleteAction() {
      if (!this.url) {
        this.success(this.id);
        this.opened = false;
        this.id = null;
        return;
      }
      this.loading = true;

      ApiService.delete(this.url + "?id=" + this.id)
        .then(({ data }) => {
          if (data.deleted > 0) {
            this.opened = false;
            this.loading = false;
            this.$bvToast.toast("Records has been deleted!", {
              title: "Deleted",
              variant: "success",
              solid: true,
            });
            this.success(data);
          }
        })
        .catch(({ response }) => {
          this.loading = false;
          if (response.data) {
            this.handleError(response.data);
          }
        });
    },
    close() {
      this.opened = false;
      this.id = null;
    },
    handleError(data) {
      if (data.errors && data.errors.length > 0) {
        data.errors.forEach((err) => {
          this.$bvToast.toast(err.msg || err, {
            title: data.status,
            variant: "danger",
            solid: true,
          });
        });
      }
    },
  },
};
</script>

<style></style>
