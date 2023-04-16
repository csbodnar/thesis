import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // state, mutations, actions, getters, etc.
  state: {
    isSignedIn: true,
  },
  mutations:{
    signOut(state) {
        state.isSignedIn = false;
    }
  }
  
})

export default store



