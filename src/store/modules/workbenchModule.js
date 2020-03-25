import api from "@/api";

const state = {
  tableData: {
    total: 0,
    accounts: []
  }
};
const mutations = {
  setData(state, payload) {
    if (payload.data) {
      state.tableData = payload.data;
    }
  }
};
const actions = {
  // 用户名片接口
  async query_user_data({ commit }, obj) {
    let result = await api.workbench.query_user_data(obj);
    return result;
  },
  // 统计区域
  async zygs_workbench_orderCount({ commit }, obj) {
    let result = await api.workbench.zygs_workbench_orderCount(obj);
    return result;
  },
  // 平台公告
  async query_inventory({ commit }, obj) {
    let result = await api.workbench.query_inventory(obj);
    return result;
  },
  // 消息通知列表接口
  async get_message_total({ commit }, obj) {
    let result = await api.workbench.get_message_total(obj);
    return result;
  },

  // 即将到期、已超期、我的待办、我分配的
  async zygs_workbench_taskList({ commit }, obj) {
    let result = await api.workbench.zygs_workbench_taskList(obj);
    return result;
  },


  // 方案待处理接口
  async zygs_workbench_planWait({ commit }, obj) {
    let result = await api.workbench.zygs_workbench_planWait(obj);
    return result;
  },



  // 用户消息已读
  async read_msg({ commit }, obj) {
    let result = await api.workbench.read_msg(obj);
    return result;
  },

  //专业公司生产在办订单
  async zygs_workbench_planOrder({ commit }, obj) {
    let result = await api.workbench.zygs_workbench_planOrder(obj);
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
