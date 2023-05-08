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
        <b-icon-arrow-right
          class="align-self-center"
          variant="primary"
        ></b-icon-arrow-right>
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
              v-for="segment in Object.entries(ownSegments)"
              :key="segment[0]"
              :segment="segment[1]"
              :places="places"
              :carriers="carriers"
            ></flight-details>
          </b-card>
        </b-collapse>
      </div>
      <div class="flight-card__time-total">
        <div class="flight-card__time-total__label">Total Time:</div>
        <div class="flight-card__time-total__time">{{ this.travelTime }}</div>
      </div>
      <div v-if="!hasMoreOptions">
        <b-button
          variant="primary"
          target="_blank"
          :href="this.pricingOptions[0].link"
          >{{ this.pricingOptions[0].price }}
        </b-button>
      </div>
      <div v-else>
        <b-button v-b-toggle.collapse-1 variant="primary">
          From {{ this.pricingOptions[0].price }}</b-button
        >
        <b-collapse id="collapse-1" class="mt-2">
          <b-card
            v-for="option in Object.entries(pricingOptions)"
            :key="option[0]"
          >
            <div v-for="agent in option.agents" :key="agent.name">
              <img :src="agent.imageUrl" :alt="agent.name" />
            </div>
            <b-button variant="primary" target="_blank" :href="option[1].link"
              >{{ option[1].price }}
            </b-button>
          </b-card>
        </b-collapse>
      </div>
    </div>
    <!-- logged in-->
    <div v-if="showMarkButton">
      <b-button variant="warning" @click="markingValidation">Mark</b-button>
      <b-modal :id="`mark-${this.id.replace(',', ':')}`" hide-footer>
        <template #modal-title> Warning! </template>
        <div class="d-block text-center">
          <h5>
            You already have a marked Itinerary, do You want to replace it?
          </h5>
          <span
            >Check it
            <router-link to="/marked" custom v-slot="{ navigate }">
              <a href=":href" @click="navigate" @keypress.enter="navigate"
                >here
              </a>
            </router-link></span
          >
        </div>
        <div class="mt-3 modal-footer d-flex justify-content-center">
          <button type="button" @click="onHide" class="btn btn-secondary">
            Cancel
          </button>
          <button type="button" @click="onOk" class="btn btn-primary">
            Yes
          </button>
        </div>
      </b-modal>
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
    legs: Object,
    segments: Object,
    places: Object,
    carriers: Object,
    agents: Object,
    showMarkButton: Boolean,
  },
  components: {
    FormattedDate,
    FlightDetails,
    BIconArrowRight,
  },
  data() {
    return {
      pricingOptions: [],
      fromObject: {},
      toObject: {},
      travelTime: "",
      stopCount: 0,
      modalShow: false,
    };
  },
  created() {
    this.itinerary.pricingOptions.forEach((option) => {
      let priceObj = option.price;
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
      let agents = option.agentIds.map((id) => {
        return this.agents[id];
      });
      this.pricingOptions.push({
        price: formatter.format(amount),
        link: option.items[0].deepLink,
        agents,
      });
    });
    console.log(this.pricingOptions);

    const firstLeg = this.legs[this.itinerary.legIds[0]];
    const firstSegment = this.segments[firstLeg.segmentIds[0]];

    this.fromObject = {
      fromPlace: this.places[firstSegment.originPlaceId],
      departureDateTime: new Date(
        firstSegment.departureDateTime.year,
        firstSegment.departureDateTime.month,
        firstSegment.departureDateTime.day,
        firstSegment.departureDateTime.hour,
        firstSegment.departureDateTime.minute
      ),
    };

    const lastLeg =
      this.legs[this.itinerary.legIds[this.itinerary.legIds.length - 1]];
    const lastSegment =
      this.segments[lastLeg.segmentIds[lastLeg.segmentIds.length - 1]];

    this.toObject = {
      toPlace: this.places[lastSegment.destinationPlaceId],
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
      sumMinutes += this.legs[legId].durationInMinutes;
      this.stopCount += this.legs[legId].segmentIds.length - 1;
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
    ownSegments() {
      let segments = [];
      this.itinerary.legIds.forEach((legId) => {
        this.legs[legId].segmentIds.forEach((segmentId) => {
          segments.push(this.segments[segmentId]);
        });
      });
      return segments;
    },
    hasMoreOptions() {
      return this.itinerary.pricingOptions.length > 1;
    },
  },
  methods: {
    markingValidation() {
      if (
        store.state.markedFlightData.raw == null ||
        store.state.markedFlightData.raw == undefined
      ) {
        this.setMarkedForUser();
      } else {
        this.$bvModal.show(`mark-${this.id.replace(",", ":")}`);
      }
    },
    setMarkedForUser() {
      store
        .dispatch("setMarkedFlightData", {
          itineraryId: this.id,
          pricingOptionId: this.itinerary.pricingOptions[0].id,
          originEntityId: this.fromObject.fromPlace.entityId,
          destinationEntityId: this.toObject.toPlace.entityId,
        })
        .then((response) => {
          console.log(response);
          store.dispatch("getMarkedFlightData");
        });
    },
    onHide() {
      this.$bvModal.hide(`mark-${this.id.replace(",", ":")}`);
    },
    onOk() {
      this.$bvModal.hide(`mark-${this.id.replace(",", ":")}`);
      this.setMarkedForUser();
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
