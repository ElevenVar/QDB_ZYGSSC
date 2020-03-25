import api from '@/api'

const state = {
  dataList: {
    records: [],
    totalPage: 0
  },
  commodityOptions: []
};
const mutations = {
  setData(state, payload) {
    state.dataList = payload
  },
  setCommodityOptions(state, payload) {
    state.commodityOptions = payload
  }
};
const actions = {
  async get_order_model_by_status({
    commit
  }, obj) {
    const result = await api.chargeback.get_order_model_by_status(obj);
    commit('setData', result);
    if (result.code === 200) {
      commit('setData', result.data);
    }
    return result
  },
  async find_product({
    commit
  }, obj) {
    const result = await api.chargeback.find_product(obj);
    if (result.code === 200) {
      commit('setCommodityOptions', result.data);
    }
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
