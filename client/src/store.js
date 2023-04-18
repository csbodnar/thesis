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
  },
  getters: {
    getPlaceSuggestions(state) {
      return state.placeSuggestions;
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
  search(state, payload) {
    axios
      .post("http://localhost:5555/search", {
        query: {
          market: "UK",
          locale: "en-GB",
          currency: "EUR",
          queryLegs: [
            {
              originPlaceId: { iata: "LHR" },
              destinationPlaceId: { iata: "DXB" },
              date: { year: 2023, month: 9, day: 20 },
            },
          ],
          cabinClass: payload.cabinClass,
          adults: 2,
          childrenAges: [3, 9],
        },
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
  actions: {
    goBack() {
      router.go(-1);
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
            //deafault culture is hungarian
            context.state.market = "HU";
            context.state.locale = "hu-HU";
            context.state.currency = {
              code: "HUF",
              symbol: "Ft",
              thousandsSeparator: ".",
              decimalSeparator: ",",
              symbolOnLeft: false,
              spaceBetweenAmountAndSymbol: true,
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
