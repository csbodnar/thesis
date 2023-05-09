<template>
  <b-container
    class="col-md-12 col-lg-8 d-flex justify-content-center mt-3 h-100"
    fluid="md"
  >
    <b-spinner
      v-if="loading"
      variant="primary"
      class="d-flex align-self-center"
    ></b-spinner>

    <div v-else class="w-100">
      <flight-component
        :itinerary="markedDetailed.itineraries[markedRaw.itineraryId]"
        :id="markedRaw.itineraryId"
        :legs="markedDetailed.legs"
        :segments="markedDetailed.segments"
        :places="markedDetailed.places"
        :carriers="markedDetailed.carriers"
        :agents="markedDetailed.agents"
        :showMarkButton="false"
      ></flight-component>
    </div>
  </b-container>
</template>
<script>
import store from "./../store";
import FlightComponent from "../components/FlightComponent.vue";
export default {
  name: "MarkedFlight",
  components: {
    FlightComponent,
  },
  data() {
    return {
      loading: true,
    };
  },
  async created() {
    if (this.markedDetailed != undefined) {
      this.loading = false;
    }
    await store.dispatch("fetchMarkedFlightData").then(() => {
      this.loading = false;
    });
    console.log(this.markedDetailed);
  },
  computed: {
    markedDetailed() {
      return store.state.markedFlightData.detailed;
    },
    markedRaw() {
      return store.state.markedFlightData.raw;
    },
  },
};
</script>
