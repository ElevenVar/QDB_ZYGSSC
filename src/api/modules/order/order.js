import method from "@/api/method";
import { objToString } from "@/utils/helper";

// 查询拒绝原因 --  查询业务
export function tree_book_list(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/white/common/tree_book_list.do${objToString(params)}`,
    params
  );
}
// 查询团队成员
export function get_current_user_handle_order_team(params) {
  return method.get(
    `${process.env.ZYGSPrefixRule}api/portal/store/staff${objToString(params)}`,
    params
  );
}
// 查询产品
export function zysc_find_product(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/white/common/search_product.do${objToString(params)}`
  );
}
// 查询订单状态
export function zysc_get_order_status(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/white/common/order_status.do`,
    params
  );
}
