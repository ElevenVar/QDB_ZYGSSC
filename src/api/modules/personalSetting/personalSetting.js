/*
 * 案例模块
 * @author zjm
 * @date 2019年12月02日
 */
import method from '@/api/method'
// 获取个人信息
export function query_userinfo_setup(params) {
  return method.post('qdsmerchant/api/portal/merchant/user/v1/query_userinfo_setup.do', params)
}
// 获取名片信息
export function query_usercard_detail(params) {
  return method.get('qdsmerchant/api/system/business_card/v1/query_detail.do')
}
// 保存/发布名片信息
export function add_or_editor(params) {
  return method.post('qdsmerchant/api/system/business_card/v1/add_or_editor.do', params)
}
// 获取实名认证信息
export function query_verify_info(params) {
  return method.post('qdsmerchant/api/portal/merchant/user/v1/query_verify_info.do', params)
}
// 实名认证
export function verify_realname(params) {
  return method.post('qdsmerchant/api/portal/merchant/user/v1/verify_realname.do', params)
}
// 识别身份证
export function identify_IDCard(params) {
  return method.post('https://ocr.dgg188.cn/ocr/detect', params, {
    isrlencoded: true,
    isauthen: true
  })
}
// 获取身份证上传ID
export function get_card_file_id(params) {
  return method.get('qdsmerchant/api/portal/merchant/user/v1/get_card_file_id.do?userId=' + params)
}
// 获取个人信息头像上传ID
export function get_photo_file_id(params) {
  return method.get('qdsmerchant/api/portal/merchant/user/v1/get_photo_file_id.do?userId=' + params)
}
// 擅长领域
export function get_tree_book_list(params) {
  return method.get('qdsmerchant/api/white/merchant/common/v1/get_tree_book_list.do?code=QDS_MC_FL')
}
// 字典
export function get_normal_book_list(params) {
  return method.get('qdsmerchant/api/white/merchant/common/v1/get_tree_book_list.do?code=' + params.code)
}
// 公司地址
export function get_company_city(params) {
  return method.get('qdsmerchant/api/white/merchant/city/v1/get_company_city.do')
}
// 修改手机号码
export function change_phone(params) {
  return method.post('qdsmerchant/api/white/authfund/v1/change_phone.do', params)
}
// 获取手机验证码
export function send_sms(params) {
  return method.post('qdsmerchant/api/white/authfund/v1/send_sms.do', params)
}
// 验证手机验证码
export function verify_Code(params) {
  return method.post('qdsmerchant/api/white/authfund/v1/verify_Code.do', params)
}
// 修改密码
export function change_pwd(params) {
  return method.post('qdsmerchant/api/white/authfund/v1/change_pwd.do', params)
}
// 关联案例列表
export function ref_case_list(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/query_list2.do', params)
}
// 根据案例id集合查询关联案例列表
export function ref_caseids_list(params) {
  return method.post('qdsflsc/api/white/caseinstance/v1/query_list3.do', params)
}
// 发布/上架/下架
export function publish(params) {
  return method.post('qdsmerchant/api/system/business_card/v1/publish.do', params)
}
