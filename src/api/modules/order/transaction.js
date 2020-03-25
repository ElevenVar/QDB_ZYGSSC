import method from "@/api/method";
import config from "@/service/config";
import { objToString } from "@/utils/helper";

// 办理中 列表 --订单模式
export function get_order_model_by_status(params) {
  params.orderBy = "receive_time"; // 用于排序
  params.isAsc = true; // 用于排序
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/inProgress`,
    params
  );
}

// 办理中 列表 --产品模式
export function get_product_model_by_status(params) {
  params.orderBy = "receive_time";
  params.isAsc = true; // 用于排序
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/order/inProgress/product`,
    params
  );
}
// 退单申请
export function apply_back_order_audit(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/base/handingOrder/applyRetratOrder`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 结项 --  上传结项数据
export function apply_case_audit(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/base/handingOrder/applyEndOrder`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 获取业务底单
export function get_order_business(params) {
  return method.get(
    `qdsflsc/api/portal/order/v1/get_order_business.do${objToString(params)}`
  );
}

// 编辑业务底单
export function edit_bottom_sheet(params) {
  return method.post(
    `qdsflsc/api/portal/order/v1/edit_order_business.do`,
    params
  );
}

// 订单成员设置、查询项目成员
export function get_assist_handle(params) {
  return method.get(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/task/queryProjectMemberVO${objToString(params)}`
  );
}

// 附件文档列表
export function search_files(params) {
  return method.get(config.fileUrl + objToString(params), params);
}

// cms附件文档列表
export function search_files_cms(params) {
  return method.get(
    `qdsflsc/api/white/common/v1/query_cms_annex.do${objToString(params)}`,
    params
  );
}

// 附件文档列表
export function update_files(params) {
  return method.get(config.updateUrl + objToString(params), {
    isXReqUserName: true
  });
}

// 附件文档列表
export function delete_files(params) {
  return method.get(config.deleteUrl + objToString(params), params);
}

// 删除协办人
export function delete_assist_handle(params) {
  return method.get(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/task/deleteProjectMember${objToString(params)}`,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 修改项目管理人
export function update_project_manager(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/changeProjectManager`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

// 新增协办人
export function add_assist_handle(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/addProjectMember`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}

//获取所有法院接口
export function get_court_with_page(params) {
  return method.post(
    "qdsflsc/api/system/bottom/v1/get_court_with_page.do",
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
//-------------------------------张浪 新添加
// 标件 -- 撤回订单
export function undo_case_audit(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/base/handingOrder/confirmBack${objToString(params)}`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
//  非标件 -- 撤回订单 -- 方案待审核
export function undo_back_order_audit(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/base/handingOrder/confirmBackMethod${objToString(params)}`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
// 标件 --  恢复订单 -- 暂停
export function undo_case_recovery(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/base/handingOrder/recoveryStopOrder${objToString(params)}`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
// 订单暂停
export function undo_case_submission(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/base/handingOrder/recoveryStopOrder${objToString(params)}`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
// 非标件 -- 方案审核驳回 --  提交
export function zygs_handingOrder_applyStop(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/base/handingOrder/applyStop`,
    params,
    {
      isXAuthToken: true,
      isXReqUserId: true
    }
  );
}
