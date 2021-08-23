import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./core/services/store";
import ApiService from "./core/services/api.service";
// import MockService from "./core/mock/mock.service";
import { VERIFY_AUTH } from "./core/services/store/auth.module";
import { RESET_LAYOUT_CONFIG } from "@/core/services/store/config.module";
import { CLEAR_ACTION } from "@/core/services/store/actions.module";

const moment = require("moment");
require("moment/locale/id");

Vue.use(require("vue-moment"), {
  moment,
});

Vue.config.productionTip = false;

// workaround
// https://github.com/vuetifyjs/vuetify/issues/9999
const ignoreWarnMessage = `The .native modifier for v-on is only valid on components but it was used on <div>.`;
// eslint-disable-next-line no-unused-vars
Vue.config.warnHandler = function(msg, vm, trace) {
  if (msg === ignoreWarnMessage) {
    msg = null;
    vm = null;
    trace = null;
  }
};
// Global 3rd party plugins
import "popper.js";
import "tooltip.js";
import PerfectScrollbar from "perfect-scrollbar";
window.PerfectScrollbar = PerfectScrollbar;
import ClipboardJS from "clipboard";
window.ClipboardJS = ClipboardJS;

// Vue 3rd party plugins
import i18n from "./core/plugins/vue-i18n";
import vuetify from "./core/plugins/vuetify";
import "./core/plugins/portal-vue";
import "./core/plugins/bootstrap-vue";
import "./core/plugins/perfect-scrollbar";
import "./core/plugins/highlight-js";
import "./core/plugins/inline-svg";
import "./core/plugins/apexcharts";
import "./core/plugins/metronic";
import "@mdi/font/css/materialdesignicons.css";

// API service init
ApiService.init();

// Remove this to disable mock API
// MockService.init();

router.beforeEach((to, from, next) => {
  // reset config to initial state
  store.dispatch(RESET_LAYOUT_CONFIG);
  store.dispatch(CLEAR_ACTION);
  // Ensure we checked auth before each page load.
  store.dispatch(VERIFY_AUTH).then((status) => {
    if (!status && ["login", "register"].indexOf(to.name) == -1) {
      next({ name: "login" });
    } else {
      next();
    }
  });

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
