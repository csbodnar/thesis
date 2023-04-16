<template>
  <b-container fluid="md">
    <b-form @submit.prevent="register">
      <b-form-group id="name-input" :label="$t('nameLabel')" label-for="name">
        <b-form-input
          id="name"
          v-model="name"
          type="text"
          required
          :placeholder="$t('namePlaceholder')"
        ></b-form-input>
      </b-form-group>

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

      <b-form-group
        id="password-input-again"
        :label="$t('passwordAgainLabel')"
        label-for="passwordAgain"
      >
        <b-form-input
          id="password-again"
          v-model="passwordAgain"
          type="password"
          required
          :placeholder="$t('passwordAgainPlaceholder')"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit">{{ $t("register") }}</b-button>
    </b-form>
  </b-container>
</template>
<script>
import store from "./../store";
export default {
  name: "RegistryComponent",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      passwordAgain: "",
    };
  },
  methods: {
    register() {
      if (this.password === this.passwordAgain) {
        store.commit("register", {
          name: this.name,
          email: this.email,
          password: this.password,
        });
      } else {
        // todo error
      }
    },
  },
};
</script>
