<template>
  <div class="brabBillDetails">
    <div class="brabBillDetails-title">
      <span class="title">订单信息</span>
    </div>
    <div class="brabBillDetails-body">
      <dgg-row>
        <div class="fl">
          <span class="brabBillDetails-name"> 订单状态:</span>
          <span class="brabBillDetails-value"> {{ orderDetail.orderStatus }}</span>
        </div>
        <div class="fl">
          <span class="brabBillDetails-name"> 订单编号：</span>
          <span class="brabBillDetails-value"> {{ orderDetail.scOrderNo }}</span>
        </div>
      </dgg-row>
      <dgg-row class="brabBillDetails-row">
        <div class="fl">
          <span class="brabBillDetails-name"> 客户信息:</span>
          <span class="brabBillDetails-value"> {{ orderDetail.customerName }} {{ orderDetail.customerPhone }}</span>
        </div>
        <div class="fl">
          <span class="brabBillDetails-name"> 合同编号：</span>
          <span class="brabBillDetails-value"> {{ orderDetail.contractNo }}</span>
        </div>
      </dgg-row>
      <dgg-row class="brabBillDetails-row">
        <div class="fl">
          <span class="brabBillDetails-name"> 订单产品:</span>
          <span class="brabBillDetails-value"> {{ orderDetail.productName }}</span>
        </div>
        <div class="fl">
          <span class="brabBillDetails-name"> 分单时间：</span>
          <span class="brabBillDetails-value"> {{ orderDetail.receiveTime }}</span>
        </div>
      </dgg-row>
      <dgg-row class="brabBillDetails-row">
        <div class="fl">
          <span class="brabBillDetails-name"> 业务地区:</span>
          <span class="brabBillDetails-value"> {{ orderDetail.region }}</span>
        </div>
        <div class="fl">
          <span class="brabBillDetails-name"> 业务备注：</span>
          <span class="brabBillDetails-value"> {{ orderDetail.remark }}</span>
        </div>
      </dgg-row>
    </div>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex';
export default {
  name: 'BrabBillDetails',
  components: {},
  data() {
    return {
      orderDetail: {}
    };
  },
  computed: {
  },
  watch: {},
  async mounted() {
    let oid = this.$route.params.id;
    if (oid === undefined || oid.length === 0) { // url参数未传有id
      oid = sessionStorage.getItem('brabId');
      if (oid === undefined) { // sessionStorage 未存有id
        this.ruoterJump({ name: 'brabBill' });
        return;
      }
    } else {
      sessionStorage.setItem('brabId', oid)
    }
    const detail = await this.get_sc_order_by_id({ scOrderId: oid });
    if (detail.code === 200) {
      this.orderDetail = detail.data;
    }
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
    ...mapActions('grapModule', [
      'get_sc_order_by_id'
    ])
  }
};
</script>

<style lang="less">
.brabBillDetails {
  width: 100%;
  height: 100%;
    overflow-y: auto;

  .brabBillDetails-title{
    height:55px;
    line-height: 55px;
    border-bottom: 1px solid #E3E4E6;
    >.title{
      font-size:16px;
      font-weight:500;
      color:rgba(25,35,60,1);
    } &:before {
      content: '';
      margin-top: -4px;
      display: inline-block;
      margin-right: 10px;
      margin-left: 30px;
      width: 6px;
      height: 6px;
      border-radius: 6px;
      vertical-align: middle;
      background-color: #1DC4C1;
    }
  }
  .brabBillDetails-body{
    padding: 30px;
    height: 485px;
    .brabBillDetails-row{
      margin-top: 20px;
    }
    .brabBillDetails-name{
      width:74px;
      height:20px;
      font-size:14px;
      font-weight:400;
      color:rgba(102,104,115,1);
      line-height:20px;
    }
    .brabBillDetails-value{
      display: inline-block;
      width: 300px;
      height:20px;
      font-size:14px;
      font-weight:400;
      color:#19233C;
      line-height:20px;
      margin-left: 50px;
            word-wrap:break-word;

    }
  }
}
</style>
