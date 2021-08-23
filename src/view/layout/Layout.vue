<template>
  <div class="d-flex flex-column flex-root">
    <!-- begin:: Header Mobile -->
    <KTHeaderMobile></KTHeaderMobile>
    <!-- end:: Header Mobile -->

    <Loader v-if="loaderEnabled" v-bind:logo="loaderLogo"></Loader>

    <!-- begin::Body -->
    <div class="d-flex flex-row flex-column-fluid page">
      <!-- begin:: Aside Left -->
      <KTAside v-if="asideEnabled"></KTAside>
      <!-- end:: Aside Left -->

      <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">
        <!-- begin:: Header -->
        <KTHeader :openProfile="openProfile"></KTHeader>
        <!-- end:: Header -->

        <!-- begin:: Content -->
        <div
          id="kt_content"
          class="content d-flex flex-column flex-column-fluid"
        >
          <!-- begin:: Content Head -->
          <v-app>
            <!-- begin:: Content Head -->
            <KTSubheader
              v-if="subheaderDisplay"
              v-bind:breadcrumbs="breadcrumbs"
              v-bind:title="pageTitle"
            />
            <!-- end:: Content Head -->
            <!-- begin:: Content Body -->
            <div class="d-flex flex-column-fluid">
              <div
                :class="{
                  'container-fluid': contentFluid,
                  container: !contentFluid,
                }"
              >
                <transition name="fade-in-up">
                  <router-view />
                </transition>
              </div>
              <my-profile ref="myProfile"></my-profile>
            </div>
          </v-app>
        </div>
        <KTFooter></KTFooter>
      </div>
    </div>
    <KTScrollTop></KTScrollTop>
  </div>
</template>
<style lang="scss">
@import "~vuetify/dist/vuetify.css";

.theme--light.v-application {
  background: transparent !important;
}
.v-application code {
  box-shadow: none !important;
}
</style>
<script>
import { mapGetters } from "vuex";
import { GET_PERMISSION } from "@/core/services/store/auth.module";
import KTAside from "@/view/layout/aside/Aside.vue";
import KTHeader from "@/view/layout/header/Header.vue";
import KTHeaderMobile from "@/view/layout/header/HeaderMobile.vue";
import KTFooter from "@/view/layout/footer/Footer.vue";
import HtmlClass from "@/core/services/htmlclass.service";
import KTSubheader from "@/view/layout/subheader/Subheader.vue";
import KTScrollTop from "@/view/layout/extras/ScrollTop";
import Loader from "@/view/content/Loader.vue";
import {
  ADD_BODY_CLASSNAME,
  REMOVE_BODY_CLASSNAME,
} from "@/core/services/store/htmlclass.module.js";
import MyProfile from "@/view/pages/auth/Profile";

export default {
  name: "Layout",
  components: {
    KTAside,
    KTHeader,
    KTHeaderMobile,
    KTFooter,
    KTSubheader,
    KTScrollTop,
    Loader,
    MyProfile,
  },
  beforeMount() {
    // show page loading
    this.$store.dispatch(ADD_BODY_CLASSNAME, "page-loading");

    // initialize html element classes
    HtmlClass.init(this.layoutConfig());
  },
  mounted() {
    // this.$refs.myProfile.open();
    // check if current user is authenticated
    if (!this.isAuthenticated) {
      this.$router.push({ name: "login" });
    }

    this.$store.dispatch(GET_PERMISSION).then(() => {
      this.$store.dispatch(REMOVE_BODY_CLASSNAME, "page-loading");
    });
    // // Simulate the delay page loading
    // setTimeout(() => {
    //   // Remove page loader after some time

    // }, 2000);
  },
  methods: {
    openProfile() {
      this.$refs.myProfile.open();
    },
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "breadcrumbs",
      "pageTitle",
      "layoutConfig",
    ]),

    /**
     * Check if the page loader is enabled
     * @returns {boolean}
     */
    loaderEnabled() {
      return !/false/.test(this.layoutConfig("loader.type"));
    },

    /**
     * Check if container width is fluid
     * @returns {boolean}
     */
    contentFluid() {
      return this.layoutConfig("content.width") === "fluid";
    },

    /**
     * Page loader logo image using require() function
     * @returns {string}
     */
    loaderLogo() {
      return process.env.BASE_URL + this.layoutConfig("loader.logo");
    },

    /**
     * Check if the left aside menu is enabled
     * @returns {boolean}
     */
    asideEnabled() {
      return !!this.layoutConfig("aside.self.display");
    },

    /**
     * Set the right toolbar display
     * @returns {boolean}
     */
    toolbarDisplay() {
      // return !!this.layoutConfig("toolbar.display");
      return true;
    },

    /**
     * Set the subheader display
     * @returns {boolean}
     */
    subheaderDisplay() {
      return !!this.layoutConfig("subheader.display");
    },
  },
};
</script>
