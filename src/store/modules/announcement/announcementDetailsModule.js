import api from '@/api'

const state = {
    tableData: {
        total: 0,
        accounts: [],
    },
}
const mutations = {
    setData(state, payload) {
        if (payload.data) {
            state.tableData = payload.data
        }
    },
}
const actions = {
    //平台公告详情
    async query_inventory_id({ commit }, obj) {
        let result = await api.announcement.query_inventory_id(obj)
        return result
    },
}
const getters = {}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}