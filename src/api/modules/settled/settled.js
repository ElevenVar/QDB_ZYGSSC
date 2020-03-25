import method from '@/api/method'
import { objToString } from '@/utils/helper'
// 获取全国省市列表
export function get_area(params) {
  return method.get(`qdsmerchant/api/white/merchant/city/v1/get_city.do${objToString(params)}`, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

// 获取分公司城市地址服务
export function get_company_city(params) {
  return method.get(`qdsmerchant/api/white/merchant/city/v1/get_company_city.do`, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

// 获取业态信息服务
export function get_yt_list(params) {
  return method.get(`qdsmerchant/api/white/merchant/product/v1/get_yt_info.do${objToString(params)}`, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

// 获取产品信息服务
export function get_yt_prodyct_list(params) {
  return method.post(`qdsflsc/api/white/common/v1/search_product.do`, params, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

// 申请店铺入驻
export function apply_store(params) {
  return method.post(`qdsmerchant/api/portal/merchant/store/v1/apply_store.do`, params, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

// 图片信息读取
export function img_msg(params) {
  return method.post(`https://ocr.dgg188.cn/ocr/detect`, params, {
    isrlencoded: true,
    isauthen: true
  })
}

// 店铺名是否重复
export function is_store_name_repeat(params) {
  return method.get(`qdsmerchant/api/portal/merchant/store/v1/is_store_name_repeat.do${objToString(params)}`)
}

