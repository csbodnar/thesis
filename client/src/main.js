import Vue from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import { BootstrapVue } from "bootstrap-vue";
import VueRouter from "vue-router";
import router from "./router";
import store from "./store";
import { i18n } from "./i18n";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueRouter);

new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
