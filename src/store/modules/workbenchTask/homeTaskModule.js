import api from "@/api";

const state = {
  tableData: {}
};
const mutations = {};
const actions = {
  // 查询任务统计
  async zysc_homeTask_list({commit},obj){
    let result = await api.homeTask.zysc_homeTask_list(obj);
    return result;
  },
  // 查询具体某个类的任务
  async zysc_homeTask_c({commit},obj){
    let result = await api.homeTask.zysc_homeTask_c(obj);
    return result;
  },
  // 查询任务详情
  async zysc_homeTask_details({commit},obj){
    let result = await api.homeTask.zysc_homeTask_details(obj);
    return result;
  },
  // 查询 任务记录
  async zysc_homeTask_record({commit},obj){
    let result = await api.homeTask.zysc_homeTask_record(obj);
    return result
  },
  // 添加任务备注
  async zysc_homeTask_record_add({commit},obj){
    let result = await api.homeTask.zysc_homeTask_record_add(obj);
    return result
  },
  // 查询产品列表
  async zysc_homeTask_getProduct({commit},obj){
    let result = await api.homeTask.zysc_homeTask_getProduct(obj);
    return result
  },
  // 完成激活产品
  async zysc_complete_task_service({commit},obj){
    let result = await api.homeTask.zysc_complete_task_service(obj);
    return result
  },
  // 添加/ 删除/ 修改 办理人
  async zysc_manageTaskHandler_operation({commit},obj){
    let result = await api.homeTask.zysc_manageTaskHandler_operation(obj);
    return result
  },
  // 修改任务提醒
  async ztsc_task_updtae_reminder({commit},obj){
    let result = await api.homeTask.ztsc_task_updtae_reminder(obj);
    return result
  },
  // 删除任务提醒
  async zysc_task_delete_reminder({commit},obj){
    let result = await api.homeTask.zysc_task_delete_reminder(obj);
    return result
  },
  // 跳转查询 订单详情
  async zysc_get_production_order_details_data({commit},obj){
    let result = await api.homeTask.zysc_get_production_order_details_data(obj);
    return result
  },
  
};
const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
