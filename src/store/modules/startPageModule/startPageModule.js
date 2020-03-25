import api from "@/api";

const state = {
  tableData: {},
  storeName: "",
  waitingGrabCount: 0 // 待抢单数量
};
const mutations = {
  setData(state, payload) {
    if (payload.data) {
      state.tableData = payload.data;
    }
  },
  setWaitingGrabCount(state, payload) {
    state.waitingGrabCount = Number(payload.data ? payload.data : 0);
  },
  setStoreName(state, payload) {
    if (payload.code === 200) {
      state.storeName = payload.data[0].storeName;
    }
  }
};
const actions = {
  // 获取用户在店铺的业态信息（暂用于法律业态PC）
  async get_store_yt_info({ commit }, obj) {
    const result = await api.startPage.get_store_yt_info(obj);
    commit("setStoreName", result);
    return result;
  },

  // 开启接单服务
  async set_store_permission({ commit }, obj) {
    const result = await api.startPage.set_store_permission(obj);
    return result;
  },
  // 是否接单的状态
  async get_un_read({ commit }, obj) {
    const result = await api.startPage.get_un_read(obj);
    return result;
  },
  // 消息通知数量
  async get_store_info_vo({ commit }, obj) {
    const result = await api.startPage.get_store_info_vo(obj);
    return result;
  },
  // 待结单数量
  async count_waiting_grab({ commit }, obj) {
    const result = await api.startPage.count_waiting_grab(obj);
    commit("setWaitingGrabCount", result);
    return result;
  },
  // 门户跳转专业生产获取用户数据
  async get_user_data_by_key({ commit }, obj) {
    const result = await api.startPage.get_user_data_by_key(obj);
    return result;
  }
};
const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
