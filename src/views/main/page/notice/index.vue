<template>
  <div class="notice">
    <dgg-tabs v-model="activeName" class="normal-tabs" @tab-click="handleClick">
      <dgg-tab-pane label="未读通知" name="unread">
        <template v-if="unreadList.length > 0">
          <div class="list-box">
            <ul>
              <li v-for="item in unreadList" :key="item.id">
                <div class="left">
                  <dgg-icon
                    :icon-class="
                      iconList[
                        item.extendParamsJson.icon_type
                          ? item.extendParamsJson.icon_type
                          : 'noicon'
                      ] + '_active'
                    "
                    svg-width="36px"
                    svg-height="36px"
                  />
                </div>
                <div class="right">
                  <div class="title-box" @click="details(item, 'unreadStatus')">
                    <h4 class="text-one-line link">{{ item.title }}</h4>
                    <span>{{ item.createTimeStamp | filteTime }}</span>
                  </div>
                  <p class="text-one-line">{{ item.msgContent }}</p>
                </div>
              </li>
            </ul>
          </div>
          <dgg-pagination
            :current-page="currentPageUnread"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :total="unreadTotalSize"
            layout="sizes, prev, pager, next"
            @size-change="handleSizeChange($event)"
            @current-change="handleCurrentChange($event, 'currentPageUnread')"
            v-if="unreadTotalSize > 10"
          />
        </template>
        <!-- 占位图 -->
        <taskBitMap
          svgWidth="100px"
          svgHeight="100px"
          svgClass="icon_nomessage"
          synopsis="没有未读通知哦~~"
          v-if="unreadList.length < 1"
        />
      </dgg-tab-pane>
      <dgg-tab-pane label="已读通知" name="read">
        <template v-if="readList.length > 0">
          <div class="list-box">
            <ul>
              <li v-for="item in readList" :key="item.id">
                <div class="left">
                  <!--  :icon-class="iconList[item.extendParamsJson.icon_type?item.extendParamsJson.icon_type:'icon_nodatanews']" -->
                  <dgg-icon
                    :icon-class="
                      iconList[
                        item.extendParamsJson.icon_type
                          ? item.extendParamsJson.icon_type
                          : 'noicon'
                      ]
                    "
                    svg-width="36px"
                    svg-height="36px"
                  />
                </div>
                <div class="right">
                  <div class="title-box" @click="details(item, 'readStatus')">
                    <h4 class="text-one-line link">{{ item.title }}</h4>
                    <span>{{ item.createTimeStamp | filteTime }}</span>
                  </div>
                  <p class="text-one-line">{{ item.msgContent }}</p>
                </div>
              </li>
            </ul>
          </div>
          <dgg-pagination
            :current-page="currentPageRead"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :total="readTotalSize"
            layout="sizes, prev, pager, next"
            @size-change="handleSizeChange($event)"
            @current-change="handleCurrentChange($event, 'currentPageRead')"
            v-if="readTotalSize > 10"
          />
        </template>
        <!-- 占位图 -->
        <taskBitMap
          svgWidth="100px"
          svgHeight="100px"
          svgClass="icon_nomessage"
          synopsis="没有已读通知哦~~"
          v-if="readList.length < 1"
        />
      </dgg-tab-pane>
    </dgg-tabs>
    <fixedNotice :top="546" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import moment from "moment";
