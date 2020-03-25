import api from "@/api";
import Notification from "@/componentsEl/notification/index.js";

const state = {
  //订单-- 全部
  allOrderData: {
    records: [],
    totalPage: 0
  },
  //待接收
  dataList: {
    records: [],
    totalPage: 0
  }
};
const mutations = {
  //订单--全部 赋值
  setAllOrder(state, payload) {
    state.allOrderData = payload;
  },
  // 订单-- 待接收
  setData(state, payload) {
    state.dataList = payload;
  }
};
const actions = {
  //获取全部订单列表
  async zysc_get_allOrder_list({ commit }, obj) {
    const result = await api.receive.zysc_get_allOrder_list(obj);
    if (result.code == 200) {
      commit("setAllOrder", result.data);
    } else {
      Notification.warning(result.message);
    }
    return result;
  },
  // 订单 -- 待接收
  async zysc_get_order_model_by_status({ commit }, obj) {
    const result = await api.receive.zysc_get_order_model_by_status(obj);
    if (result.code === 200) {
      commit("setData", result.data);
    } else {
      Notification.warning(result.message);
    }
    return result;
  },
  async receive_order({ commit }, obj) {
    const result = await api.receive.receive_order(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result;
  },
  // 订单 --  拒绝 （确认）
  async refused_order({ commit }, obj) {
    const result = await api.receive.refused_order(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result;
  },
  // 查询拒绝原因列表
  async refuse_code_tree_book_list({ commit }, obj) {
    const result = await api.order.tree_book_list(obj);
    return result;
  },
  // 获取店铺成员
  async get_store_peoples({ commit }, obj) {
    const result = await api.receive.get_store_peoples(obj);
    return result;
  },
  //  提交方案流程
  async sub_programme({ commit }, obj) {
    const result = await api.receive.sub_programme(obj);
    return result;
  },
  // 查询 流程方案
  async get_programme({ commit }, obj) {
    const result = await api.receive.get_programme(obj);
    return result;
  },
  // 查询 订单信息 -- 提交流程方案
  async get_info_details({ commit }, obj) {
    const result = await api.receive.get_info_details(obj);
    return result;
  },
  // 查询生产中心 设置的抢单，接单 时间
  async zysc_get_setTime({commit},obj){
    const result = await api.receive.zysc_get_setTime(obj);
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
