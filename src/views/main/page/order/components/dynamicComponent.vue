<template>
  <div class="dynamicComponent">
    <!--切换按钮 start -->
    <div class="dgg-btn">
      <dgg-button
        v-for="(item, index) in tabNames"
        :key="index"
        :class="currentTab == index ? 'this-btn' : ''"
        @click="changetab(index)"
        >{{ item }}</dgg-button
      >
    </div>
    <!-- 切换按钮 end -->
    <dgg-row>
      <!-- 动态左边 start -->
      <dgg-col :span="18">
        <!-- 阶段名称步骤条 start -->
        <div class="phaseName-step" v-show="phaseNameList.length > 0">
          <!-- 上一步 -->
          <dgg-icon
            v-if="stepStart > 0"
            slot="icon"
            class="arrow-left arrow"
            svg-width="36px"
            svg-height="36px"
            icon-class="dgg_left"
            @click="stepMove(-1)"
          />
          <div class="steps-box">
            <dgg-steps :active="stepActive" align-center space="600">
              <dgg-step
                v-for="(item, index) in phaseNameList"
                v-show="index >= stepStart && index < stepStart + 5"
                :key="index"
                :title="item.stageName"
                :description="
                  item.complateTask != 0 ? item.latestUpdateTime : ''
                "
                :progress="true"
              >
                <template slot="progress">
                  <dgg-progress
                    type="sector"
                    :percentage="
                      isNaN((item.complateTask / item.allTask) * 100)
                        ? 0
                        : (item.complateTask / item.allTask) * 100
                    "
                    :width="14"
                  />
                </template>
              </dgg-step>
            </dgg-steps>
          </div>
          <!-- 下一步 -->
          <dgg-icon
            v-if="stepStart + 5 < phaseNameList.length"
            slot="icon"
            class="arrow-right arrow"
            svg-width="36px"
            svg-height="36px"
            icon-class="dgg_right"
            @click="stepMove(1)"
          />
        </div>
        <!-- 阶段名称步骤条 end -->
        <!-- 发表信息及信息轴 start -->
        <div class="content">
          <!--发表信息 start  -->
          <dgg-form ref="ruleForm" :model="from">
            <dgg-form-item>
              <dgg-input
                :resize="'none'"
                v-model="from.desc"
                :rows="4"
                type="textarea"
                maxlength="1000"
              />
            </dgg-form-item>
            <dgg-button
              type="primary"
              @click="submitForm('ruleForm')"
              :disabled="isLength"
              :class="[isLength ? 'yes-diabled' : 'no-diabled']"
              :loading = saveLodading
              >保存</dgg-button
            >
          </dgg-form>
          <!-- 发表信息 end -->

          <!-- 切换动态时间铀 start-->
          <ul class="tab-dynamic-list">
            <!-- 全部 start -->
            <li v-if="currentTab == 0" class="tab-dynamic-list-li">
              <div
                v-for="(item, index) in dynamicList"
                :key="index"
                class="phase-box"
              >
                <h4>
                  <div class="title-icon">
                    <dgg-icon
                      icon-class="dgg-icon-step"
                      svg-width="24px"
                      svg-height="24px"
                    />
                  </div>
                  {{ item.createDate }}
                </h4>
                <div
                  v-for="(phaseItem, phaseIndex) in item.contentVos"
                  :key="phaseIndex"
                  class="phase-detail"
                >
                  <div class="task-top">
                    <div class="task-title">
                      <div class="task-person">
                        <dgg-tooltip
                          :content="phaseItem.createrName"
                          effect="dark"
                          placement="top"
                        >
                          <div>
                            <img
                              :src="
                                phaseItem.createrHeadAddress
                                  ? phaseItem.createrHeadAddress
                                  : userInfoSrc
                              "
                              :onerror="defaultImg"
                              class="person-img"
                            />
                            <!-- <span v-if="phaseItem.receiver.isMain === 1">主</span> -->
                          </div>
                        </dgg-tooltip>
                      </div>
                      <label>{{ phaseItem.createrName }}</label>
                      <span>{{ phaseItem.createTime }}</span>
                      <span>{{ phaseItem.optName }}</span>
                    </div>
                  </div>
                  <div class="item-info">
                    <div class="desc-text">{{ phaseItem.optDetails }}</div>
                  </div>
                </div>
              </div>
              <!-- 分页 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
              ></el-pagination>
            </li>
            <!-- 全部 end -->
            <!-- 与我相关 start -->
            <li v-if="currentTab == 1" class="tab-dynamic-list-li">
              <div
                v-for="(item, index) in dynamicList"
                :key="index"
                class="phase-box"
              >
                <h4>
                  <div class="title-icon">
                    <dgg-icon
                      icon-class="dgg-icon-step"
                      svg-width="24px"
                      svg-height="24px"
                    />
                  </div>
                  {{ item.createDate }}
                </h4>
                <div
                  v-for="(phaseItem, phaseIndex) in item.contentVos"
                  :key="phaseIndex"
                  class="phase-detail"
                >
                  <div class="task-top">
                    <div class="task-title">
                      <div class="task-person">
                        <dgg-tooltip
                          :content="phaseItem.createrName"
                          effect="dark"
                          placement="top"
                        >
                          <div>
                            <img
                              :src="
                                phaseItem.createrHeadAddress
                                  ? phaseItem.createrHeadAddress
                                  : userInfoSrc
                              "
                              :onerror="defaultImg"
                              class="person-img"
                            />
                            <!-- <span v-if="phaseItem.receiver.isMain === 1">主</span> -->
                          </div>
                        </dgg-tooltip>
                      </div>
                      <label>{{ phaseItem.createrName }}</label>
                      <span>{{ phaseItem.createTime }}</span>
                      <span>{{ phaseItem.optName }}</span>
                    </div>
                  </div>
                  <div class="item-info">
                    <div class="desc-text">{{ phaseItem.optDetails }}</div>
                  </div>
                </div>
              </div>
              <!-- 无阶段占位图 -->
              <taskBitMap
                synopsis="暂无数据"
                svg-class="icon_nostage"
                svg-width="58px"
                svg-height="41px"
                v-if="!dynamicList"
              />
              <!-- 分页 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
              ></el-pagination>
            </li>
            <!-- 与我相关 end -->
          </ul>
          <!-- 切换动态时间铀 end -->
        </div>
        <!-- 发表信息及信息轴 end -->
      </dgg-col>
      <!-- 动态左边 start -->
      <!-- 动态右边 start -->
      <dgg-col :span="6">
        <div class="right">
          <h2>基础信息</h2>
          <!-- 项目名称 end -->
          <div class="basics-content">
            <!-- 项目周期 start @blur="saveName(basicInfor.name)" -->
            <div class="content-box cycle-box obj-name">
              <h3 class="cylcle-title">项目名称</h3>
              <dgg-input
                v-model="basicInfor.name"
                maxlength="30"
                readonly
                class="projecName"
              />
            </div>
          </div>

          <!-- 项目名称 end -->
          <div class="basics-content">
            <!-- 项目周期 start -->
            <div class="content-box cycle-box">
              <h3 class="cylcle-title">项目周期</h3>
              <div class="cycle">
                <dgg-icon
                  slot="icon"
                  svg-width="12px"
                  svg-height="12px"
                  icon-class="dgg_time"
                />
                <span>开始</span>
                <div class="time-text">{{ startTime }}</div>
              </div>
              <div class="cycle">
                <dgg-icon
                  slot="icon"
                  svg-width="12px"
                  svg-height="12px"
                  icon-class="dgg_time"
                />
                <span>结束</span>
                <div class="time-text">{{ endTime }}</div>
              </div>
            </div>
            <!-- 项目周期 end -->
            <!-- 财务分成 end -->

            <!-- 项目统计 start -->
            <div class="content-box project-box">
              <h3>项目统计</h3>
              <div class="finance-text">
                <dgg-row>
                  <dgg-col :span="8">
                    <span>已完成</span>
                    <b
                      ><b>{{ statistics.complateTask }}</b></b
                    >
                    <label class="green-bg" />
                  </dgg-col>
                  <dgg-col :span="8">
                    <span>未完成</span>
                    <b>{{ statistics.incomplateTask }}</b>
                    <label class="red-bg" />
                  </dgg-col>
                  <dgg-col :span="8">
                    <span>已逾期</span>
                    <b>{{ statistics.beOverdueTask }}</b>
                    <label class="red-bg" />
                  </dgg-col>
                </dgg-row>
                <dgg-row>
                  <dgg-col :span="8">
                    <span>待分配</span>
                    <b>{{ statistics.waitingDistributeTask }}</b>
                    <label class="darkgray-bg" />
                  </dgg-col>
                  <dgg-col :span="8">
                    <span>今日到期</span>
                    <b>{{ statistics.toDayExpireTask }}</b>
                    <label class="gray-bg" />
                  </dgg-col>
                  <dgg-col :span="8">
                    <span>逾期完成</span>
                    <b>{{ statistics.overdueComplate }}</b>
                    <label class="gray-bg" />
                  </dgg-col>
                </dgg-row>
              </div>
            </div>
            <!-- 项目统计 end -->
          </div>
        </div>
      </dgg-col>
      <!-- 动态右边 end -->
    </dgg-row>

    <!-- 已完结标签 -->
    <!-- v-if="transactionItem.orderStatusCode=='QDS_SC_ORDER_STATUS_CODE04'" -->
    <div
      class="finishImg"
      :class="{
        'back-order-seal-active': getOrderStatusSealName() == '已退单'
      }"
      fit="cover"
      v-if="
        !orderDetailAuthority.includes($route.name) && getOrderStatusSealName()
      "
    >
      <!-- 返回盖章名称 -->
      <p class="finishImg-title">{{ getOrderStatusSealName() }}</p>
      <p class="finishImg-time">
        {{ transactionItem.endTime | timeFilter("YYYY.MM.DD") }}
      </p>
    </div>

    <!-- 右下角订单图标状态 -->
    <orderStatusIconComponents
      :storeTransactionItem="transactionItem"
    ></orderStatusIconComponents>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
