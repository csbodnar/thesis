<template>
  <div class="d-flex justify-content-center">
    <formatted-date :dateObj="this.departureDate"></formatted-date>
    <formatted-date :dateObj="this.arrivalDate"></formatted-date>
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
  },
  computed: {},
  methods: {},
};
</script>
