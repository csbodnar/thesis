<template>
  <b-container
    fluid="md"
    class="d-flex flex-column border border-secondary rounded mt-3 col-lg-8 col-xl-6 col-md-12"
  >
    <h2 style="margin-top: 2rem">{{ $t("loginTab") }}</h2>
    <b-form @submit.prevent="login">
      <b-form-group
        id="email-input"
        :label="$t('emailAddressLabel')"
        label-for="email"
        label-cols="4"
        label-cols-lg="4"
        class="d-flex flex-column flex-lg-row mt-2 align-to-start"
      >
        <b-form-input
          id="email"
          v-model="email"
          type="email"
          required
          :placeholder="$t('emailAddressPlaceholder')"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="password-input"
        :label="$t('passwordLabel')"
        label-for="password"
        label-cols="4"
        label-cols-lg="4"
        class="d-flex flex-column flex-lg-row mt-2 align-to-start"
      >
        <b-form-input
          id="password"
          v-model="password"
          type="password"
          required
          :placeholder="$t('passwordPlaceholder')"
        ></b-form-input>
      </b-form-group>
      <div class="my-3">
        <b-button class="mx-4" @click="goBack">{{ $t("back") }}</b-button>
        <b-button class="mx-4" variant="outline-success" type="submit">{{
          $t("loginVerb")
        }}</b-button>
      </div>
    </b-form>
  </b-container>
</template>
<script>
import store from "./../store";
export default {
  name: "LoginComponent",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      store.dispatch("login", {
        email: this.email,
        password: this.password,
      });
    },
    goBack() {
      store.dispatch("goBack");
    },
  },
};
</script>
