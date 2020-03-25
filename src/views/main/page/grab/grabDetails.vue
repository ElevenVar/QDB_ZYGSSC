<template>
  <div class="grabDetails">
    <div class="grabDetails-title">
      <span class="title">订单信息</span>
    </div>
    <div class="grabDetails-body">
      <dgg-row>
        <div class="fl">
          <span class="grabDetails-name"> 订单状态:</span>
          <span class="grabDetails-value"> {{ orderDetail.orderStatus }}</span>
        </div>
        <div class="fl">
          <span class="grabDetails-name"> 订单编号：</span>
          <span class="grabDetails-value"> {{ orderDetail.orderNo }}</span>
        </div>
      </dgg-row>
      <dgg-row class="grabDetails-row">
        <div class="fl">
          <span class="grabDetails-name"> 客户信息:</span>
          <span class="grabDetails-value"> {{ orderDetail.customerName }}  {{ orderDetail.customerPhone }}</span>
        </div>
        <div class="fl">
          <span class="grabDetails-name"> 合同编号：</span>
          <span class="grabDetails-value"> {{ orderDetail.contractNo }}</span>
        </div>
      </dgg-row>
      <dgg-row class="grabDetails-row">
        <div class="fl">
          <span class="grabDetails-name"> 订单产品:</span>
          <span class="grabDetails-value"> {{ orderDetail.commodityName }}</span>
        </div>
        <div class="fl">
          <span class="grabDetails-name"> 分单时间：</span>
          <span class="grabDetails-value"> {{ orderDetail.splitTime }}</span>
        </div>
      </dgg-row>
      <dgg-row class="grabDetails-row">
        <div class="fl">
          <span class="grabDetails-name"> 业务地区:</span>
          <span class="grabDetails-value"> {{ orderDetail.registeringArea }}</span>
        </div>
        <div class="fl">
          <span class="grabDetails-name"> 业务备注：</span>
          <span class="grabDetails-value"> {{ orderDetail.remark }}</span>
        </div>
      </dgg-row>
    </div>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
export default {
  name: 'GrabDetails',
  components: {},
  data() {
    return {
      orderDetail: {}
    };
  },
  computed: {
    ...mapGetters(['grabId'])
  },
  watch: {},
  async mounted() {
    this.getDetail();
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
    ]),
    ...mapActions(['ruoterJump', 'setGrabId']),
    async getDetail() {
      let oid = this.$route.params.id;
      if (oid === undefined || oid.length === 0) { // url参数未传有id
        oid = sessionStorage.getItem('grabId');
        if (oid === undefined || oid.length === 0) { // sessionStorage 未存有id
          this.ruoterJump({ name: 'grab' });
          return;
        }
      } else {
        sessionStorage.setItem('grabId', oid);
      }
      const detail = await this.get_sc_order_by_id({ scOrderId: oid });
      if (detail.code === 200) {
        this.orderDetail = detail.data;
      }
    }
  }
};
</script>

<style lang="less">
.grabDetails {
  width: 100%;
  height: 100%;
  .grabDetails-title{
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
  .grabDetails-body{
    padding: 30px;
    height: 485px;
    .grabDetails-row{
      margin-top: 20px;
    }
    .grabDetails-name{
      width:74px;
      height:20px;
      font-size:14px;
      font-weight:400;
      color:rgba(102,104,115,1);
      line-height:20px;
    }
    .grabDetails-value{
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
