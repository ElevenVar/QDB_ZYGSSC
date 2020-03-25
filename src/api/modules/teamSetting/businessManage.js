import method from '@/api/method'
import { objToString } from '@/utils/helper'
// 批量获取店铺的产品信息
export function get_store_product(params) {
  return method.get(`qdsmerchant/api/portal/merchant/product/v1/get_store_product_list.do${objToString(params)}`, {
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

// 店铺添加产品范围服务
export function add_product(params) {
  return method.post(`qdsmerchant/api/portal/merchant/store_applicant/v1/add_product.do`, params, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

// 删除店铺的产品
export function delete_product(params) {
  return method.post(`qdsmerchant/api/portal/merchant/product/v1/del_store_product.do`, params, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}
// 更新经营产品区域
export function update_product_area(params) {
  return method.post(`qdsmerchant/api/portal/merchant/store_applicant/v1/update_product_area.do`, params, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

