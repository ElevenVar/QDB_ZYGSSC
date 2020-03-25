import method from '@/api/method'
import { objToString } from '@/utils/helper'
// 邀请加入店铺消息操作
export function add_store_user_agree(params) {
    return method.post('qdsmerchant/api/portal/merchant/usershoprelate/v1/add_store_user_agree.do', params)
}

// 获取消息状态
export function getStatus(params) {
    return method.get(`qdsmerchant/api/portal/merchant/usershoprelate/v1/get_relate_info.do${objToString(params)}`)
}

