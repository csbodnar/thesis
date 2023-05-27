<template>
  <b-card class="mb-3">
    <div>
      <div class="row justify-content-center">
        <div class="col-sm-12 col-md-5 align-self-stretch">
          <b-card :title="this.fromObject.fromPlace.name">
            <formatted-date
              :dateObj="this.fromObject.departureDateTime"
            ></formatted-date>
          </b-card>
        </div>
        <div class="h2 col-sm-12 col-md-1 d-block d-md-none">
          <b-icon-arrow-down variant="primary"></b-icon-arrow-down>
        </div>
        <div class="h2 col-sm-12 col-md-1 d-none d-md-block align-self-center">
          <b-icon-arrow-right variant="primary"></b-icon-arrow-right>
        </div>
        <div class="col-sm-12 col-md-5 align-self-stretch">
          <b-card :title="this.toObject.toPlace.name">
            <formatted-date
              :dateObj="this.toObject.arrivalDateTime"
            ></formatted-date>
          </b-card>
        </div>
      </div>

      <div class="">
        <a
          class="fw-bold"
          v-b-toggle
          :href="`#stops-info_${htmlId}`"
          @click.prevent
          >Stops: {{ this.stopCount }}</a
        >
        <b-collapse :id="`stops-info_${htmlId}`">
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
      <div class="d-flex flex-row justify-content-center">
        <p class="fw-bold">Total Time:</p>
        <p class="fw-bold">{{ this.travelTime }}</p>
      </div>
      <div v-if="!hasMoreOptions && pricingOptions[0]">
        <b-button
          variant="primary"
          target="_blank"
          :href="this.pricingOptions[0].link"
          >{{ this.pricingOptions[0].price }}
        </b-button>
      </div>
      <div v-else>
        <b-button
          v-if="pricingOptions[0]"
          v-b-toggle="htmlId"
          variant="primary"
        >
          From {{ pricingOptions[0].price }}</b-button
        >
        <b-collapse :id="htmlId" class="mt-2">
          <b-card
            class="d-flex flex-row"
            v-for="option in Object.entries(pricingOptions)"
            :key="option[0]"
          >
            <img
              v-for="agent in option[1].agents"
              class="mx-3"
              :key="agent.name"
              :src="agent.imageUrl"
              :alt="agent.name"
            />

            <b-button
              class="mx-3"
              variant="primary"
              target="_blank"
              :href="option[1].link"
              >{{ option[1].price }}
            </b-button>
          </b-card>
        </b-collapse>
      </div>
    </div>
    <!-- logged in-->
    <div v-if="showMarkButton">
      <b-button variant="warning" @click="markingValidation">Mark</b-button>
      <b-modal
        :id="`mark-${this.id.replace(',', ':')}`"
        hide-footer
        hide-header-close
      >
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
import { BIconArrowDown, BIconArrowRight } from "bootstrap-vue";

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
    BIconArrowDown,
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
  async created() {
    // console.log(this.pricingOptions, this.hasMoreOptions);
    this.pricingOptions = this.getPricingOptions();

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
  watch: {
    hasMoreOptions: async function (newVal, oldVal) {
      this.pricingOptions = this.getPricingOptions();
    },
  },
  computed: {
    htmlId() {
      return this.id.replace(",", ":");
    },

    currency() {
      return store.state.currency;
    },
    isWideScreen() {
      return window.innerWidth >= 800;
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
          priceAmount: this.itinerary.pricingOptions[0].price.amount,
          priceUnit: this.itinerary.pricingOptions[0].price.unit,
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
    getPricingOptions() {
      return this.itinerary.pricingOptions.map((option) => {
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
        let price = formatter.format(amount);
        return {
          price: price.includes("NaN") ? "unknown" : price,
          link: option.items[0].deepLink,
          agents,
        };
      });
    },
  },
};
</script>
<style scoped>
@media screen and (max-width: 600px) {
  .small-widht {
    background-color: lightblue;
  }
}
</style>
