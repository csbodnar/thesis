<template>
  <div class="flight-card">
    <div>
      <b-card :title="departureCity" class="flight-card__card">
        <div class="flight-card__time">{{ departureTime }}</div>
      </b-card>
      <div class="flight-card__divider"></div>
      <b-card :title="arrivalCity" class="flight-card__card">
        <div class="flight-card__time">{{ arrivalTime }}</div>
      </b-card>
    </div>

    <div class="flight-card__time-total">
      <div class="flight-card__time-total__label">Total Time:</div>
      <div class="flight-card__time-total__time">{{ totalTime }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "FlightCard",
  props: {
    departureCity: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalCity: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    totalTime: {
      type: String,
      required: true,
    },
  },
  computed: {
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
