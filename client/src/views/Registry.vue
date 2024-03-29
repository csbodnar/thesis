<template>
  <b-container
    fluid="md"
    class="d-flex flex-column border border-secondary rounded mt-3 col-lg-8 col-xl-6 col-md-10"
  >
    <h2 style="margin-top: 2rem">{{ $t("registry") }}</h2>

    <b-form @submit.prevent="register">
      <b-form-group
        id="name-input"
        label-cols="4"
        label-cols-lg="4"
        class="d-flex flex-column flex-lg-row mt-2 align-to-start"
        :label="$t('nameLabel')"
        label-for="name"
      >
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

      <b-form-group
        id="password-input-again"
        :label="$t('passwordAgainLabel')"
        label-for="passwordAgain"
        label-cols="4"
        label-cols-lg="4"
        class="d-flex flex-column flex-lg-row mt-2 align-to-start"
      >
        <b-form-input
          id="password-again"
          v-model="passwordAgain"
          type="password"
          required
          :placeholder="$t('passwordAgainPlaceholder')"
        ></b-form-input>
      </b-form-group>
      <div class="my-3">
        <b-button class="mx-4" @click="goBack">{{ $t("back") }}</b-button>
        <b-button class="mx-4" variant="outline-success" type="submit">{{
          $t("register")
        }}</b-button>
      </div>
    </b-form>
    <b-modal
      ref="registryModal"
      header-bg-variant="danger"
      hide-footer
      hide-header-close
    >
      <template #modal-title> Error! </template>
      <div class="d-block text-center">
        <h5 v-if="errorCode !== null">{{ $t(`${errorCode}`) }}</h5>
      </div>
      <div class="mt-3 modal-footer d-flex justify-content-center">
        <b-button class="mt-1" block @click="hideModal">Ok</b-button>
      </div>
    </b-modal>
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
  mounted() {
    store.commit("setRegistryModal", { ref: this.$refs.registryModal });
  },
  beforeDestroy() {
    store.commit("setRegistryModal", { ref: null });
  },
  methods: {
    register() {
      if (this.password === this.passwordAgain) {
        store.dispatch("register", {
          name: this.name,
          email: this.email,
          password: this.password,
        });
      } else {
        store.state.registryModal.error = "UNMATCHABLE_PASSWORDS_ERROR";
        this.$refs.registryModal.show();
        this.passwordAgain = "";
      }
    },
    goBack() {
      store.dispatch("goBack");
    },
    hideModal() {
      this.$refs.registryModal.hide();
    },
  },
  computed: {
    errorCode() {
      return store.state.registryModal.error;
    },
  },
};
</script>
