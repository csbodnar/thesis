import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";
import LoginComponent from "./components/Login.vue";
import RegistryComponent from "./components/Registry.vue";
import SearchComponent from "./components/Search.vue";
import HomeComponent from "./components/Home.vue";
import MarkedFlight from "./components/Marked";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeComponent,
    },
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
      path: "/search",
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
