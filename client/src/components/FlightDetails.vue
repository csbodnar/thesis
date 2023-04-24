<template>
  <div class="d-flex justify-content-center">
    <div class="d-flex flex-column justify-content-start mx-5">
      <p>{{ this.originPlace }}</p>
      <formatted-date :dateObj="this.departureDate"></formatted-date>
    </div>
    <div class="d-flex flex-column justify-content-end mx-5">
      <p>{{ this.destinationPlace }}</p>
      <formatted-date :dateObj="this.arrivalDate"></formatted-date>
    </div>
  </div>
</template>
<script>
import store from "./../store";
import FormattedDate from "./FormattedDate.vue";
export default {
  name: "FlightDetails",
  props: {
    segment: Object,
    id: String,
  },
  components: {
    FormattedDate,
  },
  data() {
    return {
      departureDate: "",
      arrivalDate: "",
      originPlace: "",
      destinationPlace: "",
      flightTime: "",
      flightNumber: "",
      carrierId: "",
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
    this.carrierId = this.segment.marketingCarrierId;
    this.flightNumber = this.segment.marketingFlightnumber;
    this.originPlace =
      store.state.searchResultPlaces[this.segment.originPlaceId].name;
    this.destinationPlace =
      store.state.searchResultPlaces[this.segment.destinationPlaceId].name;
  },
  computed: {},
  methods: {},
};
</script>
