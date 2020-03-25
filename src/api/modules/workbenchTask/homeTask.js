import method from "@/api/method";
import config from "@/service/config";
import { objToString } from "@/utils/helper";

// 查询任务统计
export function zysc_homeTask_list(params) {
  return method.get(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/task/queryHeadTaskItemVO${objToString(params)}`
  );
}
// 查询 任务 --  具体某个类的任务
export function zysc_homeTask_c(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/queryHeadTaskVO`,
    params
  );
}
// 查询 任务详情
export function zysc_homeTask_details(params) {
  return method.get(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/task/queryHeadTaskDetail${objToString(params)}`,
    params
  );
}
// 查询任务记录列表
export function zysc_homeTask_record(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/queryTaskRecordPage`,
    params
  );
}
// 添加任务备注
export function zysc_homeTask_record_add(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/saveTaskExplain`,
    params
  );
}
// 获取产品列表
export function zysc_homeTask_getProduct(params) {
  return method.get(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/task/queryProductVO${objToString(params)}`,
    params
  );
}
// 完成/激活/ 任务
export function zysc_complete_task_service(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/complateTask`,
    params
  );
}
// 添加/ 删除/  修改 办理人
export function zysc_manageTaskHandler_operation(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/manageTaskHandler`,
    params
  );
}
// 修改任务提醒
export function ztsc_task_updtae_reminder(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/updateTaskRemind`,
    params
  );
}
// 删除任务提醒
export function zysc_task_delete_reminder(params) {
  return method.get(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/task/deleteTaskRemind${objToString(params)}`
  );
}
// 跳转查询订单详情
export function zysc_get_production_order_details_data(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/orderDetail${objToString(
      params
    )}`
  );
}
