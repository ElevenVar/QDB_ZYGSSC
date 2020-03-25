<template>
  <!--  工作台 -->
  <div class="workbench">
    <div v-show="$route.name === 'workbench'">
      <!-- 头部导航 -->
      <dgg-row class="work-top-nav" v-if="1 < 0">
        <div class="team-name-list">
          <dgg-button
            v-for="(team, index) in merchant.list"
            :key="index"
            :class="{ activeTeam: team.id === choosedTeam.id }"
            class="list-button"
            @click="changeTeam(team, index)"
            >{{ team.title }}
          </dgg-button>
        </div>

        <dgg-popover
          v-if="merchant.list.length > 3"
          placement="bottom"
          v-model="showTeamSurplus"
          width="220"
          popper-class="open-team-surplus"
          trigger="click"
        >
          <dgg-button
            slot="reference"
            class="admin-team drop-down"
            :class="{ active: choosedTeam.id > 3 }"
          >
            <dgg-icon
              icon-class="icon_dropdown"
              class="icon_dropdown"
              svg-width="8px"
              svg-height="7px"
            />
          </dgg-button>

          <!-- 切换团队显示 -->
          <ul class="surplus-team-lists">
            <li
              v-for="(item, index) in merchant.list.slice(3)"
              :key="index"
              :class="{ 'active-team': item.id === choosedTeam.id }"
              @click="changeTeam(item, index)"
            >
              <p>{{ item.title }}</p>
              <dgg-icon
                icon-class="icon_select"
                svg-width="13PX"
                svg-height="12px"
              />
            </li>
          </ul>
        </dgg-popover>
        <!-- <dgg-button class="admin-team">管理我的团队</dgg-button> -->
        <div class="manage-team">
          <dgg-button
            class="admin-team"
            @click="manageTeamState = !manageTeamState"
            >管理我的团队
          </dgg-button>
          <div v-if="manageTeamState" class="manage-team-all">
            <div class="manage-team-head">
              <div class="manage-team-title">
                <dgg-icon
                  icon-class="mange-team"
                  svg-width="36PX"
                  svg-height="55px"
                />
              </div>

              <div class="manage-team-word">
                <div
                  style="height:30px;line-height:40px;color:#19233C;font-weight:600;"
                >
                  管理我的团队
                </div>
                <div
                  style="height:30px;line-height:15px;font-size:12px;color:rgba(102,104,115,1);font-weight:400;"
                >
                  上下拖动可对团队进行排序
                </div>
              </div>
            </div>
            <!--
               @start="isDragging = true"
              @end="end"
              @change="change"
             -->
            <draggable
              v-model="merchant.list"
              v-bind="dragOptions"
              class="manage-team-lists list-group"
              tag="ul"
            >
              <transition-group type="transition" name="flip-list">
                <li
                  v-for="item in merchant.list"
                  :key="item.id"
                  class="list-group-item"
                >
                  {{ item.title }}
                </li>
              </transition-group>
            </draggable>
            <div class="manage-team-hr">
              <div />
            </div>
            <div class="manage-team-footer">
              <dgg-button
                type="primary"
                style="width:65px;margin-right:10px;"
                class="fr"
                @click="manageTeamState = false"
              >
                确 定
              </dgg-button>
              <dgg-button
                plain
                style="width:65px;margin-right:10px;"
                class="dgg-button-nocolor fr"
                @click="manageTeamState = false"
              >
                取 消
              </dgg-button>
            </div>
          </div>
        </div>
      </dgg-row>
      <!-- 用户信息、订单统计、平台公告 -->
      <dgg-row :gutter="24" class="work-top-row">
        <!-- 用户个人信息卡片 -->
        <dgg-col :span="8" class="work-model">
          <div
            :style="{ backgroundImage: 'url(' + userInfoBg + ')' }"
            class="dgg-card user-info"
          >
            <div class="user-detail">
              <div class="head-img">
                <img
                  :src="
                    userInfoData.headerImg
                      ? userInfoData.headerImg
                      : userInfoSrc
                  "
                  :onerror="errorDefaultImg"
                  alt="用户头像"
                />
              </div>
              <div class="user-name-group">
                <h6>
                  {{
                    userInfoData.userName
                      ? userInfoData.userName
                      : userInfoData.phone
                  }}
                </h6>
                <p>{{ userInfoData.storeName }}</p>
                <!--  <dgg-row class="user-tags">
                  <dgg-tag
                    v-for="(tagItem,
                    tagIndex) in userInfoData.businessScopeList"
                    :key="tagIndex"
                    >{{ tagItem.businessProductName }}
                  </dgg-tag>
                </dgg-row> -->
              </div>
              <div></div>
              <div
                class="user-settings"
                v-if="1 < 0"
                @click="
                  ruoterJump({
                    name: 'personalSetting',
                    params: { userId: userId, tabindex: 'personalCard' }
                  })
                "
              >
                <dgg-icon
                  icon-class="icon_setting"
                  svg-width="17px"
                  svg-height="17px"
                />
                <span>设置</span>
              </div>
            </div>
            <div class="user-mood">
              <div class="mood-wrap">
                <div class="date-time">
                  <h6>{{ userCardTime.todayNum }}</h6>
                  <p>{{ userCardTime.todayWeek }}</p>
                </div>
                <div class="mood-list">
                  <dgg-tooltip
                    :value="showTips"
                    :popper-options="popperOptions"
                    :content="userCardTime.todayMotto"
                    placement="top"
                    class="msg-dot"
                    effect="dark"
                  >
                    <h6>{{ userCardTime.todayMotto }}</h6>
                  </dgg-tooltip>
                  <!--                  <p>{{ userCardTime.todayDate }} 农历 10月27日</p>-->
                  <p>{{ userCardTime.todayDate }}</p>
                </div>
              </div>
            </div>
          </div>
        </dgg-col>
        <!-- 订单统计数据 -->
        <dgg-col
          :span="8"
          class="work-model middle"
          :class="{ 'tongji-modle': countOrderDatas.length < 1 }"
        >
          <dgg-row :gutter="24" v-if="countOrderDatas.length > 0">
            <dgg-col
              :span="12"
              v-for="(item, index) in countOrderDatas"
              :key="index"
            >
              <div
                class="dgg-card"
                style="cursor: pointer"
                @click="totalIn(item)"
              >
                <dgg-icon
                  :icon-class="formatOrderIcoclass(item)"
                  svg-width="24px"
                  svg-height="24px"
                />
                <h6 :class="item.status === 'overdue' ? 'passed-order' : ''">
                  <countTo
                    :startVal="0"
                    :endVal="item.count > 0 ? Number(item.count) : 0"
                    :duration="3000"
                  ></countTo>
                </h6>
                <p>{{ item.statusName }}</p>
              </div>
            </dgg-col>
          </dgg-row>
          <!-- 占位图 -->
          <bitMap v-if="countOrderDatas.length < 1" />
        </dgg-col>
        <!-- 平台公告 -->
        <dgg-col :span="8" class="work-model">
          <div class="dgg-card platform-notice">
            <div class="notice-title">
              <h6>平台公告</h6>
              <span @click="ruoterJump({ name: 'announcement' })">更多</span>
            </div>
            <dgg-milepost
              :reverse="false"
              :activities="platformNoticeLists"
              :is-hover="true"
              class="notice-lists"
              @milepostClick="milepostClick"
              v-if="platformNoticeLists.length > 0"
            />
            <!-- 占位图 -->
            <bitMap v-if="platformNoticeLists.length < 1" />
          </div>
        </dgg-col>
      </dgg-row>
      <!-- 消息通知待办列表 -->
      <dgg-row :gutter="24" class="work-middle-row">
        <dgg-col :span="8">
          <div class="dgg-card news-notify">
            <div class="notify-title">
              <h6>消息通知</h6>
              <span @click="ruoterJump({ name: 'notice' })">更多</span>
            </div>
            <div v-if="unreadNoitces.length > 0" class="notify-lists">
              <div
                v-for="(notice, index) in unreadNoitces"
                :key="index"
                class="list"
                @click="toNoticeDetail(notice, index)"
                v-if="unreadNoitces.length > 0"
              >
                <dgg-icon
                  :icon-class="
                    iconList[
                      notice.extendParamsJson.icon_type
                        ? notice.extendParamsJson.icon_type
                        : 'noicon'
                    ] + '_active'
                  "
                  svg-width="36px"
                  svg-height="36px"
                />
                <div>
                  <h6>{{ notice.title }}</h6>
                  <p>{{ notice.msgContent }}</p>
                </div>
              </div>
            </div>
            <!-- 占位图 -->
            <bitMap v-if="unreadNoitces.length < 1" />
          </div>
        </dgg-col>
        <dgg-col :span="16">
          <div class="dgg-card task-order-lists">
            <dgg-tabs :value="taskOrderActiveName" @tab-click="taskOrderClick">
              <dgg-tab-pane
                :label="tabItem.name"
                :name="tabItem.code"
                v-for="(tabItem, tabindex) in taskTabLists"
                :key="tabindex"
                v-loading="indexTaskListLoading"
              >
                <dgg-row v-if="workbenchTaskListData.length > 0">
                  <dgg-col
                    v-for="(item, index) in workbenchTaskListData"
                    :span="24"
                    :key="index"
                    class="order-list"
                  >
                    <div class="tab-list-names">
                      <dgg-tooltip
                        :value="showTips"
                        :popper-options="popperOptions"
                        :content="
                          item.taskSwitching == 1 ? '激活任务' : '完成任务'
                        "
                        placement="top"
                        class="msg-dot"
                        effect="dark"
                      >
                        <dgg-checkbox
                          :checked="item.taskSwitching == 1"
                          v-model="item.taskSwitching == 1"
                          label=""
                          class="list-checkbox"
                          @change="stateChange(item, taskOrderActiveName)"
                          :disabled="isClickCheckStatus(item)"
                        />
                      </dgg-tooltip>
                      <div
                        class="list-group"
                        @click="toWorkBrenchTask(currentTaskStatusCodes, item)"
                      >
                        <div class="list-title">
                          <h6>
                            <dgg-tag
                              class="due-tag"
                              v-if="
                                !(item.taskSwitching == 1) &&
                                  item.aboutExpire == 1 &&
                                  (taskOrderActiveName == 'MY_TODO' ||
                                    taskOrderActiveName == 'MY_DISTRIBUTION' ||
                                    taskOrderActiveName == 'ZYGSSC_TASK_5')
                              "
                              >即将到期
                            </dgg-tag>
                            <dgg-tag
                              class="overdue-tag"
                              v-if="
                                !(item.taskSwitching == 1) &&
                                  item.taskOverTime == 1 &&
                                  (taskOrderActiveName == 'MY_TODO' ||
                                    taskOrderActiveName == 'MY_DISTRIBUTION' ||
                                    taskOrderActiveName == 'ZYGSSC_TASK_5')
                              "
                              >已超期
                            </dgg-tag>
                            <dgg-tag
                              class="due-tag"
                              v-if="
                                !(item.taskSwitching == 1) &&
                                  item.suspend == 1 &&
                                  (taskOrderActiveName == 'MY_TODO' ||
                                    taskOrderActiveName == 'MY_DISTRIBUTION' ||
                                    taskOrderActiveName == 'ZYGSSC_TASK_5')
                              "
                              >已暂停
                            </dgg-tag>
                            <p
                              :class="{
                                deleteLine: item.taskSwitching == 1,
                                disabledEl: isClickCheckStatus(item)
                              }"
                            >
                              {{ item.taskName }}
                            </p>
                            <dgg-tooltip
                              :value="showTips"
                              :popper-options="popperOptions"
                              placement="top"
                              class="msg-dot ml-20"
                              effect="dark"
                              content="关键任务"
                            >
                              <dgg-icon
                                v-if="item.isKeyTask == 1"
                                icon-class="icon_star"
                                svg-width="14px"
                                svg-height="14px"
                              />
                            </dgg-tooltip>
                          </h6>
                        </div>
                        <p class="list-des">
                          {{ item.customerName ? item.customerName + "-" : ""
                          }}{{ item.proScAttrName }}
                        </p>
                      </div>
                    </div>
                    <dgg-tooltip
                      :value="showTips"
                      :popper-options="popperOptions"
                      :content="item.taskManager"
                      placement="top"
                      class="msg-dot ml-20"
                      effect="dark"
                      v-if="item.taskManagerHeaderUrl"
                    >
                      <img
                        :src="item.taskManagerHeaderUrl"
                        alt=""
                        :onerror="errorDefaultImg"
                        class="tab-list-img"
                      />
                    </dgg-tooltip>
                    <!-- 如果不是完成的任务显示到期时间/截止时间 -->
                    <p class="tab-list-date">
                      {{ formatTaskTime(item) }}
                    </p>
                  </dgg-col>
                </dgg-row>

                <bitMap v-else />
              </dgg-tab-pane>
            </dgg-tabs>
            <span class="task-order-more" @click="ruoterJump({ name: 'task' })"
              >更多</span
            >
          </div>
        </dgg-col>
      </dgg-row>
      <!-- 我的账户、在办订单 -->
      <dgg-row :gutter="24" class="work-bottom-row">
        <dgg-col :span="8">
          <div class="dgg-card my-account">
            <div class="account-title">
              <h6>方案待处理</h6>
              <span
                @click="
                  ruoterJump({
                    name: 'transaction',
                    params: {
                      tabindex: 'orderMode',
                      scAttrStatus:
                        'QDS_ZYGSSC_ATTRSTATUS_CODE1,QDS_ZYGSSC_ATTRSTATUS_CODE2'
                    }
                  })
                "
                >更多</span
              >
            </div>
            <div class="workbench-paln-handled">
              <dgg-row
                class="placing-orders"
                v-if="workBenchPlanWaitData.length > 0"
              >
                <dgg-col
                  v-for="(item, index) in workBenchPlanWaitData"
                  :span="24"
                  :key="index"
                  class="order-list"
                >
                  <div
                    class="tab-list-names"
                    @click="workToTranstionDetail(item)"
                  >
                    <div class="list-group">
                      <div class="list-title">
                        <dgg-tag
                          v-if="
                            item.scAttrStatus == 'ATTR_WAIT_STATUS_ZYGSSC_02'
                          "
                          class="due-tag"
                          >{{ item.scAttrStatusName }}
                        </dgg-tag>
                        <dgg-tag
                          v-if="
                            item.scAttrStatus == 'ATTR_WAIT_STATUS_ZYGSSC_01'
                          "
                          class="overdue-tag"
                          >{{ item.scAttrStatusName }}
                        </dgg-tag>
                        <h6>{{ item.productName }}</h6>
                      </div>
                      <p class="list-des ">客户：{{ item.customerName }}</p>
                    </div>
                    <div class="awiait-attr-status">
                      {{ item.scAttrStatusName ? item.scAttrStatusName : "" }}
                    </div>
                  </div>
                </dgg-col>
              </dgg-row>
              <!-- 占位图 -->
              <bitMap v-if="workBenchPlanWaitData.length < 1" />
            </div>
          </div>
        </dgg-col>
        <dgg-col :span="16" style="float:right;">
          <div class="dgg-card my-account handle-order">
            <div class="account-title">
              <h6>在办订单</h6>
              <span
                @click="
                  ruoterJump({
                    name: 'transaction',
                    params: { tabindex: 'orderMode' }
                  })
                "
                >更多</span
              >
            </div>
            <dgg-row class="placing-orders" v-if="placingOrderLists.length > 0">
              <dgg-col
                v-for="(item, index) in placingOrderLists"
                :span="24"
                :key="index"
                class="order-list"
              >
                <div
                  class="tab-list-names"
                  @click="workToTranstionDetail(item)"
                >
                  <div class="list-group">
                    <div class="list-title">
                      <dgg-tag v-if="item.overTimeStatus == 2" class="due-tag"
                        >即将到期
                      </dgg-tag>
                      <dgg-tag
                        v-if="item.overTimeStatus == 3"
                        class="overdue-tag"
                        >已超期
                      </dgg-tag>
                      <h6>{{ item.productName }}</h6>
                    </div>
                    <p class="list-des ">客户：{{ item.customerName }}</p>
                  </div>
                </div>
                <div class="order-progress">
                  <el-progress
                    :percentage="
                      Math.round(
                        (item.taskTotal && item.completeTaskNum
                          ? item.completeTaskNum / item.taskTotal
                          : 0) * 100
                      )
                    "
                  />
                  <p>
                    最新阶段：{{
                      item.latestCasePhaseName ? item.latestCasePhaseName : "--"
                    }}
                  </p>
                </div>
                <p
                  :class="{
                    'tab-list-due-data': item.overTimeStatus == 2,
                    'tab-list-overdue-data': item.overTimeStatus == 3
                  }"
                  class="tab-list-date"
                >
                  {{ item.orderDeadline ? item.orderDeadline : "未设置" }}
                </p>
              </dgg-col>
            </dgg-row>
            <!-- 占位图 -->
            <bitMap v-if="placingOrderLists.length < 1" />
          </div>
        </dgg-col>
      </dgg-row>

      <div v-if="this.$route.name === 'workbench'" class="footer">
        Copyright © 2019-2020 成都聚蓉晟商务信息咨询有限公司 版权所有
        保留一切权利 备案号 : 蜀ICP备19038831号-1
      </div>
    </div>
    <fixedNotice :top="787" />
    <router-view />
  </div>
