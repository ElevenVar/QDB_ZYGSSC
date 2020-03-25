import api from "@/api";

const state = {};
const mutations = {};
const actions = {
  async genera_tetemplate({ commit }, obj) {
    const result = await api.common.genera_tetemplate(obj);
    return result;
  }
};
const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
