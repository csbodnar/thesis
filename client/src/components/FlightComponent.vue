<template>
  <b-card class="d-flex justify-content-center mt-3">
    <div class="flight-card">
      <b-card-group
        class="d-flex flex-row justify-content-center"
        deck
        v-if="isWideScreen"
      >
        <b-card
          :title="this.fromObject.fromPlace.name"
          class="flight-card__card"
        >
          <formatted-date
            :dateObj="this.fromObject.departureDateTime"
          ></formatted-date>
        </b-card>
        <b-card :title="this.toObject.toPlace.name" class="flight-card__card">
          <formatted-date
            :dateObj="this.toObject.arrivalDateTime"
          ></formatted-date>
        </b-card>
      </b-card-group>

      <div class="d-flex justify-content-center" v-else>
        <b-card
          :title="this.fromObject.fromPlace.name"
          class="flight-card__card"
        >
          <formatted-date
            :dateObj="this.fromObject.departureDateTime"
          ></formatted-date>
        </b-card>
        <b-icon-arrow-right variant="primary"></b-icon-arrow-right>
        <b-card :title="this.toObject.toPlace.name" class="flight-card__card">
          <formatted-date
            :dateObj="this.toObject.arrivalDateTime"
          ></formatted-date>
        </b-card>
      </div>

      <div class="flight-card__stop-count">
        <a
          v-b-toggle
          :href="`#stops-info_${this.id.replace(',', ':')}`"
          @click.prevent
          >Stops: {{ this.stopCount }}</a
        >
        <b-collapse :id="`stops-info_${this.id.replace(',', ':')}`">
          <b-card title="Details">
            <flight-details
              v-for="segment in Object.entries(segments)"
              :key="segment[0]"
              :segment="segment[1]"
            ></flight-details>
          </b-card>
        </b-collapse>
      </div>
      <div class="flight-card__time-total">
        <div class="flight-card__time-total__label">Total Time:</div>
        <div class="flight-card__time-total__time">{{ this.travelTime }}</div>
      </div>
      <b-button variant="primary" target="_blank" :href="this.link">{{
        this.price
      }}</b-button>
    </div>
    <!-- logged in-->
    <div v-if="true">
      <b-button variant="warning" @click="setMarkedForUser">Mark</b-button>
    </div>
  </b-card>
</template>
<script>
import store from "./../store";
import FormattedDate from "./FormattedDate.vue";
import FlightDetails from "./FlightDetails.vue";
import { BIconArrowRight } from "bootstrap-vue";

export default {
  name: "FlightComponent",
  props: {
    itinerary: Object,
    id: String,
  },
  components: {
    FormattedDate,
    FlightDetails,
    BIconArrowRight,
  },
  data() {
    return {
      price: "",
      fromObject: {},
      toObject: {},
      travelTime: "",
      stopCount: 0,
      link: "",
      number: 0,
    };
  },
  created() {
    // console.log(this.sorted);
    this.link = this.itinerary.pricingOptions[0].items[0].deepLink;
    let priceObj = this.itinerary.pricingOptions[0].price;
    const unitMultiplier = store.state.priceMultiplier[priceObj.unit];
    const amount = parseInt(priceObj.amount) / unitMultiplier;
    const formatter = new Intl.NumberFormat(store.state.locale, {
      style: "currency",
      currency: this.currency.code,
      currencyDisplay: "symbol",
      minimumFractionDigits: this.currency.decimalDigits,
      maximumFractionDigits: this.currency.decimalDigits,
      useGrouping: true,
      grouping: this.currency.thousandsSeparator,
      decimalSeparator: this.currency.decimalSeparator,
    });

    this.price = formatter.format(amount);

    const firstLeg = store.state.searchResultLegs[this.itinerary.legIds[0]];
    const firstSegment =
      store.state.searchResultSegments[firstLeg.segmentIds[0]];

    this.fromObject = {
      fromPlace: store.state.searchResultPlaces[firstSegment.originPlaceId],
      departureDateTime: new Date(
        firstSegment.departureDateTime.year,
        firstSegment.departureDateTime.month,
        firstSegment.departureDateTime.day,
        firstSegment.departureDateTime.hour,
        firstSegment.departureDateTime.minute
      ),
    };

    const lastLeg =
      store.state.searchResultLegs[
        this.itinerary.legIds[this.itinerary.legIds.length - 1]
      ];
    const lastSegment =
      store.state.searchResultSegments[
        lastLeg.segmentIds[lastLeg.segmentIds.length - 1]
      ];

    this.toObject = {
      toPlace: store.state.searchResultPlaces[lastSegment.destinationPlaceId],
      arrivalDateTime: new Date(
        lastSegment.arrivalDateTime.year,
        lastSegment.arrivalDateTime.month,
        lastSegment.arrivalDateTime.day,
        lastSegment.arrivalDateTime.hour,
        lastSegment.arrivalDateTime.minute
      ),
    };

    let sumMinutes = 0;
    this.itinerary.legIds.forEach((legId) => {
      sumMinutes += store.state.searchResultLegs[legId].durationInMinutes;
      this.stopCount +=
        store.state.searchResultLegs[legId].segmentIds.length - 1;
    });
    let hours = Math.floor(sumMinutes / 60);
    this.travelTime = `${hours}h ${sumMinutes - hours * 60}m`;
  },
  computed: {
    currency() {
      return store.state.currency;
    },
    isWideScreen() {
      return window.innerWidth >= 992;
    },
    segments() {
      let segments = [];
      this.itinerary.legIds.forEach((legId) => {
        store.state.searchResultLegs[legId].segmentIds.forEach((segmentId) => {
          segments.push(store.state.searchResultSegments[segmentId]);
        });
      });
      return segments;
    },
    itineraries() {
      return store.state.searchResultItineraries;
    },
    sorted() {
      return store.getters.getSortedItineraries;
    },
  },
  methods: {
    setMarkedForUser() {
      store.dispatch("setMarkedFlightData", {});
      // if (store.state.markedFlightData != null) {
      // } else {
      //   //todo: pop-up if user wants to replace marked flight
      // }
    },
  },
};
</script>
<style scoped>
.flight-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.flight-card__card {
  width: 100%;
  max-width: 500px;
  margin-right: 10px;
}

.flight-card__time {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
}

.flight-card__time-total {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
}
.flight-card__stop-count {
  font-size: 24px;
  font-weight: bold;
  display: block;
  align-items: center;
}

.flight-card__time-total__label {
  margin-right: 20px;
}
</style>
