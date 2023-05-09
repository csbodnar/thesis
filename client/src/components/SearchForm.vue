<template>
  <b-container class="bg-info rounded mt-3 col-lg-6 col-md-12" fluid="md">
    <b-form class="py-3" @submit.prevent="search">
      <div>
        <b-form-group v-slot="{ ariaDescribedby }">
          <div class="mt-2 d-flex justify-content-start">
            <b-form-radio
              id="oneway"
              v-model="searchType"
              :aria-describedby="ariaDescribedby"
              value="oneway"
            >
            </b-form-radio>
            <label class="mx-1" for="oneway">{{ $t("oneway") }}</label>
            <b-form-radio
              class="ms-5"
              id="return"
              v-model="searchType"
              :aria-describedby="ariaDescribedby"
              value="return"
            >
            </b-form-radio>
            <label class="mx-1" for="return">{{ $t("return") }}</label>
          </div>
        </b-form-group>
      </div>
      <div>
        <b-form-group
          id="from-input"
          :label="$t('fromLabel')"
          label-cols="12"
          label-cols-lg="3"
          label-for="from"
          class="d-flex flex-column flex-lg-row mt-2 align-to-start"
        >
          <b-form-input
            id="from"
            list="from-list"
            v-model="from.search"
            @input="autoSuggestFromPlace"
            @change="setOriginPlace"
            autocomplete="off"
            type="text"
            required
            class="order-lg-1"
          >
          </b-form-input>
          <datalist id="from-list">
            <option
              v-for="suggestion in this.placeSuggestions"
              :key="suggestion.entityId"
            >
              <span>{{ suggestionStringify(suggestion) }}</span>
            </option>
          </datalist>
        </b-form-group>
      </div>

      <b-form-group
        id="to-input"
        :label="$t('toLabel')"
        label-for="to"
        label-cols="12"
        label-cols-lg="3"
        class="d-flex flex-column flex-lg-row mt-2 align-to-start"
      >
        <b-form-input
          id="to"
          list="to-list"
          v-model="to.search"
          @input="autoSuggestToPlace"
          @change="setDestinationPlace"
          autocomplete="off"
          type="text"
          required
          class="order-lg-1"
        ></b-form-input>
        <datalist id="to-list">
          <option
            v-for="suggestion in this.placeSuggestions"
            :key="suggestion.entityId"
          >
            <span>{{ suggestionStringify(suggestion) }}</span>
          </option>
        </datalist>
      </b-form-group>

      <b-form-group
        id="date-depart-input"
        :label="$t('dateDepartLabel')"
        label-for="dateDepart"
        label-cols="12"
        label-cols-lg="3"
        class="mb-2 d-flex flex-column flex-lg-row mt-2 align-to-start"
      >
        <b-form-datepicker
          id="dateDepart"
          :min="minDate"
          v-model="searchObject.dateDepart"
          class="order-lg-1"
        ></b-form-datepicker>
      </b-form-group>

      <b-form-group
        v-if="this.isReturn"
        id="date-return-input"
        :label="$t('dateReturnLabel')"
        label-for="dateReturn"
        label-cols="12"
        label-cols-lg="3"
        class="d-flex flex-column flex-lg-row mt-2 align-to-start"
      >
        <b-form-datepicker
          id="dateReturn"
          :min="minDate"
          v-model="searchObject.dateReturn"
          class="mb-2 order-lg-1"
        ></b-form-datepicker>
      </b-form-group>

      <div class="d-flex flex-wrap justify-content-center align-items-center">
        <div class="d-flex flex-wrap flex-row align-items-center">
          <b-form-group class="mx-3">
            <b-form-checkbox
              id="direct"
              :checked="directFlightSearch"
              @change="toggleDirectFlightSearch"
              name="direct"
            >
              <label class="mx-1" for="direct">{{ $t("direct") }}</label>
            </b-form-checkbox>
          </b-form-group>
          <div class="d-flex flex-column">
            <label for="cabin-class">
              {{ $t("cabinClass") }}
            </label>
            <b-form-select
              variant="secondary"
              id="cabin-class"
              rounded
              :value="searchObject.cabinClass"
              @change="changeCabinClass"
              :options="options"
            >
            </b-form-select>
          </div>
        </div>
        <div class="d-flex flex-wrap flex-row align-items-center">
          <div v-if="isUsingSearhForm">
            <b-dropdown
              id="dropdown-buttons"
              v-model="sortingOption"
              text="Sorting By"
              class="m-1"
              variant="light"
              style="width: 8rem"
            >
              <b-dropdown-item-button
                @click="setSortingOption"
                :active="sortingOption == 'best'"
                value="best"
                >Best</b-dropdown-item-button
              >
              <b-dropdown-item-button
                @click="setSortingOption"
                :active="sortingOption == 'cheapest'"
                value="cheapest"
                >Cheapest</b-dropdown-item-button
              >
              <b-dropdown-item-button
                @click="setSortingOption"
                :active="sortingOption == 'fastest'"
                value="fastest"
                >Fastest</b-dropdown-item-button
              >
            </b-dropdown>
          </div>
          <b-button
            class="m-1"
            type="submit"
            variant="light"
            style="width: 8rem; height: 2.5rem"
            >{{ $t("search") }}</b-button
          >
        </div>
      </div>
    </b-form>
  </b-container>
