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
      if (payload.data.records.length > 0) {
        payload.data.records.forEach((item, index) => {
          item.type = item.isIncome ? '收入' : '支出';
          item.money = item.amount;
          item.currentStae = item.curStatusName;
          item.tradingReason = item.recordTypeName;
          item.accoutnTime = item.occurreTime;
          item.remark = item.recordTypeName;
        });
      }
      state.dataList = payload.data;
    }
  }
};
const actions = {
  async get_balance({ commit }, obj) {
    let result = await api.accountManage.get_balance(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async get_bill_list({ commit }, obj) {
    let result = await api.accountManage.get_bill_list(obj);
    commit('setData', result);
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