import method from "@/api/method";
import { objToString } from "@/utils/helper";
//  列表 -- 订单模式
export function get_order_model_by_status(params) {
  params.orderBy = "end_time"; // 用于排序
  params.isAsc = true; // 用于排序
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/toBeFinished`,
    params
  );
}

//  列表 -- 产品模式
export function get_product_model_by_status(params) {
  params.orderBy = "end_time"; // 用于排序
  params.isAsc = true; // 用于排序
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/toBeCompleted/product`,
    params
  );
}