</template>

<script>
import countTo from "vue-count-to";

// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import bitMap from "@/views/main/page/components/bitmap.vue";
import LineChart from "./components/LineChart";
import userInfoBg from "@/assets/images/workbench/image_namecard.png";
import draggable from "vuedraggable";
import moment from "moment";
import fixedNotice from "@/views/main/page/components/fixedNotice.vue";
import taskTransactorImg from "@/assets/images/image_portrait_fault.png";

//定义全局变量
let CalendarData = new Array(100);
let madd = new Array(12);
const numString = "一二三四五六七八九十";
const monString = "正二三四五六七八九十冬腊";
let cYear, cMonth, cDay, TheDate;
CalendarData = new Array(
  0xa4b,
  0x5164b,
  0x6a5,
  0x6d4,
  0x415b5,
  0x2b6,
  0x957,
  0x2092f,
  0x497,
  0x60c96,
  0xd4a,
  0xea5,
  0x50da9,
  0x5ad,
  0x2b6,
  0x3126e,
  0x92e,
  0x7192d,
  0xc95,
  0xd4a,
  0x61b4a,
  0xb55,
  0x56a,
  0x4155b,
  0x25d,
  0x92d,
  0x2192b,
  0xa95,
  0x71695,
  0x6ca,
  0xb55,
  0x50ab5,
  0x4da,
  0xa5b,
  0x30a57,
  0x52b,
  0x8152a,
  0xe95,
  0x6aa,
  0x615aa,
  0xab5,
  0x4b6,
  0x414ae,
  0xa57,
  0x526,
  0x31d26,
  0xd95,
  0x70b55,
  0x56a,
  0x96d,
  0x5095d,
  0x4ad,
  0xa4d,
  0x41a4d,
  0xd25,
  0x81aa5,
  0xb54,
  0xb6a,
  0x612da,
  0x95b,
  0x49b,
  0x41497,
  0xa4b,
  0xa164b,
  0x6a5,
  0x6d4,
  0x615b4,
  0xab6,
  0x957,
  0x5092f,
  0x497,
  0x64b,
  0x30d4a,
  0xea5,
  0x80d65,
  0x5ac,
  0xab6,
  0x5126d,
  0x92e,
  0xc96,
  0x41a95,
  0xd4a,
  0xda5,
  0x20b55,
  0x56a,
  0x7155b,
  0x25d,
  0x92d,
  0x5192b,
  0xa95,
  0xb4a,
  0x416aa,
  0xad5,
  0x90ab5,
  0x4ba,
  0xa5b,
  0x60a57,
  0x52b,
  0xa93,
  0x40e95
);
madd[0] = 0;
madd[1] = 31;
madd[2] = 59;
madd[3] = 90;
madd[4] = 120;
madd[5] = 151;
madd[6] = 181;
madd[7] = 212;
madd[8] = 243;
madd[9] = 273;
madd[10] = 304;
madd[11] = 334;

