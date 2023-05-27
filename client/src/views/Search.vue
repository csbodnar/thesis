<template>
  <div class="d-flex flex-column">
    <search-form></search-form>
    <b-container class="container-fluid">
      <div v-if="isSearching" class="justify-content-center my-5">
        <b-spinner variant="primary"></b-spinner>
      </div>
      <div v-else class="mt-3">
        <flight-component
          :key="element.itineraryId"
          v-for="element in currentPageItems"
          :itinerary="itineraries[element.itineraryId]"
          :id="element.itineraryId"
          :legs="legs"
          :segments="segments"
          :places="places"
          :carriers="carriers"
          :agents="agents"
          :showMarkButton="isSignedIn"
        ></flight-component>
      </div>
      <b-pagination
        v-if="showPaging"
        align="center"
        v-model="currentPage"
        :total-rows="totalItems"
        :per-page="perPage"
      ></b-pagination>
    </b-container>
  </div>
</template>
<script>
import SearchForm from "../components/SearchForm.vue";
import FlightComponent from "../components/FlightComponent.vue";
import store from "../store";
import { mapState } from "vuex";
export default {
  name: "SearchComponent",
  components: {
    SearchForm,
    FlightComponent,
  },
  data() {
    return {
      index: 0,
      sorting: "",
      currentPage: 1,
      perPage: 6,
    };
  },
  created() {},
  computed: {
    isSearching() {
      return store.state.isSearching;
    },
    itineraries() {
      return store.state.searchResultItineraries;
    },
    legs() {
      return store.state.searchResultLegs;
    },
    segments() {
      return store.state.searchResultSegments;
    },
    places() {
      return store.state.searchResultPlaces;
    },
    carriers() {
      return store.state.searchResultCarriers;
    },
    agents() {
      return store.state.searchResultAgents;
    },
    ...mapState(["isSignedIn"]),
    showResults() {
      return store.state.showingResults;
    },
    sorted() {
      return store.getters.getSortedItineraries;
    },
    filtered() {
      if (store.state.directFlightSearch) {
        return store.getters.getSortedItineraries.filter((element) => {
          let stops = 0;
          let itinerary =
            store.state.searchResultItineraries[element.itineraryId];
          itinerary.legIds.forEach((legId) => {
            stops += store.state.searchResultLegs[legId].segmentIds.length - 1;
          });
          return stops == 0;
        });
      } else {
        return store.getters.getSortedItineraries;
      }
    },
    totalItems() {
      return Object.keys(this.filtered).length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    currentPageItems() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.filtered.slice(startIndex, endIndex);
    },
    showPaging() {
      return this.filtered.length > 6;
    },
  },
};
</script>
