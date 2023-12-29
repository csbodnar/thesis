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
import FormattedDate from "./FormattedDate.vue";
import { BIconArrowRight } from "bootstrap-vue";
export default {
  name: "FlightDetails",
  props: {
    segment: Object,
    places: Object,
    carriers: Object,
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
      imageUrl: undefined,
      carrierName: "",
    };
  },
  created() {
    this.departureDate = new Date(
      this.segment.departureDateTime.year,
      this.segment.departureDateTime.month - 1,
      this.segment.departureDateTime.day,
      this.segment.departureDateTime.hour,
      this.segment.departureDateTime.minute
    );
    this.arrivalDate = new Date(
      this.segment.arrivalDateTime.year,
      this.segment.arrivalDateTime.month - 1,
      this.segment.arrivalDateTime.day,
      this.segment.arrivalDateTime.hour,
      this.segment.arrivalDateTime.minute
    );
    let hours = Math.floor(this.segment.durationInMinutes / 60);
    this.flightTime = `${hours}h ${
      this.segment.durationInMinutes - hours * 60
    }m`;
    let operatingCarrierId = this.segment.marketingCarrierId;
    this.imageUrl = this.carriers[operatingCarrierId].imageUrl;
    this.carrierName = this.carriers[operatingCarrierId].name;
    this.flightNumber = this.segment.marketingFlightnumber;
    this.originPlace = this.places[this.segment.originPlaceId].name;
    this.destinationPlace = this.places[this.segment.destinationPlaceId].name;
  },
};
</script>
