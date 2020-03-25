/*
 * 前端状态管理 vuex
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 *  当前为主vuex
 *  自动引入modules结尾的 子vuex
 */

/* eslint-disable */

import Vue from "vue";
import Vuex from "vuex";

import api from "@/api";
import i18nPlugin from "./plugins/i18n";
import config from "@/service/config";
import {
  default as router,
  baseRouter,
  appRouters,
  resetRouter
} from "@/router";
import * as types from "./types";
import lodash from "lodash";
// import fiveStrokesLib from '@/../static/vendor/fiveStrokes/fiveStrokes'
const files = require.context(".", true, /Module\.js$/);
const modules = {};

/* 自动加载子vuex  以Module结尾的文件 */
try {
  files.keys().forEach(path => {
    if (path.indexOf("Module.js") !== -1) {
      const modu = files(path).default;
      if (modu) {
        const name = path
          .split("/")
          .pop()
          .replace(/(\.\/|\.js)/g, "");
        modules[name] = modu;
      } else {
        console.error(`${path.split("/").pop()}modules加载失败`);
      }
    }
  });
} catch (e) {
  console.error("store加载失败", e);
}

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    routeParmsTitleVal: "",
    transtionOrderModel: 1, //办理中订单模式
    finishOrderModel: 1, //办理中订单模式
    workBrenchTaskStageId: "", //顶部任务选定阶段id
    workBrenchTaskTaskId: "", //顶部任务选定任务id
    transactionStageId: "", //办理阶段id
    transactionTaskId: "", //办理任务id
    newsRulesData: {}, //消息规则数据
    storeInfoData: {}, //液态信息
    /* 用户请求数据 */
    tokenId: "", //登陆成功返回的tokenId
    userId: "", //登陆成功返回的userId
    personMsg: {},
    lang: "",
    token: "", // 密钥
    account: {},
    baseUrl: config.baseUrl,
    /* 程序,当前状态 */
    loadingState: false, // 全局loading状态
    tabs: [], // 当前的tabs
    realRoutes: [], // 真是需要展现的路由
    activeRoute: {}, // 当前激活的路由
    notCachePage: "", // 不缓存的页面
    recordRoute: [],
    parentName: "",
    notShowbreadcrumb: [
      "allOrder",
      "workbench",
      "case",
      "brabBill",
      "receive",
      "transaction",
      "finish",
      "chargeback",
      "personalSetting",
      "notice",
      "task",
      "grab",
      "teamSetting",
      "inviteNotice"
    ], // 不需要标签页的页面
    notShowFooter: [
      "allOrder",
      "brabBill",
      "receive",
      "transaction",
      "finish",
      "chargeback",
      "transactionTask"
    ], //不需要页面公共底部
    orderDetailAuthority: [
      "transactionTask",
      "transactionDocument",
      "transactionBill",
      "transactionDynamic"
    ], //订单操作权限
    merchant: {}, // 商户信息
    choosedTeam: {}, //选择团队id
    transactionItem: {}, // 缓存的办理中的数据。 （跳转办理中详情需要的）
    //请求头信息
    sysCode: "qds_888", //系统授权码测试D环境的
    nonce: "", //请求id（随机字符串，不可重复）
    XReqClient: "", //请求客户端
    XReqYT: "", //当前操作业态
    XAuthToken: "", //用户Token
    XReqUserId: "", //用户id
    XReqArea: "", //城市code
    ContentLength: "", //请求body长度
    allRemindTimesData: [], //设置查询提醒时间总数据

    //生产订单状态
    orderStatus: {
      QDS_SC_ORDER_HANDLE: "QDS_SC_ORDER_STATUS_CODE01", //办理中
      QDS_SC_ORDER_REVIEW_REFUND: "QDS_SC_ORDER_STATUS_CODE02", //退单待审核
      QDS_SC_ORDER_REVIEW_FINISH: "QDS_SC_ORDER_STATUS_CODE03", //完结待审核
      QDS_SC_ORDER_FINISH: "QDS_SC_ORDER_STATUS_CODE04", //已完结
      QDS_SC_ORDER_REFUND: "QDS_SC_ORDER_STATUS_CODE05", //已退单
      QDS_SC_ORDER_GENERATED: "QDS_SC_ORDER_STATUS_CODE06", //生产订单生成中
      QDS_SC_ORDER_WAIT_RECEPTION: "QDS_SC_ORDER_STATUS_CODE07", //待接收
      QDS_SC_ORDER_RETURN: "QDS_SC_ORDER_STATUS_CODE08", //已退回
      QDS_SC_ORDER_WAIT_ASSIGN: "QDS_SC_ORDER_STATUS_CODE09", //待分配
      QDS_SC_ORDER_WAIT_GRAB: "QDS_SC_ORDER_STATUS_CODE25", //待抢单
      QDS_SC_ORDER_SUSPEND: "QDS_SC_ORDER_STATUS_CODE26", //暂停
      QDS_SC_ORDER_SUSPEND_AWAIT: "QDS_SC_ORDER_STATUS_CODE27", //暂停待审核
      QDS_SC_ORDER_BACK_REJECT: "QDS_SC_ORDER_STATUS_CODE19", //退单驳回
      QDS_SC_ORDER_END_REJECT: "QDS_SC_ORDER_STATUS_CODE29" //完结驳回
    },
    //生产订单状态名称
    orderStatusName: {
      QDS_SC_ORDER_STATUS_CODE01: "办理中",
      QDS_SC_ORDER_STATUS_CODE02: "退单待审核",
      QDS_SC_ORDER_STATUS_CODE03: "完结待审核",
      QDS_SC_ORDER_STATUS_CODE04: "已完结",
      QDS_SC_ORDER_STATUS_CODE05: "已退单",
      QDS_SC_ORDER_STATUS_CODE06: "生产订单生成中",
      QDS_SC_ORDER_STATUS_CODE07: "待接收",
      QDS_SC_ORDER_STATUS_CODE08: "已退回",
      QDS_SC_ORDER_STATUS_CODE09: "待分配",
      QDS_SC_ORDER_STATUS_CODE26: "暂停",
      QDS_SC_ORDER_STATUS_CODE27: "暂停待审核",
      QDS_SC_ORDER_STATUS_CODE28: "退单驳回",
      QDS_SC_ORDER_STATUS_CODE29: "结项驳回"
    },
    //质检任务返回名称
    storeQalNspectionsStatus: {
      // NODE_QUALITY_AWAIT: "待质检",
      NODE_QUALITY_REVIEW: "待质检",
      NODE_QUALITY_COMPLETE: "质检已通过",
      NODE_QUALITY_REFUSE: "质检未通过"
    },

    //任务订单状态
    taskStatusCodes: {
      TOTAL_TASK: "TOTAL_TASK", //全部的code
      ZYGSSC_TASK_1: "ZYGSSC_TASK_1", //即将到期
      ZYGSSC_TASK_6: "ZYGSSC_TASK_6", //已超期
      ZYGSSC_TASK_3: "ZYGSSC_TASK_3", //已暂停
      ZYGSSC_TASK_5: "ZYGSSC_TASK_5", //待处理
      MY_TODO: "MY_TODO", //我的待办
      MY_DISTRIBUTION: "MY_DISTRIBUTION", //我分配的
      UN_COMPLETE_TASK: "UN_COMPLETE_TASK", //未完成
      COMPLETE_TASK: "COMPLETE_TASK" //已完成
    },
    //消息类型
    msgTypes: {
      QDS_MSG_TYPE_ORDER: "QDS_MSG_TYPE_ORDER", //订单消息
      QDS_MSG_TYPE_TRADE: "QDS_MSG_TYPE_TRADE", //交易消息
      QDS_MSG_TYPE_SYSTEM: "QDS_MSG_TYPE_SYSTEM" //系统消息
    },
    //消息通知图标icon状态
    iconList: {
      add_case: "add_case", //新增案件任务
      add_task: "add_task", //添加分配任务
      as_remind: "as_remind", //任务截止时间提醒
      cancel_deadline: "cancel_deadline", //取消截止时间
      cancel_distribution: "cancel_distribution", //取消分配任务
      cancel_order: "cancel_order", //撤销订单申请
      cancel_order_finish: "cancel_order_finish", //撤销订单结案申请
      case_order: "case_order", //订单结案提醒
      delete_remark: "delete_remark", //删除备注
      delete_task: "delete_task", //任务删除提醒
      expiration_date: "expiration_date", //截止时间到期前
      finish_task: "finish_task", //任务完成提醒
      invita_team: "invita_team", //团队邀请通知
      out_team: "out_team", //脱离团队通知
      personal_setting: "personal_setting", //个人设置
      reback_order: "reback_order", //发起退单/结案申请
      receive_order: "receive_order", //接单
      refuse_order: "refuse_order", //订单退单提醒
      remove_project: "remove_project", //项目「主办/协办」移除
      save_update: "save_update", //保存变更/备注
      sys_distribution: "sys_distribution", //系统分单成功
      task_changes: "task_changes", //任务变更提醒
      task_comments: "task_comments", //任务评论提醒
      task_restart: "task_restart", //任务重启提醒
      time_setting: "time_setting", //完成截止时间设置
      track_case: "track_case", //跟案备注提醒
      update_project: "update_project", //项目「主办/协办」变更
      update_project_officer: "update_project_officer", //项目负责人变更
      unknown_inform: "unknown_inform", //未知消息
      noicon: "noicon", //无数据占位
      new_refuse_order: "new_refuse_order", //拒收图标
      submit_pause: "submit_pause", //提交订单暂停申请
      pause_not_pass: "pause_not_pass", //暂停审核未通过时
      pause_pass: "pause_pass", //暂停审核通过时
      over_not_pass: "over_not_pass", //完结审核未通过时
      withdrawal_fail: "withdrawal_fail", //退单审核失败
      parts_task_not_submit: "parts_task_not_submit", //非标件未提交任务方案/标件未选择任务模版
      process_not_pass: "process_not_pass", //流程方案审核未通过
      process_pass: "process_pass", //流程方案审核通过
      pause_task: "pause_task" //暂停生产任务审核
    }
  },

  getters: {
    cachePage(state) {
      // 当前需要缓存的页面
      let temp = lodash.cloneDeep(state.tabs);
      return (
        (temp.length &&
          temp
            .map(item => {
              item.name =
                item.name.substring(0, 1).toUpperCase() +
                item.name.substring(1);
              return item.name;
            })
            .filter(item => item !== state.notCachePage)) ||
        []
      );
    },
    grabId() {
      return sessionStorage.getItem("grabId");
    }
  },
  mutations: {
    [types.SET_LANGUAGE](state, payload) {
      state.lang = payload + "";
    },
    mergeToken(state, payload) {
      state.token = payload;
    },
    mergeAccount(state, payload) {
      // 合并账号
      state.account = payload;
    },
    setParentName(state, payload) {
      // 设置当前父元素的名字
      state.parentName = payload;
    },
    setRealRoutes(state, payload) {
      // 真是需要展现的路由
      state.realRoutes = payload;
    },
    setActiveRoute(state, payload) {
      // 当前激活的路由
      state.activeRoute = payload;
    },
    setStoreRoute(state, payload) {
      if (Object.keys(payload).length) {
        localStorage.setItem("activeRoute", JSON.stringify(payload));
      }
    },
    setRoute(state, payload) {
      let routeArr = lodash.cloneDeep(payload);
      let routerTemp = [];
      routeArr.forEach(element => {
        element.children &&
          element.children.length &&
          element.children.forEach(element => {
            routerTemp.push(element);
          });
      });
      state.routers = routerTemp;
    },

    setRecordRoute(state, payload) {
      //添加路由记录
      state.recordRoute = payload;
    },
    setMerchant(state, payload) {
      // 合并商户信息
      state.merchant = payload;
    },
    setChoosedTeam(state, payload) {
      // 设置液态信息
      state.choosedTeam = payload;
    },
    //退出登录
    logout(state, payload) {
      state.tokenId = "";
      state.XAuthToken = "";
      state.userId = "";
      state.XReqUserId = "";
      localStorage.removeItem("loginData");
      localStorage.removeItem("activeRoute");
      localStorage.removeItem("storeInfoData");
      localStorage.removeItem("storeTabName");
      localStorage.removeItem("transactionItem"); // 清除办理中的缓存
      sessionStorage.clear();
    },
    //储存personMsg
    setStoreInfoData(state, payload) {
      state.storeInfoData = payload;
      state.tokenId = payload.tokenId;
      state.XAuthToken = payload.tokenId;
      state.userId = payload.userId;
      state.XReqUserId = payload.userId;
      localStorage.setItem("storeInfoData", JSON.stringify(payload));
      localStorage.setItem("loginData", JSON.stringify(payload));
    },
    // 团队tabs标签单独处理
    setTeamSettingTab(state, payload) {
      localStorage.setItem("storeTabName", JSON.stringify(payload));
    },
    // 存储办理中的订单数据
    setTransactionItem(state, payload) {
      state.transactionItem = payload;
      localStorage.setItem("transactionItem", JSON.stringify(payload));
    },
    //储存待抢单详情页id
    setGrabId(state, payload) {
      sessionStorage.setItem("grabId", payload);
    },
    //设置查询提醒时间总数据
    setRemindTimes(state, payload) {
      console.log(payload, "查询提交时间总数接口--------------");
      state.allRemindTimesData = payload;
    },
    //消息跳转规则数据
    setNewsRulesData(state, payload) {
      console.log(JSON.parse(JSON.stringify(payload)), "点击消息缓存的数据--");
      state.newsRulesData = payload;
      sessionStorage.setItem("newsRulesData", JSON.stringify(payload));
    },
    //设置顶部任务的阶段id
    setWorkBrenchTaskStageId(state, payload) {
      state.workBrenchTaskStageId = payload;
      sessionStorage.setItem("workBrenchTaskStageId", payload);
    },
    //设置顶部的任务任务id
    setWorkBrenchTaskTaskId(state, payload) {
      state.workBrenchTaskTaskId = payload;
      sessionStorage.setItem("workBrenchTaskTaskId", payload);
    },
    //设置办理阶段id
    setTransactionStageId(state, payload) {
      console.log(
        JSON.parse(JSON.stringify(payload)),
        "点击消息缓存的阶段id--"
      );
      state.transactionStageId = payload;
      sessionStorage.setItem("transactionStageId", payload);
    },
    //设置办理任务id
    setTransactionTaskId(state, payload) {
      console.log(
        JSON.parse(JSON.stringify(payload)),
        "点击消息缓存的任务id--"
      );
      state.transactionTaskId = payload;
      sessionStorage.setItem("transactionTaskId", payload);
    },
    //记录办理中订单是产品模式还是订单模式
    setTranstionOrderModel(state, payload) {
      console.log(payload, "记录办理中订单是产品模式还是订单模式++++");
      state.transtionOrderModel = payload;
      sessionStorage.setItem("transtionOrderModel", payload);
    },
    //记录完结订单是产品模式还是订单模式
    setFinishOrderModel(state, payload) {
      console.log(payload, "记录完结订单是产品模式还是订单模式++++");
      state.finishOrderModel = payload;
      sessionStorage.setItem("finishOrderModel", payload);
    },
    //改变路由title
    setRouteParmsTitle(state, payload) {
      state.routeParmsTitleVal = payload;
    }
  },
  actions: {
    // 初始化路由
    async initRouters({ state, commit }) {
      let routers = lodash.cloneDeep(appRouters);

      commit("setRoute", routers); // 这里要做权限控制。 存储和添加路由都要根据权限来添加
      let arr = [];
      routers.forEach(item => {
        item.children &&
          item.children.length &&
          item.children.forEach(element => {
            if (element.component) {
              arr.push(element);
            }
            if (element.children && element.children.length) {
              element.children.forEach(el => {
                if (!el.component) {
                  el.children &&
                    el.children.forEach(em => {
                      arr.push(em);
                    });
                } else {
                  arr.push(el);
                }
              });
            }
          });
      });
      resetRouter();
      // 添加重定向路由
      baseRouter.children = arr;
      commit("setRealRoutes", arr);
      router.addRoutes([
        baseRouter,
        {
          path: "*",
          redirect: {
            name: "workbench"
          }
        }
      ]);
    },
    // 跳转路由
    ruoterJump({ state, commit }, obj) {
      if (lodash.get(obj, "params")) {
        router.push({
          // 跳转需要传参的。
          name: obj.name,
          params: lodash.get(obj, "params")
        });
      } else {
        router.push({
          // 跳转不需要传参的。
          name: obj.name
        });
      }

      let _router = recursion(
        {
          children: state.realRoutes
        },
        obj
      );

      if (
        state.realRoutes.some(el => {
          // 判断是不是真实路由里面的
          return el.name == obj.name;
        })
      ) {
        let activeRoute = state.realRoutes.find(item => {
          return item.name == obj.name;
        });
        commit("setRecordRoute", lodash.uniq([...[activeRoute], ..._router])); //
        commit("setActiveRoute", activeRoute); // 设置当前激活的路由
        commit("setStoreRoute", activeRoute); //  设置当前被被缓存的路由数据
      } else {
        let activeRoute = {};
        state.realRoutes.forEach(item => {
          item.children.forEach(el => {
            if (el.name === obj.name) {
              activeRoute = item;
              commit("setStoreRoute", el); // 设置当前被被缓存的路由数据
            }
            el.children.forEach(sub => {
              if (sub.name === obj.name) {
                activeRoute = item;
                commit("setStoreRoute", sub); // 设置当前被被缓存的路由数据
              }
              sub.children.forEach(v => {
                if (v.name === obj.name) {
                  activeRoute = item;
                  commit("setStoreRoute", v); // 设置当前被被缓存的路由数据
                }
              });
            });
          });
        });
        commit("setRecordRoute", lodash.uniq([...[activeRoute], ..._router])); //
        commit("setActiveRoute", activeRoute); // 设置当前激活的路由
      }
    },
    setGrabId({ commit }, obj) {
      commit("setGrabId", obj);
    },
    //清空token
    clearToken({ state, commit }) {
      state.token = "";
    },
    async postLogin({ commit }, obj) {
      let result = await api.login.postLogin(obj); //
      return result;
    },
    //获取验证码
    async get_code({ commit }, obj) {
      let result = await api.login.get_code(obj); //
      // commit('setData', result);
      return result;
    },
    //登录
    async login({ commit, dispatch }, obj) {
      let result = await api.login.login(obj);
      if (result.code === 200) {
        await dispatch("updatePersonMsg", result.data.userId);
      }
      return result;
    },
    // 更新用户信息
    async updatePersonMsg({ commit, dispatch }, obj) {
      let res = await api.teamSetting.get_person_msg({
        userId: obj
      });
      if (res.code === 200) {
        if (!res.data.storeId && res.data.otherStore) {
          res.data.storeId = res.data.otherStore[0].storeId;
        }
        console.log("updatePersonMsgSuccess");
      }
      commit("setStoreInfoData", res);
      sessionStorage.setItem("globalPersonMsg", JSON.stringify(res.data));
      return res;
    },
    //注册
    async register({ commit }, obj) {
      let result = await api.login.register(obj); //
      // commit('setData', result);
      return result;
    },
    //修改密码
    async modify_pwd({ commit }, obj) {
      let result = await api.login.modify_pwd(obj); //
      // commit('setData', result);
      return result;
    },
    //退出登录
    async logout({ commit, state }, obj) {
      // let result = await api.login.logout({
      //   tokenId: state.tokenId
      // });
      commit("logout");
      // return result;
    }
  },
  modules,
  plugins: [i18nPlugin],
  strict: false // 关闭vuex 的严格模式
  // strict: process.env.NODE_ENV === 'development'
});

function recursion(obj, active) {
  let arr = [];
  obj.children.forEach(item => {
    if (item.name === active.name) {
      if (lodash.get(obj, "name")) {
        arr.push(obj);
      }
      arr.push(item);
    } else {
      if (item.children && item.children.length) {
        arr = [...arr, ...recursion(item, active)];
      }
    }
  });
  return arr;
}
export default store;
