<template>
  <h1>MarkedFlight</h1>
</template>
<script>
import store from "./../store";
export default {
  name: "MarkedFlight",
  created() {
    store.dispatch("fetchMarkedFlightData");
    console.log(this.marked);
  },
  computed: {
    marked() {
      return store.state.markedFlightData;
    },
  },
};
</script>
