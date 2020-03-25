/**
** @author wangjian
**/
<template>
  <div class="registerTab">
    <div class="title">
      手机注册
    </div>
    <dgg-form ref="registerForm" :rules="rules" :model="registerForm">
      <dgg-form-item class="margin-top-32" prop="phoneNum">
        <dgg-input
          ref="phoneInput"
          v-model="registerForm.phoneNum"
          placeholder="输入手机号码"
          maxlength="11"
          @input="registerForm.phoneNum=registerForm.phoneNum.replace(/[^\d]/g,'');"
          clearable
          type="tel">
        </dgg-input>
      </dgg-form-item>
      <dgg-form-item class="margin-top-20" prop="code">
        <dgg-input v-model="registerForm.code" maxlength="6" placeholder="输入验证码" class="relative" @input="registerForm.code=registerForm.code.replace(/[\u4E00-\u9FA5]+/,''); registerForm.code = registerForm.code.replace(/\s+/g,'');"></dgg-input>
        <span :style="{ left: getCodeLeft , color: getCodeColor}" class="get_code" @click="getCode">{{ codeBtnText }}</span>
      </dgg-form-item>
      <dgg-form-item class="margin-top-20" prop="password">
        <dgg-input :type="passwordType" @input="registerForm.password = registerForm.password.replace(/\s+/g,'');" class="relative" v-model="registerForm.password" maxlength="15" placeholder="输入密码（6-15位数字/字母/字符）"></dgg-input>
        <dgg-icon v-if="registerForm.password.length > 0" class="password-icon" @click="showPassword" :icon-class="passwordIcon" :class="'x2'"/>
      </dgg-form-item>
      <dgg-form-item class="margin-top-20 line-height-1">
        <dgg-checkbox v-model="agreement"><span class="font-size-13 margin-left-4">我已阅读<a class="cursor-pointer color-10BBB8" @click="routerJumpAgreement">《企大宝平台协议》</a></span></dgg-checkbox>
      </dgg-form-item>
      <dgg-form-item class="margin-top-20">
        <dgg-button :disabled="btnDisabled"  :class="{disable:btnDisabled}" @click="registerEvent" type="primary">注册</dgg-button>
      </dgg-form-item>
      <dgg-form-item class="margin-top-20 font-size-13">
        <div class="line-height-1 text-align-right">
          <a class="cursor-pointer color-10BBB8" @click="parentFun(false)">已有账号，请登录 <dgg-icon :icon-class="'dgg-right'" :class="'x2'"/></a>
        </div>
      </dgg-form-item>
    </dgg-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";  //mapState, mapActions, mapGetters, mapMutations
