import api from '@/api'
import Notification from '@/componentsEl/notification/index.js'

const state = {
    personMsg: {},
    storeData: {},
    staffData: {
        records: [],
        totalCount: 0
    }
};
const mutations = {
    setPersonData(state, payload) {
        if (payload.code === 200) {
            state.personMsg = payload.data;
        }
    },
    setStoreData(state, payload) {
        if (payload.code === 200) {
            state.storeData = payload.data;
        }
    },
    setStaffData(state, payload) {
        if (payload.code === 200) {
            let list = [];
            if(payload.data.records === undefined) {
                payload.data.records = payload.data.list;
            }
            if(payload.data.records !== undefined) {
                payload.data.records.forEach((item, index) => {
                    if (item.roleCode !== 'MERCHANT_STORE_OWNER') {
                        item.id = item.relateId;
                        item.name = item.userName;
                        item.imgUrl = item.photoUrl;
                        item.authenticationed = item.certificationStatus;
                        item.receipted = item.authReceiveOrder;
                        item.time = item.joinTime;
                        list.push(item);
                    }
                });
            }
            payload.data.records = list;
            state.staffData = payload.data;
        }
    }
};
const actions = {
    async get_person_msg({ commit }, obj) {
        let result = await api.teamSetting.get_person_msg(obj);
        commit('setPersonData', result);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    },
    async get_team_comment({ commit }, obj) {
        let result = await api.teamSetting.get_team_comment(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    },
    async get_store_msg({ commit }, obj) {
        let result = await api.teamSetting.get_store_msg(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        commit('setStoreData', result);
        return result
    },
    async get_authentication({ commit }, obj) {
        let result = await api.teamSetting.get_authentication(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    },
    async get_area({ commit }, obj) {
        let result = await api.settled.get_area(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    },
    async modify_store_msg({ commit }, obj) {
        let result = await api.teamSetting.modify_store_msg(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    },
    async get_store_user({ commit }, obj) {
        let result = await api.teamSetting.get_store_user(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        commit('setStaffData', result);
        return result
    },
    async get_store_user_page({ commit }, obj) {
        // obj.pageSize = obj.limit;
        // obj.pageNo = obj.start;
        // obj.limit = 1;
        let result = await api.teamSetting.get_store_user_page(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        commit('setStaffData', result);
        return result
    },
    async get_store_adduser({ commit }, obj) {
        let result = await api.teamSetting.get_store_adduser(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    },
    async add_store_user({ commit }, obj) {
        let result = await api.teamSetting.add_store_user(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    },
    async del_store_user({ commit }, obj) {
        let result = await api.teamSetting.del_store_user(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    },
    async deal_employee({ commit }, obj) {
        let result = await api.teamSetting.deal_employee(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    },
    async get_order_data({ commit }, obj) {
        let result = await api.teamSetting.get_order_data(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    },
    async set_employee_receive_order({ commit }, obj) {
        let result = await api.teamSetting.set_employee_receive_order(obj);
        // if (result.code !== 200 && result.code !== 5223) {
        //   Notification.error(result.message)
        // }
        return result
    }
};

const getters = {

};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}