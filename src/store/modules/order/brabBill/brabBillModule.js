import api from '@/api'
import timeFilter from '@/filters/timeFilter.js'

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
  async get_grab_order_page({
    commit
  }, obj) {
    const result = await api.brabBill.get_grab_order_page(obj);
    commit('setData', result);
    if (result.code === 200) {
      commit('setData', result.data.pageInfo);
    }
    return result
  },
  async find_product({
    commit
  }, obj) {
    const result = await api.brabBill.find_product(obj);
    if (result.code === 200) {
      commit('setCommodityOptions', result.data);
    }
    return result
  },
  async find_grab_order_with_page({ commit }, obj) {
    obj.endMoney = Number(obj.endMoney);
    obj.startMoney = Number(obj.startMoney);
    obj.startUserGrabTime = timeFilter(obj.startUserGrabTime, 'YYYY-MM-DD');
    obj.endUserGrabTime = timeFilter(obj.endUserGrabTime, 'YYYY-MM-DD');
    // timeFilter
    const result = await api.brabBill.find_grab_order_with_page(obj);
    commit('setData', result);
    if (result.code === 200) {
      commit('setData', result.data);
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
