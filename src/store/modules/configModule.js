const state = {
    options: {
        // 测试状态
        'status': [{
                'label': '正常',
                'value': 2
            },
            {
                'label': '冻结',
                'value': 1
            }
        ]
    },
    themes: []
}
const mutations = {
    mergeOptions(state, payload) { // 合并选项
        state.options = {
            ...state.options,
            ...payload
        }
    },
    mergeBaseOptions(state, payload) { // 合并选项
        state.baseOptions = payload
    },
    loadthem(state, payload) {
        state.themes = payload
    }
}
const actions = {

}
const getters = {

}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}