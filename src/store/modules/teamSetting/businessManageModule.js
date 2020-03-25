import api from '@/api'
import Notification from '@/componentsEl/notification/index.js'

const state = {

};
const mutations = {
  setData(state, payload) {
    if (payload.code === 200) {

    }
  }
};
const actions = {
  async get_store_product({ commit }, obj) {
    let result = await api.businessManage.get_store_product(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async get_company_city({ commit }, obj) {
    let result = await api.businessManage.get_company_city(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async add_product({ commit }, obj) {
    let result = await api.businessManage.add_product(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async delete_product({ commit }, obj) {
    let result = await api.businessManage.delete_product(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async update_product_area({ commit }, obj) {
    let result = await api.businessManage.update_product_area(obj);
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