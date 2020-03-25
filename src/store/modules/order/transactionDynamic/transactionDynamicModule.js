import api from "@/api";
import Notification from "@/componentsEl/notification/index.js";

const state = {};
const mutations = {};
const actions = {
  // 获取动态详情
  async get_production_order_details_data({ commit }, obj) {
    const result = await api.transactionDynamic.get_production_order_details_data(
      obj
    );
    return result;
  },
  //获取生产订单id订单详情
  async get_production_order_details_by_sc_order_id({ commit }, obj) {
    const result = await api.transactionDynamic.get_production_order_details_by_sc_order_id(
      obj
    );
    return result;
  },
  // 查询订单阶段任务完成情况
  async zysc_stage_list_new({ commit }, obj) {
    const result = await api.transactionDynamic.zysc_stage_list_new(obj);
    return result;
  },
  // 获取跟案记录
  async zysc_query_inventory_dynamic({ commit }, obj) {
    const result = await api.transactionDynamic.zysc_query_inventory_dynamic(
      obj
    );
    return result;
  },
  //添加跟案备注
  async zysc_generate_dynamic({ commit }, obj) {
    const result = await api.transactionDynamic.zysc_generate_dynamic(obj);
    return result;
  },
  // 任务统计
  async zysc_task_todal_scount_dynamic({ commit }, obj) {
    const result = await api.transactionDynamic.zysc_task_todal_scount_dynamic(
      obj
    );
    return result;
  },

  // 恢复订单
  async zygs_handingOrder_recoveryStopOrder({ commit }, obj) {
    const result = await api.transactionDynamic.zygs_handingOrder_recoveryStopOrder(
      obj
    );
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
