import api from '@/api'
import Notification from '@/componentsEl/notification/index.js'

const state = {
  dataList: {
    records: [],
    totalCount: 0
  }
};
const mutations = {
  setData(state, payload) {
    if (payload.code === 200) {
      if (payload.data.pageInfo.records.length > 0) {
        payload.data.pageInfo.records.forEach((item, index) => {
          item.service_name = item.productNames;
          item.generating_orm = item.scOrderNo;
          item.custome_name = item.customerName;
          item.regional = item.area;
          item.proportion = item.commission;
          item.countDown = new Date(item.grabDeadline).getTime() - new Date().getTime();  //item.grabDeadline的时间戳 - 当前时间戳
          item.upstatus = true
        });
        state.dataList = payload.data.pageInfo;
      } else {
        state.dataList = {
          records: [],
          totalCount: 0
        }
      }
    }
  }
};
const actions = {
  async get_grap_list({ commit }, obj) {
    obj.minMoney = Number(obj.minMoney) ? Number(obj.minMoney):'';
    obj.maxMoney = Number(obj.maxMoney) ? Number(obj.maxMoney):'';
    let result = await api.grap.get_grap_list(obj);
    commit('setData', result);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },

  async get_order_detail({ commit }, obj) {
    let result = await api.grap.get_order_detail(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },

  async get_sc_order_by_id({ commit }, obj) {
    let result = await api.grap.get_sc_order_by_id(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },

  async rob_order({ commit }, obj) {
    let result = await api.grap.rob_order(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },

  async get_level2_yt({ commit }, obj) {
    let result = await api.grap.get_level2_yt(obj);
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