</template>
<script>
import store from "./../store";
import {
  mdiAirport,
  mdiFlagVariant,
  mdiCityVariant,
  mdiAirplane,
} from "@mdi/js";
import { mapState, mapMutations } from "vuex";

export default {
  name: "SearchForm",
  data() {
    return {
      minDate: new Date(),
      searchType: "oneway",
      from: {
        search: "",
        object: {},
      },
      to: {
        search: "",
        object: {},
      },
      options: [
        { value: "CABIN_CLASS_ECONOMY", text: this.$t("economyClass") },
        {
          value: "CABIN_CLASS_PREMIUM_ECONOMY",
          text: this.$t("premiumEconomyClass"),
        },
        { value: "CABIN_CLASS_BUSINESS", text: this.$t("buisnessClass") },
        { value: "CABIN_CLASS_FIRST", text: this.$t("firstClass") },
      ],
    };
  },
  created() {
    this.from.search = this.suggestionStringify(
      store.state.searchObject.originPlaceObject
    );
    this.to.search = this.suggestionStringify(
      store.state.searchObject.destinationPlaceObject
    );
  },
  computed: {
    isReturn() {
      return this.searchType === "return";
    },
    placeSuggestions() {
      return store.getters.getPlaceSuggestions;
    },
    isUsingSearhForm() {
      return store.state.isSearching;
    },
    searchObject() {
      return store.getters.getSearchObject;
    },
    ...mapState(["sortingOption", "directFlightSearch", "searchObject"]),
  },
  methods: {
    ...mapMutations(["toggleDirectFlightSearch"]),
    changeCabinClass(cabinClass) {
      store.commit("changeCabinClass", { cabinClass });
    },
    toggleSearching() {
      store.state.isSearching = !store.state.isSearching;
    },
    setOriginPlace(value) {
      let originPlace = this.placeSuggestions.find(
        (suggestion) => this.suggestionStringify(suggestion) === value
      );
      store.commit("setOriginPlaceObject", { place: originPlace });
    },
    setDestinationPlace(value) {
      let destinationPlace = this.placeSuggestions.find(
        (suggestion) => this.suggestionStringify(suggestion) === value
      );
      store.commit("setDestinationPlaceObject", { place: destinationPlace });
    },
    setSortingOption(event) {
      store.state.sortingOption = event.target.value;
    },
    suggestionStringify(suggestion) {
      switch (suggestion.type) {
        case "PLACE_TYPE_AIRPORT":
          return `${suggestion.name} (${suggestion.iataCode})`;
        case "PLACE_TYPE_CITY":
          return `${suggestion.name} (${suggestion.countryName})`;
        case "PLACE_TYPE_COUNTRY":
          return suggestion.name;
        default:
          return suggestion.name;
      }
    },
    suggestionIcon(suggestion) {
      switch (suggestion.type) {
        case "PLACE_TYPE_AIRPORT":
          return mdiAirport;
        case "PLACE_TYPE_CITY":
          return mdiCityVariant;
        case "PLACE_TYPE_COUNTRY":
          return mdiFlagVariant;
        default:
          return mdiAirplane;
      }
    },

    async search() {
      let dateOfDepart = new Date(this.searchObject.dateDepart);
      // let dateOfReturn = "";
      // if (this.isReturn) {
      //   //todo: do somethin
      // }
      let originPlaceId = {};
      if (this.from.object.iata) {
        originPlaceId.iata = this.from.object.iata;
      } else {
        originPlaceId.entityId = this.from.object.entityId;
      }
      let destinationPlaceId = {};
      if (this.to.object.iata) {
        destinationPlaceId.iata = this.to.object.iata;
      } else {
        destinationPlaceId.entityId = this.to.object.entityId;
      }
      console.log(this.from.object, this.to.object);
      await store
        .dispatch("search", {
          query: {
            queryLegs: [
              {
                originPlaceId,
                destinationPlaceId,
                date: {
                  year: dateOfDepart.getFullYear(),
                  month: dateOfDepart.getMonth() + 1,
                  day: dateOfDepart.getDate(),
                },
              },
            ],
            cabinClass: this.searchObject.cabinClass,
          },
        })
        .then(() => {
          store.dispatch("searchPoll");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    autoSuggestFromPlace(text) {
      const selectedSuggestion = this.placeSuggestions.find(
        (suggestion) => this.suggestionStringify(suggestion) === text
      );
      if (selectedSuggestion) {
        this.from.object = selectedSuggestion;
      }
      store.dispatch("autoSuggestPlace", {
        searchTerm: text,
        isDestination: false,
      });
    },
    autoSuggestToPlace(text) {
      const selectedSuggestion = this.placeSuggestions.find(
        (suggestion) => this.suggestionStringify(suggestion) === text
      );
      if (selectedSuggestion) {
        this.to.object = selectedSuggestion;
      }
      store.dispatch("autoSuggestPlace", {
        searchTerm: text,
        isDestination: true,
      });
    },
  },
};
</script>
<style>
.align-to-start {
  text-align: left !important;
}
</style>
