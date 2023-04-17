<template>
  <h1>MarkedFlight</h1>
</template>
<script>
import store from "./../store";
export default {
  name: "MarkedFlight",
  async created() {
    let data = await store.dispatch("fetchMarkedFlightData");
    console.log(data);
  },
};
</script>
