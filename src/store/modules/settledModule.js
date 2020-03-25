import api from '@/api'
import Notification from '@/componentsEl/notification/index.js'

const state = {
  data: {

  }
};
const mutations = {
  setData(state, payload) {
    if (payload.data) {

    }
  }
};
const actions = {
  async get_area({ commit }, obj) {
    let result = await api.settled.get_area(obj); //
    commit('setData', result);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async get_company_city({ commit }, obj) {
    let result = await api.settled.get_company_city(obj); //
    commit('setData', result);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async get_yt_list({ commit }, obj) {
    let result = await api.settled.get_yt_list(obj); //
    commit('setData', result);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async get_yt_prodyct_list({ commit }, obj) {
    let result = await api.settled.get_yt_prodyct_list(obj); //
    commit('setData', result);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async apply_store({ commit }, obj) {
    let result = await api.settled.apply_store(obj); //
    commit('setData', result);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async img_msg({ commit }, obj) {
    let result = await api.settled.img_msg(obj);
    return result
  },
  async is_store_name_repeat({ commit }, obj) {
    let result = await api.settled.is_store_name_repeat(obj);
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