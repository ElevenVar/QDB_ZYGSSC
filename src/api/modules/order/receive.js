import method from "@/api/method";
import { objToString } from "@/utils/helper";
// 全部订单
export function zysc_get_allOrder_list(params) {
  params.orderBy = "create_time";
  params.isAsc = true;
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/allOrder`,
    params
  );
}
// 待接收列表
export function zysc_get_order_model_by_status(params) {
  params.orderBy = "receive_time";
  params.isAsc = true;
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/waitReceive`,params
  );
}

// 查询产品
export function find_product(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/white/common/search_product.do`,
    params
  );
}

// 订单接收
export function receive_order(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/receive${objToString(
      params
    )}`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 订单拒接
export function refused_order(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/reject`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
//  查询 店铺成员
export function get_store_peoples(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/store/staff${objToString(params)}`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
// 提交方案流程 -- 提交流程方案
export function sub_programme(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/base/handingOrder/v1/submintPlan.do`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
// 查询流程方案 -- 提交流程方案
export function get_programme(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/base/handingOrder/v1/query_submint_plan_data.do${objToString(
      params
    )}`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
// 查看订单信息 -- 提交流程方案
export function get_info_details(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/base/handingOrder/v1/order_detail.do${objToString(params)}`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
// 查询生产中心 设置的抢单，接单 时间
export function zysc_get_setTime(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/system/zygssc/order/v1/select_order_duration.do`,
    params
  );
}
