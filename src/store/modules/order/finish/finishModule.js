import api from "@/api";

const state = {
  dataList: {
    records: [],
    total: 0
  },
  productList: {
    records: [],
    total: 0
  },
  commodityOptions: []
};
const mutations = {
  setData(state, payload) {
    state.dataList = payload;
  },
  setProductData(state, payload) {
    state.productList = payload;
  },
  setCommodityOptions(state, payload) {
    state.commodityOptions = payload;
  }
};
const actions = {
  // 获取列表
  async get_order_model_by_status({ commit }, obj) {
    const result = await api.finish.get_order_model_by_status(obj);
    if (result.code === 200) {
      commit("setData", result.data);
    }
    return result;
  },
  async get_product_model_by_status({ commit }, obj) {
    // 获取产品模式
    const result = await api.finish.get_product_model_by_status(obj);
    if (result.code === 200) {
      commit("setProductData", result.data);
    }
    return result;
  },
  async find_product({ commit }, obj) {
    const result = await api.finish.find_product(obj);
    if (result.code === 200) {
      commit("setCommodityOptions", result.data);
    }
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
