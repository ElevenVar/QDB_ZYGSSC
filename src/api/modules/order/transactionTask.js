//办理中订单任务查询
import method from "@/api/method";
import { objToString } from "@/utils/helper";

//任务的搜索匹配
export function search_stage_and_task(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/queryTaskSmartBox`,
    params
  );
}

//阶段列表接口
export function orderdetail_queryTaskPanael(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/queryTaskPanael`,
    params
  );
}

//模板列表接口
export function query_template(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/base/handingOrder/query_standard_template${objToString(
      params
    )}`,
    params
  );
}

//指定模板详情接口
export function template_demapnotes(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/base/handingOrder/standard_banding_template${objToString(
      params
    )}`,
    params
  );
}

//开启任务接口
export function zygs_TaskBeginHanding(params) {
  return method.post(
    `${
      process.env.ZYGSPrefixRule
    }api/portal/orderdetail/task/TaskBeginHanding${objToString(params)}`,
    params
  );
}
//暂停任务接口
export function zygs_applyTaskTimeOut(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/applyTaskTimeOut`,
    params
  );
}
//查询添加成员列表数据
export function zygs_queryMemberNonMerchantVO(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/orderdetail/task/queryMemberNonMerchantVO`,
    params
  );
}
