/*
 * 请求统一封装。
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 *
 * 注： 根据实际情况封装参数
 */

import axios from "axios";

/* eslint-disable */
import config from "./config";
import sign1 from "./sign1";
import * as lodash from "lodash";
import router from "../router";
import qs from "qs";
import Notification from "@/componentsEl/notification/index.js";
import store from "../store";

/* 生成不重复的uuid */
import uuid from "uuid";

// axios 配置
axios.defaults.timeout = 20000; // 请求超时事件 请求的发生时间，格式为时间戳毫秒级。取值为当前系统的GMT时间。
axios.defaults.baseURL = config.baseUrl; // 服务器地址
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
axios.interceptors.request.use(
  config => {
    // 根据类型 判断不同的contentType
    if (lodash.get(config, "isrmultipart")) {
      // 判断是multipart
      config.headers["Content-Type"] = "multipart/form-data";
    }
    if (lodash.get(config, "isrlencoded")) {
      // 判断是urlencoded
      config.headers["Content-Type"] =
        "application/x-www-form-urlencoded;charset=utf-8";
    }

    if (lodash.get(config, "isauthen")) {
      // 如果不需要验证 直接返回config
      return config;
    }

    if (lodash.get(config, "isloading")) {
      // 打开loading
      store.state.loadingState = true;
    }

    const data = {
      sysCode: store.state.sysCode || "", //系统授权码
      nonce: store.state.nonce || uuid.v4(), //请求id（随机字符串，不可重复）
      XReqClient: store.state.XReqClient || "PC_WEB", //请求客户端
      XReqYT: store.state.XReqYT || "BUS_YT_CYFZYJY", //当前操作业态
      XAuthToken: store.state.XAuthToken || "", //用户Token
      XReqUserId: store.state.XReqUserId || "", //用户id
      userName: {
        name:
          (store.state.storeInfoData.userName &&
            encodeURI(store.state.storeInfoData.userName)) ||
          "" //用户名
      },
      XReqArea: store.state.XReqArea || "", //城市code
      ContentLength: store.state.ContentLength || "" //请求body长度
    };
    config.headers["X-Req-YT"] = data.XReqYT; //当前操作业态 ===>是否必传（是） 法律业态：BUS_YT_FL
    config.headers["X-Auth-Token"] = data.XAuthToken; //用户Token。格式为 客户端标识 : token。 ===>是否必传（否 ）
    config.headers["X-Req-UserId"] = data.XReqUserId; //用户id。===>是否必传（否）
    config.headers["sysCode"] = data.sysCode; //系统授权码。   ===>是否必传（是）
    config.headers["time"] = new Date().getTime(); //请求的发生时间，格式为时间戳毫秒级。取值为当前系统的GMT时间。   ===>是否必传（是）
    config.headers["nonce"] = data.nonce; //请求id（随机字符串，不可重复）。===>是否必传（是）
    // config.headers['X-Req-Client'] = data.XReqClient; //请求客户端。===>是否必传（是）  PC网站端：PC_WEB，
    // config.headers['X-Req-Client'] = 'IOS';
    // config.headers['X-Req-Client'] = 'ANDROID';
    // config.headers['X-Req-Client'] = 'WECHAT_MINI';
    config.headers["X-Req-Client"] = "PC_WEB";
    if (lodash.get(config, "isXAuthToken")) {
      config.headers["X-Auth-Token"] = data.XAuthToken; //用户Token。格式为 客户端标识 : token。 ===>是否必传（否 ）
    }
    if (lodash.get(config, "isXReqUserId")) {
      config.headers["X-Req-UserId"] = data.XReqUserId; //用户id。===>是否必传（否）
    }
    if (lodash.get(config, "isXReqArea")) {
      config.headers["X-Req-Area"] = data.XReqArea; //城市code ===>是否必传（否）
    }
    if (lodash.get(config, "isContentLength")) {
      config.headers["Content-Length"] = data.ContentLength; //请求body长度，单位为Byte。===>是否必传（否）
    }
    if (lodash.get(config, "isXReqUserName")) {
      config.headers["X-Req-Content"] = JSON.stringify(data.userName); //自定义字段，当前登录用户名。===>是否必传（否）
    }
    let signData = {};
    if (config.method === "post") {
      signData = sign1.createSign(
        config.data,
        "qds_888",
        "55769c13-23f6-4c7c-a53e-ccb95fd67ac8"
      );
    } else if (config.method === "get") {
      signData = sign1.createGetSign(
        config.baseURL + config.url,
        "qds_888",
        "55769c13-23f6-4c7c-a53e-ccb95fd67ac8"
      );
    }
    config.headers["sign"] = signData.sign;
    config.headers["nonce"] = signData.nonce;
    config.headers["time"] = signData.time;

    return config;
  },
  err => {
    if (store.state.loadingState) {
      store.state.loadingState = false;
    }
    return Promise.reject(err);
  }
);
// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (store.state.loadingState) {
      store.state.loadingState = false;
    }
    if (
      response.data.code !== 200 &&
      response.data.code !== 5223 &&
      response.data.code !== 0 &&
      response.data.code !== 1 &&
      response.data.code !== 5002
    ) {
    }
    //登录过期拦截器
    if (response.data.code == 5223) {
      localStorage.removeItem("loginData");
      localStorage.removeItem("activeRoute");
      localStorage.removeItem("storeInfoData");
      localStorage.removeItem("storeTabName");
      sessionStorage.clear();
      sessionStorage.setItem("reload", "true");
      window.open(`${process.env.loginOutUrlL}`, "_self");
    }
    return response.data;
  },
  error => {
    if (error.response) {
      if (store.state.loadingState) {
        store.state.loadingState = false;
      }
      switch (error.response.status) {
        case 400:
          Notification.error({
            message: lodash.get(error, "response.data.message")
          });
          return null;
          break;
        case 401:
          Notification.error("登录失效");

          break;
        case 404:
          Notification.error("地址不存在");
          break;
        case 500:
          Notification.error({
            message: "服务器出错了"
          });
          break;
      }
    } else {
      Notification.error({
        message: error
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
