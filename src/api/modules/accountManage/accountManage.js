import method from '@/api/method'

//获取账户余额和总收入和总支出
export function get_balance(params) {
  return method.post('qdsmerchant/api/portal/merchant/financial_flow/v1/query_account_data.do', params, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

//获取账单列表
export function get_bill_list(params) {
  return method.post('qdsmerchant/api/portal/merchant/financial_flow/v1/query_account_details.do', params, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}
