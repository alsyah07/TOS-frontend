<template>
  <!-- begin:: Header Topbar -->
  <div class="topbar">
    <div class="topbar-item">
      <b-dropdown
        size="sm"
        variant="transparent"
        class="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
        right
        no-flip
      >
        <template v-slot:button-content>
          <span
            class="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1"
          >
            Hi,
          </span>
          <span
            class="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3"
          >
            {{ currentUser.name.split(" ")[0] }}
          </span>
        </template>
        <b-dropdown-text tag="div" style="width: 175px;">
          <ul class="navi navi-hover py-4">
            <li class="navi-item" :key="i">
              <a href="#" class="navi-link" v-on:click="openProfile()">
                <i class="flaticon-user mr-5"></i>
                Profil Saya
              </a>
            </li>
            <li class="navi-item" :key="i">
              <a href="#" class="navi-link" v-on:click="onLogout"
                ><i class="flaticon-logout mr-5"></i> Keluar</a
              >
            </li>
          </ul>
          <!-- <KTDropdownLanguage
            v-on:language-changed="onLanguageChanged"
          ></KTDropdownLanguage> -->
        </b-dropdown-text>
      </b-dropdown>
    </div>
    <!--begin: User Bar -->
    <!-- <KTQuickUser></KTQuickUser> -->
    <!--end: User Bar -->
    <my-profile ref="myProfile"></my-profile>
  </div>
  <!-- end:: Header Topbar -->
</template>

<style lang="scss">
.topbar {
  .dropdown-toggle {
    padding: 0;
    &:hover {
      text-decoration: none;
    }

    &.dropdown-toggle-no-caret {
      &:after {
        content: none;
      }
    }
  }

  .dropdown-menu {
    margin: 0;
    padding: 0;
    outline: none;
    .b-dropdown-text {
      padding: 0;
    }
  }
}
</style>

<script>
import { LOGOUT } from "@/core/services/store/auth.module";
import MyProfile from "@/view/pages/auth/Profile";
import { mapGetters } from "vuex";

export default {
  name: "KTTopbar",
  data() {
    //
    return {
      user: this.$store.state.auth.user,
    };
  },
  props: {
    openProfile: {
      type: Function,
      default: function() {},
    },
  },
  components: {
    MyProfile,
  },
  methods: {
    onLogout() {
      this.$store
        .dispatch(LOGOUT)
        .then(() => this.$router.push({ name: "login" }));
    },
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
};
</script>
