import method from '@/api/method'

const apiUrl = 'https://tgetway.dgg188.cn:8443/'

// 查询消息列表
export function find_msg_List(params) {
    return method.post(apiUrl + 'message-instation/instation/receivelist?token=1', params) //  测试接口
}

// 查询消息列表
export function sign_msg(params) {
    return method.post(apiUrl + 'message-instation/instation//receive/read?token=1', params) //  测试接口
}