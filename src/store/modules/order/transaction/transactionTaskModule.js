import api from "@/api";

const state = {};
const mutations = {};
const actions = {
  //任务的搜索匹配
  async search_stage_and_task({ commit }, obj) {
    const result = await api.transactionTask.search_stage_and_task(obj);
    return result;
  },
  //阶段列表接口
  async orderdetail_queryTaskPanael({ commit }, obj) {
    const result = await api.transactionTask.orderdetail_queryTaskPanael(obj);
    return result;
  },



  //添加任务接口
  async new_task_service({ commit }, obj) {
    const result = await api.transactionTask.new_task_service(obj);
    return result;
  },


  //模板列表接口
  async query_template({ commit }, obj) {
    const result = await api.transactionTask.query_template(obj);
    return result;
  },
  //指定模板详情接口
  async template_demapnotes({ commit }, obj) {
    const result = await api.transactionTask.template_demapnotes(obj);
    return result;
  },

  //开启任务接口
  async zygs_TaskBeginHanding({ commit }, obj) {
    const result = await api.transactionTask.zygs_TaskBeginHanding(obj);
    return result;
  },
  //暂停任务接口
  async zygs_applyTaskTimeOut({ commit }, obj) {
    const result = await api.transactionTask.zygs_applyTaskTimeOut(obj);
    return result;
  },
  //查询添加成员列表数据
  async zygs_queryMemberNonMerchantVO({ commit }, obj) {
    const result = await api.transactionTask.zygs_queryMemberNonMerchantVO(obj);
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
