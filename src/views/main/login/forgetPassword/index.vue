/**
** @author wangjian
**/
<template>
  <div class="content">
<!--    <div class="step">-->
<!--      <dgg-steps-->
<!--        :active="active"-->
<!--        align-center-->
<!--        finish-status="success"-->
<!--        class="dgg-steps"-->
<!--      >-->
<!--        <dgg-step title="验证手机号"></dgg-step>-->
<!--        <dgg-step title="重置密码"></dgg-step>-->
<!--        <dgg-step title="完成设置"></dgg-step>-->
<!--      </dgg-steps>-->
<!--    </div>-->
    <div v-if="active === 0" class="form-box">
      <div>
        <dgg-icon :icon-class="'icon_warning'" class="noticeTextIcon" :class="'x2'"/>
        <span class="noticeIconText">请输入你的手机号进行验证</span>
      </div>
      <dgg-form ref="formData" :rules="rules" :model="formData" :label-position="'right'" :label-width="active ? '100px' : '80px'">
        <dgg-form-item label="手机号码" prop="phoneNum">
          <dgg-input
            ref="firstInput"
            v-model="formData.phoneNum"
            placeholder="请输入手机号码"
            maxlength="11"
            @input="queryIdentity"
          ></dgg-input>
<!--          @change="queryIdentity"-->
        </dgg-form-item>
        <dgg-form-item label="身份证号" prop="codeNum" v-if="identity">
          <dgg-input v-model="formData.codeNum" @input="formData.codeNum=formData.codeNum.replace(/[\u4E00-\u9FA5]+/,''); formData.codeNum = formData.codeNum.replace(/\s+/g,'')" placeholder="请输入身份证号" maxlength="18"></dgg-input>
        </dgg-form-item>
        <dgg-form-item v-if="active < 1" prop="codeInputModal" label="验证码:">
          <dgg-input
            v-model="formData.codeInputModal"
            maxlength="6"
            placeholder="输入验证码"
            class="relative"
            @input="formData.codeInputModal=formData.codeInputModal.replace(/[\u4E00-\u9FA5]+/,'');formData.codeInputModal = formData.codeInputModal.replace(/\s+/g,'')"
          ></dgg-input>
          <span :style="{ left: getCodeLeft , color: getCodeColor}" class="get_code" @click="getCode">{{ codeBtnText }}</span>
        </dgg-form-item>

        <dgg-form-item label="新密码" prop="password">
          <dgg-input v-model="formData.password" @input="formData.password = formData.password.replace(/\s+/g,'')" placeholder="请输入新密码" type="password" maxlength="15" @change="passwordChange"></dgg-input>
        </dgg-form-item>
        <dgg-form-item label="重复密码" prop="passwordRepeat">
          <dgg-input v-model="formData.passwordRepeat" @input="formData.passwordRepeat = formData.passwordRepeat.replace(/\s+/g,'')" ref="passwordRepeat" placeholder="请再次输入新密码" type="password" maxlength="15"></dgg-input>
        </dgg-form-item>

        <div class="form-button">
          <dgg-button class="dgg-button" type="primary" @click="loginEvent">去登录</dgg-button>
          <dgg-button class="dgg-button" :disabled="btnDisabled" :class="{disable:btnDisabled}" type="primary" @click="nextStep">下一步</dgg-button>
        </div>
      </dgg-form>
    </div>
    <div v-else class="completeNotice">
      <img src="@/assets/images/icon_compimg.png" alt="">
      <div class="complete-notice-text">重置成功</div>
      <div class="complete-notice-text2">请使用新密码登录</div>
      <dgg-button class="go-login" type="primary" @click="loginEvent">去登录</dgg-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "verifyPhone",
  data: function() {
    return {
      identity: false,
      active: 0,
      codeBtnText: '获取验证码',
      getCodeLeft: '169px',
      getCodeColor: '#10BBB8',
      formData: {
        phoneNum: '',
        codeNum: '',
        codeInputModal: '',
        password: '',
        passwordRepeat: ''
      },
      rules: {
        phoneNum: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入手机号码'));
              } else if (!/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          },
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        codeNum: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入身份证号码'));
              } else if (value.length !== 18) {
                callback(new Error('请输入18位身份证号码'));
              } else {
                let idCard = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                if (!idCard.test(value)) {
                  callback(new Error('请输入正确身份证号码'));
                } else {
                  callback();
                }
              }
            },
            trigger: 'blur'
          },
          { required: true, message: '请输入身份证号码', trigger: 'blur' }
        ],
        codeInputModal: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入验证码'));
              } else if (value.length !== 6) {
                callback(new Error('请输入6位验证码'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          },
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'));
              } else if (value.length < 6 || value.length > 15) {
                callback(new Error('长度在 6 到 15 个字符'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          },
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            message: '密码必须为包含数字字母的6到15位字符串',
            trigger: 'blur',
            pattern: /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,15}$/
          }
        ],
        passwordRepeat: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'));
              } else if (value !== this.formData.password) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          },
          { required: true, message: '请再次输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    btnDisabled: function() {
      if (!/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(this.formData.phoneNum)) {
        return true;
      }
      if (this.identity) {
        let idCard = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (!idCard.test(this.formData.codeNum)) {
          return true;
        }
      }
      if (this.formData.codeInputModal.length !== 6) {
        return true;
      }
      if (this.formData.password.length < 6 || this.formData.password.length > 15) {
        return true;
      }
      if (!/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,15}$/.test(this.formData.password)) {
        return true;
      }
      if (this.formData.password !== this.formData.passwordRepeat) {
        return true;
      }
      return false;
    }
  },
  watch: {

  },
  methods: {
    ...mapActions(["ruoterJump", 'get_code', 'modify_pwd']),
    ...mapActions('loginModule', [
      'query_user_byphone'
    ]),
    async queryIdentity(val) {
      this.formData.phoneNum = this.formData.phoneNum.replace(/[^\d]/g,'');
      console.log(this.formData.phoneNum);
      if (/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(this.formData.phoneNum)) {
        let res = await this.query_user_byphone({ phone: val });
        if(res.code === 200){
          this.identity = res.data.certificationStatus === 1;
        }
      }
    },
    loginEvent() {
      sessionStorage.setItem('reload', 'true');
      this.ruoterJump({ name: "login" });
    },
    passwordChange() {
      if (this.formData.passwordRepeat.length > 0 && this.formData.password !== this.formData.passwordRepeat) {
        this.$refs.passwordRepeat.focus();
        this.$refs.passwordRepeat.blur();
      }
    },
    async getCode() {
      if (this.codeBtnText === '获取验证码') {
        if (!/^1\d{10}$/.test(this.formData.phoneNum)) {
          this.$refs.firstInput.focus();
          this.$refs.firstInput.blur();
          return false;
        }
        let params = {
          type: 'forgetpwd',
          phone: this.formData.phoneNum
        }
        let result = await this.get_code(params);
        if (result.code === 200) {
          this.codeBtnText = '重新获取(60s)';
          this.getCodeColor = '#9398A1';
          this.getCodeLeft = '150px';
          this.setCodeBtnText(60);
          this.$message.success('验证码发送成功');
        } else {
          this.$notify({
            message: result.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
          // alert('测试：后台返回验证码发送失败');
        }
      }
    },
    setCodeBtnText(time) {
      setTimeout(() => {
        time--;
        if (time === 0) {
          this.getCodeLeft = '169px';
          this.getCodeColor = '#10BBB8';
          this.codeBtnText = '获取验证码';
          // 停止
        } else {
          this.codeBtnText = '重新获取(' + time + 's)';
          this.setCodeBtnText(time);
        }
      }, 1000)
    },
    async nextStep() {
      if (this.active === 1) {
        this.active = 0;
      } else {
        let params = {};
        params.phone = this.formData.phoneNum;
        params.smsCode = this.formData.codeInputModal;
        params.idNumber = this.formData.codeNum;
        params.pwd = this.formData.password;
        let result = await this.modify_pwd(params);
        if (result.code === 200) {
          this.resetForm('formData');
          this.active++
        } else {
          this.$notify({
            message: result.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped lang="less">
  .relative{
    position: relative;
  }
  .content{
    width: 1180px;
    height: 720px;
    background: #ffffff;
    margin-top: 80px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 100px;
    .disable{
      background-color: #88DEDC !important;
    }
    .step{
      height: 30px;
      width: 664px;
      /*width: 100%;*/
      margin-right: auto;
      margin-left: auto;
      .dgg-steps{
        overflow-x:auto;overflow-y:hidden
      }
      /deep/ .el-step__title{
        font-size: 12px;
      }
      /deep/ .el-step__icon-inner {
        font-weight: bold;
      }
    }
    .form-box {
      text-align: center;
      margin-top: 100px;
      .noticeTextIcon{
        font-size: 16px;
        vertical-align: sub;
        color: #10BBB8
      }
      .noticeIconText{
        color: #9398A1;
        font-size: 13px
      }
      /deep/ .el-form{
        margin-top: 30px;
        display: inline-block;
        text-align: left;
        .el-form-item__error{
          top: 115%;
        }
        .el-form-item {
          margin-bottom: 20px;
        }
        .el-form-item__label {
          font-size: 14px;
          line-height: 30px;
          color: #666873;
        }
        .el-form-item__content {
          font-size: 14px;
          margin-left: 18px !important;
          line-height: 30px;
        }
        .el-input{
          width: 250px;
          height: 30px;
        }
        .el-input__inner {
          font-size: 13px;
          border: 1px solid #E3E4E6;
        }
      }
      .form-button {
        text-align: center;
        padding-top: 20px;
        .dgg-button{
          width: 88px;
          height: 30px
        }
      }
    }
    .get_code{
      font-size: 13px;
      color: #10BBB8;
      position: absolute;
      left: 169px;
      //150
      top: 1px;
      cursor: pointer;
    }
    .completeNotice{
      /*height: 100%;*/
      width: 100%;
      margin-right: auto;
      margin-left: auto;
      margin-top: 129px;
      text-align: center;
      font-family:Microsoft YaHei;
      img{
        width: 100px;
        height: 100px;
      }
      .complete-notice-text{
        margin-top: 26px;
        text-align: center;
        font-size:16px;
        font-weight:bold;
        color: #19233C;
      }
      .complete-notice-text2{
        font-size: 13px;
        color: #9398A1;
      }
      .go-login{
        margin-top: 33px;
        width: 88px;
        height: 30px
      }
    }
  }
</style>