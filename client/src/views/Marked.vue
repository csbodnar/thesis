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
      <b-card class="mb-2">
        <div class="row justify-content-around">
          <div class="col-12 col-sm-4 fw-bold align-self-center">
            Price when You marked it:
          </div>

          <div class="col-6 col-sm-4">
            <div
              class="bg-warning text-dark rounded p-2 fw-bold align-self-center mx-auto w-75"
            >
              {{ this.priceWhenMarked }}
            </div>
          </div>
        </div>
      </b-card>

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
      priceWhenMarked: "",
    };
  },
  async created() {
    await store.dispatch("getMarkedFlightData").then(() => {
      this.loading = false;
    });
    console.log(this.markedDetailed);
    store
      .dispatch("getPriceWithFormat", {
        price: {
          unit: this.markedRaw.priceUnit,
          amount: this.markedRaw.priceAmount,
        },
      })
      .then((response) => {
        this.priceWhenMarked = response;
      });
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
