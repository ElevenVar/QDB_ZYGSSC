import api from '@/api'
import Notification from '@/componentsEl/notification/index.js'

const state = {
  data: {
    id: null,
    account: null
  }
};
const mutations = {
  setData(state, payload) {
    if (payload.data) {
      state.data = payload.data
    }
  }
};
const actions = {
  async get_code({ commit }, obj) {
    let result = await api.login.get_code(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async login({ commit }, obj) {
    let result = await api.login.login(obj);
    commit('setData', result);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async register({ commit }, obj) {
    let result = await api.login.register(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async get_agreement({ commit }, obj) {
    let result = await api.login.get_agreement(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async get_adv({ commit }, obj) {
    let result = await api.login.get_adv(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async query_user_byphone({ commit }, obj) {
    let result = await api.login.query_user_byphone(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  }

};

const getters = {

};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}