import Notification from "@/componentsEl/notification/index.js";
export default {
  name: "registerComp",
  props: {
  },
  components: {
  },
  data: function() {
    return {
      registerForm: {
        phoneNum: '',
        password: '',
        code: ''
      },
      rules: {
        phoneNum: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            message: '请输入正确的手机号',
            trigger: 'blur',
            pattern: /^0?(13|14|15|16|17|18|19)[0-9]{9}$/i
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度为6-15位数字/字母/字符',
            trigger: 'blur'
          },
          {
            message: '密码必须为包含数字字母的6到15位字符串',
            trigger: 'blur',
            pattern: /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,15}$/
          }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          {
            min: 6,
            max: 6,
            message: '请输入6位验证码',
            trigger: 'blur'
          }
        ]
      },
      agreement: false,
      codeBtnText: '获取验证码',
      getCodeColor: '#10BBB8',
      getCodeLeft: '189px',
      passwordType: 'password',
      passwordIcon: 'icon_view',
      registerClickTime: 0,
      registerEventWait: false
    }
  },
  computed: {
    btnDisabled: function() {
      if (!/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(this.registerForm.phoneNum)) {
        return true;
      }
      if (!/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,15}$/.test(this.registerForm.password)) {
        return true;
      }
      if (this.registerForm.password.length < 6 || this.registerForm.password.length > 15) {
        return true;
      }
      if (this.registerForm.code.length !== 6) {
        return true;
      }
      if (!this.agreement) {
        return true;
      }
      return this.registerEventWait;
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['ruoterJump', 'get_code', 'register']),
    async registerEvent() {
      if (new Date().getTime() - this.registerClickTime > 2000) {
        if (!this.btnDisabled) {
          this.registerClickTime = new Date().getTime();
          this.registerEventWait = true;
          let params = {
            phone: this.registerForm.phoneNum,
            verificationCode: this.registerForm.code,
            pdw: this.registerForm.password,
            deviceType: 3,
            source: 'WEB'
          };
          let result = await this.register(params);
          if (result.code === 200) {
            this.$message.success('注册成功，请登录');
            this.$emit('childFn', false);
          } else {
            this.$notify({
              message: result.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
            // this.$message.error(result.message);
          }
          this.registerEventWait = false;
        } else {
          // 必填内容未通过验证
          return false
        }
      } else {
        // Notification.error("请不要重复点击");
      }
    },
    routerJumpAgreement() {
      window.open(`${window.location.origin}/#/agreement`);
    },
    // 禁止输入中文、小数点和e
    // changePhoneVal(e, changeform, newval) {
    //   this.$set(changeform, newval, e);
    // },
    showPassword() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text';
        this.passwordIcon = 'icon_hidden'
      } else {
        this.passwordType = 'password';
        this.passwordIcon =  'icon_view'
      }
    },
    parentFun(isRegister) {
      this.$emit('childFn', isRegister);
    },
    async getCode() {
      if (this.codeBtnText === '获取验证码') {
        if (!/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(this.registerForm.phoneNum)) {
          this.$refs.phoneInput.focus();
          this.$refs.phoneInput.blur();
          return false;
        }
        let params = {
          type: 'register',
          phone: this.registerForm.phoneNum
        }
        let result = await this.get_code(params);
        if (result.code === 200) {
          this.codeBtnText = '重新获取(60s)';
          this.getCodeColor = '#9398A1';
          this.getCodeLeft = '170px';
          this.setCodeBtnText(60);
          this.$message.success('验证码发送成功');
        } else {
          this.$notify({
            message: result.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
          // this.$message.error(result.message);
          // alert('测试：后台返回验证码发送失败');
        }
      }
    },
    setCodeBtnText(time) {
      setTimeout(() => {
        time--;
        if (time === 0) {
          this.getCodeLeft = '189px';
          this.getCodeColor = '#10BBB8';
          this.codeBtnText = '获取验证码';
          // 停止
        } else {
          this.codeBtnText = '重新获取(' + time + 's)';
          this.setCodeBtnText(time);
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang="less" >
  .cursor-pointer{
    cursor: pointer;
  }
  .text-align-right{
    text-align: right
  }
  .color-10BBB8{
    color: #10BBB8;
  }
  .relative{
    sposition: relative
  }
  .line-height-1{
    line-height: 1
  }
  .margin-top-32{
    margin-top: 32px
  }
  .margin-top-20{
    margin-top: 20px
  }
  .font-size-13{
    font-size: 13px
  }
  .margin-left-4{
    margin-left: 4px;
  }
  .registerTab{
    width: 330px;
    height: 390px;
    border-radius: 6px;
    background: #FFFFFF;
    position: fixed;
    right: 240px;
    top: 220px;
    /deep/ .el-checkbox__input{
      vertical-align: text-bottom;
    }
    .disable{
      background-color: #88DEDC !important;
    }
    .title{
      height:46px;
      border-bottom: 1px solid #EDEFF0;
      font-size: 14px;
      line-height: 46px;
      font-family:Microsoft YaHei;
      font-weight:bold;
      text-align: center;
    }
    .password-icon{
      font-size: 16px;
      position: absolute;
      top: 13px;
      left: 241px;
      color: #E3E4E6;
      cursor: pointer
    }
    /deep/ .el-form{
      padding: 0 30px;
      .el-form-item__error{
        top: 114%;
      }
    }
    /deep/ .el-form-item__content{
      width: 100%;
      line-height: 1;
      .get_code{
        font-size: 13px;
        color: var(--main-primary-color);
        /*color: #10BBB8;*/
        position: absolute;
        left: 189px;
        top: 12px;
        cursor: pointer;
      }
    }
    /deep/ .el-input{
      width: 270px;
      .el-input__inner{
        line-height: 38px;
        height: 38px;
      }
    }
    /deep/ .dgg-button{
      width: 270px;
      height: 38px;
      /*background: #88DEDC;*/
      font-size: 14px;
    }
  }
</style>