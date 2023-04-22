<template>
  <div class="flight-card">
    <b-card-group deck v-if="isWideScreen">
      <b-card :title="this.fromObject.fromPlace.name" class="flight-card__card">
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

    <div v-else>
      <b-card :title="this.fromObject.fromPlace.name" class="flight-card__card">
        <formatted-date
          :dateObj="this.fromObject.departureDateTime"
        ></formatted-date>
      </b-card>
      <div class="flight-card__divider"></div>
      <b-card :title="this.toObject.toPlace.name" class="flight-card__card">
        <formatted-date
          :dateObj="this.toObject.arrivalDateTime"
        ></formatted-date>
      </b-card>
    </div>

    <div class="flight-card__time-total">
      <div class="flight-card__time-total__label">Total Time:</div>
      <div class="flight-card__time-total__time">{{ this.travelTime }}</div>
      <b-button variant="primary" target="_blank" :href="this.link">{{
        this.price
      }}</b-button>
    </div>
  </div>
</template>
<script>
import store from "./../store";
import FormattedDate from "./FormattedDate.vue";
export default {
  name: "FlightComponent",
  props: {
    itinerary: Object,
  },
  components: {
    FormattedDate,
  },
  data() {
    return {
      price: "",
      fromObject: {},
      toObject: {},
      travelTime: "",
      link: "",
    };
  },
  created() {
    // let priceObj = this.itinerary.pricingOptions[0].items[0];
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
    // const diff =
    //   (this.toObject.arrivalDateTime - this.fromObject.departureDateTime) /
    //   (1000 * 60); // time difference in minutes
    // const hours = Math.floor(diff / 60);
    // const minutes = Math.round(diff % 60);
    // this.travelTime = `${hours}h ${minutes}m`;

    let sumMinutes = 0;
    this.itinerary.legIds.forEach((legId) => {
      sumMinutes += store.state.searchResultLegs[legId].durationInMinutes;
    });

    const date = new Date(0, 0, 0, 0, sumMinutes);
    this.travelTime = date.toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  },
  computed: {
    currency() {
      return store.state.currency;
    },
    isWideScreen() {
      return window.innerWidth >= 992;
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

.flight-card__divider {
  height: 2px;
  width: 100%;
  background-color: #ccc;
  margin: 20px 0;
}

.flight-card__time-total {
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.flight-card__time-total__label {
  margin-right: 20px;
}

@media (max-width: 991.98px) {
  .flight-card__divider {
    display: none;
  }
}
</style>
