import method from "@/api/method";
import { objToString } from "@/utils/helper";
// 获取用户在店铺的业态信息（暂用于法律业态PC）
export function get_store_yt_info(params) {
  return method.get(
    `qdsmerchant/api/portal/merchant/store/v1/get_store_yt_info.do${objToString(
      params
    )}`
  );
}
// 开启接单服务
export function set_store_permission(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/store/v1/set_store_permission.do`,
    params
  );
}
// 开启接单服务
export function get_un_read(params) {
  return method.get(
    `qdsmerchant/api/portal/merchant/message_record/v1/get_un_read.do${objToString(
      params
    )}`,
    params,
    {
      isloading: true
    }
  );
}
// 开启接单服务
export function get_store_info_vo(params) {
  return method.get(
    `qdsmerchant/api/portal/merchant/store/v1/get_store_info_vo.do${objToString(
      params
    )}`,
    params
  );
}
// 待接单数量
export function count_waiting_grab(params) {
  return method.post(
    `qdsproduction/api/portal/production/sc_order/v1/count_waiting_grab.do`,
    params
  );
}
//门户跳转专业生产获取用户数据
export function get_user_data_by_key(params) {
  return method.get(
    `qdsmerchant/api/white/merchant/store/home/v1/get_user_data_by_key.do${objToString(
      params
    )}`,
    params,
    {
      isloading: true
    }
  );
}
