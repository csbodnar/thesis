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
    locale: "en-GB",
    currency: {
      code: "GBP",
      decimalDigits: 2,
      decimalSeparator: ".",
      spaceBetweenAmountAndSymbol: false,
      symbol: "£",
      symbolOnLeft: true,
      thousandsSeparator: ",",
    },
    priceMultiplier: {
      PRICE_UNIT_UNSPECIFIED: 1,
      PRICE_UNIT_WHOLE: 1,
      PRICE_UNIT_CENTI: 100,
      PRICE_UNIT_MILLI: 1000,
      PRICE_UNIT_MICRO: 1000000,
    },
    placeSuggestions: [],
    isSignedIn: false,
    authToken: "",
    isSearching: true,
    showingResults: false,
    loadingResults: false,
    searchSessionToken: "",
    searchResultItineraries: {},
    searchResultPlaces: {},
    searchResultLegs: {},
    searchResultSegments: {},
    searchResultAgents: {},
    searchResultCarriers: {},
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
    getPriceWithFormat(context, payload) {
      const unitMultiplier = context.state.priceMultiplier[payload.price.unit];
      const amount = parseInt(payload.price.amount) / unitMultiplier;
      const formatter = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: context.state.currency.code,
        currencyDisplay: "symbol",
        minimumFractionDigits: context.state.currency.decimalDigits,
        maximumFractionDigits: context.state.currency.decimalDigits,
        useGrouping: true,
        grouping: context.state.currency.thousandsSeparator,
        decimalSeparator: context.state.currency.decimalSeparator,
      });

      let asd = formatter.format(amount);
      console.log(asd);
      return asd;
    },
    goBack() {
      router.go(-1);
    },
    async search(context, payload) {
      context.state.isCurrentlySearching = false;
      context.state.loadingResults = true;
      await axios
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
          if (response.data.action !== "RESULT_ACTION_OMITTED") {
            console.log(response.data.content);
            context.state.sortingOptions = response.data.content.sortingOptions;
            context.state.searchResultItineraries =
              response.data.content.results.itineraries;
            context.state.searchResultSegments =
              response.data.content.results.segments;
            context.state.searchResultLegs = response.data.content.results.legs;
            context.state.searchResultPlaces =
              response.data.content.results.places;
            context.state.searchResultCarriers =
              response.data.content.results.carriers;
            context.state.searchResultAgents =
              response.data.content.results.agents;
            context.state.showingResults = true;
            context.state.loadingResults = false;

            context.state.sortingOptions[context.state.sortingOption].forEach(
              (idx) => {
                console.log(
                  context.state.searchResultItineraries[idx.itineraryId]
                );
              }
            );
          } else {
            //todo: error date from past
          }
        })
        .catch((error) => {
          console.log(error);
          return error.msg;
        });
    },
    async searchItinerary(context, payload) {
      context.state.isCurrentlySearching = false;
      context.state.loadingResults = true;
      await axios
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
          if (response.data.action !== "RESULT_ACTION_OMITTED") {
            console.log(response.data.content);
            context.state.sortingOptions = response.data.content.sortingOptions;
            context.state.searchResultItineraries =
              response.data.content.results.itineraries;
            context.state.searchResultSegments =
              response.data.content.results.segments;
            context.state.searchResultLegs = response.data.content.results.legs;
            context.state.searchResultPlaces =
              response.data.content.results.places;
            context.state.searchResultCarriers =
              response.data.content.results.carriers;
            context.state.searchResultAgents =
              response.data.content.results.agents;
            context.state.showingResults = true;
            context.state.loadingResults = false;

            context.state.sortingOptions[context.state.sortingOption].forEach(
              (idx) => {
                console.log(
                  context.state.searchResultItineraries[idx.itineraryId]
                );
              }
            );
          } else {
            //todo: error date from past
          }
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
          console.log(response.data.places);
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
