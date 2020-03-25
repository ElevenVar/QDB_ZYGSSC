import method from '@/api/method'
import { objToString } from '@/utils/helper'
// 获取验证码
export function get_code(params) {
    return method.post('qdsmerchant/api/white/authfund/v1/send_sms.do', params)
}

// 注册
export function register(params) {
    return method.post('qdsmerchant/api/white/authfund/v1/register.do', params)
}

// 登录
export function login(params) {
    return method.post('qdsmerchant/api/white/authfund/v1/loginin.do', params)
}
// 修改密码
export function modify_pwd(params) {
    return method.post('qdsmerchant/api/white/authfund/v1/forget_password.do', params)
}

// 退出登录
export function logout(params) {
    return method.post('qdsmerchant/api/white/authfund/v1/login_out.do', params)
}

// 获取协议
export function get_agreement(params) {
    return method.get(`qdsoperate/api/white/operate/common_problems/v1/get_agreement.do${objToString(params)}`)
}

// 获取图片
export function get_adv() {
    return method.get(`qdsoperate/api/white/operate/advertising/v1/get_adv.do?advPositions=HPME_GG`)
}

// 获取认证信息
export function query_user_byphone(params) {
    return method.post(`qdsmerchant/api/white/merchant/user/v1/query_user_byphone.do`, params)
}

