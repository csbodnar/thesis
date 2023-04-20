<template>
  <div>
    <p>Price: {{ this.price }}</p>
    <p>From: {{ this.fromObject.fromPlace.name }}</p>
    <p>Depart: {{ JSON.stringify(this.fromObject.departureDateTime) }}</p>
    <p>To: {{ this.toObject.toPlace.name }}</p>
    <p>Arrive: {{ JSON.stringify(this.toObject.arrivalDateTime) }}</p>
    <p>Journey in minutes: {{ this.sumMinutes }}</p>
    <p>__________________</p>
  </div>
</template>
<script>
import store from "./../store";
export default {
  name: "FlightComponent",
  props: {
    itinerary: Object,
  },
  data() {
    return {
      price: "",
      fromObject: {},
      toObject: {},
      sumMinutes: 0,
    };
  },
  created() {
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
      departureDateTime: firstSegment.departureDateTime,
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
      arrivalDateTime: lastSegment.arrivalDateTime,
    };
    this.itinerary.legIds.forEach((legId) => {
      this.sumMinutes += store.state.searchResultLegs[legId].durationInMinutes;
    });
  },
  computed: {
    currency() {
      return store.state.currency;
    },
  },
};
</script>
