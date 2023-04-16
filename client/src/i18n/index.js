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
    markedFlight: "Marked Flight",
    nameLabel: "Username:",
    namePlaceholder: "Enter username",
    emailAddressLabel: "Email address:",
    emailAddressPlaceholder: "Enter email",
    passwordLabel: "Password:",
    passwordPlaceholder: "Enter password",
    passwordAgainLabel: "Password again:",
    passwordAgainPlaceholder: "Enter password again",
    loginVerb: "Login",
    register: "Register",
  },
  fr: {
    loginTab: "Se connecter",
    registry: "Registry",
    search: "Search",
    language: "LANG",
    profile: "Profile",
    signOut: "Sign Out",
    markedFlight: "Marked Flight",
    nameLabel: "Username:",
    namePlaceholder: "Enter username",
    emailAddressLabel: "Email address:",
    emailAddressPlaceholder: "Email address:",
    passwordLabel: "Password:",
    passwordPlaceholder: "Password:",
    passwordAgainLabel: "Password again:",
    passwordAgainPlaceholder: "Enter password again",
    loginVerb: "Login",
    register: "Register",
  },
  hu: {
    loginTab: "Bejelentkezés",
    registry: "Regisztráció",
    search: "Keresés",
    language: "NYELV",
    profile: "Profil",
    signOut: "Kijelentkezés",
    markedFlight: "Figyelt járat",
    nameLabel: "Felhasználónév:",
    namePlaceholder: "Írja be a fehasználónevét",
    emailAddressLabel: "Email cím:",
    emailAddressPlaceholder: "Írja be email-címét",
    passwordLabel: "Jelszó:",
    passwordPlaceholder: "Írja be a jelszavát",
    passwordAgainLabel: "Jelszó mégegyszer:",
    passwordAgainPlaceholder: "Írja be a jelszavát mégegyszer",
    loginVerb: "Belépés",
    register: "Regisztrálás",
  },
  de: {
    loginTab: "Log in",
    registry: "Registry",
    search: "Search",
    language: "LANG",
    profile: "Profile",
    signOut: "Sign Out",
    markedFlight: "Marked Flight",
    nameLabel: "Username:",
    namePlaceholder: "Enter username",
    emailAddressLabel: "Email address:",
    emailAddressPlaceholder: "Email address:",
    passwordLabel: "Password:",
    passwordPlaceholder: "Password:",
    passwordAgainLabel: "Password again:",
    passwordAgainPlaceholder: "Enter password again",
    loginVerb: "Login",
    register: "Register",
  },
  // add more languages as needed
};

export const i18n = new VueI18n({
  locale: "en", // set the default locale
  fallbackLocale: "en", // set the fallback locale
  messages, // set the messages object
});
