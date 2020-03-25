import method from '@/api/method'
import { objToString } from '@/utils/helper'

//平台公告详情
export function query_inventory_id(params) {
    return method.get(`qdsoperate/api/white/business_card/v1/query_inventory_id.do${objToString(params)}`)
}