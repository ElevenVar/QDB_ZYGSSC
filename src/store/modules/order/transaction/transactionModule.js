import api from "@/api";
import Notification from "@/componentsEl/notification/index.js";

const state = {
  dataList: {
    records: [],
    totalPage: 0
  },
  productList: {
    records: [],
    totalPage: 0
  }
};
const mutations = {
  setData(state, payload) {
    state.dataList = payload;
  },
  setProductData(state, payload) {
    state.productList = payload;
  }
};
const actions = {
  // 订单模式列表
  async get_order_model_by_status({ commit }, obj) {
    const result = await api.transaction.get_order_model_by_status(obj);
    if (result.code === 200) {
      commit("setData", result.data);
    }
    return result;
  },
  // 产品模式列表
  async get_product_model_by_status({ commit }, obj) {
    const result = await api.transaction.get_product_model_by_status(obj);
    if (result.code === 200) {
      commit("setProductData", result.data);
    }
    return result;
  },
  async apply_back_order_audit({ commit }, obj) {
    const result = await api.transaction.apply_back_order_audit(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result;
  },
  async apply_case_audit({ commit }, obj) {
    const result = await api.transaction.apply_case_audit(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result;
  },
  async get_order_business({ commit }, obj) {
    const result = await api.transaction.get_order_business(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result;
  },
  async edit_bottom_sheet({ commit }, obj) {
    const result = await api.transaction.edit_bottom_sheet(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result;
  },
  async get_assist_handle({ commit }, obj) {
    const result = await api.transaction.get_assist_handle(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result;
  },

  async delete_assist_handle({ commit }, obj) {
    const result = await api.transaction.delete_assist_handle(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result;
  },
  async update_project_manager({ commit }, obj) {
    const result = await api.transaction.update_project_manager(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result;
  },
  async add_assist_handle({ commit }, obj) {
    const result = await api.transaction.add_assist_handle(obj);
    // if (result.code !== 200 && result.code !== 5223) {
    //   Notification.error(result.message)
    // }
    return result;
  },
  async search_files({ commit }, obj) {
    const result = await api.transaction.search_files(obj);
    return result;
  },
  async update_files({ commit }, obj) {
    const result = await api.transaction.update_files(obj);
    return result;
  },
  async delete_files({ commit }, obj) {
    const result = await api.transaction.delete_files(obj);
    return result;
  },
  async search_files_cms({ commit }, obj) {
    const result = await api.transaction.search_files_cms(obj);
    return result;
  },
  async get_court_with_page({ commit }, obj) {
    const result = await api.transaction.get_court_with_page(obj);
    return result;
  },
  // 标件 -- 撤回订单
  async undo_case_audit({ commit }, obj) {
    const result = await api.transaction.undo_case_audit(obj);
    return result;
  },
  // 非标件 -- 撤回订单 -- 方案待审核
  async undo_back_order_audit({ commit }, obj) {
    const result = await api.transaction.undo_back_order_audit(obj);
    return result;
  },
  // 标件 --  恢复订单 -- 暂停
  async undo_case_recovery({ commit }, obj) {
    const result = await api.transaction.undo_case_recovery(obj);
    return result;
  },
  // 订单暂停
  async zygs_handingOrder_applyStop({ commit }, obj) {
    const result = await api.transaction.zygs_handingOrder_applyStop(obj);
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
