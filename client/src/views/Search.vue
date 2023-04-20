<template>
  <div>
    <search-form></search-form>
    <div v-if="true">
      <flight-component
        :key="element.itineraryId"
        v-for="element in sorted"
        :itinerary="itineraries[element.itineraryId]"
      ></flight-component>
    </div>
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
  },
};
</script>
