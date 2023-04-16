import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const messages = {
  en: {
    loginTab: "Log in",
    registry: "Registry",
    search: "Search",
    language: "LANG",
    profile: "Profile",
    signOut: "Sign Out",
    watchedFlight: "Watched Flight",
    emailAddressLabel: "Email address:",
    passwordLabel: "Password:",
    loginVerb: "Login",
  },
  fr: {
    loginTab: "Se connecter",
    registry: "Registry",
    search: "Search",
    language: "LANG",
    profile: "Profile",
    signOut: "Sign Out",
    watchedFlight: "Watched Flight",
    emailAddressLabel: "Email address:",
    passwordLabel: "Password:",
    loginVerb: "Login",
  },
  hu: {
    loginTab: "Log in",
    registry: "Registry",
    search: "Search",
    language: "LANG",
    profile: "Profile",
    signOut: "Sign Out",
    watchedFlight: "Watched Flight",
    emailAddressLabel: "Email address:",
    passwordLabel: "Password:",
    loginVerb: "Login",
  },
  de: {
    loginTab: "Log in",
    registry: "Registry",
    search: "Search",
    language: "LANG",
    profile: "Profile",
    signOut: "Sign Out",
    watchedFlight: "Watched Flight",
    emailAddressLabel: "Email address:",
    passwordLabel: "Password:",
    loginVerb: "Login",
  },
  // add more languages as needed
};

export const i18n = new VueI18n({
  locale: "en", // set the default locale
  fallbackLocale: "en", // set the fallback locale
  messages, // set the messages object
});
