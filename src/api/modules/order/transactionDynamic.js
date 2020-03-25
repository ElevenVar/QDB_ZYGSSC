import method from "@/api/method";
import { objToString } from "@/utils/helper";
// 查询订单详情
export function get_production_order_details_data(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/orderDetail${objToString(
      params
    )}`,
    params
  );
}
// 查询生产订单订单详情
export function get_production_order_details_by_sc_order_id(params) {
  return method.get(
    `qdsflsc/api/portal/order/v1/get_production_order_details_by_sc_order_id.do${objToString(
      params
    )}`
  );
}
//
// 查询订单动态阶段
export function zysc_stage_list_new(params) {
  return method.get(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/dynamic/queryOrderStageStatus${objToString(
      params
    )}`,
    params
  );
}

// 查询备注记录
export function zysc_query_inventory_dynamic(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/dynamic/queryDynamicTimeLineItemPage`,
    params
  );
}
// 添加跟案备注
export function zysc_generate_dynamic(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/dynamic/saveOrderRemarks`,
    params
  );
}
// 任务截止当日统计情况
export function zysc_task_todal_scount_dynamic(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/dynamic/queryOrderCountVO${objToString(params)}`,
    params
  );
}

//恢复订单
export function zygs_handingOrder_recoveryStopOrder(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/base/handingOrder/recoveryStopOrder${objToString(params)} `,
    params
  );
}
