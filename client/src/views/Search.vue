<template>
  <div>
    <search-form></search-form>
    <b-container class="col-lg-6 col-md-12" fluid="md">
      <flight-component
        :key="element.itineraryId"
        v-for="element in currentPageItems"
        :itinerary="itineraries[element.itineraryId]"
        :id="element.itineraryId"
      ></flight-component>
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
    itineraries() {
      return store.state.searchResultItineraries;
    },
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
      return Object.keys(this.itineraries).length;
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
