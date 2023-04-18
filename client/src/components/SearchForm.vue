<template>
  <b-container fluid="md">
    <b-form @submit.prevent="search">
      <div>
        <b-form-group v-slot="{ ariaDescribedby }">
          <b-form-radio
            v-model="searchType"
            :aria-describedby="ariaDescribedby"
            value="oneway"
            >{{ $t("oneway") }}
          </b-form-radio>
          <b-form-radio
            v-model="searchType"
            :aria-describedby="ariaDescribedby"
            value="return"
            >{{ $t("return") }}
          </b-form-radio>
        </b-form-group>
      </div>
      <b-form-group id="from-input" :label="$t('fromLabel')" label-for="from">
        <b-form-input
          id="from"
          list="from-list"
          v-model="from"
          @input="autoSuggestFromPlace"
          type="text"
          required
        >
        </b-form-input>
        <datalist id="from-list">
          <option
            v-for="suggestion in this.placeSuggestions"
            :key="suggestion.entityId"
          >
            {{
              suggestion.name + suggestion.countryName
                ? ` (${suggestion.countryName})`
                : ""
            }}
          </option>
        </datalist>
      </b-form-group>

      <b-form-group id="to-input" :label="$t('toLabel')" label-for="to">
        <b-form-input id="to" v-model="to" type="text" required></b-form-input>
      </b-form-group>

      <b-form-group
        id="date-depart-input"
        :label="$t('dateDepartLabel')"
        label-for="dateDepart"
      >
        <b-form-datepicker
          id="dateDepart"
          v-model="dateDepart"
          class="mb-2"
        ></b-form-datepicker>
      </b-form-group>

      <b-form-group
        v-if="this.isReturn"
        id="date-return-input"
        :label="$t('dateReturnLabel')"
        label-for="dateReturn"
      >
        <b-form-datepicker
          id="dateReturn"
          v-model="dateReturn"
          class="mb-2"
        ></b-form-datepicker>
      </b-form-group>

      <div>
        <b-form-select v-model="cabinClass" class="mb-3">
          <b-form-select-option value="CABIN_CLASS_UNSPECIFIED">
            {{ $t("cabinClass") }}
          </b-form-select-option>
          <b-form-select-option value="CABIN_CLASS_ECONOMY">
            {{ $t("economyClass") }}
          </b-form-select-option>
          <b-form-select-option value="CABIN_CLASS_PREMIUM_ECONOMY">
            {{ $t("premiumEconomyClass") }}
          </b-form-select-option>
          <b-form-select-option value="CABIN_CLASS_BUSINESS">
            {{ $t("buisnessClass") }}
          </b-form-select-option>
          <b-form-select-option value="CABIN_CLASS_FIRST">
            {{ $t("firstClass") }}
          </b-form-select-option>
        </b-form-select>
      </div>

      <b-form-group>
        <b-form-checkbox id="direct" v-model="isDirect" name="direct">
          {{ $t("direct") }}
        </b-form-checkbox>
      </b-form-group>

      <b-button type="submit">{{ $t("search") }}</b-button>
    </b-form>
  </b-container>
</template>
<script>
import store from "./../store";

export default {
  name: "SearchForm",
  data() {
    return {
      searchType: "oneway",
      from: "",
      to: "",
      dateDepart: "",
      dateReturn: "",
      cabinClass: "CABIN_CLASS_UNSPECIFIED",
      isDirect: true,
    };
  },
  computed: {
    isReturn() {
      return this.searchType === "return";
    },
    placeSuggestions() {
      return store.getters.getPlaceSuggestions;
    },
  },
  methods: {
    search() {
      store.commit("search", {
        email: this.email,
        password: this.password,
      });
    },
    autoSuggestFromPlace(text) {
      store.dispatch("autoSuggestPlace", {
        searchTerm: text,
        isDestination: false,
      });
      console.log(
        this.placeSuggestions.map((x) => {
          x.name;
        })
      );
    },
  },
};
</script>
