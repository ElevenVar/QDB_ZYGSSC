<template>
  <div class="content">
    <TaskBitMap svg-width="130px" svg-height="130px" :svg-class="noticeStatus[noticeType].icon" class="notice-wrapper">
      <h2 class="notice-title">
        <slot name="title">{{ noticeStatus[noticeType].tipTitle }}</slot>
      </h2>
      <p class="notice-content">
        <slot>{{ noticeStatus[noticeType].tipContent }}</slot>
      </p>
      <p class="notice-text">
        <slot name="notice">{{ noticeStatus[noticeType].tipNotice }}</slot>
      </p>
      <div v-if="noticeType==='confirm'" slot="button" class="notice-button">
        <dgg-button class="accept-btn" @click="accept">加入</dgg-button>
        <dgg-button class="refuse-btn" @click="refuse">拒绝</dgg-button>
      </div>
    </TaskBitMap>
    <dgg-modal :modal="acceptDialog" :hasmodal="true" :hasQuit="false" affirm-text="我知道了" title="提示" @modalAffirm="ruoterJump({ name: 'workbench' })">{{addNotice}}</dgg-modal>
    <dgg-modal :modal="refuseDialog" :hasmodal="true" title="提示" @modalAffirm="modalAffirm" @modalQuit="modalQuit">确认拒绝加入？</dgg-modal>
  </div>
</template>

<script>
import TaskBitMap from './../components/taskBitMap';
import Notification from '@/componentsEl/notification/index.js';
import { mapState, mapActions } from "vuex";
export default {
  name: "inviteNotice",
  components: {
    TaskBitMap
  },
  props: {
    // noticeType: {
    //   type: String,
    //   default: 'confirm' // confirm：待确认  refuse：拒绝  invalid：失效 //success 已加入
    // }
  },
  data() {
    return {
      addNotice: '加入成功',
      noticeType: 'confirm',
      noticeStatus: {
        success: {
          icon: 'icon-success',
          tipTitle: '已加入',
          tipContent: '',
          tipNotice: ''
        },
        confirm: {
          icon: 'icon-invite',
          tipTitle: '待确认',
          tipContent: '',
          tipNotice: '温馨提示：请在24小时内进行操作，超时链接失效'
        },
        refuse: {
          icon: 'icon-refuse',
          tipTitle: '已拒绝邀请',
          tipContent: '',
          tipNotice: ''
        },
        invalid: {
          icon: 'icon-invaild',
          tipTitle: '已失效',
          tipContent: '',
          tipNotice: ''
        }
      },
      statusObj: {
        EMPLOYEE_STATUS_1: 'success',
        EMPLOYEE_STATUS_2: 'confirm',
        EMPLOYEE_STATUS_4: 'refuse',
        EMPLOYEE_STATUS_3: 'invalid'
      },
      acceptDialog: false,
      refuseDialog: false,
      item: ''
    }
  },
  computed: {
    ...mapState([
      "userId" // 登陆成功返回的userId
    ])
  },
  async mounted() {
    this.noticeType = 'confirm';
    let item = sessionStorage.getItem('newsRulesData') && JSON.parse(sessionStorage.getItem('newsRulesData'));
    !item && this.ruoterJump({ name: 'workbench' });
    this.item = item;
    let status = await this.getStatus({relateId: this.item.extendParamsJson.relateId});
    if (status.code === 200) {
      this.noticeType = this.statusObj[status.data.currentStatus];
      // this.noticeStatus[this.noticeType].title = item.title;
      this.noticeStatus[this.noticeType].tipContent = item.title;
      this.noticeStatus[this.noticeType].tipNotice = item.msgContent;
      this.noticeStatus.refuse.tipNotice = item.msgContent;
      this.noticeStatus.success.tipContent = item.title;
      this.noticeStatus.success.tipNotice = item.msgContent;
      this.addNotice = '您已加入' + status.data.storeName + '的店铺。';
    } else {
      Notification.error(status.message);
      // this.ruoterJump({ name: 'workbench' });
    }
  },
  methods: {
    ...mapActions(["ruoterJump", "updatePersonMsg"]),
    ...mapActions('inviteNoticeModule', ['add_store_user_agree', 'getStatus']),
    async accept() {
      let res = await this.add_store_user_agree({relateId: this.item.extendParamsJson.relateId, state: 'EMPLOYEE_STATUS_1'});
      if (res.code === 200) {
        this.noticeType = 'success';
        this.acceptDialog = true;
        this.updatePersonMsg(this.userId);
        // 加入成功
      }
    },
    refuse() {
      this.refuseDialog = true;
    },
    async modalQuit() {
      this.acceptDialog = false;
      this.refuseDialog = false;
    },
    async modalAffirm() {
      let res = await this.add_store_user_agree({relateId: this.item.extendParamsJson.relateId, state: 'EMPLOYEE_STATUS_4'});
      if (res.code === 200) {
        this.acceptDialog = false;
        this.refuseDialog = false;
        this.noticeType = 'refuse';
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .content{
    /deep/ .confirm-btn, /deep/ .cancel-btn{
      width: 70px !important;
      /*!*height: 25px !important;*!*/
      /*padding-top: 0 !important;*/
      /*padding-bottom: 0 !important;*/
      /*line-height: 25px !important;*/
    }
    /deep/ .cancel-btn{
      background: #E3E4E6;
    }
    /deep/.el-dialog{
      width: 410px !important;
      border-radius: 4px;
      .el-dialog__header{
        padding-top: 25px;
        padding-left: 25px;
        .el-dialog__title{
          color: #666873;
        }
      }
      .el-dialog__body{
        text-align: center;
        font-size: 14px;
      }
      .el-dialog__footer{
        border-top: 1px solid #c2c4c7;
        padding-bottom: 10px;
        padding-top: 15px
      }
    }
  }
  .notice-wrapper {
    .notice-title {
      font-size: 16px;
      font-weight:500;
      margin-top: 20px;
      color: #19233C;
    }
    .notice-content {
      font-size: 14px;
      margin-top: 10px;
      color: #666873;
    }
    .notice-text {
      font-size: 12px;
      margin-top: 5px;
      color: #9398A1;
    }
    .notice-button {
      margin-top: 25px;
      .accept-btn{
        color: #ffffff;
        background: #10BBB8;
        width: 60px;
        height: 30px;
        font-size: 14px
      }
      .refuse-btn{
        color: #19233C;
        width: 60px;
        height: 30px;
        font-size: 14px
      }
    }
    &.notice-success {
      .notice-title {
        color: #10BBB8;
      }
    }
    &.notice-error {
      .notice-title {
        color: #F10940;
      }
    }
  }
</style>
