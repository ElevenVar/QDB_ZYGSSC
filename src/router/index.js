/*
 * route 引用
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 * @defaultRoutes 默认的路由
 * @baseRouter    基础路由
 * @appRouters    动态自动引入路由
 * @resetRouter   重新设置路由的方法
 */
import Vue from "vue";
import Router from "vue-router";

// 惰性加载
const StartPage = r =>
  require.ensure([], () => r(require("@/views/main/startPage")), "startPage");

const Loading = r =>
  require.ensure([], () => r(require("@/views/main/index.vue")), "loading");

const login = r =>
  require.ensure([], () => r(require("@/views/main/login/login.vue")), "login");

const resetPassword = r =>
  require.ensure(
    [],
    () => r(require("@/views/main/login/forgetPassword/index.vue")),
    "resetPassword"
  );

const agreement = r =>
  require.ensure(
    [],
    () => r(require("@/views/main/login/agreement.vue")),
    "agreement"
  );

//个人认证占位图
// const personalAttestation = r =>
//     require.ensure([], () => r(require('@/views/main/attestation/personal.vue')), 'personalAttestation');
//
// //店铺认证占位图
// const storeAttestation = r =>
//     require.ensure([], () => r(require('@/views/main/attestation/store.vue')), 'storeAttestation');

Vue.use(Router);

const mainChildrenRouter = [];
const files = require.context("./modules", true, /\.js$/);

try {
  files.keys().forEach(path => {
    if (
      process.env.NODE_ENV === "production" &&
      path.indexOf("devguide") !== -1
    ) {
      return;
    }
    console.log(files(path).default, "工作台路由====");
    mainChildrenRouter.push(files(path).default);
  });
} catch (e) {
  console.error("router main children router加载失败", e);
}

// 默认路由
export const defaultRoutes = [
  {
    // loading页面
    path: "/loading",
    name: "loading",
    component: Loading,
    meta: {
      title: "loading"
    }
  },
  {
    // login页面
    path: "/login",
    name: "login",
    component: login,
    meta: {
      title: "login"
    }
  },
  {
    // forgetPassword页面
    path: "/resetPassword",
    name: "resetPassword",
    component: resetPassword,
    meta: {
      title: "resetPassword"
    }
  },
  {
    // agreement页面
    path: "/agreement",
    name: "agreement",
    component: agreement,
    meta: {
      title: "agreement"
    }
  }
];
// 基础页面
export const baseRouter = {
  path: "/startPage",
  name: "startPage",
  component: StartPage
};
// 需要显示在菜单的动态路由
export const appRouters = [...mainChildrenRouter];
const createRouter = () =>
  new Router({
    mode: "hash",
    // mode: "history",
    base: process.env.BASE_URL,
    routes: [...defaultRoutes]
  });

const router = createRouter();
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
