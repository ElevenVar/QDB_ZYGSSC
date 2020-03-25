import method from "@/api/method";
import { objToString } from "@/utils/helper";

// 用户名片接口
export function query_user_data(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/user/v1/query_user_data.do`,
    params,
    {
      isXAuthToken: true
    }
  );
}
// 统计区域
export function zygs_workbench_orderCount(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/workbench/orderCount${objToString(
      params
    )}`,
    params
  );
}

//平台公告
export function query_inventory(params) {
  return method.post(
    `qdsoperate/api/white/business_card/v1/query_inventory.do`,
    params
  );
}

//消息通知列表接口
export function get_message_total(params) {
  return method.get(
    `qdsmerchant/api/portal/merchant/message_record/v1/get_message_total.do${objToString(
      params
    )}`
  );
}

// 即将到期、已超期、我的待办、我分配的
export function zygs_workbench_taskList(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/workbench/taskList${objToString(
      params
    )}`,
    params
  );
}

//我的账户--账户金额统计查询
export function zygs_workbench_planWait(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/workbench/planWait`,
    params
  );
}

//专业公司生产在办订单
export function zygs_workbench_planOrder(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/workbench/planOrder`,
    params
  );
}

//用户消息已读
export function read_msg(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/message_record/v1/read_msg.do`,
    params
  );
}
