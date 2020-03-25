import method from "@/api/method";
import { objToString } from "@/utils/helper";
// 获取用户数据（企大顺app登录后，获取用户数据，店铺，身份）
export function get_person_msg(params) {
  return method.post(
    "qdsmerchant/api/portal/merchant/user/v1/query_user_data.do",
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 获取店铺数据
export function get_store_msg(params) {
  return method.get(
    `qdsmerchant/api/portal/merchant/store/v1/get_store_info_vo.do${objToString(
      params
    )}`,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 获取实名认证信息
export function get_authentication(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/user/v1/query_verify_info.do`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 团队评价
export function get_team_comment(params) {
  return method.get(
    `qdsproduction/api/portal/production/sc_order/v1/select_store_scores.do${objToString(
      params
    )}`,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 获取全国省市列表
export function get_area(params) {
  return method.get(
    `qdsmerchant/api/white/merchant/city/v1/get_city.do${objToString(params)}`,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 修改店铺信息
export function modify_store_msg(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/store/v1/update_store_info.do`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 获取店铺下员工
export function get_store_user(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/usershoprelate/v1/get_store_user.do`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 获取店铺下员工
export function get_store_user_page(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/usershoprelate/v1/get_store_user_page.do`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 根据电话查询员工
export function get_store_adduser(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/usershoprelate/v1/get_store_adduser.do`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 添加员工
export function add_store_user(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/usershoprelate/v1/add_store_user.do`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 删除员工
export function deal_employee(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/usershoprelate/v1/del_store_user.do`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 获取员工在店铺的订单数据
export function get_order_data(params) {
  return method.get(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/task/queryUserCountVO${objToString(params)}`,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 设置员工接单权限服务
export function set_employee_receive_order(params) {
  return method.post(
    `qdsmerchant/api/portal/merchant/usershoprelate/v1/set_employee_receive_order.do`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
