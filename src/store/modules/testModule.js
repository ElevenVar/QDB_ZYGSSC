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
    async postTest({ commit }, obj) {
        let result = await api.test.postTest(obj) //
        commit('setData', result)
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