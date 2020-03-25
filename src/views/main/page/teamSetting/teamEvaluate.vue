`<template>
  <!-- 店铺信息页面 -->
  <div class="teamEvaluate">
    <div class="no-data" v-if="evaluateListsData.length === 0">
      <bitmap></bitmap>
    </div>
    <ul class="evaluate-lists" v-else>
      <li
        class="list"
        v-for="(item, index) in evaluateListsData"
        :key="item.scOrderId"
      >
        <div class="various-data">
          <img :src="item.imgUrl ? item.imgUrl : userInfoSrc" alt="" />
          <div class="team-name">
            <h6>客服</h6>
            <p>{{ item.latestEvaluateTime }}</p>
          </div>
          <p>
            综合得分<span class="active">{{ item.scoreAvg }}</span>
          </p>
          <p v-for="ite in item.scores" :key="ite.dimensionCode">
            {{ ite.dimensionName }}<span>{{ ite.dimensionScore }}</span>
          </p>
        </div>
        <div
          class="user-product"
          @click="toTranstionDetail(item, item.scOrderId)"
        >
          <p>
            <span>客户：{{ item.customerName }}</span>
            <span>产品类别：{{ item.productInfo }}</span>
          </p>
          <dgg-icon icon-class="dgg-right" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import bitmap from "@/views/main/page/components/bitmap.vue";
/* eslint-disable */
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "teamEvaluate",
  components: {
    bitmap
  },
  data() {
    return {
      userInfoSrc: require("@/assets/images/image_head_default.png"),
      evaluateListsData: [
        // {
        //   scOrderId: 1,
        //   imgUrl:
        //     "http://zys.dgg.net/static/home/images/service_index/wj-img.jpg",
        //   title: "李文华",
        //   latestEvaluateTime: "06/01 15:01",
        //   scoreAvg: "9.21",
        //   scores:[
        //     {"dimensionCode": "QDS_SCORE_ATITUDE", "dimensionName": "服务态度", "dimensionScore": "9.25"},
        //     {"dimensionCode": "QDS_SCORE_TIMELINESS", "dimensionName": "时效性", "dimensionScore": "9.25"},
        //     {"dimensionCode": "QDS_SCORE_PROCESS_REPORT", "dimensionName": "进度/节点跟踪反馈", "dimensionScore": "9.25"},
        //     {"dimensionCode": "QDS_SCORE_PROFESSIONAL", "dimensionName": "专业度", "dimensionScore": "9.25"}
        //     ],
        //   customerName: "湛江人",
        //   productInfo: "产品类别: 注册服务+刻章+西柯镇+客户+客户快递号+基尔加"
        // }
      ]
    };
  },
  created() {},
  async mounted() {
    console.log(this.storeInfoData.storeId, "this.storeInfoData.storeId---");
    if (this.storeInfoData.storeId) {
      //gs2016-2019-12-30修改
      let comment = await this.get_team_comment({
        storeId: this.storeInfoData.storeId
      });
      if (comment.code === 200) {
        if (comment.data.length > 0) {
          comment.data.forEach((it, inx) => {
            it.scores = JSON.parse(it.scores);
          });
        }
        this.evaluateListsData = comment.data;
      }
    }
  },
  computed: {
    ...mapState(["userId", "storeInfoData", "orderStatus"])
  },

  methods: {
    ...mapActions(["ruoterJump"]),
    ...mapActions("teamSettingModule", ["get_team_comment"]),
    ...mapActions("transactionDynamicModule", [
      "get_production_order_details_by_sc_order_id"
    ]),
    ...mapMutations([
      "setTransactionItem",
      "setTransactionStageId", //设置办理阶段id
      "setTransactionTaskId" //设置办理任务id
    ]),
    //跳转到订单详情
    toTranstionDetail(item, orderid) {
      if (orderid) {
        this.get_production_order_details_by_sc_order_id({
          scOrderId: orderid
        }).then(res => {
          if (res.code == 200) {
            this.setTransactionItem(res.data);
            let toOrderName = "";
            if (
              res.data.orderStatusCode == this.orderStatus.QDS_SC_ORDER_FINISH
            ) {
              toOrderName = "finishDetailsTask";
            }
            if (
              res.data.orderStatusCode == this.orderStatus.QDS_SC_ORDER_REFUND
            ) {
              toOrderName = "chargeBackDetailsTask";
            }
            if (toOrderName) {
              //如果是其它跳转到办理中并且有些需要定位阶段和任务选中
              this.ruoterJump({
                name: toOrderName,
                params: {
                  title: `${res.data.customerName}-${res.data.scOrderNo}`
                }
              });
            }
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
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件
.no-data {
  text-align: center;
  font-size: 14px;
  padding-top: 100px;
  min-height: 650px;
}
.teamEvaluate {
  margin-bottom: 100px;
  .evaluate-lists {
    padding: 0 30px;
    .list {
      border: 1px solid #edeff0;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #666873;
      font-size: 13px;
      margin-bottom: 20px;
      .various-data {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        .dgg-text-ellip;
        height: 40px;
        margin-bottom: 10px;

        & > img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 8px;
        }
        & > p,
        .team-name {
          width: 150px;
          height: 100%;
        }
        .team-name {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          h6 {
            font-weight: bold;
            font-size: 14px;
            color: #19233c;
            line-height: 22px;
            .dgg-text-ellip;
          }
          p {
            .dgg-text-ellip;
            font-size: 12px;
            line-height: 22px;
          }
        }
        & > p {
          line-height: 40px;
          .dgg-text-ellip;
          span {
            margin-left: 8px;
            font-size: 14px;
            &.active {
              color: #10bbb8;
            }
          }
        }
      }
      .user-product {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        height: 40px;
        display: flex;
        justify-content: space-between;
        padding: 0 20px 0 22px;
        background-color: #f5f7fa;
        cursor: pointer;
        .dgg-text-ellip;
        &:hover {
          color: #10bbb8;
        }
        & > p {
          flex: 1;
          .dgg-text-ellip;
          span {
            &:last-child {
              margin-left: 25px;
            }
          }
        }
        .dgg-icon {
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
