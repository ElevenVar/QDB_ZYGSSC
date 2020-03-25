/*
 * 案例模块
 * @author zjm
 * @date 2019年12月02日
 */
import method from '@/api/method'
// 获取案例列表
export function case_query_list(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/query_list.do', params) //  测试接口
}
// 查看案例详情
export function case_detail(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/detail.do', params) //  测试接口
}
// 获取生成案例详情
export function case_edit_detail(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/generate.do', params) //  测试接口
}
// 获取案例中心的案例详情
export function case_center_detail(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/detail2.do', params) //  测试接口
}
// 保存案例
export function case_edite(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/edite.do', params) //  测试接口
}
// 删除案例
export function case_del(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/del.do', params) //  测试接口
}
// 撤回案例
export function case_revoke(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/revoke.do', params) //  测试接口
}
// 发布案例
export function case_publish(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/publish.do', params) //  测试接口
}
// 查询案例标签列表
export function add_lable(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/query_lable.do', params) //  测试接口
}
// 保存并发布案例
export function publish_two(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/publish_two.do', params) //  测试接口
}
// 重置案例
export function regenerate(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/regenerate.do', params) //  测试接口
}
