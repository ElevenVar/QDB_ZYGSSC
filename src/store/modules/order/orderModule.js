import api from "@/api";

const state = {
  areaOptions: [],
  productOptions: [],
  orderTeamOptions: [],
  orderStatusList: [], // 订单状态
  productDataList: [] // 产品数据
};
const mutations = {
  // 设置订单状态数据
  setOrderStatus(state, payload) {
    state.orderStatusList = payload;
  },
  mergeAreaOptions(state, payload) {
    // 合并选项
    state.areaOptions = payload;
  },
  mergeProductOptions(state, payload) {
    // 合并选项
    state.productOptions = payload;
  },
  mergeOrderTeamOptions(state, payload) {
    // 合并选项
    state.orderTeamOptions = payload;
  },
  // 设置 产品数据
  setProductDataList(state, payload) {
    state.productDataList = payload;
  }
};
const actions = {
  async area_tree_book_list({ commit }, obj) {
    const result = await api.order.tree_book_list(obj);
    if (result.code === 200) {
      commit("mergeAreaOptions", result.data);
    }
    return result;
  },
  async product_tree_book_list({ commit }, obj) {
    const result = await api.order.tree_book_list(obj);
    if (result.code === 200) {
      commit("mergeProductOptions", result.data);
    }
    return result;
  },
  async get_current_user_handle_order_team({ commit }, obj) {
    const result = await api.order.get_current_user_handle_order_team(obj);
    if (result.code === 200) {
      commit("mergeOrderTeamOptions", result.data);
    }
    return result;
  },
  //  查询订单状态
  async zysc_get_order_status({ commit }, obj) {
    const result = await api.order.zysc_get_order_status(obj);
    if (result.code === 200) {
      let data = [];
      if (result.data) {
        for (let i in result.data) {
          data.push({ name: result.data[i], code: i });
        }
      }
      commit("setOrderStatus", data);
    }
  },
  // 查询产品状态
  async zysc_find_product({ commit }, obj) {
    const result = await api.order.zysc_find_product(obj);
    if (result.code === 200) {
      commit("setProductDataList", result.data);
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
