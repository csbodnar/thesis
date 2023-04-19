import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "./router";
import { i18n } from "./i18n";

Vue.use(Vuex);

const store = new Vuex.Store({
  // state, mutations, actions, getters, etc.
  state: {
    market: "",
    locale: "",
    currency: {},
    placeSuggestions: [],
    isSignedIn: false,
    authToken: "",
    isSearching: true,
    showingResults: false,
    searchResultItineraries: {},
    sortingOption: "best",
    sortingOptions: {
      cheapest: [],
      fastest: [],
      best: [],
    },
  },
  getters: {
    getPlaceSuggestions(state) {
      return state.placeSuggestions;
    },
    isCurrentlySearching(state) {
      return state.isSearching;
    },
    getSortedItineraries(state) {
      return state.sortingOptions[state.sortingOption];
    },
  },
  mutations: {
    signOut(state) {
      state.isSignedIn = false;
      state.authToken = "";
      if (router.currentRoute.path !== "/") {
        router.push("/");
      }
    },
    setSortingOption(state, payload) {
      state.sortingOption = payload.sortingOption;
    },
    setCurrentlySearching(state, payload) {
      state.isSearching = payload.isSearching;
    },
    login(state, payload) {
      axios
        .post("http://localhost:5555/login", {
          email: payload.email,
          password: payload.password,
        })
        .then((response) => {
          state.authToken = response.data.token;
          state.isSignedIn = true;
          router.push("/");
        })
        .catch((error) => {
          console.log(error);
          return error.msg;
        });
    },
    register(state, payload) {
      axios
        .post("http://localhost:5555/register", {
          name: payload.name,
          email: payload.email,
          password: payload.password,
        })
        .then((response) => {
          state.authToken = response.data.token;
          state.isSignedIn = true;
          router.push("/");
        })
        .catch((error) => {
          console.log(error);
          return error.data;
        });
    },
  },
  actions: {
    goBack() {
      router.go(-1);
    },
    search(context, payload) {
      context.commit("setCurrentlySearching", { isSearching: false });
      axios
        .post("http://localhost:5555/search", {
          query: {
            market: context.state.market,
            locale: context.state.locale,
            currency: context.state.currency.code,
            queryLegs: payload.query.queryLegs,
            cabinClass: payload.query.cabinClass,
            adults: 1,
            // childrenAges: [3, 9],
          },
        })
        .then((response) => {
          console.log(response.data);
          console.log(response.data.content);
          this.state.sortingOptions = response.data.content.sortingOptins;
          this.state.searchResultItineraries =
            response.data.content.results.itineraries;
          this.state.showingResults = true;
          // return response.data;
        })
        .catch((error) => {
          console.log(error);
          return error.msg;
        });
    },
    autoSuggestPlace(context, payload) {
      axios
        .post("http://localhost:5555/suggestPlace", {
          query: {
            market: context.state.market,
            locale: context.state.locale,
            searchTerm: payload.searchTerm,
          },
          isDestination: payload.isDestination,
          limit: 10,
        })
        .then((response) => {
          context.state.placeSuggestions = response.data.places;
        })
        .catch((error) => {
          console.log(error);
          return error.msg;
        });
    },
    async fetchCulture(context) {
      await axios
        .get("http://localhost:5555/fetchCulture")
        .then((response) => {
          console.log(response);
          if (response.data.name === "Error") {
            //deafault culture is english(uk)
            context.state.market = "UK";
            context.state.locale = "en-GB";
            context.state.currency = {
              code: "GBP",
              symbol: "£",
              thousandsSeparator: ",",
              decimalSeparator: ".",
              symbolOnLeft: false,
              spaceBetweenAmountAndSymbol: false,
              decimalDigits: 2,
            };
          } else {
            context.state.market = response.data.market.code;
            context.state.locale = response.data.locale.code;
            context.state.currency = response.data.currency;
          }
          i18n.locale = context.state.locale;
          return response;
        })
        .catch((error) => {
          console.log(error);
          return error.msg;
        });
    },

    async fetchMarkedFlightData(context) {
      await axios
        .get("http://localhost:5555/getWatched", {
          headers: { Authorization: `Bearer ${context.state.authToken}` },
        })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log(error);
          return error.msg;
        });
    },
  },
});

export default store;
