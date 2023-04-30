import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const messages = {
  "en-US": {
    loginTab: "Log in",
    registry: "Registry",
    search: "Search",
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
    oneway: "One way",
    return: "Return",
    direct: "Direct",
    fromLabel: "From",
    toLabel: "To",
    dateDepartLabel: "Depart date",
    dateReturnLabel: "Return date",
    cabinClass: "Cabin Class",
    economyClass: "Economy",
    premiumEconomyClass: "Premium Economy",
    buisnessClass: "Buisness",
    firstClass: "First Class",
    back: "Back",
  },
  "en-GB": {
    loginTab: "Log in",
    registry: "Registry",
    search: "Search",
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
    oneway: "One way",
    return: "Return",
    direct: "Direct",
    fromLabel: "From",
    toLabel: "To",
    dateDepartLabel: "Depart date",
    dateReturnLabel: "Return date",
    cabinClass: "Cabin Class",
    economyClass: "Economy",
    premiumEconomyClass: "Premium Economy",
    buisnessClass: "Buisness",
    firstClass: "First Class",
    back: "Back",
  },
  "fr-FR": {
    loginTab: "Se connecter",
    registry: "Registry",
    search: "Search",
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
    oneway: "One way",
    return: "Return",
    direct: "Direct",
    fromLabel: "From",
    toLabel: "To",
    dateDepartLabel: "Depart date",
    dateReturnLabel: "Return date",
    cabinClass: "Cabin Class",
    economyClass: "Economy",
    premiumEconomyClass: "Premium Economy",
    buisnessClass: "Buisness",
    firstClass: "First Class",
    back: "Back",
  },
  "hu-HU": {
    loginTab: "Bejelentkezés",
    registry: "Regisztráció",
    search: "Keresés",
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
    oneway: "Egyirányú",
    return: "Retur",
    direct: "Direct",
    fromLabel: "Honnan",
    toLabel: "Hová",
    dateDepartLabel: "Indulás dátuma",
    dateReturnLabel: "Érkezés dátuma",
    cabinClass: "Osztály",
    economyClass: "Economy",
    premiumEconomyClass: "Premium Economy",
    buisnessClass: "Buisness",
    firstClass: "Első Osztály",
    back: "Vissza",
  },
  "de-DE": {
    loginTab: "Log in",
    registry: "Registry",
    search: "Search",
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
    oneway: "One way",
    return: "Return",
    direct: "Direct",
    fromLabel: "From",
    toLabel: "To",
    dateDepartLabel: "Depart date",
    dateReturnLabel: "Return date",
    cabinClass: "Cabin Class",
    economyClass: "Economy",
    premiumEconomyClass: "Premium Economy",
    buisnessClass: "Buisness",
    firstClass: "First Class",
    back: "Back",
  },
  // add more languages as needed
};

export const i18n = new VueI18n({
  locale: "en-GB", // set the default locale
  fallbackLocale: "en-GB", // set the fallback locale
  messages, // set the messages object
});
