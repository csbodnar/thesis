import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";
import LoginComponent from "./views/Login.vue";
import RegistryComponent from "./views/Registry.vue";
import SearchComponent from "./views/Search.vue";
import MarkedFlight from "./views/Marked";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginComponent,
      beforeEnter: (to, from, next) => {
        if (store.state.isSignedIn) {
          next(from);
        } else {
          next();
        }
      },
    },
    {
      path: "/registry",
      name: "registry",
      component: RegistryComponent,
      beforeEnter: (to, from, next) => {
        if (store.state.isSignedIn) {
          next(from);
        } else {
          next();
        }
      },
    },
    {
      path: "/",
      name: "search",
      component: SearchComponent,
    },
    {
      path: "/marked",
      name: "marked",
      component: MarkedFlight,
      beforeEnter: (to, from, next) => {
        if (!store.state.isSignedIn) {
          next(from);
        } else {
          next();
        }
      },
    },
  ],
});

export default router;
