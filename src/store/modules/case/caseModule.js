/*
 * 案例模块
 * @author zjm
 * @date 2019年12月02日
 */
import api from '@/api'
import lodash from 'lodash'
const state = {
  caseList: {},
  caseDetailPage: {},
  originalDetail: {}
}
const mutations = {
  mergeCaseList(state, payload) {
    state.caseList = payload
  },
  mergeCasePreview(state, payload) {
    state.originalDetail = lodash.cloneDeep(payload)
  },
  mergePageCasePreview(state, payload) {
    state.caseDetailPage = lodash.cloneDeep(payload)
  }
}
const actions = {
  async case_query_list({
    commit
  }, obj) {
    const result = await api.case.case_query_list(obj)
    commit('mergeCaseList', result.data)
    return result
  },
  async case_detail({
    commit
  }, obj) {
    const result = await api.case.case_detail(obj)
    commit('mergeCasePreview', result.data)
    return result
  },
  async case_edit_detail({
    commit
  }, obj) {
    const result = await api.case.case_edit_detail(obj)
    return result
  },
  async case_center_detail({
    commit
  }, obj) {
    const result = await api.case.case_center_detail(obj)
    return result
  },
  async case_edite({
    commit
  }, obj) {
    const result = await api.case.case_edite(obj)
    return result
  },
  async case_del({
    commit
  }, obj) {
    const result = await api.case.case_del(obj)
    return result
  },
  async case_revoke({
    commit
  }, obj) {
    const result = await api.case.case_revoke(obj)
    return result
  },
  async case_publish({
    commit
  }, obj) {
    const result = await api.case.case_publish(obj)
    return result
  },
  async add_lable({
    commit
  }, obj) {
    const result = await api.case.add_lable(obj)
    return result
  },
  async publish_two({ commit }, obj) {
    const result = await api.case.publish_two(obj)
    return result
  },
  async regenerate({ commit }, obj) {
    const result = await api.case.regenerate(obj)
    return result
  }
}
const getters = {}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
