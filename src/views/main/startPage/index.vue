<template>
  <div class="startPage">
    <dgg-row :gutter="20" class="nav-box">
      <dgg-col :span="7" class="left-title">
        <img :src="defaultLogoImg" class="dgg-icon" @click="goHome" />
        <div class="nav-merchant-name">
          <span
            class="optionState"
            style="max-width:200px;"
            @click="optionStateClick"
          >
            {{ storeName ? storeName : "企大宝" }}
            <!-- {{ choosedTeam.title }} -->
            <ul
              v-Clickoutside="clickoutside"
              v-if="optionState"
              class="optionState-list"
            >
              <li
                v-for="(item, index) of optionList"
                :class="{ isactive: item.name === lawOffice.name }"
                :key="index"
                class="optionState-list-item"
                @click="optionItemClick(item, index)"
              >
                <span style="width:">{{ item.name }}</span>
                <dgg-icon
                  v-if="item.name === lawOffice.name"
                  icon-class="dgg-check"
                  svg-width="10px"
                  svg-height="30px"
                  class="optionState"
                  style="margin-left:10px"
                  @click.native="optionStateClick"
                />
              </li>
            </ul>
          </span>
          <!-- 第一期不切换液态 -->
          <dgg-icon
            :icon-class="optionState ? 'dgg-up-fill' : 'dgg-down-fill'"
            svg-width="10px"
            svg-height="23px"
            class="optionState"
            style="margin-left:10px"
            v-if="1 < 0"
            @click.native="optionStateClick"
          />
        </div>
      </dgg-col>

      <dgg-col :span="10">
        <el-menu
          :default-active="activeIndex"
          class="dgg-menu-main start-menu-main"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item
            v-for="(item, index) of menuList"
            :index="index + 1 + ''"
            :key="index"
            class="dgg-menu-main-item"
            @click="jump(item, index)"
          >
            {{ item.meta.title }}
          </el-menu-item>
        </el-menu>
      </dgg-col>
      <dgg-col :span="7" class="align-right nav-box-right">
        <dgg-switch
          v-model="isReceiveOrderData"
          :active-value="1"
          :inactive-value="0"
          active-text="接单"
          class="change-get-order-switch"
          @click.native="changeGetOrder(isReceiveOrder)"
          v-if="
            storeInfoData.storeId &&
              (storeInfoData.storeStatus == 0 || storeInfoData.storeStatus == 1)
          "
        />
        <dgg-badge
          v-if="!otherYtUser"
          :value="msgNumber"
          :max="99"
          class="ml-20 cursor-pointer"
        >
          <dgg-icon
            icon-class="icon_message"
            svg-width="20px"
            svg-height="20px"
            @click.native="ruoterJump({ name: 'notice' })"
          />
        </dgg-badge>
        <el-dropdown class="ml-20">
          <span class="el-dropdown-link cursor-pointer">
            <img
              :src="
                storeInfoData.avatarUrl ? storeInfoData.avatarUrl : defaultHead
              "
              class="user-image"
              alt="头像"
            />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="!otherYtUser && 1 < 0"
              @click.native="ruoterJump({ name: 'personalSetting' })"
              >个人设置</el-dropdown-item
            >
            <el-dropdown-item
              @click.native="ruoterJump({ name: 'teamSetting' })"
              v-if="
                storeInfoData.storeId &&
                  (storeInfoData.storeStatus == 0 ||
                    storeInfoData.storeStatus == 1)
              "
              >员工管理</el-dropdown-item
            >
            <el-dropdown-item @click.native="logoutEvent"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </dgg-col>
    </dgg-row>
    <el-breadcrumb
      v-if="!notShowbreadcrumb.includes(this.$route.name)"
      class="breadcrumb-style"
      separator="/"
    >
      <el-breadcrumb-item
        v-for="(item, index) of recordRoute"
        :class="{ activebreadcrumb: true }"
        :key="index"
        @click.native="breadcrumbClick(item, index !== recordRoute.length)"
      >
        {{ item && item.meta && item.meta.title }}
        <!-- {{ item.children && item.children.length === 0 && $route.params.title ? (' - ' + $route.params.title) :'' }} -->
        {{
          item.children && item.children.length === 0 && $route.params.title
            ? " - " + formatSouteParmsTitle
            : ""
        }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div
      :class="{
        'breadcrumb-page-keep': !notShowbreadcrumb.includes(this.$route.name)
      }"
      class="start-page-keep task-page-keep"
    >
      <keep-alive :include="activeRoute.name">
        <router-view />
      </keep-alive>
    </div>

    <!-- !notShowFooter.includes(this.$route.name) -->
    <!-- <div
      v-if="this.$route.name === 'workbench'"
      class="footer"
    >Copyright © {{ curYear }} 顶呱呱科技股份有限公司 版权所有 保留一切权利 备案号： 蜀ICP备19000843号-7</div> -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import clickoutside from "@/components/other/base/clickoutside";
