import method from "@/api/method";
import { objToString } from "@/utils/helper";
// 退单 -- 列表查询
export function get_order_model_by_status(params) {
  params.orderBy = "end_time"; // 用于排序
  params.isAsc = true; // 用于排序
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/toBeRefunded`,params
  );
}