export default {
  name: "Workbench",
  components: {
    bitMap, // 占位图
    LineChart,
    draggable,
    fixedNotice,
    countTo
  },
  data() {
    return {
      indexTaskListLoading: true, //首页任务loading
      errorDefaultImg: 'this.src="' + taskTransactorImg + '"', //默认图地址
      testDate: "",
      countOrderDatas: [], //统计图数据
      userInfoData: [], //用户信息
      showTeamSurplus: false, // 显示切换团队下拉
      manageTeamState: false,
      curYear: new Date().getFullYear(),
      dragOptions: {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      },
      lineChartData: {},
      choosedTeam: {
        id: 1,
        title: "四川顶泰律师事务所"
      }, // 选择的团队id
      userCardTime: {}, // 用户名片日期时间
      showTips: false,
      // 顶部模拟律师名称
      teamNameLists: [
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
      ],
      popperOptions: {
        boundariesElement: "body"
      },
      userInfoBg: userInfoBg, // 用户信息背景图
      userInfoSrc: require("@/assets/images/image_head_default.png"),
      platformNoticeLists: [], //平台公告数据
      // 任务即将到期列表
      workbenchTaskListData: [],
      // 在办订单列表
      placingOrderLists: [],
      workBenchPlanWaitData: [],
      // 模拟未读消息提示
      unreadNoitces: [],
      //当前任务code
      currentTaskStatusCodes: "ZYGSSC_TASK_1"
    };
  },
  computed: {
    ...mapState([
      "merchant",
      "storeInfoData",
      "userId",
      "orderStatus", //生产订单状态
      "msgTypes", //消息类型
      "iconList", //消息通知图标icon状态
      "taskStatusCodes" //任务订单状态
    ]),
    taskOrderActiveName() {
      //激活的任务列表tab
      const _name = this.currentTaskStatusCodes
        ? this.currentTaskStatusCodes
        : this.taskStatusCodes["ZYGSSC_TASK_1"];
      return this.taskStatusCodes[_name]; // 默认激活的订单列表
    },
    taskTabLists() {
      const taskTabListsData = [
        {
          name: "即将到期",
          code: this.taskStatusCodes["ZYGSSC_TASK_1"]
        },
        {
          name: "已超期",
          code: this.taskStatusCodes["ZYGSSC_TASK_6"]
        },
        {
          name: "已暂停",
          code: this.taskStatusCodes["ZYGSSC_TASK_3"]
        },
        {
          name: "待处理",
          code: this.taskStatusCodes["ZYGSSC_TASK_5"]
        },
        {
          name: "我的待办",
          code: this.taskStatusCodes["MY_TODO"]
        },
        {
          name: "我分配的",
          code: this.taskStatusCodes["MY_DISTRIBUTION"]
        }
      ];
      return taskTabListsData;
    }
  },
  watch: {
    merchant() {
      this.choosedTeam = this.merchant.list[0];
      this.setChoosedTeam(this.choosedTeam);
    }
  },
  mounted() {
    //请求统计区域
    this.zygs_workbench_orderCount().then(res => {
      if (res.code == 200) {
        this.$nextTick(() => {
          this.countOrderDatas = res.data;
        });
      } else {
        this.$nextTick(() => {
          this.countOrderDatas = [];
        });
      }
    });
    //方案待处理
    this.zygs_workbench_planWait().then(res => {
      if (res.code == 200) {
        this.$nextTick(() => {
          this.workBenchPlanWaitData = res.data;
        });
      } else {
        this.$nextTick(() => {
          this.workBenchPlanWaitData = [];
        });
      }
    });
    //在办订单
    this.zygs_workbench_planOrder().then(res => {
      if (res.code == 200) {
        this.$nextTick(() => {
          this.placingOrderLists = res.data.records;
        });
      } else {
        this.$nextTick(() => {
          this.placingOrderLists = [];
        });
      }
    });

    //任务订单列表
    this.taskListCodeFn(this.taskStatusCodes["ZYGSSC_TASK_1"]);

    // 初始化时间
    this.formatDate();
    // 默认我的待办赋值
    this.setChoosedTeam(this.choosedTeam);
    this.userInfoData = this.storeInfoData;
    this.userInfoData.headerImg = this.userInfoData.avatarUrl
      ? this.userInfoData.avatarUrl
      : this.userInfoData.cardsAvatarUrl;

    //请求用户名片接口
    this.userInfoData = this.storeInfoData;
    if (this.userInfoData.otherStore.length > 0) {
      this.userInfoData.storeName = this.userInfoData.otherStore[0].storeName;
    }

    //请求平台公告
    this.query_inventory({
      limit: 3,
      start: 0,
      sys: "QDB_SYSTEM_BUSINESS_ZYSC"
    }).then(res => {
      if (res.code == 200 && res.data.length) {
        console.log(res.data);
        this.platformNoticeLists = res.data.map((item, index, arr) => {
          return {
            id: item.id,
            timestamp: item.isOnlineTime,
            color: "#D8D9DB",
            content: item.noticeProfile
          };
        });
      } else {
        this.platformNoticeLists = [];
      }
    });

    //消息通知列表接口
    this.getMessageTotalFn();
  },
  activated() {
    //
  },
  created() {},
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions(["ruoterJump"]),
    ...mapActions("startPageModule", [
      "get_store_yt_info", // 获取用户在店铺的业态信息（暂用于法律业态PC）
      "get_store_info_vo"
    ]),
    ...mapMutations([
      "setChoosedTeam",
      "setNewsRulesData", //消息规则数据
      "setTransactionStageId", //设置办理阶段id
      "setTransactionTaskId", //设置办理任务id
      "setTransactionItem",
      "setWorkBrenchTaskStageId",
      "setWorkBrenchTaskTaskId"
    ]),
    ...mapActions("workbenchModule", [
      "zygs_workbench_orderCount", // 统计区域
      "query_inventory", //平台公告接口
      "get_message_total", //消息通知列表接口
      "zygs_workbench_taskList", //即将到期、已超期、我的待办、我分配的
      "zygs_workbench_planWait", //方案待处理接口
      "read_msg", //用户消息已读'
      "zygs_workbench_planOrder"
    ]),
    ...mapActions("transactionDynamicModule", [
      "get_production_order_details_data" //获取订单详情
    ]),
    ...mapActions("homeTaskModule", [
      "zysc_complete_task_service", //
      "zysc_manageTaskHandler_operation" // 添加/删除/修改 办理人
    ]),
    formatTaskTime(item) {
      let timeVal = "未设置";
      if (item.taskStatusCode == "HEAD_TASK_ITEM_6") {
        timeVal = item.endTime ? item.endTime : "未设置";
      } else {
        timeVal = item.finalDeadline ? item.finalDeadline : "未设置";
      }
      return timeVal;
    },
    //格式化统计区域订单iconclas
    formatOrderIcoclass(item) {
      let iconClass = "icon_handling";
      if (item.status === "QDS_SC_ORDER_STATUS_CODE01") {
        iconClass = "icon_handling";
      } else if (item.status === "QDS_SC_ORDER_STATUS_CODE07") {
        iconClass = "icon_waiting";
      } else if (item.status === "overdue") {
        iconClass = "icon_overdue";
      } else {
        iconClass = "icon_end";
      }
      return iconClass;
    },
    //跳转到工作台任务页面并且定位任务列表和阶段id
    toWorkBrenchTask(taskStatusCode, item) {
      // console.log(taskStatusCode,'点击的code');
      if (item.taskStatusCode) {
        this.setWorkBrenchTaskStageId(item.taskStatusCode);
        if (item.taskId) {
          this.setWorkBrenchTaskTaskId(item.taskId);
        }
      } else {
        this.setWorkBrenchTaskStageId("");
        this.setWorkBrenchTaskTaskId("");
      }
      this.ruoterJump({ name: "task" });
    },
    /*获取当前农历*/
    showCal() {
      let D = new Date();
      let yy = D.getFullYear();
      let mm = D.getMonth() + 1;
      let dd = D.getDate();
      return this.GetLunarDay(yy, mm, dd);
    },
    GetBit(m, n) {
      return (m >> n) & 1;
    },
    //农历转换
    e2c() {
      let that = this;
      TheDate =
        arguments.length != 3
          ? new Date()
          : new Date(arguments[0], arguments[1], arguments[2]);
      let total, m, n, k;
      let isEnd = false;
      let tmp = TheDate.getYear();
      if (tmp < 1900) {
        tmp += 1900;
      }
      total =
        (tmp - 1921) * 365 +
        Math.floor((tmp - 1921) / 4) +
        madd[TheDate.getMonth()] +
        TheDate.getDate() -
        38;

      if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
        total++;
      }
      for (m = 0; ; m++) {
        k = CalendarData[m] < 0xfff ? 11 : 12;
        for (n = k; n >= 0; n--) {
          if (total <= 29 + that.GetBit(CalendarData[m], n)) {
            isEnd = true;
            break;
          }
          total = total - 29 - that.GetBit(CalendarData[m], n);
        }
        if (isEnd) break;
      }
      cYear = 1921 + m;
      cMonth = k - n + 1;
      cDay = total;
      if (k === 12) {
        if (cMonth === Math.floor(CalendarData[m] / 0x10000) + 1) {
          cMonth = 1 - cMonth;
        }
        if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
          cMonth--;
        }
      }
    },
    GetcDateString() {
      let tmp = "";
      if (cMonth < 1) {
        tmp += "(闰)";
        tmp += monString.charAt(-cMonth - 1);
      } else {
        tmp += monString.charAt(cMonth - 1);
      }
      tmp += "月";
      tmp += cDay < 11 ? "初" : cDay < 20 ? "十" : cDay < 30 ? "廿" : "三十";
      if (cDay % 10 != 0 || cDay == 10) {
        tmp += numString.charAt((cDay - 1) % 10);
      }
      return tmp;
    },
    GetLunarDay(solarYear, solarMonth, solarDay) {
      solarMonth = parseInt(solarMonth) > 0 ? solarMonth - 1 : 11;
      this.e2c(solarYear, solarMonth, solarDay);
      return this.GetcDateString();
    },

    //判断是否显示待抢订单
    hasOrderReceive(data) {
      if (data.storeId && data.roles.indexOf("MERCHANT_STORE_OWNER") != -1) {
        //如果有店铺
        if (
          data.storeInfo.isReceiveOrder === 1 &&
          data.storeInfo.isReceiveOrderAdmin === 1
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        //如果没有店铺判断员工
        if (typeof data.otherStore == "object" && data.otherStore.length > 0) {
          if (data.otherStore[0].authReceiveOrder === 1) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    //是否可以点击操作框
    isClickCheckStatus(item) {
      /* console.log(
        JSON.parse(JSON.stringify(this.setTransactionItem)),
        "缓存的订单的值++++++++++"
      ); */
      if (
        //已退单和已完结返回为true
        item.orderStatus == this.orderStatus.QDS_SC_ORDER_FINISH ||
        item.orderStatus == this.orderStatus.QDS_SC_ORDER_REFUND
      ) {
        return true;
      }
      if (item.taskSwitchingCode == "QDS_ZYGSSC_TASKSTATUS_CODE3") {
        //  暂停任务 不可以操作
        return true;
      }
      if (
        //26暂停状态、27暂停待审核
        item.orderStatus == "QDS_SC_ORDER_STATUS_CODE26" ||
        item.orderStatus == "QDS_SC_ORDER_STATUS_CODE27"
      ) {
        //  订单暂停不可操作
        return true;
      }
      // 0 未完成，1：完成
      if (item.taskSwitching == 1) {
        if (item.isCheck == 1) {
          // 是否 质检任务：0 ：否， 1： 是
          //待质检
          if (item.qalNspectionsStatus == "NODE_QUALITY_AWAIT") {
            return true;
          }
          //质检中
          else if (item.qalNspectionsStatus == "NODE_QUALITY_REVIEW") {
            return true;
          }
          //质检已通过
          else if (item.qalNspectionsStatus == "NODE_QUALITY_COMPLETE") {
            return true;
          }
          //质检驳回
          else if (item.qalNspectionsStatus == "NODE_QUALITY_REFUSE") {
            return false;
          } else {
            return true;
          }
        } else {
          //非质检
          return false;
        }
      } else {
        //未完成全部可以点击
        return false;
      }
    },
    // 统计穿透点击
    totalIn(item) {
      // 办理中订单
      let keyWords = [];
      if (item.keyWords) {
        keyWords = item.keyWords;
      } else {
        keyWords = [];
      }
      if (item.status === "QDS_SC_ORDER_STATUS_CODE01") {
        this.ruoterJump({
          name: "transaction",
          params: {
            tabindex: "orderMode"
          }
        });
      } else if (item.status === "QDS_SC_ORDER_STATUS_CODE07") {
        if (
          this.storeInfoData.storeId &&
          (this.storeInfoData.storeStatus == 0 ||
            this.storeInfoData.storeStatus == 1)
        ) {
          this.ruoterJump({
            name: "receive",
            params: {
              tabindex: "orderMode"
            }
          });
        }
      } else if (item.status === "overdue") {
        let formatKeyWords = {};
        if (keyWords.length > 0) {
          formatKeyWords = {
            [keyWords[0].key]: keyWords[0].value
          };
        } else {
          formatKeyWords = {};
        }
        this.ruoterJump({
          name: "allOrder",
          params: {
            ...formatKeyWords
          }
        });
      } else {
        this.ruoterJump({
          name: "finish",
          params: {
            tabindex: "orderMode"
          }
        });
      }
    },
    // 任务订单点击列表
    taskOrderClick(tab, event) {
      if (this.taskOrderActiveName === tab.name) {
        return false;
      } else {
        this.currentTaskStatusCodes = tab.name;
        this.taskListCodeFn(tab.name); //调用点击tab切换列表数据
      }
    },

    // 平台公告列表
    milepostClick(item, index) {
      // console.log(item, "---------");
      this.ruoterJump({
        name: "announcementDetails",
        params: { id: item.id }
      });
    },
    // 切换律师团队
    changeTeam(team, index) {
      // console.log(team, index,'+++++++++');
      this.choosedTeam = team;
      console.log(this.choosedTeam, "asdfasdf");
      this.setChoosedTeam(this.choosedTeam);
      this.showTeamSurplus = false; // 选中后隐藏下拉框
    },
    // 处理日期
    formatDate() {
      const todayMoment = moment();
      // 一周的星期天数
      const weekdays = {
        0: "星期日",
        1: "星期一",
        2: "星期二",
        3: "星期三",
        4: "星期四",
        5: "星期五",
        6: "星期六"
      };
      const mottos = [
        "一切伟大的行动和思想，都有一个微不足道的开始。 -- 阿贝尔.加缪",
        "信仰是在你看不见整段楼梯时就踏出的第一步。 -- 马丁.路德.金",
        "我们活着就是这么一大段又凄凉又甜蜜的日子。 -- 曹禺",
        "白日将尽，一如往常日子那般逝去。 -- 赫尔曼·黑塞",
        "从前那个我，如果来找现在的我，会得到很好的款待。 -- 木心",
        "为了使灵魂宁静，一个人每天要做两件不喜欢的事。 -- 海桑",
        "而我的心略大于整个宇宙。 -- 费尔南多·佩索阿",
        "人是有理性的生物，但尚未证实是通情达理的。 -- 尼古拉·巴维雷兹",
        "清晰明确也未必就代表真相。 -- 迈克尔·翁达杰",
        "在我们以前，“人生”已被反复了数千万遍。 -- 丰子恺",
        "你必须内心丰富，才能摆脱这些生活表面的相似。 -- 王朔",
        "有一个可以想念的人，就是幸福。 -- 岩井俊二",
        "太阳每天都是新的，而且会永远常新。 -- 赫拉克利特",
        "我们都成了上帝的疯子。 -- 弗朗西斯.科波拉",
        "演的时候不要当真，直到情境成真。 -- 大卫.林奇",
        "永远不要靠的太近——这就是高贵。 -- 费尔南多.佩索阿",
        "永恒只是一瞬间，刚好开一个玩笑。 -- 赫尔曼.黑塞",
        "人生不能像做菜，把所有料都准备好才下锅。 -- 李安",
        "生命是时时刻刻不知如何是好。 -- 木心",
        "我喜欢我四岁的时候怀疑一切的眼光。 -- 张爱玲",
        "仅仅活着是不够的，还必须穿越生活。 -- 让.波德里亚",
        "人们嘴上挂着的法律，其真实含义是财富。 -- 爱献生",
        "思想打破生活的平淡无奇。 -- 苏珊.桑塔格",
        "钞票不是万能的，有时还需要信用卡。 -- 《加菲猫》",
        "生活是一种永恒的沉重的努力。 -- 米兰.昆德拉",
        "真理常常藏在事物的深底。 -- 席勒",
        "世间本无其他，都是奇迹。 -- 黄灿然《奇迹集》",
        "有时候，幸福需要等一等。 -- 《幸福终点站》",
        "懂事是需要时间的。 -- 《月升王国》",
        "不可言说之事，必将无言以对。 -- 路德维希.维特根斯坦",
        "要拿走些东西，他们才知道自己拥有什么。 -- 《追随》",
        "朝着一个目标不停的向前。 -- 《送给自己》",
        "没人期待我的到来，一切都等着我去打开。 -- 帕蒂.史密斯"
      ];
      // 当天的心情
      const todayMotto = mottos[Math.floor(Math.random() * mottos.length)];
      // 当天星期几
      const todayWeek = weekdays[todayMoment.format("d")];
      //当天农历
      const calendar = this.showCal();
      // 当天日期国历
      const todayDate = todayMoment.format("YYYY-MM-DD") + " 农历 " + calendar;
      // 当天的农历
      // 当天号数
      const todayNum = todayMoment.format("DD");
      // 每天随机抽取心情
      // console.log(moment(moment().startOf('day')).format('x'));//当天凌晨毫秒数 1573574400000
      // console.log(moment(moment().endOf('day')).format('x'));//当天23:59:59 毫秒数 1573660799999

      // 赋值日期、农历以及号数、星期几
      this.$nextTick(() => {
        this.userCardTime = {
          todayWeek: todayWeek,
          todayDate: todayDate,
          todayNum: todayNum,
          todayMotto: todayMotto
        };
      });
    },
    // 跳转到消息详情页面
    toNoticeDetail(item, index) {
      console.log(JSON.parse(JSON.stringify(item)), "点击消息");
      //用户消息已读
      this.readMsgFn(item);

      //缓存数据
      this.setNewsRulesData(item);

      //消息跳转规则配置
      switch (item.eventCode) {
        case "MSG_EVENT_1": //员工加入消息规则\跳转name（inviteNotice）---channel：Web
          this.ruoterJump({
            name: "inviteNotice"
          });
          break;
        case "MSG_EVENT_7": //titile：抢单失败\description：{操作账号的用户名}抢单失败，请留意您团队的分数排名哟~~\action：点击跳转到待抢单列表---channel：Web
          this.ruoterJump({
            name: "grab"
          });
          break;
        case "MSG_EVENT_8": //titile：您有一个新的订单待接收、description：您有一个新的订单待接收：{生产单编号} action：点击跳转对应订单列表页；---channel：Web
          this.ruoterJump({
            name: "receive"
          });
          break;
        case "MSG_EVENT_20": //titile：新增负责项目、description：{操作账号的用户名}接单成功，并设置您为项目负责人：{生产单编号（项目名称）}、action：点击跳转对应订单任务，并打开订单详---channel：Web{-跳转办理中任务详情页面}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_21": //（生产中心加事件CODE）titile：抢单失败、description：{操作账号的用户名}抢单失败，请留意您团队的分数排名哟~~、action：点击跳转到待抢单列表---channel：Web
          this.ruoterJump({
            name: "grab"
          });
          break;

        case "MSG_EVENT_23": //titile：新增订单任务\description：{操作账号的用户名}给您分配了任务：{任务名称}\action：点击跳转对应订单任务，并打开订单详情---channel：Web {{-跳转办理中任务详情页面---定位阶段和任务卡片}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;

        case "MSG_EVENT_24": //titile：取消订单任务\description：{操作账号的用户名}取消了您的任务：{任务名称}\action：点击跳转对应订单任务，并打开订单详情---channel：Web {{-跳转办理中任务详情页面}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;

        case "MSG_EVENT_25": //titile：任务截止时间提醒\description：{操作账号的用户名}设置任务截止时间为{设置的截止时间}，相关任务：{任务名称}\action：点击跳转对应订单任务，并打开订单详情---channel：Web {{-跳转办理中任务详情页面-----定位阶段和任务卡片}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_26": //titile：任务截止时间提醒\description：{操作账号的用户名}取消了任务截止时间，相关任务：{任务名称}\action：点击跳转对应订单任务，并打开订单详情---channel：Web {{-跳转办理中任务详情页面----定位阶段和任务卡片}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_27": //titile：任务到期提醒\description：任务还有{设置的提醒时间}到期，请尽快完成！相关任务：{任务名称}\action：点击跳转对应订单任务，并打开任务详情---channel：Web  {{-跳转办理中任务详情页面-----定位阶段和任务卡片}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_28": //titile：任务到期提醒\description：{操作账号的用户名}变更了任务名称，相关任务：{新的任务名称}\action：点击跳转对应订单任务，并打开任务详情---channel：Web   {{-跳转办理中任务详情页面-----定位阶段和任务卡片}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_29": //titile：任务备注提醒\description：{操作账号的用户名}在任务备注中提到了你，相关任务：{任务名称}\action：点击跳转对应项目的“订单-订单详情-任务”---channel：Web  {{-跳转办理中任务详情页面-----定位阶段和任务卡片}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_30": //titile：任务备注删除提醒\description：{操作账号的用户名}删除了与您相关的任务备注，相关任务：{任务名称}\action：点击跳转对应项目的“订单-订单详情-任务”---channel：Web   {{-跳转办理中任务详情页面-----定位阶段和任务卡片}}
          // this.toTranstionDetail(item, item.extendParamsJson.id);
          return false;
          break;
        case "MSG_EVENT_31": //titile：任务完成提醒\description：{操作账号的用户名}完成了任务：{任务名称}\action：点击跳转对应订单任务，并打开订单详情---channel：Web  {{-跳转办理中任务详情页面-----定位阶段和任务卡片}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_32": //titile：任务重启提醒\description：{操作账号的用户名}重启了任务：{任务名称}\action：点击跳转对应订单任务，并打开订单详情---channel：Web  {{-跳转办理中任务详情页面-----定位阶段和任务卡片}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_33": //titile：任务删除提醒\description：{操作账号的用户名}删除了任务：{任务名称}\action：点击跳转到对应的订单的任务列表---channel：Web {{-跳转办理中任务详情页面-}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_34": //titile：订单退单提醒\description：{操作账号的用户名}发起了退单申请：{生产单编号}\action：点击跳转到对应的订单详情---channel：Web  {{-跳转办理中任务详情页面-}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_35": //titile：订单结项提醒\description：{操作账号的用户名}发起了结项申请：{生产单编号}\action：点击跳转到对应的订单详情---channel：Web  {{-跳转办理中任务详情页面-}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_36": //titile：撤销订单退单申请\description：{操作账号的用户名}撤销了订单退单申请：{生产单编号}\action：点击跳转到对应的项目详情/审核详情---channel：Web {{-跳转办理中任务详情页面-}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_37": //titile：撤销订单结项申请\description：{操作账号的用户名}撤销了订单结项申请：{生产单编号}\action：点击跳转到对应的项目详情/审核详情---channel：Web {{-跳转办理中任务详情页面-}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_38": //titile：跟案备注提醒\description：{操作账号的用户名}在{项目名称}的项目记录中提到了你：{项目备注内容}\action：点击跳转对应项目的“订单-订单详情-备注”---channel：Web  {{-跳转办理中--动态tab-}}
          // this.toTranstionDetail(item, item.extendParamsJson.id);
          return false;
          break;
        case "MSG_EVENT_39": //titile：项目{主办/协办}变更\description：{操作账号的用户名}变更您的项目角色为{项目主办/项目协办}\action：点击跳转对应项目任务，并打开项目详情页---channel：Web {{-跳转办理中任务详情页面-}}
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "MSG_EVENT_40": //titile：项目{主办/协办}移除\description： {操作账号的用户名}将您移出项目主办：{项目名称}\action：点击跳转对应项目任务，并打开项目详情页（无权限则显示无权限占位页）---channel：Web ====>迭代第二版做
          return false;
          break;
        case "MSG_EVENT_41": //titile：项目负责人变更\description：{操作账号的用户名}变更项目负责人为{新项目负责人的用户名}：{项目名称}\action：点击跳转对应项目任务，并打开项目详情页（无权限则显示无权限占位页）---channel：Web====>迭代第二版做
          return false;
          break;
        case "MSG_EVENT_44": //title：脱离团队通知\description：您已被移出{律所全称}，无法继续访问该律所/团队相关信息\action：点击跳转打开App跳转到消息中心
          return false;
          break;
        case "QDB_ZYSC_MSG_EVENT_01": //点击跳转对应订单详情页
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "QDB_ZYSC_MSG_EVENT_01_01": //点击跳转对应订单详情页（固定至该任务项）
          this.toTranstionDetail(item, item.extendParamsJson.id);
          break;
        case "QDB_ZYSC_MSG_EVENT_02": //点击跳转办理中订单列表
          this.ruoterJump({
            name: "transaction",
            params: { tabindex: "orderMode" }
          });
          break;
        case "QDB_ZYSC_MSG_EVENT_03": //点击跳转任务列表，并自动定位到该生产任务对应的任务位置
          if (item.extendParamsJson.taskStatusCode) {
            this.setWorkBrenchTaskStageId(item.extendParamsJson.taskStatusCode);
          }
          if (item.extendParamsJson.taskId) {
            this.setWorkBrenchTaskTaskId(item.extendParamsJson.taskId);
          }
          this.ruoterJump({
            name: "task"
          });
          break;
        case "QDB_ZYSC_MSG_EVENT_04": //点击跳转到团队成员管理
          this.ruoterJump({
            name: "teamSetting"
          });
          break;
        case "QDB_ZYSC_MSG_EVENT_05": //无操作
          return false;
          break;
        default:
          return false;
          break;
      }
    },
    //用户消息已读
    readMsgFn(item) {
      this.read_msg({
        ids: String(item.id)
      })
        .then(res => {
          if (res.code == 200) {
            this.$notify({
              title: "提示",
              message: res.message,
              type: "success",
              customClass: "dgg-tip-msg"
            });
            //消息通知列表接口方法
            this.getMessageTotalFn();
          } else {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
        })
        .catch(error => {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        });
    },
    //消息通知列表接口方法
    getMessageTotalFn() {
      this.get_message_total({
        //msgType:'',//消息类型，订单消息：QDS_MSG_TYPE_ORDER，交易消息：QDS_MSG_TYPE_TRADE，系统消息 ：QDS_MSG_TYPE_SYSTEM，不传则全部
        pageNo: 1,
        pageSize: 5, //分页参数
        userId: this.userId,
        readStatus: 0 //消息类型状态  0 未读， 1 已读，默认全部
      }).then(res => {
        // unreadNoitces
        if (res.code == 200) {
          this.$nextTick(() => {
            // 设置显示echarts数据
            this.unreadNoitces = res.data.dataList;

            this.$bus.$emit("msgRefresh", Number(res.data.totalSize));
          });
        } else {
          this.unreadNoitces = [];
        }
      });
    },
    //跳转到办理中订单详情
    toTranstionDetail(item, orderid) {
      console.log(
        JSON.parse(JSON.stringify(item)),
        "点击消息执行跳转方法了---"
      );

      if (orderid) {
        this.get_production_order_details_data({
          id: orderid
        }).then(res => {
          if (res.code == 200) {
            if (item.extendParamsJson.stageId) {
              this.setTransactionStageId(item.extendParamsJson.stageId);
            }
            if (item.extendParamsJson.taskId) {
              this.setTransactionTaskId(item.extendParamsJson.taskId);
            }
            this.setTransactionItem(res.data);
            let toOrderName = "transactionTask";
            if (res.data.orderStatus == this.orderStatus.QDS_SC_ORDER_FINISH) {
              toOrderName = "finishDetailsTask";
            }
            if (res.data.orderStatus == this.orderStatus.QDS_SC_ORDER_REFUND) {
              toOrderName = "chargeBackDetailsTask";
            }
            //如果是其它跳转到办理中并且有些需要定位阶段和任务选中
            this.ruoterJump({
              name: toOrderName,
              params: {
                title: `${res.data.customerName}-${res.data.scOrderNo}`
              }
            });
          }
        });
      }
    },
    //在办订单跳转办理中任务详情
    workToTranstionDetail(item) {
      if (item.id) {
        this.get_production_order_details_data({
          id: item.id
        }).then(res => {
          if (res.code == 200) {
            this.$nextTick(() => {
              this.setTransactionItem(res.data);
              sessionStorage.setItem("proccessPlanID", item.id);
              this.ruoterJump({
                name: "transactionTask",
                params: {
                  title: `${item.customerName}-${item.productName}`
                }
              });
            });
          } else {
            this.$notify({
              title: "提示",
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
        });
      }
    },
    // 点击复选框
    stateChange(item, postCompleteTask) {
      console.log(JSON.parse(JSON.stringify(item)), "传递的订单的值");
      if (!(item.isCheck == 1) && !(item.taskSwitching == 1)) {
        this.$confirm("确认完成任务？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(res => {
            // item.taskSwitching = 1;
            this.requestCompleteTaskService(item, postCompleteTask);
          })
          .catch(error => {
            this.$set(item, "taskSwitching", 0);
          });
      }
      if (item.isCheck == 1 && !(item.taskSwitching == 1)) {
        this.$confirm(
          "该任务为关键任务，点击完成后将提交至后台进行质检，确认完成？",
          "提示",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(res => {
            // item.taskSwitching = 1;
            this.requestCompleteTaskService(item, postCompleteTask);
          })
          .catch(error => {
            this.$set(item, "taskSwitching", 0);
          });
      }
      if (item.taskSwitching == 1) {
        this.$confirm(
          "激活任务后，任务将重新显示为未完成状态，任务信息不改变，确认激活？",
          "提示",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(res => {
            // item.taskSwitching = 0;
            this.requestCompleteTaskService(item, postCompleteTask);
          })
          .catch(error => {
            this.$set(item, "taskSwitching", 1);
          });
      }
    },
    //任务订单列表
    taskListCodeFn(state) {
      this.indexTaskListLoading = true;
      this.zygs_workbench_taskList({
        taskSwitching: state
      })
        .then(res => {
          if (res.code == 200) {
            this.$nextTick(() => {
              this.indexTaskListLoading = false;
              this.workbenchTaskListData = res.data;
            });
          } else {
            this.indexTaskListLoading = false;
            this.workbenchTaskListData = [];
          }
        })
        .catch(error => {
          this.indexTaskListLoading = false;
        });
    },
    // 即将到期、已超期、我的待办、我分配的下面列表复选框---任务已完成、任务未完成、激活任务接口
    requestCompleteTaskService(item, postCompleteTask) {
      this.zysc_complete_task_service({
        isActive: item.taskSwitching, //是否为激活任务 0：完成 1：激活
        isCheck: item.isCheck, // 是否为质检任务 0：否，1：是|
        isKeyTask: item.isKeyTask, //是否为关键任务 0：否 ，1：是
        stageId: item.stageId, // 阶段ID
        storeId: this.storeInfoData.storeId, // 店铺ID / 商户ID
        taskId: item.taskId, // 任务ID
        taskSwitchingCode: item.taskSwitchingCode, // 任务状态字典
        zygsscId: item.zygsscId // 专业公司生产ID
      }).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "提示",
            message: res.message,
            type: "success",
            customClass: "dgg-tip-msg"
          });
          this.$nextTick(() => {
            this.taskListCodeFn(postCompleteTask);
          });
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件

.open-team-surplus {
  padding: 8px 0 !important;
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

.workbench {
  .el-timeline-item__node--normal {
    left: 2px;
    width: 7px;
    height: 7px;
  }

  .el-timeline-item__tail {
    position: absolute;
    left: 5px;
    height: 81%;
    border-left: 1px solid #e4e7ed;
    top: 9px;
  }

  //重定义tab标题颜色样式
  /deep/ .el-tabs__item {
    color: #666873 !important;
  }

  /deep/ .el-tabs__item.is-top.is-active {
    color: #10bbb8 !important;
  }
}

//按钮默认移入改变样式
.dgg-btn-normol-hover {
  background-color: #10bbb8;
  color: #ffffff;
}

.workbench {
  width: 100%;
  height: 100%;
}

//公共占位图
/deep/ .bitmap {
  height: calc(100% - 40px);
}

// 头部导航
.work-top-nav {
  height: 30px;
  margin: 0 0 20px 0;
  font-size: 0;

  .icon_dropdown {
    color: #19233c;
  }

  .team-name-list {
    height: 100%;
    display: inline-block;
    font-size: 0;
    overflow: hidden;
    word-break: break-all;
    word-wrap: break-word;

    .dgg-button.activeTeam {
      background-color: #10bbb8;
      color: #fff;
      font-weight: 400;
    }

    .dgg-button:nth-child(n + 4) {
      display: none;
    }
  }

  /deep/ .dgg-button {
    height: 100%;
    padding: 7px 15px;
    max-width: 222px;
    border-color: #e5e9f2;
    font-size: 14px;
    border-radius: 4px;
    // color: #19233c;
    vertical-align: top;
    // &:not(.admin-team):hover {
    //   .dgg-btn-normol-hover;
    // }
    &.admin-team {
      padding: 7px 0;
      margin-left: 14px;
      background-color: transparent;
      border-color: transparent;
      position: relative;
      color: #19233c;

      &:hover {
        color: #10bbb8;
      }
    }

    &.drop-down {
      border-radius: 50%;
      padding: 0;
      width: 30px;
      height: 30px;
      vertical-align: top;
      overflow: hidden;
      background-color: #ffffff;
      margin-left: 12px;

      &.active {
        .dgg-btn-normol-hover;

        .dgg-icon {
          color: #fff !important;
        }
      }

      &:hover {
        .dgg-btn-normol-hover;

        .dgg-icon {
          color: #fff !important;
        }
      }

      span {
        line-height: 0;
      }
    }

    span {
      max-width: 100%;
      display: inline-block;
      box-sizing: border-box;
      .dgg-text-ellip;
    }
  }

  /deep/ .list-button {
    color: #19233c;
  }

  .list-button:hover {
    background-color: @main;
    color: #fff;
  }
}

//切换团队
.open-team-surplus {
  .surplus-team-lists {
    & > li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
      padding: 0 9px 0 14px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      margin-bottom: 2px;

      &.active-team {
        background-color: #f5f7fa;
        color: #10bbb8;

        .dgg-icon {
          display: inline;
        }
      }

      &:hover {
        background-color: #f5f7fa;
        color: #10bbb8;

        .dgg-icon {
          display: inline;
        }
      }

      p {
        font-size: 13px;
        .dgg-text-ellip;
        flex: 1;
        padding-right: 14px;
      }

      .dgg-icon {
        flex-shrink: 0;
        display: none;
      }
    }
  }
}

.work-top-row {
  /*overflow: hidden;*/

  .work-model {
    height: 250px;
    &.tongji-modle {
      .bitmap {
        border-radius: 4px;
        background-color: #fff;
        height: 100%;
      }
    }

    .dgg-card {
      height: 100%;

      &.platform-notice {
        padding: 20px 15px 20px 20px;
        overflow: hidden;
        color: #9398a1;

        .notice-title {
          padding: 0 4px 17px 11px;
          border-bottom: 1px solid #e3e4e6;
          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;
          align-items: center;

          h6 {
            font-size: 14px;
            font-weight: 550;
            color: #19233c;
            line-height: 22px;
            .dgg-text-ellip;
          }

          span {
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            flex-shrink: 0;
            padding: 2px 10px;
            cursor: pointer;

            &:hover {
              color: #10bbb8;
            }
          }
        }

        // 平台公告列表
        .notice-lists {
          padding-top: 16px;
          padding-left: 13px;
          padding-right: 8px;
          max-height: 180px;
          overflow: hidden;
          //重定义公告详情时间线条新式
          /deep/ .el-timeline-item__node--normal {
            left: 2px;
            width: 7px;
            height: 7px;
          }

          /deep/ .el-timeline-item__tail {
            position: absolute;
            left: 5px;
            height: 81%;
            border-left: 1px solid #e4e7ed;
            top: 9px;
          }

          /deep/ .el-timeline-item {
            padding-bottom: 16px;

            &:nth-child(n + 4) {
              display: none;
            }

            &:nth-child(3) {
              /deep/ .el-timeline-item__tail {
                height: 0;
              }
            }
          }

          /deep/ .el-timeline-item__content {
            color: #666873;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            .dgg-text-ellip;
          }

          /deep/ .el-timeline-item__timestamp {
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            .dgg-text-ellip;

            &.is-bottom {
              margin-top: 5px;
            }
          }
        }
      }
    }

    .user-info {
      height: 100%;
      background: no-repeat center;
      background-size: conver;
      position: relative;
      flex: 0 0 auto;

      .user-detail {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        padding: 28px 28px 0 28px;
        //  position: relative;

        .head-img {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          margin-top: 1px;
          img {
            // position: absolute;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            // top: 33px;
            // left: 31px;
          }
        }

        .user-name-group {
          margin-left: 18px;
          max-width: 204px;
          color: #fff;
          flex: 1;

          h6 {
            font-size: 16px;
            font-weight: 550;
            line-height: 22px;
            .dgg-text-ellip;
          }

          & > p {
            font-size: 12px;
            .dgg-text-ellip;
            line-height: 17px;
            margin-top: 4px;
            font-weight: 400px;
          }

          .user-tags {
            font-size: 0;
            margin-top: 12px;
            max-height: 56px;
            overflow: hidden;
            display: flex;
            flex-wrap: wrap;

            /deep/ .el-tag {
              max-width: 94px;
              border: 0;
              height: 18px;
              line-height: 18px;
              background: rgba(255, 255, 255, 1);
              border-radius: 9px;
              color: #10bbb8;
              .dgg-text-ellip;
              font-size: 12px;
              margin-right: 10px;
              margin-bottom: 10px;
              flex-shrink: 0;
            }
          }
        }

        .user-settings {
          padding-left: 10px;
          max-height: 30px;
          overflow: hidden;
          cursor: pointer;
          font-size: 0;
          color: #fff;
          flex-shrink: 0;
          line-height: 17px;

          span {
            display: inline;
            font-size: 12px;
            margin-left: 3px;
            vertical-align: top;
          }
        }
      }

      .user-mood {
        position: absolute;
        height: 88px;
        bottom: 8px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 8px;

        .mood-wrap {
          border: 1px solid rgba(97, 221, 204, 1);
          height: 100%;
          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;
          padding: 8px 0;

          .date-time {
            width: 72px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: flex-end;
            padding-bottom: 8px;
            color: #fff;
            flex-shrink: 0;
            border-right: 1px solid #61ddcc;

            h6 {
              font-size: 30px;
              font-weight: 500;
            }

            p {
              font-size: 12px;
              line-height: 17px;
              margin-top: 4px;
              .dgg-text-ellip;
              max-width: 100%;
              padding: 0 10px;
            }
          }

          .mood-list {
            flex: 1;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            margin: 0 17px;
            padding-bottom: 8px;
            overflow: hidden;

            h6,
            p {
              line-height: 17px;
              font-size: 12px;
              .dgg-text-ellip;
              margin-top: 4px;
            }

            h6:hover {
              cursor: default;
            }
          }
        }
      }
    }

    &.middle {
      .dgg-card {
        height: 115px;
        margin-bottom: 20px;
        padding: 16px 28px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        h6 {
          font-size: 26px;
          font-weight: 550;
          color: #19233c;

          line-height: 31px;
          .dgg-text-ellip;

          &.passed-order {
            color: #f10940;
          }
        }

        p {
          font-size: 12px;
          font-weight: 400;
          color: #666873;
          line-height: 17px;
          .dgg-text-ellip;
        }
      }
    }
  }
}

.work-middle-row {
  height: 431px;
  margin-top: 24px;

  /deep/ .el-col {
    height: 100%;

    .dgg-card {
      height: 100%;

      &.news-notify {
        padding: 20px 17px;
        overflow: hidden;
        color: #9398a1;

        .notify-title {
          padding: 0 4px 17px 11px;
          border-bottom: 1px solid #e3e4e6;
          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;
          align-items: center;

          h6 {
            font-size: 14px;
            font-weight: 550;
            color: #19233c;
            line-height: 22px;
            .dgg-text-ellip;
          }

          span {
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            flex-shrink: 0;
            padding: 2px 10px;
            cursor: pointer;

            &:hover {
              color: #10bbb8;
            }
          }
        }

        .notify-lists {
          padding: 5px 0;
          overflow: hidden;
          max-height: 350px;

          .list {
            overflow: hidden;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            padding: 15px 13px;
            cursor: pointer;

            &:hover {
              background-color: #f0f2f5;
            }

            svg {
              margin-right: 20px;
              flex-shrink: 0;
            }

            & > div {
              flex: 1;
              overflow: hidden;

              h6 {
                font-size: 12px;
                font-weight: 600;
                color: #19233c;
                line-height: 17px;
                .dgg-text-ellip;
              }

              p {
                font-size: 12px;
                font-weight: 400;
                color: #9398a1;
                line-height: 17px;
                margin-top: 2px;
                .dgg-text-ellip;
              }
            }
          }
        }
      }

      &.task-order-lists {
        padding: 0 20px 14px 14px;
        position: relative;

        .el-tabs {
          height: 100%;

          /deep/ .el-tabs__header {
            margin-bottom: 0px;
          }

          .el-tabs__nav-scroll {
            padding: 0 58px 0 15px;
            overflow: hidden;
            font-size: 14px;
            color: #666873;

            .el-tabs__nav {
              width: 100%;
              height: 48px;
              .dgg-text-ellip;

              /deep/ .el-tabs__item {
                line-height: 48px;
                height: 48px;
                font-size: 14px;
              }
            }
          }

          .el-tabs__content {
            height: calc(100% - 68px);

            .el-tab-pane {
              height: 100%;

              .el-row {
                height: 100%;
                overflow: hidden;

                .order-list {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  flex-wrap: nowrap;
                  height: 89px;
                  overflow: hidden;
                  padding: 0 10px 0 16px;
                  border-bottom: 1px solid #edeff0;

                  &:hover {
                    background-color: #f0f2f5;
                  }

                  &:nth-child(n + 4) {
                    border-bottom: none;
                  }

                  .tab-list-names {
                    flex: 1;
                    height: 100%;
                    padding-right: 16px;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: nowrap;
                    overflow: hidden;
                    padding-top: 21px;
                    cursor: pointer;

                    .list-checkbox {
                      flex-shrink: 0;
                      margin-right: 12px;

                      /deep/ .el-checkbox__input {
                        margin-top: -5px;
                      }
                    }

                    .list-group {
                      flex: 1;
                      overflow: hidden;

                      .list-title {
                        display: flex;
                        align-items: center;
                        flex-wrap: nowrap;
                        flex: 1;

                        .el-tag {
                          height: 18px;
                          border-radius: 10px;
                          font-size: 12px;
                          line-height: 16px;
                          font-weight: 400;
                          margin-right: 6px;
                          background-color: transparent;

                          &.due-tag {
                            color: #fd8e26;
                            border-color: #fd8e26;
                          }

                          &.overdue-tag {
                            color: #f10940;
                            border-color: #f10940;
                          }
                        }

                        h6 {
                          flex: 1;
                          .dgg-text-ellip;
                          font-size: 14px;
                          font-weight: 550;
                          color: #19233c;
                          line-height: 20px;
                          width: 0;

                          p {
                            max-width: calc(100% - 24px);
                            display: inline-block;
                            .dgg-text-ellip;
                            vertical-align: middle;
                            &.deleteLine {
                              text-decoration: line-through;
                            }
                            &.disabledEl {
                              color: #9398a1;
                            }
                          }

                          .dgg-icon {
                            margin-left: 4px;
                            display: inline-block;
                            vertical-align: middle;
                          }
                        }
                      }

                      .list-des {
                        margin-top: 8px;
                        font-size: 13px;
                        font-weight: 400;
                        color: #9398a1;
                        line-height: 18px;
                        .dgg-text-ellip;
                      }
                    }
                  }

                  .tab-list-img {
                    flex-shrink: 0;
                    width: 27px;
                    height: 27px;
                    // border: 1px solid red;
                    border-radius: 50%;
                    margin-right: 67px;
                  }

                  .tab-list-date {
                    flex-shrink: 0;
                    font-size: 13px;
                    font-weight: 400;
                    color: #19233c;
                    line-height: 18px;
                    min-width: 130px;
                    text-align: right;

                    &.tab-list-due-data {
                      color: #ffab2c;
                    }

                    &.tab-list-overdue-data {
                      color: #f10940;
                    }
                  }
                }
              }
            }
          }
        }

        .task-order-more {
          position: absolute;
          right: 30px;
          font-size: 12px;
          top: 0;
          height: 48px;
          line-height: 48px;
          color: #9398a1;
          cursor: pointer;
          z-index: 100;

          &:hover {
            color: #10bbb8;
          }
        }

        // 占位图
        .bitmap {
          height: 100%;
        }
      }
    }
  }
}

.work-bottom-row {
  height: 420px;
  margin-top: 24px;

  .el-col {
    height: 100%;

    .dgg-card {
      height: 100%;

      &.my-account {
        padding-top: 20px;
        overflow: hidden;
        color: #9398a1;

        .account-title {
          padding: 0 0 17px 11px;
          border-bottom: 1px solid #e3e4e6;
          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;
          align-items: center;
          margin: 0 17px;

          h6 {
            font-size: 14px;
            font-weight: 550;
            color: #19233c;
            line-height: 22px;
            .dgg-text-ellip;
          }

          span {
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            flex-shrink: 0;
            padding: 2px 13px;
            cursor: pointer;

            &:hover {
              color: #10bbb8;
            }
          }
        }
        .workbench-paln-handled {
          height: 100%;
        }
        .account-echarts {
          padding: 0 13px;
          margin: 0 17px;

          .data-statistics {
            .el-col {
              margin-top: 23px;
              margin-bottom: 3px;

              h6 {
                font-size: 20px;
                font-weight: 550;
                color: #19233c;
                line-height: 24px;
                .dgg-text-ellip;
              }

              p {
                font-size: 12px;
                font-weight: 400;
                color: #666873;
                line-height: 17px;
                .dgg-text-ellip;
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                margin-top: 4px;

                span {
                  display: inline-block;

                  &.name {
                    max-width: 138px;
                  }

                  &.cicre {
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background-color: #359ff8;
                    flex-shrink: 0;
                    margin-left: 4px;

                    &.withdrawals {
                      background-color: #b347cb;
                    }

                    &.account-balance {
                      background-color: #f10940;
                    }

                    &.withdrawals {
                      background-color: #ff2cff;
                    }
                  }
                }
              }
            }
          }
        }

        .echarts-graphical {
          height: calc(100% - 182px);
          position: relative;

          .no-echarts-data {
            width: 100%;
            position: absolute;
            bottom: 39px;
            left: 0;

            hr {
              margin: 0;
              background-color: #ffab2c;

              &:last-child {
                margin-top: 0.5px;
                background-color: #10bbb8;
              }
            }
          }
        }
      }

      .el-row {
        height: 100%;
        overflow: hidden;

        &.placing-orders {
          padding: 0 20px 0 14px;
        }

        .order-list {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: nowrap;
          height: 89px;
          overflow: hidden;
          padding: 0 10px 0 16px;
          border-bottom: 1px solid #edeff0;
          cursor: pointer;

          &:hover {
            background-color: #f0f2f5;
          }
          &:last-child {
            border-bottom: none;
          }
          &:nth-child(n + 4) {
            border-bottom: 0;
          }

          .tab-list-names {
            flex: 1;
            height: 100%;
            padding-right: 16px;
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            overflow: hidden;
            padding-top: 21px;

            .list-checkbox {
              flex-shrink: 0;
              margin-right: 12px;
            }

            .list-group {
              flex: 1;
              overflow: hidden;

              .list-title {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;

                .el-tag {
                  height: 18px;
                  border-radius: 10px;
                  font-size: 12px;
                  line-height: 16px;
                  font-weight: 400;
                  margin-right: 6px;
                  background-color: transparent;

                  &.due-tag {
                    color: #fd8e26;
                    border-color: #fd8e26;
                  }

                  &.overdue-tag {
                    color: #f10940;
                    border-color: #f10940;
                  }
                }

                h6 {
                  flex: 1;
                  .dgg-text-ellip;
                  font-size: 14px;
                  font-weight: 550;
                  color: #19233c;
                  line-height: 20px;
                }
              }

              .list-des {
                margin-top: 8px;
                font-size: 13px;
                font-weight: 400;
                color: #9398a1;
                line-height: 18px;
                .dgg-text-ellip;
              }
            }
            .awiait-attr-status {
              flex-shrink: 0;
              .dgg-text-ellip;
              color: rgb(255, 0, 0);
              padding-top: 10px;
              max-width: 64px;
            }
          }

          .order-progress {
            flex-shrink: 0;
            margin-right: 65px;
            width: 222px;

            /deep/ .el-progress-bar__outer {
              height: 4px !important;
            }

            /deep/ .el-progress__text {
              font-size: 13px !important;
              font-weight: 400;
              color: #10bbb8;
              line-height: 18px;
              max-width: 38px;
              .dgg-text-ellip;
            }

            & > p {
              font-size: 13px;
              font-weight: 400;
              color: #9398a1;
              line-height: 18px;
              margin-top: 9px;
              .dgg-text-ellip;
            }
          }

          .tab-list-date {
            flex-shrink: 0;
            font-size: 13px;
            font-weight: 400;
            color: #19233c;
            line-height: 18px;
            min-width: 130px;
            text-align: right;

            &.tab-list-due-data {
              color: #ffab2c;
            }

            &.tab-list-overdue-data {
              color: #f10940;
            }
          }
        }
      }
    }
  }
}

.manage-team {
  display: inline-block;
  height: 100%;
  border-color: #e5e9f2;
  font-size: 14px;
  border-radius: 4px;
  color: #19233c;
  vertical-align: top;
  position: relative;

  .manage-team-hr {
    height: 10px;
    padding: 0 7px;

    > div {
      height: 100%;
      width: 100%;
      border-bottom: 1px solid #e3e4e6;
    }
  }

  .manage-team-footer {
    height: 55px;
    line-height: 55px;
    padding: 11.5px 0;
  }

  .manage-team-all {
    position: absolute;
    background: #fff;
    z-index: 100;
    width: 360px;
    height: 340px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 10px 5px 0;

    .manage-team-head {
      height: 55px;
      line-height: 55px;
      padding: 0 15px;
      display: flex;
      margin: 0 0 25px;

      .manage-team-title {
        width: 36px;
      }

      .manage-team-word {
        flex: 1;
        padding-left: 15px;
      }
    }
  }

  .manage-team-lists {
    & > li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
      height: 30px;
      line-height: 30px;

      margin-bottom: 2px;

      &.active-team {
        background-color: #f5f7fa;
        color: #10bbb8;

        .dgg-icon {
          display: inline;
        }
      }

      &:hover {
        background-color: #f5f7fa;
        color: #10bbb8;

        .dgg-icon {
          display: inline;
        }
      }

      p {
        font-size: 13px;
        .dgg-text-ellip;
        flex: 1;
        padding-right: 14px;
      }

      .dgg-icon {
        flex-shrink: 0;
        display: none;
      }
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }

  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  .list-group {
    min-height: 20px;
    max-height: 183px;
    overflow-y: auto;
  }

  .list-group-item {
    cursor: move;
    width: 100%;
    height: 40px;
    padding: 0 15px;
    line-height: 40px;
    background: #fff;
    overflow: hidden;
    font-size: 14px;
    font-weight: 400;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    margin-bottom: 6px;
  }

  .list-group-item:last-child {
    margin-bottom: 0px;
  }

  .list-group-item:hover {
    background: rgba(245, 247, 250, 1);
  }

  .list-group-item i {
    cursor: pointer;
  }

  .list-group-item-action {
    width: 100%;
    color: #495057;
    text-align: inherit;
  }

  .list-group-item-action:hover,
  .list-group-item-action:focus {
    z-index: 1;
    color: #495057;
    text-decoration: none;
    background-color: #f8f9fa;
  }

  .list-group-item-action:active {
    color: #212529;
    background-color: #e9ecef;
  }

  .list-group-item {
    position: relative;
    display: block;
    // margin-bottom: -1px;
    background-color: #fff;
  }

  .list-group-item:first-child {
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }

  .list-group-item:last-child {
    margin-bottom: 0;
    border-bottom-right-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }

  .list-group-item.disabled,
  .list-group-item:disabled {
    color: #6c757d;
    pointer-events: none;
    background-color: #fff;
  }

  .list-group-item.active {
    z-index: 2;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
}
</style>
