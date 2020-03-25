/*
 * 案例模块
 * @author zjm
 * @date 2019年12月02日
 */
import api from '@/api'
const state = {
  userVerifyInfo: {},
  userBasicInfo: {},
  fieldList: []
}
const mutations = {
  mergeUserBasicInfo(state, payload) {
    state.userBasicInfo = payload
  },
  mergeUserVerifyInfo(state, payload) {
    state.userVerifyInfo = payload
  },
  mergeFieldsList(state, payload) {
    state.fieldList = payload
  }
}
const actions = {
  async query_userinfo_setup({
    commit
  }, obj) {
    const result = await api.personalSetting.query_userinfo_setup(obj)
    commit('mergeUserBasicInfo', result.data)
    return result
  },
  async query_usercard_detail({
    commit
  }, obj) {
    const result = await api.personalSetting.query_usercard_detail(obj)
    return result
  },
  async query_verify_info({
    commit
  }, obj) {
    const result = await api.personalSetting.query_verify_info(obj)
    commit('mergeUserVerifyInfo', result.data)
    return result
  },
  async verify_realname({
    commit
  }, obj) {
    const result = await api.personalSetting.verify_realname(obj)
    return result
  },
  async get_card_file_id({
    commit
  }, obj) {
    const result = await api.personalSetting.get_card_file_id(obj)
    return result
  },
  async identify_IDCard({
    commit
  }, obj) {
    const result = await api.personalSetting.identify_IDCard(obj)
    return result
  },
  async get_tree_book_list({
    commit
  }, obj) {
    const result = await api.personalSetting.get_tree_book_list(obj)
    commit('mergeFieldsList', result.data)
    return result
  },
  async add_or_editor({
    commit
  }, obj) {
    const result = await api.personalSetting.add_or_editor(obj)
    return result
  },
  async get_normal_book_list({
    commit
  }, obj) {
    const result = await api.personalSetting.get_normal_book_list(obj)
    return result
  },
  async get_company_city({
    commit
  }, obj) {
    const result = await api.personalSetting.get_company_city(obj)
    return result
  },
  async change_phone({
    commit
  }, obj) {
    const result = await api.personalSetting.change_phone(obj)
    return result
  },
  async send_sms({
    commit
  }, obj) {
    const result = await api.personalSetting.send_sms(obj)
    return result
  },
  async verify_Code({
    commit
  }, obj) {
    const result = await api.personalSetting.verify_Code(obj)
    return result
  },
  async change_pwd({
    commit
  }, obj) {
    const result = await api.personalSetting.change_pwd(obj)
    return result
  },
  async get_photo_file_id({
    commit
  }, obj) {
    const result = await api.personalSetting.get_photo_file_id(obj)
    return result
  },
  async ref_case_list({
    commit
  }, obj) {
    const result = await api.personalSetting.ref_case_list(obj)
    return result
  },
  async ref_caseids_list({
    commit
  }, obj) {
    const result = await api.personalSetting.ref_caseids_list(obj)
    return result
  },
  async publish({
    commit
  }, obj) {
    const result = await api.personalSetting.publish(obj)
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
