import method from "@/api/method";
import config from "@/service/config";
import { objToString } from "@/utils/helper";

// 任务产品名称获取
export function search_product(params) {
  // return method.post(`https://productapi.dgg188.cn/api/product/v1/search_product.do${objToString(params)}`)
  // console.log(config.searchProductUrl, 'config.searchProductUrl---');
  // return method.post(config.searchProductUrl + objToString(params), params); //211叫修改不拼接get
  return method.post(config.searchProductUrl, params, {
    isrmultipart: true,
    isXReqUserName: true
  });
}

//查询提醒时间总数据接口
export function task_time_tree_book_list(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/white/common/tree_book_list.do${objToString(params)}`,
    params
  );
}
//添加任务说明
export function task_description_change(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/saveTaskExplain`,
    params
  );
}
//设置提醒
export function task_add_reminder(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/addTaskRemind`,
    params
  );
}
//修改提醒
export function task_updtae_reminder(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/updateTaskRemind`,
    params
  );
}
//删除提醒
export function task_delete_reminder(params) {
  return method.get(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/task/deleteTaskRemind${objToString(params)}`,
    params
  );
}

//添加备注接口、任务说明添加跟更改接口
export function task_detail_generate(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/addTaskRemark`,
    params
  );
}
//查询任务备注列表
export function task_query_inventory(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/queryTaskRemarkPage`,
    params
  );
}
//查询任务记录列表;
export function queryTaskRecordPage(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/queryTaskRecordPage`,
    params
  );
}

//获取店铺和外部人员信息
export function get_store_user(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/usershoprelate/v2/get_store_user.do`,
    params
  );
}

//添加办理人
export function task_setting_manager(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/manageTaskHandler`,
    params
  );
}
//删除办理人
export function deleter_setting_manger(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/manageTaskHandler`,
    params
  );
}
