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

  }
};
const actions = {
  async add_store_user_agree({ commit }, obj) {
    let result = await api.inviteNotice.add_store_user_agree(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result
  },
  async getStatus({ commit }, obj) {
    let result = await api.inviteNotice.getStatus(obj);
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