import taskBitMap from "@/views/main/page/components/taskBitMap.vue";
import orderStatusIconComponents from "@/views/main/page/components/orderStatusIcon.vue";
import moment from "moment";
export default {
  name: "dynamicComponent",
  filters: {
    filteTime(val) {
      return moment(Number(val)).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  components: {
    taskBitMap, // 任务无数据占位图
    orderStatusIconComponents //右下角订单图标状态
  },
  data() {
    return {
      //---------------------ZL 新增
      saveLodading:false, // 保存按钮防重复点击
      defaultImg:
        'this.src="' + require("@/assets/images/image_head_default.png") + '"',
      userInfoSrc: require("@/assets/images/image_head_default.png"),
      currentTab: 0, // 判断类型（全部，与我相关
      activeRadioData: "1",
      tabNames: ["全部", "与我相关"],
      stepActive: 0,
      page: 1, // 当前页数 默认第一页
      limit: 20, // 当前每页显示多少数据
      stepStart: 0, // arrow初始
      from: {
        desc: "" // 动态输入
      },
      // 基础信息
      basicInfor: {
        name: "" // 项目名称
      },
      startTime: "--", // 开始时间
      endTime: "--", // 开始时间
      orderMoney: 1, //订单金额
      commission: 1, //佣金
      commissionRatio: 0, //分成比例
      dynamicList: [], // 时间轴消息
      phaseNameList: [], // 阶段名称
      totalCount: 0, //默认数据总数
      statistics: {}, //任务统计数
      portraitFault: "/src/assets/images/image_portrait_fault.png"
    };
  },
  computed: {
    ...mapState([
      "transactionItem",
      "storeInfoData",
      "orderStatus",
      "orderDetailAuthority"
    ]),

    // 判断是否有文本内容
    isLength() {
      if (this.from.desc.trim().length) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {},
  async mounted() {
    // 获取动态步骤
    this.zysc_stage_list_new({
      zygsscId: this.transactionItem.id
    }).then(res => {
      if (res.code == 200) {
        if (
          res.data &&
          res.data.orderStageVOList &&
          res.data.orderStageVOList.length > 0
        ) {
          for (let i in res.data.orderStageVOList) {
            for (let k in res.data.orderStageVOList[i]) {
              if (k == "latestUpdateTime") {
                this.$set(
                  res.data.orderStageVOList[i],
                  k,
                  this.getTime(res.data.orderStageVOList[i][k], "1")
                );
              }
            }
          }
        }
        this.basicInfor.name = res.data.projectName; //  项目名称
        this.startTime = res.data.projectStartDate
          ? this.getTime(res.data.projectStartDate)
          : "--"; // 开始时间
        this.endTime = res.data.projectEndDate
          ? this.getTime(res.data.projectEndDate)
          : "--"; // 结束时间
        this.phaseNameList = res.data.orderStageVOList; //阶段信息展示
        this.stepActiveCount(); // 获取进度数
      }
    });
    this.getMessageList(0, this.transactionItem.id, this.limit, this.page); // 获取用户操作备注
    await this.getStatistics(); // 获取任务截至统计
  },

  activated() {
    //
  },
  created() {
    //console.log(this.transactionItem);
  },
  beforeDestroy() {
    //
    this.setRouteParmsTitle("");
  },
  methods: {
    ...mapMutations(["setTransactionItem", "setRouteParmsTitle"]),

    ...mapActions("transactionDynamicModule", [
      "zysc_stage_list_new", // 获取动态步骤
      "zysc_query_inventory_dynamic", // 获取备注信息
      "zysc_generate_dynamic", // 添加备注
      "zysc_task_todal_scount_dynamic" // 查询任务统计
    ]),
    //返回订单盖章名称
    getOrderStatusSealName() {
      switch (this.transactionItem.orderStatus) {
        case this.orderStatus.QDS_SC_ORDER_FINISH: // 已完结
          return "已完结";
          break;
        case this.orderStatus.QDS_SC_ORDER_REFUND: // 已退单
          return "已退单";
          break;
        default:
          return "";
          break;
      }
    },
    // 字符传转成时间
    getTime(time, type) {
      let date;
      if (time.length == 13) {
        date = new Date(Number(time));
      }
      if (time.length == 10) {
        date = new Date(Number(time) * 1000);
      }
      let Y = date.getFullYear();
      let M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let D = date.getDate() <10 ? "0"+ (date.getDate()) : date.getDate();
      let h = date.getHours()< 10 ? "0"+(date.getHours()): date.getHours();
      let m = date.getMinutes()<10 ? "0"+(date.getMinutes()): date.getMinutes();
      let s = date.getSeconds() < 10 ? "0"+ date.getSeconds(): date.getSeconds();
      if (type) {
        return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
      }
      return Y + "年" + M + "月" + D + "日" + h + ":" + m + ":" + s;
    },
    //定义请求
    getMessageList(isOwn, zygsscId, limit, page) {
      this.dynamicList = [];
      this.zysc_query_inventory_dynamic({
        isOwn: isOwn, // 是否只查询自己相关
        zygsscId: zygsscId, //专业公司生产ID
        limit: limit, //每页数据大小
        page: page //页码
      }).then(res => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.dynamicList = res.data.records;
            this.totalCount = res.data.total;
          });
        }
      });
    },
    // 查询数据
    iscurrentTab() {
      if (this.currentTab == 0) {
        // 全部
        this.getMessageList(0, this.transactionItem.id, this.limit, this.page);
      } else if (this.currentTab == 1) {
        // 与我相关
        this.getMessageList(1, this.transactionItem.id, this.limit, this.page);
      }
    },
    // 切换（全部，与我相关） 点击
    changetab(val) {
      this.currentTab = val;
      this.page = 1;
      this.iscurrentTab();
    },
    // 上一步，下一步切换
    stepMove(val) {
      this.stepStart = this.stepStart + val;
    },
    // 每页显示数量改变
    handleSizeChange(val) {
      this.limit = val;
      // 发送请求
      this.iscurrentTab();
    },
    // 页码 改变
    handleCurrentChange(val) {
      this.page = val;
      // 发送请求
      this.iscurrentTab();
    },
    // 保存 --  添加备注
    submitForm(formName) {
      this.saveLodading = true;
      this.$refs[formName].validate(valid => {
        if (!valid) return;
        this.zysc_generate_dynamic({
          zygsscId: this.transactionItem.id,
          remarkContent: this.from.desc
        }).then(res => {
          this.saveLodading = false;
          if (res.code == 200) {
            this.from.desc = ""; // 成功后清楚输入框
            this.iscurrentTab(); // 刷新数据
            this.$message({
              type: "success",
              message: res.message
            });
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
      });
    },
    // 任务统计
    getStatistics() {
      this.zysc_task_todal_scount_dynamic({
        zygsscId: this.transactionItem.id
      }).then(res => {
        if (res.code == 200) {
          this.statistics = res.data;
        }
      });
    },
    // 计算完成进度
    stepActiveCount() {
      typeof this.phaseNameList === "object" &&
        this.phaseNameList.length &&
        this.phaseNameList.forEach(item => {
          if (item.complateTask) {
            // 完成任务数
            this.stepActive++;
          }
        });
      return this.stepActive;
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
@import "~@/assets/less/main.less"; //引入全局less文件

.dynamicComponent {
  width: 100%;
  height: 100%;
  margin: 0 0 40px;
  position: relative;

  .projecName input {
    border: none !important;
  }

  .el-tabs__content {
    border-top: 1px solid #edeff0;
  }

  .tab-dynamic-list-li {
    height: 528px;
    overflow: auto;
  }

  .dgg-btn {
    width: 100%;
    padding: 20px 30px;
    border-bottom: 1px solid #edeff0;
    display: -webkit-flex;
    display: flex;

    .el-button {
      width: auto !important;
      padding: 0 15px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #e5e9f2;
      border-left: none;
      font-size: 14px;
      color: #19233c;
      background: none;
      margin: 0 !important;
      border-radius: 0 !important;
    }

    .el-button:first-child {
      border-left: 1px solid #e5e9f2 !important;
      border-radius: 4px 0 0 4px !important;
    }

    .el-button:last-child {
      border-radius: 0 4px 4px 0 !important;
    }

    .this-btn,
    .el-button:hover {
      background: #10bbb8;
      color: #fff;
    }
  }

  .phaseName-step {
    background: #f5f7fa;
    padding: 27px 0;
    position: relative;
    border-bottom: 1px solid #edeff0;

    .steps-box {
      width: 97%;
      height: 100px;
      overflow: hidden;
    }

    /deep/.dgg-step {
      flex-basis: 20% !important;
      max-width: 20% !important;
    }

    .arrow {
      position: absolute;
      top: 27px;
      cursor: pointer;
      z-index: 88;
    }

    .arrow-left {
      left: 0;
    }

    .arrow-right {
      right: 0;
    }
  }

  .el-step__title {
    font-size: 14px;
    color: #19233c;
    font-weight: 500;
    line-height: 20px;
    margin: 4px 0 5px;
  }

  .el-step.is-center {
    .el-step__description {
      padding: 0;
      font-size: 13px;
      color: #9398a1;
      line-height: 18px;
    }
  }

  .el-step__icon {
    width: 24px;
    height: 24px;
    border-width: 1px;

    .is-text {
      border-width: 1px;
    }

    .el-progress-sector {
      background-color: #10bbb8;

      .circle-bar-right.deg {
        background-color: #10bbb8;
      }
    }
  }

  .el-step__head.is-process {
    .el-step__icon {
      background: #fff !important;
      border: 1px solid #dbdcde;
    }
  }

  .content {
    width: 100%;
    padding: 30px;

    .el-form,
    .el-form-item__content {
      width: 100%;
    }

    /deep/.el-form-item {
      margin: 0 0 12px;
      padding: 0 !important;

      .el-textarea {
        margin: 0;
        width: 100% !important;
      }
    }

    .el-textarea__inner {
      padding: 3px 15px;
    }

    .phase-box {
      position: relative;
      margin: 10px 0 0;
      padding: 0 0 0 30px;

      &:before {
        content: "";
        position: absolute;
        left: 14.5px;
        top: 20px;
        bottom: -43px;
        display: block;
        width: 1px;
        background-color: @flsc-border-color;
      }

      h4 {
        position: relative;
        height: 40px;
        padding: 0 16px;
        margin-top: 12px;
        box-sizing: border-box;
        line-height: 40px;
        font-weight: 400;
        color: #9398a1;
        border-radius: 4px;

        .title-icon {
          position: absolute;
          left: -26px;
          top: 50%;
          margin-top: -12px;
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 100%;
          background-color: #ffffff;

          .dgg-icon {
            vertical-align: top;
          }
        }
      }

      .phase-detail {
        padding-left: 16px;

        .task-top {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &:before {
            position: absolute;
            left: -37px;
            top: 50%;
            margin-top: -6px;
            content: "";
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 100%;
            background-color: #edeff0;
            border: 2px #ffffff solid;
          }

          .task-title {
            color: @flsc-main;
            font-size: 14px;
            line-height: 27px;

            span {
              color: #9398a1;
            }

            label {
              color: #19233c;
              font-weight: 400;
            }
          }
        }

        .task-person {
          margin-right: 12px;
        }

        .item-info {
          margin-left: 42px;
          margin-bottom: 20px;
        }

        .desc-text {
          font-size: 13px;
          color: #666873;
          line-height: 19px;
          word-break: break-all;
          word-wrap: break-word;
        }
      }

      &:last-child {
        .phase-detail {
          &:last-child {
            .item-info {
              position: relative;

              &:before {
                content: "";
                position: absolute;
                left: -73px;
                top: -18px;
                bottom: -43px;
                display: block;
                width: 1px;
                background-color: #ffffff;
              }
            }
          }
        }
      }
    }
  }

  .task-person {
    position: relative;
    display: inline-block;
    margin-right: 12px;

    img {
      height: 26px;
      width: 26px;
      object-fit: cover;
      border-radius: 50%;
    }

    span {
      display: inline-block;
      position: absolute;
      right: -8px;
      top: -8px;
      width: 18px;
      height: 18px;
      line-height: 16px;
      text-align: center;
      border-radius: 50%;
      background-color: #ffae4b;
      color: #fff;
      font-size: 12px;
    }
  }

  /*   .el-button {
    width: 53px;
    height: 26px;
    line-height: 26px;
    border-radius: 4px;
    background: #88dedc;
    border-color: #88dedc;
    padding: 0;
    letter-spacing: 1px;
  } */
  .yes-diabled {
    background: #eee !important;
    color: #444 !important;
    border: none;
  }

  .no-diabled {
    background: #10bbb8 !important;
  }

  .right {
    width: 100%;
    position: relative;

    &:before {
      content: "";
      display: block;
      width: 1px;
      height: 100%;
      background: #edeff0;
      position: absolute;
      left: 0;
      top: 0;
    }

    h2 {
      width: 100%;
      padding: 0 20px;
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #edeff0;
      text-align: left;
      font-size: 14px;
      color: #19233c;
      font-weight: bold;
    }

    .el-form,
    .basics-content {
      width: 100%;
      padding: 0 20px;
    }

    .el-form-item__label,
    h3 {
      width: 100%;
      text-align: left;
      font-size: 13px;
      color: #9398a1;
      line-height: 18px;
      padding: 15px 0 0;
    }

    h3 {
      padding: 5px 0 0;
    }

    .el-form-item__content,
    .content-box {
      width: 100%;
      border-bottom: 1px solid #edeff0;
      padding: 10px 0 15px;

      .el-form-item {
        margin: 0;
      }
    }

    .cycle-box {
      padding: 5px 0;

      .cylcle-title {
        padding: 0 0 10px;
        margin-top: 15px;
      }
    }

    .obj-name {
      .cylcle-title {
        margin-top: 15px;
      }

      /deep/ .el-input__inner {
        margin-top: 0;
        margin-bottom: 10px;
      }
    }

    .el-input__inner {
      border: none;
      font-size: 14px;
      color: #19233c;
      line-height: 30px;
      height: 30px;
      border: 1px solid #edeff0;
      margin: 20px 0 0;
      overflow: hidden;
      /*超出隐藏*/
      white-space: nowrap;
      /*强制在同一行显示*/
      text-overflow: ellipsis;
      /*省略号*/
    }

    .cycle {
      padding: 5px 0;

      span,
      .time-text {
        font-size: 14px;
        color: #666873;
        line-height: 20px;
      }

      .time-text {
        color: #19233c;
        margin: 5px 0 10px;
      }
    }

    .finance-text {
      padding: 10px 0 0;

      .el-col-12 {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        padding: 6px 0;
      }

      span {
        color: #666873;
        font-weight: 400;
      }

      p {
        color: #19233c;
      }

      b {
        display: block;
        font-size: 24px;
        font-weight: 500;
        line-height: 30px;
        color: #19233c;
      }
    }

    .project-box {
      border: none;

      .el-col-12 {
        font-size: 13px;
      }
    }

    label {
      display: block;
      width: 79px;
      height: 2px;
      margin: 2px 0 0;
    }

    .green-bg {
      background: #10bbb8;
    }

    .red-bg {
      background: #fb688b;
    }

    .darkgray-bg {
      background: #969ca6;
    }

    .gray-bg {
      background: #dbdcde;
    }
  }

  .taskBitMap {
    padding: 15vh 0;
  }

  .el-tabs__nav-scroll {
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: start;
  }

  .finishImg {
    top: -20px;
    right: 180px;
    position: absolute;
    z-index: 100;
    background: url("~assets/images/icon_chapter_red.png") no-repeat;
    background-size: 100% 100%;
    width: 127px;
    height: 50px;
    padding: 5px;
    color: #f10940;
    text-align: center;
    transform: rotate(-30deg);
    -ms-transform: rotate(-30deg);
    /* IE 9 */
    -moz-transform: rotate(-30deg);
    /* Firefox */
    -webkit-transform: rotate(-30deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(-30deg);
    /* Opera */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3px;
    overflow: hidden;

    &.back-order-seal-active {
      background: url("~assets/images/icon_chapter_grey_back.png") no-repeat;
      background-size: 100% 100%;
      color: #d0d0d0;
    }

    .finishImg-time {
      font-size: 12px;
      font-weight: 400;
      font-size: 12px;
      font-weight: 400;
      height: 20px;
      line-height: 20px;
      .dgg-text-ellip;
      padding: 0 10px;
    }

    .finishImg-title {
      font-size: 18px;
      font-weight: 500;
      height: 24px;
      line-height: 24px;
      .dgg-text-ellip;
      padding: 0 20px;
    }

    .el-input--suffix .el-input__inner {
      padding-right: 10px;
    }
  }
}
</style>