import lodash from "lodash";
import userImgImport from "@/assets/images/dgg-logo.svg";
import logoImg from "@/assets/images/icon_logo.png";
import defaultLogoImg from "@/assets/images/default_icon_logo.png";
import { parse } from "path";

export default {
  name: "StartPage",
  components: {},
  directives: { clickoutside },
  data() {
    return {
      defaultHead: require("@/assets/images/image_head_default.png"),
      otherYtUser: false,
      optionState: false,
      lawOffice: {
        name: "顶泰律师事务所",
        list: [
          {
            id: 1,
            title: "四川顶泰律师事务所"
          },
          {
            id: 2,
            title: "广东顶匠律师事务所百货大楼分公司"
          },
          {
            id: 3,
            title: "浙江光彩律师事务所"
          },
          {
            id: 4,
            title: "重庆盈兴律师事务所"
          },
          {
            id: 5,
            title: "北京顶言律师事务所"
          },
          {
            id: 6,
            title: "广东冠杰律师事务所"
          },
          {
            id: 7,
            title: "湖北灵均律师事务所"
          }
        ]
      },
      optionList: [
        {
          name: "顶泰律师事务所",
          list: [
            {
              id: 1,
              title: "四川顶泰律师事务所"
            },
            {
              id: 2,
              title: "广东顶匠律师事务所百货大楼分公司"
            },
            {
              id: 3,
              title: "浙江光彩律师事务所"
            },
            {
              id: 4,
              title: "重庆盈兴律师事务所"
            },
            {
              id: 5,
              title: "北京顶言律师事务所"
            },
            {
              id: 6,
              title: "广东冠杰律师事务所"
            },
            {
              id: 7,
              title: "湖北灵均律师事务所"
            }
          ]
        },
        {
          name: "会计生产中心",
          list: [
            {
              id: 1,
              title: "会计一部"
            }
          ]
        }
      ],
      isReceiveOrder: 0,
      msgNumber: 0,
      curYear: new Date().getFullYear(),
      userImg:
        "http://b-ssl.duitang.com/uploads/item/201703/12/20170312182946_eiXHT.jpeg",
      avatarImg: require("@/assets/images/ls/ls3.jpg"),
      logoImgUrl: logoImg,
      defaultLogoImg: defaultLogoImg,
      popperOptions: {
        boundariesElement: "body"
      }
    };
  },
  computed: {
    ...mapState([
      "routers",
      "activeRoute",
      "recordRoute",
      "realRoutes",
      "notShowbreadcrumb",
      "notShowFooter",
      "choosedTeam",
      "userId", // 登陆成功返回的userId
      "storeInfoData", // 液态信息
      "storeInfoData",
      "routeParmsTitleVal"
    ]),
    ...mapState("startPageModule", ["storeName"]),
    ...mapGetters(["cachePage"]),
    formatSouteParmsTitle() {
      return this.routeParmsTitleVal
        ? this.routeParmsTitleVal
        : this.$route.params.title;
    },

    isReceiveOrderData: {
      get() {
        return this.isReceiveOrder;
      },
      set(val) {}
    },
    menuList() {
      return this.routers[0].children.filter(item => {
        return item.meta.show;
      });
    },

    activeIndex() {
      let _index = "";
      this.menuList.forEach((element, index) => {
        const _map = this.recordRoute.map(item => {
          return item.name;
        });
        if (_map.includes(element.name)) {
          _index = index + 1 + "";
        }
      });

      return _index;
    },
    showTips() {
      const val = this.orderNumber > 0;
      return val;
    }
  },
  watch: {
    //
  },
  async mounted() {
    console.log(
      JSON.parse(JSON.stringify(this.storeInfoData)),
      "用户信息11111111111111"
    );
    await this.get_un_read().then(data => {
      // 未读消息数量
      if (data.code === 200) {
        this.msgNumber = Number(data.data);
      }
    });
    await this.$nextTick(() => {
      this.initRquest();
    });
    this.$bus.$on("msgRefresh", this.refreshMsg);

    const _activeRoute = JSON.parse(localStorage.getItem("activeRoute"));
    const _storeTabName = JSON.parse(localStorage.getItem("storeTabName"));
    console.log(this.menuList, "this.menuListthis.menuListthis.menuList+++");
    // 默认会跳转
    if (_activeRoute && Object.keys(_activeRoute).length) {
      if (_activeRoute.name !== "teamSetting") {
        this.ruoterJump({ name: _activeRoute.name });
      } else {
        this.ruoterJump({
          name: _activeRoute.name,
          params: { name: _storeTabName }
        });
      }
    } else {
      if (this.menuList.length) {
        this.ruoterJump({ name: this.menuList[0].name });
      }
    }

    this.setMerchant(this.lawOffice);

    // 查询提醒时间总数据接口
    this.task_time_tree_book_list({
      code: "QDB_TEMPLATE_REMIND_TIME",
      type: 1,
      level: 1
    }).then(res => {
      if (res.code == 200 && res.data.length > 0) {
        this.setRemindTimes(res.data);
      }
    });
  },
  created() {
    //
  },
  beforeDestroy() {
    //
    this.$bus.$off("msgRefresh");
    this.$bus.$off("receiveRefresh");
  },
  methods: {
    ...mapActions(["ruoterJump", "logout", "updatePersonMsg"]),
    ...mapMutations(["setMerchant", "setRemindTimes"]),
    ...mapActions("startPageModule", [
      "get_store_yt_info", // 获取用户在店铺的业态信息（暂用于法律业态PC）
      "set_store_permission", // 开启接单服务
      "get_store_info_vo", // 消息通知数量
      "get_un_read", // 是否接单的状态
      "count_waiting_grab" // 是否接单的状态
    ]),
    ...mapActions("workbenchModule", [
      "query_user_data" //  用户名片接口
    ]),
    ...mapActions("workbenchTaskModule", [
      "task_time_tree_book_list" // 查询提醒时间总数据接口
    ]),
    async goHome() {
      await this.initRquest();
      this.ruoterJump({ name: "workbench" });
    },
    // 判断是否显示待抢订单
    hasOrderReceive(data) {
      if (data.storeId && data.roles.indexOf("MERCHANT_STORE_OWNER") != -1) {
        // 如果有店铺
        if (
          data.storeInfo.isReceiveOrder === 1 &&
          data.storeInfo.isReceiveOrderAdmin === 1
        ) {
          if (this.otherYtUser) {
            return false;
          }
          return true;
        } else {
          return false;
        }
      } else {
        // console.log(typeof data.otherStore == "object");
        // 如果没有店铺判断员工
        if (typeof data.otherStore === "object" && data.otherStore.length > 0) {
          if (data.otherStore[0].authReceiveOrder === 1) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    async logoutEvent() {
      const res = await this.logout();
      window.open(`${process.env.loginOutUrlL}`, "_self");
    },

    jump(item, index) {
      // 顶部菜单栏跳转
      if (item.name === this.activeRoute.name) {
        return;
      }
      if (item.component) {
        this.ruoterJump({ name: item.name });
      }
    },
    handleSelect() {
      // 菜单栏选择事件
      //
    },
    breadcrumbClick(item, can = true) {
      if (item.name === "order") {
        can && this.ruoterJump({ name: item.children[0].name }); // todo 这里是单独处理的订单页面 原因是订页面没有页面， 里面直接加的路由
      } else {
        can && this.ruoterJump({ name: item.name });
      }
    },
    optionStateClick() {
      return false; //专业生产不需要切换
      const evt = window.event;
      evt.preventDefault();
      evt.stopPropagation();
      this.optionState = !this.optionState;
    },
    optionItemClick(item, index) {
      // 顶部商户切换
      this.lawOffice = item;
      this.setMerchant(this.lawOffice);
    },
    clickoutside() {
      this.optionState = false;
    },
    // 开启接单服务
    changeGetOrder(state) {
      let confirmText;
      if (state === 0) {
        confirmText = "确认开启接单，开启后可前往待抢单列表接单哟~~";
      } else {
        confirmText = "确认关闭接单，关闭后将不会收到新的订单推送？";
      }

      this.$confirm(confirmText, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          const sendVal = this.isReceiveOrder == 0 ? 1 : 0;
          this.set_store_permission({
            storeId: this.storeInfoData.storeId,
            flag: 1,
            val: sendVal, // 0：关闭接单 1：开启接单；其他值无效
            source: "client",
            currentUserId: this.userId
          }).then(res => {
            if (res.code == 200) {
              this.isReceiveOrder = this.isReceiveOrder == 0 ? 1 : 0;
              this.$message({
                type: "success",
                message: res.message
              });
            } else {
              // 不成功弹窗
              this.$message({
                type: "warning",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          // 取消接单弹窗操作
          return;
        });
    },
    // 需要默认请求的接口 // 不加await 让他自己请求
    async initRquest() {
      if (this.storeInfoData && this.storeInfoData.storeId) {
        await this.get_store_info_vo({
          storeId: this.storeInfoData.storeId
        }).then(
          // 状态
          data => {
            if (data.code === 200) {
              this.isReceiveOrder = Number(data.data.isReceiveOrder);
            }
          }
        );
      }
    },
    refreshMsg(val) {
      this.msgNumber = Number(val);
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/preset.less";

.startPage {
  margin: auto;
  width: 1180px;
  height: calc(100% - 36px);

  .breadcrumb-style {
    margin-left: 30px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }

  .cursor-pointer {
    cursor: pointer;
    margin: 5px 0 0;
    .dgg-icon {
      &:hover,
      &:focus,
      &:active {
        color: #10bbb8;
      }
    }
  }

  .ml-20 {
    margin-left: 20px;
  }

  .nav-box {
    display: flex;
    align-items: center;
    height: 80px;

    .left-title {
      display: flex;
      align-items: center;
      color: #121e3a;
      font-size: 16px;
      font-weight: bold;

      .dgg-icon {
        width: 40px;
        height: 41px;
        margin-right: 12px;
        cursor: pointer;
      }
    }
    .nav-box-right {
      .dgg-icon {
        color: #666873;
        &:hover,
        &:focus {
          color: @main !important;
        }
      }
    }

    .law-icon {
      color: #324063;
    }

    .user-image {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .el-switch__label {
      span {
        font-size: 14px;
      }
    }

    .dgg-menu-main.start-menu-main {
      border: none !important;
      background: none !important;
      display: flex;
      align-items: center;
      justify-content: center;

      .el-menu-item {
        font-size: 14px;
        color: #666873 !important;
        border: 0;

        &.is-active {
          font-weight: bold;
          color: #19233c !important;
          background: none !important;
        }

        &:hover,
        &:focus {
          background: unset !important;
        }

        &:not(.is-active) {
          &:hover,
          &:focus {
            color: @main !important;
          }
        }
      }
    }
  }

  .start-page-keep {
    position: relative;
    width: 100%;
    border-radius: 6px;
    min-height: calc(~"100% - 80px");
    &.breadcrumb-page-keep {
      height: calc(100% - 140px);
    }

    .el-table {
      th {
        > .cell {
          color: #666873;
          font-weight: 400;
        }
      }

      td,
      th.is-leaf {
        border-color: #edeff0;
      }
    }
  }

  .footer {
    width: 100%;
    height: 90px;
    bottom: 0;
    font-size: 13px;
    line-height: 90px;
    text-align: center;
    color: #9398a1;
  }

  .activebreadcrumb {
    > span {
      cursor: pointer;
      font-size: 14px;
      font-weight: 400;
      color: rgba(147, 152, 161, 1);
    }
  }

  .activebreadcrumb:hover {
    > span {
      color: @main;
      cursor: pointer;
    }
  }

  .nav-merchant-name {
    position: relative;
    display: flex;
    align-items: center;
    .optionState {
      // cursor: pointer;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: inline-block;

      .optionState-list {
        position: absolute;
        top: 30px;
        z-index: 100;
        max-height: 240px;
        overflow-y: auto;

        .optionState-list-item {
          width: 220px;
          height: 30px;
          background: #fff;
          padding: 0 15px;
          overflow: hidden;
          line-height: 30px;
          font-size: 14px;
          font-weight: 400;

          > span {
            width: 165px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            display: inline-block;
          }
        }

        &.isactive {
          color: @main;
        }

        .optionState-list-item:hover {
          background: rgba(245, 247, 250, 1);
        }
      }
    }

    .isactive {
      color: @main;
    }
  }
}
.change-get-order-switch {
  /deep/.el-switch__core,
  /deep/.el-switch__label {
    cursor: pointer !important;
  }
  &.is-disabled.is-checked {
    .el-switch__core {
      background-color: #10bbb8 !important;
      border-color: #10bbb8 !important;
      color: #10bbb8;
    }
  }
}
</style>
