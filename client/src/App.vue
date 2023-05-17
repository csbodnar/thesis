<template>
  <div id="app" class="vh-100 w-100">
    <b-navbar toggleable="md" type="light" variant="info">
      <router-link to="/" custom v-slot="{ navigate }">
        <b-navbar-brand
          @click="navigate"
          @keypress.enter="navigate"
          role="button"
        >
          <i>
            <b-img
              class="inline"
              :src="require('@/assets/logo.png')"
              rounded="circle"
              alt="LOGO"
              v-bind="{
                width: 60,
                height: 60,
                class: 'ms-3',
              }"
            ></b-img>
            <h1 class="inline">FlyCloud</h1>
          </i>
        </b-navbar-brand>
      </router-link>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ms-auto">
          <router-link
            v-if="!isSignedIn"
            to="/registry"
            custom
            v-slot="{ navigate }"
          >
            <b-nav-item
              class="font-weight-bold"
              @click="navigate"
              @keypress.enter="navigate"
              role="button"
            >
              <b>
                {{ $t("registry") }}
              </b>
            </b-nav-item>
          </router-link>
          <div v-if="isSignedIn">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <strong>{{ userName }}</strong>
              </template>

              <router-link to="/marked" custom v-slot="{ navigate }">
                <b-dropdown-item @click="navigate" @keypress.enter="navigate"
                  >{{ $t("markedFlight") }}
                </b-dropdown-item>
              </router-link>
              <b-dropdown-item @click="signOut">{{
                $t("signOut")
              }}</b-dropdown-item>
            </b-nav-item-dropdown>
          </div>
          <div v-else>
            <router-link to="/login" custom v-slot="{ navigate }">
              <strong>
                <b-nav-item
                  @click="navigate"
                  @keypress.enter="navigate"
                  role="button"
                >
                  {{ $t("loginTab") }}
                </b-nav-item>
              </strong>
            </router-link>
          </div>
          <div class="d-flex flex-row align-self-center mx-5">
            <div class="h3 mb-0 align-self-center">
              <b-icon-globe2></b-icon-globe2>
            </div>
            <b-nav-item-dropdown class="fw-bold" :text="language.display" left>
              <b-dropdown-item-button
                v-for="lang in this.languages"
                :key="lang.locale"
                :value="lang.locale"
                @click="changeLocale"
                >{{ lang.display }}</b-dropdown-item-button
              >
            </b-nav-item-dropdown>
          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- Rest of your website content goes here -->
    <router-view class="d-flex justify-content-center"></router-view>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import store from "./store";
import { i18n } from "./i18n";
import { BIconGlobe2 } from "bootstrap-vue";

export default {
  name: "App",
  components: {
    BIconGlobe2,
  },
  data() {
    return {
      languages: [
        { locale: "en-US", display: "English(US)" },
        { locale: "en-GB", display: "English(GB)" },
        { locale: "hu-HU", display: "Magyar" },
        { locale: "fr-FR", display: "Français" },
        { locale: "de-DE", display: "Deutsch" },
      ],
    };
  },
  created() {
    store.dispatch("fetchCulture");
    i18n.locale = store.state.language;
  },
  computed: {
    ...mapState(["isSignedIn", "userName"]),
    language() {
      return this.languages.find((x) => x.locale == i18n.locale);
    },
  },

  methods: {
    ...mapMutations(["signOut"]),
    changeLocale(event) {
      i18n.locale = event.target.value;
    },
  },
};
</script>

<style scoped>
.navbar.navbar-dark.bg-info {
  background-color: #aabb55 !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.inline {
  display: inline-block;
}
h1 {
  margin: 0 0 0 15px;
}
b-navbar-nav {
  margin-left: 100px;
}
</style>
