<template>
  <div
    style="overflow-x: auto"
    class="d-flex justify-content-between border-top pt-3"
  >
    <div class="d-flex flex-column mx-5 mb-5">
      <p class="h-100">{{ this.originPlace }}</p>
      <formatted-date :dateObj="this.departureDate"></formatted-date>
    </div>
    <div class="align-self-center">
      <b-icon-arrow-right variant="primary"></b-icon-arrow-right>
      <p>{{ this.flightTime }}</p>
    </div>
    <div class="d-flex flex-column mx-5 mb-5">
      <p class="h-100">{{ this.destinationPlace }}</p>
      <formatted-date :dateObj="this.arrivalDate"></formatted-date>
    </div>
    <img
      :src="this.imageUrl"
      class="align-self-center"
      :alt="this.carrierName"
    />
  </div>
</template>
<script>
import store from "./../store";
import FormattedDate from "./FormattedDate.vue";
import { BIconArrowRight } from "bootstrap-vue";
export default {
  name: "FlightDetails",
  props: {
    segment: Object,
    id: String,
  },
  components: {
    FormattedDate,
    BIconArrowRight,
  },
  data() {
    return {
      departureDate: "",
      arrivalDate: "",
      originPlace: "",
      destinationPlace: "",
      flightTime: "",
      flightNumber: "",
      imageUrl: "",
      carrierName: "",
    };
  },
  created() {
    this.departureDate = new Date(
      this.segment.departureDateTime.year,
      this.segment.departureDateTime.month,
      this.segment.departureDateTime.day,
      this.segment.departureDateTime.hour,
      this.segment.departureDateTime.minute
    );
    this.arrivalDate = new Date(
      this.segment.arrivalDateTime.year,
      this.segment.arrivalDateTime.month,
      this.segment.arrivalDateTime.day,
      this.segment.arrivalDateTime.hour,
      this.segment.arrivalDateTime.minute
    );
    let hours = Math.floor(this.segment.durationInMinutes / 60);
    this.flightTime = `${hours}h ${
      this.segment.durationInMinutes - hours * 60
    }m`;
    let carrierId = this.segment.marketingCarrierId;
    let operatingCarrierId = this.segment.marketingCarrierId;
    this.imageUrl = this.carriers[carrierId].imageUrl;
    this.carrierName = this.carriers[carrierId].name;
    if (this.imageUrl == "" || this.imageUrl == null) {
      this.imageUrl = this.carriers[operatingCarrierId].imageUrl;
      this.carrierName = this.carriers[operatingCarrierId].name;
    }
    if (this.imageUrl == "" || this.imageUrl == null) {
      this.imageUrl = this.agents[carrierId].imageUrl;
      this.carrierName = this.agents[carrierId].name;
    }
    this.flightNumber = this.segment.marketingFlightnumber;
    this.originPlace =
      store.state.searchResultPlaces[this.segment.originPlaceId].name;
    this.destinationPlace =
      store.state.searchResultPlaces[this.segment.destinationPlaceId].name;
  },
  computed: {
    carriers() {
      return store.state.searchResultCarriers;
    },
    agents() {
      return store.state.searchResultAgents;
    },
    aliances() {
      return store.state.searchResultAlliances;
    },
  },
  methods: {},
};
</script>