import fixedNotice from "@/views/main/page/components/fixedNotice.vue";
import taskBitMap from "@/views/main/page/components/taskBitMap.vue";
export default {
  name: "Notice",
  filters: {
    filteTime(val) {
      return moment(Number(val)).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  components: {
    fixedNotice,
    taskBitMap // 占位图
  },
  data() {
    return {
      activeName: "unread",
      currentPageUnread: 1,
      currentPageRead: 1,
      pageSizes: [10, 20, 30, 50, 100],
      pageSize: 10,
      unreadTotalSize: 0,
      readTotalSize: 0,
      unreadList: [],
      readList: []
    };
  },
  computed: {
    ...mapState([
      "iconList", //消息通知图标icon状态
      "userId",
      "orderStatus"
    ])
  },
  watch: {},
  async mounted() {
    // this.getNotify("unread");
    let iconState = this.activeName == "unread" ? 0 : 1;
    let iconType = this.activeName == "unread" ? "unreadList" : "readList";
    let pageNo =
      this.activeName == "unread"
        ? this.currentPageUnread
        : this.currentPageRead;
    let totalSize =
      this.activeName == "unread" ? "unreadTotalSize" : "readTotalSize";
    this.getMessageList(iconState, iconType, pageNo, totalSize); //调用获取列表
  },
  activated() {
    //
  },
  created() {
    //
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions(["ruoterJump"]),
    ...mapActions("workbenchModule", [
      "get_message_total", //消息通知列表接口
      "read_msg" //用户消息已读
    ]),
    ...mapActions("transactionDynamicModule", [
      "get_production_order_details_data" //获取订单详情
    ]),
    ...mapMutations([
      "setNewsRulesData", //消息规则数据
      "setTransactionStageId", //设置办理阶段id
      "setTransactionTaskId", //设置办理任务id
      "setTransactionItem"
    ]),
    getNotify(type) {
      if (type === "unread") {
        this.unreadList = [
          {
            id: "761879",
            status: "success",
            title: "新增团队邀请",
            content: "已加入已加入已加入已加入已加入已加入已加入",
            noticeType: "invite",
            type: "add_case",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "768379",
            status: "confirm",
            title: "新增团队邀请",
            content: "待确认待确认待确认待确认待确认待确认待确认待确认",
            noticeType: "invite",
            type: "add_case",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "76879",
            status: "0",
            title: "新增案件任务",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "add_case",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "sdeswr",
            status: "0",
            title: "添加分配任务",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "add_task",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "gfghj",
            status: "0",
            title: "任务截止时间提醒",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "as_remind",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "56th",
            status: "0",
            title: "取消截止时间",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "cancel_deadline",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "ghjjkj",
            status: "0",
            title: "取消分配任务",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "cancel_distribution",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "drt5r7y68",
            status: "0",
            title: "撤销订单申请",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "cancel_order",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "ghjyu78",
            status: "0",
            title: "撤销订单结项申请",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "cancel_order_finish",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "890jmyui",
            status: "0",
            title: "订单结项提醒",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "case_order",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "hj5t65456",
            status: "0",
            title: "删除备注",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "delete_remark",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "dt5r654678",
            status: "0",
            title: "任务删除提醒",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "delete_task",
            time: "2019-01-01 12:34:55"
          }
        ];
      } else if (type === "read") {
        this.readList = [
          {
            id: "7612879",
            status: "success",
            title: "新增团队邀请",
            content: "已加入已加入已加入已加入已加入已加入已加入",
            noticeType: "invite",
            type: "add_case",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "7683739",
            status: "confirm",
            title: "新增团队邀请",
            content: "待确认待确认待确认待确认待确认待确认待确认待确认",
            noticeType: "invite",
            type: "add_case",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "76879",
            status: "1",
            title: "新增案件任务",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "add_case",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "sdeswr",
            status: "1",
            title: "添加分配任务",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "add_task",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "gfghj",
            status: "1",
            title: "任务截止时间提醒",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "as_remind",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "56th",
            status: "1",
            title: "取消截止时间",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "cancel_deadline",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "ghjjkj",
            status: "1",
            title: "取消分配任务",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "cancel_distribution",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "drt5r7y68",
            status: "1",
            title: "撤销订单申请",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "cancel_order",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "ghjyu78",
            status: "1",
            title: "撤销订单结项申请",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "cancel_order_finish",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "890jmyui",
            status: "1",
            title: "订单结项提醒",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "case_order",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "hj5t65456",
            status: "1",
            title: "删除备注",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "delete_remark",
            time: "2019-01-01 12:34:55"
          },
          {
            id: "dt5r654678",
            status: "1",
            title: "任务删除提醒",
            content: "茫茫一个锅在任务评论中提到你，相关任务：你们那里",
            type: "delete_task",
            time: "2019-01-01 12:34:55"
          }
        ];
      }
    },
    handleClick(type) {
      // this.getNotify(this.activeName);
      this.$nextTick(() => {
        this.currentPageUnread = 1;
        this.currentPageRead = 1;
        this.pageSize = 10;
        this.unreadTotalSize = 0;
        this.readTotalSize = 0;
        let iconState = this.activeName == "unread" ? 0 : 1;
        let iconType = this.activeName == "unread" ? "unreadList" : "readList";
        let pageNo =
          this.activeName == "unread"
            ? this.currentPageUnread
            : this.currentPageRead;
        let totalSize =
          this.activeName == "unread" ? "unreadTotalSize" : "readTotalSize";
        // console.log(iconState);
        // console.log(iconType);
        this.getMessageList(iconState, iconType, pageNo, totalSize); //调用获取列表
      });
    },
    handleSizeChange(isThat) {
      //修改分页条数
      console.log(isThat, "修改条数---");
      this.pageSize = isThat;

      let iconState = this.activeName == "unread" ? 0 : 1;
      let iconType = this.activeName == "unread" ? "unreadList" : "readList";
      let pageNo =
        this.activeName == "unread"
          ? this.currentPageUnread
          : this.currentPageRead;
      let totalSize =
        this.activeName == "unread" ? "unreadTotalSize" : "readTotalSize";
      this.getMessageList(iconState, iconType, pageNo, totalSize); //调用获取列表
    },
    handleCurrentChange(e, val) {
      // console.log(e, "修改页数传递的页数e------");
      // console.log(val, "修改页数------");
      //修改分页页数
      this.currentPageUnread = e;
      this.currentPageRead = e;
      let iconState = this.activeName == "unread" ? 0 : 1;
      let iconType = this.activeName == "unread" ? "unreadList" : "readList";
      let pageNo =
        this.activeName == "unread"
          ? this.currentPageUnread
          : this.currentPageRead;
      let totalSize =
        this.activeName == "unread" ? "unreadTotalSize" : "readTotalSize";

      this.getMessageList(iconState, iconType, pageNo, totalSize); //调用获取列表
    },
    details(item, status) {
      console.log(JSON.parse(JSON.stringify(item)), "点击消息");
      console.log(status, "点击消息");
      if (status == "unreadStatus") {
        //用户消息已读
        this.readMsgFn(item);
      }

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
            this.getMessageList(0, "unreadList", 1, "unreadTotalSize");
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
    getMessageList(iconState, iconType, pageNo, totalSize) {
      //消息通知列表接口
      this.get_message_total({
        //msgType:'',//消息类型，订单消息：QDS_MSG_TYPE_ORDER，交易消息：QDS_MSG_TYPE_TRADE，系统消息 ：QDS_MSG_TYPE_SYSTEM，不传则全部
        pageNo: pageNo,
        pageSize: this.pageSize, //分页参数
        userId: this.userId,
        readStatus: iconState //消息类型状态  0 未读， 1 已读，默认全部
      }).then(res => {
        // unreadNoitces
        if (res.code == 200) {
          this.$nextTick(() => {
            // 设置显示echarts数据
            this[iconType] = res.data.dataList;
            this[totalSize] = Number(res.data.totalSize);

            if (iconState === 0) {
              this.$bus.$emit("msgRefresh", Number(res.data.totalSize));
            }
            // console.log(this.unreadTotalSize, "unreadTotalSize");
            // console.log(this.readTotalSize, "readTotalSize");
          });
        } else {
        }
      });
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
@import "~@/assets/less/main.less"; //引入全局less文件
.notice {
  width: 100%;
  min-height: 100%;
  border-radius: 4px;
  background-color: #ffffff;
  margin-bottom: 36px;
  .el-tab-pane {
    padding: 15px 0 20px;
  }
  .el-pagination {
    padding: 20px 10px 0;
    margin: 0 10px;
    border-top: 1px @flsc-border-color solid;
  }
  .list-box {
    padding: 0 30px;
    height: calc(100% - 50px);
    overflow: auto;
    ul {
      width: 100%;
    }
    li {
      display: flex;
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 28px;
      }
      .left {
        flex: 0 0 auto;
        width: 36px;
      }
      .right {
        width: calc(100% - 54px);
        margin-left: 20px;
        .title-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
          h4 {
            font-size: 12px;
            font-weight: bold;
            color: @flsc-main;
            width: 910px;
            flex: 0 0 auto;
            &.link {
              cursor: pointer;
              &:hover {
                color: @main;
              }
            }
          }
          span {
            font-size: 12px;
            color: #9398a1;
            display: inline-block;
            max-width: 130px;
            text-align: right;
            .dgg-text-ellip;
          }
        }
        p {
          font-size: 12px;
          color: #9398a1;
          max-width: calc(100% - 200px);
        }
      }
    }
  }
  .el-tabs__content {
    height: calc(100% - 55px);
  }
  .el-tab-pane {
    height: 100%;
  }
  .normal-tabs {
    height: 100%;
  }

  /deep/.taskBitMap {
    min-height: 700px;
  }
}
</style>

<style lang="less" scoped></style>
