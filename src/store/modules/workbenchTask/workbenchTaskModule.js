import api from "@/api";

const state = {
  tableData: {}
};
const mutations = {};
const actions = {
  // 任务产品名称获取
  async search_product({ commit }, obj) {
    let result = await api.workbenchTask.search_product(obj);
    return result;
  },
  //查询提醒时间总数据接口
  async task_time_tree_book_list({ commit }, obj) {
    let result = await api.workbenchTask.task_time_tree_book_list(obj);
    return result;
  },
  //添加任务说明
  async task_description_change({ commit }, obj) {
    let result = await api.workbenchTask.task_description_change(obj);
    return result;
  },
  //设置提醒
  async task_add_reminder({ commit }, obj) {
    let result = await api.workbenchTask.task_add_reminder(obj);
    return result;
  },
  //修改提醒
  async task_updtae_reminder({ commit }, obj) {
    let result = await api.workbenchTask.task_updtae_reminder(obj);
    return result;
  },
  //删除提醒
  async task_delete_reminder({ commit }, obj) {
    let result = await api.workbenchTask.task_delete_reminder(obj);
    return result;
  },

  //添加备注接口、任务说明添加跟更改接口
  async task_detail_generate({ commit }, obj) {
    let result = await api.workbenchTask.task_detail_generate(obj);
    return result;
  },
  //查询任务备注列表
  async task_query_inventory({ commit }, obj) {
    let result = await api.workbenchTask.task_query_inventory(obj);
    return result;
  },
  //查询任务记录列表
  async queryTaskRecordPage({ commit }, obj) {
    let result = await api.workbenchTask.queryTaskRecordPage(obj);
    return result;
  },
  // 获取店铺和外部人员信息
  async get_store_user({ commit }, obj) {
    let result = await api.workbenchTask.get_store_user(obj);
    return result;
  },
  // 添加办理人
  async task_setting_manager({ commit }, obj) {
    let result = await api.workbenchTask.task_setting_manager(obj);
    return result;
  },
  // 删除办理人
  async deleter_setting_manger({ commit }, obj) {
    let result = await api.workbenchTask.deleter_setting_manger(obj);
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
