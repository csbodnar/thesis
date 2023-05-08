<template>
  <h1>MarkedFlight</h1>
</template>
<script>
import store from "./../store";
export default {
  name: "MarkedFlight",
  data() {
    return {
      places: [],
      agents: [],
      carriers: [],
      pricingOptions: [],
      legIds: [],
      segments: [],
    };
  },
  created() {
    store.dispatch("fetchMarkedFlightData").then((response) => {
      console.log(response.data);
    });
    // console.log(this.marked);
  },
  computed: {
    marked() {
      return store.state.markedFlightData;
    },
  },
};
</script>
