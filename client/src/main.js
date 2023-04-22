import Vue from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import Vuetify from "vuetify";
import "@mdi/font/css/materialdesignicons.css";

import { BootstrapVue } from "bootstrap-vue";
import VueRouter from "vue-router";
import router from "./router";
import store from "./store";
import { i18n } from "./i18n";
// import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(Vuetify);
Vue.use(VueRouter);

const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi",
  },
});

new Vue({
  el: "#app",
  vuetify,
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
