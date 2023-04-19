<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="#">LogoIcon</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link to="/search" custom v-slot="{ navigate }">
            <b-nav-item
              @click="navigate"
              @keypress.enter="navigate"
              role="button"
              >{{ $t("search") }}</b-nav-item
            >
          </router-link>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="LANG" right>
            <b-dropdown-item-button value="en-US" @click="changeLocale"
              >English(US)</b-dropdown-item-button
            >
            <b-dropdown-item-button value="en-GB  " @click="changeLocale"
              >English(GB)</b-dropdown-item-button
            >
            <b-dropdown-item-button value="hu-HU" @click="changeLocale"
              >Magyar</b-dropdown-item-button
            >
            <b-dropdown-item-button value="fr-FR" @click="changeLocale"
              >Français</b-dropdown-item-button
            >
            <b-dropdown-item-button value="de-DE" @click="changeLocale"
              >Deutsch</b-dropdown-item-button
            >
          </b-nav-item-dropdown>
          <router-link
            v-if="!isSignedIn"
            to="/registry"
            custom
            v-slot="{ navigate }"
          >
            <b-nav-item
              @click="navigate"
              @keypress.enter="navigate"
              role="button"
              >{{ $t("registry") }}</b-nav-item
            >
          </router-link>
          <div v-if="isSignedIn">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>{{ $t("profile") }}</em>
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
              <b-nav-item
                @click="navigate"
                @keypress.enter="navigate"
                role="button"
                >{{ $t("loginTab") }}</b-nav-item
              >
            </router-link>
          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- Rest of your website content goes here -->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import store from "./store";
import { i18n } from "./i18n";
export default {
  name: "App",
  created() {
    store.dispatch("fetchCulture");
  },
  components: {},
  computed: {
    ...mapState(["isSignedIn"]),
  },

  methods: {
    ...mapMutations(["signOut"]),
    changeLocale(event) {
      i18n.locale = event.target.value;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
