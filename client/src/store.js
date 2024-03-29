import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "./router";

Vue.use(Vuex);

const store = new Vuex.Store({
  // state, mutations, actions, getters, etc.
  state: {
    market: "",
    locale: "en-GB",
    language: "en-GB",
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
    userName: "",
    authToken: "",
    directFlightSearch: false,
    isSearching: false,
    showingResults: false,
    loadingResults: false,
    searchSessionToken: "",
    searchResultItineraries: {},
    searchResultPlaces: {},
    searchResultLegs: {},
    searchResultSegments: {},
    searchResultAgents: {},
    searchResultCarriers: {},
    searchResultAlliances: {},
    sortingOption: "best",
    sortingOptions: {
      cheapest: [],
      fastest: [],
      best: [],
    },
    searchObject: {
      originPlaceObject: {},
      destinationPlaceObject: {},
      dateDepart: new Date(),
      dateReturn: new Date(),
      cabinClass: "CABIN_CLASS_ECONOMY",
    },
    markedFlightData: {
      detailed: undefined,
      raw: undefined,
    },
    registryModal: {
      ref: null,
      error: null,
    },
    loginModal: {
      ref: null,
      error: null,
    },
  },
  getters: {
    getSearchObject(state) {
      return state.searchObject;
    },
    getDateReturn(state) {
      return `${state.searchObject.dateReturn.getFullYear()}-${state.searchObject.dateReturn.getMonth()}-${state.searchObject.dateReturn.getDay()}`;
    },
    getPlaceSuggestions(state) {
      return state.placeSuggestions;
    },
    isCurrentlySearching(state) {
      return state.isSearching;
    },
    getSortedItineraries(state) {
      if (state.directFlightSearch) {
        return state.sortingOptions[state.sortingOption].filter((element) => {
          let stops = 0;
          let itinerary = state.searchResultItineraries[element.itineraryId];
          itinerary.legIds.forEach((legId) => {
            stops += state.searchResultLegs[legId].segmentIds.length - 1;
          });
          return stops == 0;
        });
      } else {
        return state.sortingOptions[state.sortingOption];
      }
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
    changeCabinClass(state, payload) {
      state.searchObject.cabinClass = payload.cabinClass;
    },
    setOriginPlaceObject(state, payload) {
      state.searchObject.originPlaceObject = payload.place;
    },
    setDestinationPlaceObject(state, payload) {
      state.searchObject.destinationPlaceObject = payload.place;
    },
    setSortingOption(state, payload) {
      state.sortingOption = payload.sortingOption;
    },
    toggleDirectFlightSearch(state) {
      state.directFlightSearch = !state.directFlightSearch;
    },
    setCurrentlySearching(state, payload) {
      state.isSearching = payload.isSearching;
    },
    setRegistryModal(state, payload) {
      state.registryModal.ref = payload.ref;
    },
    setLoginModal(state, payload) {
      state.loginModal.ref = payload.ref;
    },
  },
  actions: {
    login(context, payload) {
      axios
        .post("http://localhost:5555/login", {
          email: payload.email,
          password: payload.password,
        })
        .then((response) => {
          context.state.authToken = response.data.token;
          context.state.isSignedIn = true;
          context.state.userName = response.data.name;
          // context.dispatch("getMarkedFlightData");
          router.go(-1);
        })
        .catch((error) => {
          context.state.loginModal.error = error.response.data.error;
          context.state.loginModal.ref.show();
        });
    },
    register(context, payload) {
      axios
        .post("http://localhost:5555/register", {
          name: payload.name,
          email: payload.email,
          password: payload.password,
        })
        .then((response) => {
          context.state.authToken = response.data.token;
          context.state.isSignedIn = true;
          context.state.userName = response.data.name;
          router.push("/");
        })
        .catch((error) => {
          context.state.registryModal.error = error.response.data.error;
          context.state.registryModal.ref.show();
        });
    },
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
      let price = formatter.format(amount);
      return price.includes("NaN") ? "unknown" : price;
    },
    goBack() {
      router.go(-1);
    },
    async search(context, payload) {
      context.state.isCurrentlySearching = false;
      context.state.isSearching = true;
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
          console.log(response.data.status, response.data.action);

          if (response.data.status == 400) {
            return Promise.reject(new Error(response.data.error));
          } else if (response.data.action !== "RESULT_ACTION_OMITTED") {
            context.state.searchSessionToken = response.data.sessionToken;
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
            context.state.searchResultAlliances =
              response.data.content.results.alliances;
            context.state.showingResults = true;
            context.state.isSearching = false;
            context.state.loadingResults = false;
          } else {
            //todo: error date from past
          }
        })
        .catch((error) => {
          return Promise.reject(new Error(error));
        });
    },
    async searchPoll(context) {
      context.state.isCurrentlySearching = false;
      context.state.loadingResults = true;
      let finishCondition = false;
      while (!finishCondition) {
        await axios
          .post("http://localhost:5555/searchRefresh", {
            sessionToken: context.state.searchSessionToken,
          })
          .then((response) => {
            if (response.data.status == 400) {
              finishCondition = true;
              return Promise.reject(new Error(response.data.message));
            } else {
              context.state.sortingOptions =
                response.data.content.sortingOptions;
              context.state.searchResultItineraries =
                response.data.content.results.itineraries;
              context.state.searchResultSegments =
                response.data.content.results.segments;
              context.state.searchResultLegs =
                response.data.content.results.legs;
              context.state.searchResultPlaces =
                response.data.content.results.places;
              context.state.searchResultCarriers =
                response.data.content.results.carriers;
              context.state.searchResultAgents =
                response.data.content.results.agents;
            }
            if (response.data.status === "RESULT_STATUS_COMPLETE") {
              finishCondition = true;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      context.state.isSearching = false;
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
          context.state.market = response.data.market.code;
          context.state.locale = response.data.locale.code;
          context.state.language = response.data.locale.code;
          context.state.currency = response.data.currency;
          return response;
        })
        .catch((error) => {
          console.log(error);
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
          return error.msg;
        });
    },

    async getMarkedFlightData(context) {
      await axios
        .get("http://localhost:5555/getWatched", {
          headers: { Authorization: `Bearer ${context.state.authToken}` },
        })
        .then((response) => {
          if (response.data.msg == "no watched") {
            context.state.markedFlightData.raw = undefined;
          } else {
            context.state.markedFlightData.raw = response.data.raw;
            context.state.markedFlightData.detailed =
              response.data.detailed.content.results;
          }
          return response.data;
        })
        .catch((error) => {
          context.state.markedFlightData.raw = undefined;
          console.log(error);
          return error.msg;
        });
    },
    async setMarkedFlightData(context, payload) {
      let dateOfDepart = new Date(context.state.searchObject.dateDepart);
      let data = {
        itineraryId: payload.itineraryId,
        priceAmount: payload.priceAmount,
        priceUnit: payload.priceUnit,
        originIATA: payload.originIATA,
        originEntityId: payload.originEntityId,
        destinationIATA: payload.destinationIATA,
        destinationEntityId: payload.destinationEntityId,
        year: dateOfDepart.getFullYear(),
        month: dateOfDepart.getMonth() + 1,
        day: dateOfDepart.getDate(),
        currency: context.state.currency.code,
        market: context.state.market,
        locale: context.state.locale,
        adults: 1,
        cabinClass: context.state.searchObject.cabinClass,
        // childrenAges: req.body.childrenAges,
      };
      await axios
        .request({
          method: "POST",
          url: "http://localhost:5555/setWatched",
          headers: { Authorization: `Bearer ${context.state.authToken}` },
          data,
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
