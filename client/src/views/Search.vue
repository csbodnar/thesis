<template>
  <div>
    <search-form></search-form>
    <b-container fluid="md">
      <div v-if="true">
        <flight-component
          :key="element.itineraryId"
          v-for="element in currentPageItems"
          :itinerary="itineraries[element.itineraryId]"
          :id="element.itineraryId"
        ></flight-component>
      </div>
      <b-pagination
        v-if="itineraries.length > 6"
        :align="'center'"
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
    totalItems() {
      return Object.keys(this.itineraries).length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    currentPageItems() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.sorted.slice(startIndex, endIndex);
    },
  },
};
</script>
