<template>
  <b-container class="bg-info rounded mt-3 col-lg-6 col-md-12" fluid="md">
    <b-form @submit.prevent="search">
      <div>
        <b-form-group v-slot="{ ariaDescribedby }">
          <div class="mt-2 d-flex justify-content-left">
            <b-form-radio
              class="mr-5"
              v-model="searchType"
              :aria-describedby="ariaDescribedby"
              value="oneway"
              >{{ $t("oneway") }}
            </b-form-radio>
            <b-form-radio
              v-model="searchType"
              :aria-describedby="ariaDescribedby"
              value="return"
              >{{ $t("return") }}
            </b-form-radio>
          </div>
        </b-form-group>
      </div>
      <div>
        <b-form-group
          id="from-input"
          :label="$t('fromLabel')"
          label-cols="4"
          label-cols-lg="2"
          label-for="from"
          class="d-flex flex-column flex-lg-row mt-2"
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
        label-cols="4"
        label-cols-lg="2"
        class="d-flex flex-column flex-lg-row mt-2"
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
        label-cols="4"
        label-cols-lg="2"
        class="mb-2 d-flex flex-column flex-lg-row mt-2"
      >
        <b-form-datepicker
          id="dateDepart"
          v-model="searchObject.dateDepart"
          class="order-lg-1"
        ></b-form-datepicker>
      </b-form-group>

      <b-form-group
        v-if="this.isReturn"
        id="date-return-input"
        :label="$t('dateReturnLabel')"
        label-for="dateReturn"
        label-cols="4"
        label-cols-lg="2"
        class="d-flex flex-column flex-lg-row mt-2"
      >
        <b-form-datepicker
          id="dateReturn"
          v-model="searchObject.dateReturn"
          class="mb-2 order-lg-1"
        ></b-form-datepicker>
      </b-form-group>

      <div class="d-flex flex-wrap justify-content-center align-items-center">
        <div class="mr-auto px-2">
          <b-form-group>
            <b-form-checkbox
              id="direct"
              :checked="directFlightSearch"
              @change="toggleDirectFlightSearch"
              name="direct"
            >
              {{ $t("direct") }}
            </b-form-checkbox>
          </b-form-group>
          <b-form-select
            variant="secondary"
            rounded
            :value="searchObject.cabinClass"
            @change="changeCabinClass"
          >
            <b-form-select-option value="CABIN_CLASS_UNSPECIFIED">
              {{ $t("cabinClass") }}
            </b-form-select-option>
            <b-form-select-option value="CABIN_CLASS_ECONOMY">
              {{ $t("economyClass") }}
            </b-form-select-option>
            <b-form-select-option value="CABIN_CLASS_PREMIUM_ECONOMY">
              {{ $t("premiumEconomyClass") }}
            </b-form-select-option>
            <b-form-select-option value="CABIN_CLASS_BUSINESS">
              {{ $t("buisnessClass") }}
            </b-form-select-option>
            <b-form-select-option value="CABIN_CLASS_FIRST">
              {{ $t("firstClass") }}
            </b-form-select-option>
          </b-form-select>
        </div>
        <div v-if="isUsingSearhForm">
          <b-dropdown
            id="dropdown-buttons"
            v-model="sortingOption"
            text="Sorting By"
            class="m-2"
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
          class="px-2"
          type="submit"
          variant="light"
          style="width: 8rem; height: 2.5rem"
          >{{ $t("search") }}</b-button
        >
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
      searchType: "oneway",
      from: {
        search: "",
        object: {},
      },
      to: {
        search: "",
        object: {},
      },
      cabinClass: "CABIN_CLASS_UNSPECIFIED",
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
      await store
        .dispatch("search", {
          query: {
            queryLegs: [
              {
                originPlaceId: {
                  entityId: this.from.object.entityId,
                },
                destinationPlaceId: {
                  entityId: this.to.object.entityId,
                },
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
