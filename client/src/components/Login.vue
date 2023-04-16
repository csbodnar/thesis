<template>
  <b-container fluid="md">
    <b-form @submit.prevent="login">
      <b-form-group
        id="email-input"
        :label="$t('emailAddressLabel')"
        label-for="email"
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
      >
        <b-form-input
          id="password"
          v-model="password"
          type="password"
          required
          :placeholder="$t('passwordPlaceholder')"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit">{{ $t("loginVerb") }}</b-button>
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
      store.commit("login", {
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>
