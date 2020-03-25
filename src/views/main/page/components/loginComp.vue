/** ** @author wangjian ** @params type:String login type password||phone code
** @params tabType(isRegister):Boolean is show register tab **/
<template>
  <div>
    <div
      v-if="!isRegister"
      :style="{ height: type === 'account' ? '340px' : '328px' }"
      class="tab"
    >
      <div class="title">
        <span
          :class="{ active: type === 'account', native: type !== 'account' }"
          @click="changeTab('account')"
          >账号密码登录</span
        >
        <span
          :class="{ active: type === 'code', native: type !== 'code' }"
          @click="changeTab('code')"
          >手机快捷登录</span
        >
      </div>
      <dgg-form ref="form" :rules="rules" :model="form">
        <!--手机号登录-->
        <dgg-form-item
          v-if="type === 'account'"
          class="margin-top-32"
          prop="account"
        >
          <dgg-input
            v-model="form.account"
            placeholder="输入手机号码"
            maxlength="11"
            @input="form.account = form.account.replace(/[^\d]/g, '')"
            clearable
            type="tel"
          ></dgg-input>
        </dgg-form-item>
        <dgg-form-item
          v-if="type === 'account'"
          class="margin-top-20"
          prop="password"
        >
          <dgg-input
            v-model="form.password"
            type="password"
            placeholder="输入密码"
            maxlength="15"
            @input="form.password = form.password.replace(/\s+/g, '')"
            @keyup.enter.native="loginEvent"
          ></dgg-input>
          <!--          oninput="this.value = this.value.replace(/\s+/g,'');"-->
        </dgg-form-item>
        <!--验证码登录-->
        <dgg-form-item
          v-if="type === 'code'"
          class="margin-top-32"
          prop="phoneNum"
        >
          <dgg-input
            v-model="form.phoneNum"
            placeholder="输入手机号码"
            ref="loginPhone"
            maxlength="11"
            @input="form.phoneNum = form.phoneNum.replace(/[^\d]/g, '')"
            clearable
            type="tel"
          ></dgg-input>
        </dgg-form-item>
        <dgg-form-item v-if="type === 'code'" class="margin-top-20" prop="code">
          <dgg-input
            v-model="form.code"
            placeholder="输入验证码"
            maxlength="6"
            class="relative"
            @input="
              form.code = form.code.replace(/[\u4E00-\u9FA5]+/, '');
              form.code = form.code.replace(/\s+/g, '');
            "
            @keyup.enter.native="loginEvent"
          ></dgg-input>
          <span
            :style="{ left: getCodeLeft, color: getCodeColor }"
            class="get_code"
            @click="getCode"
            >{{ codeBtnText }}</span
          >
        </dgg-form-item>
        <!--   -->
        <dgg-form-item class="margin-top-30">
          <dgg-button
            :disabled="btnDisabled"
            :class="{ disable: btnDisabled, color10BBB8: !btnDisabled }"
            class="loginBtn"
            type="primary"
            @click="loginEvent"
            :loading="loginLoding"
            >登录</dgg-button
          >
        </dgg-form-item>
        <dgg-form-item
          v-if="type == 'account'"
          class="font-size-13 margin-top-20"
        >
          <div class="line-height-1 text-align-right">
            <a class="cursor-pointer color-9398A1" @click="forgetPassword"
              >忘记密码</a
            >
          </div>
        </dgg-form-item>
      </dgg-form>
      <div
        :style="{ marginTop: type === 'account' ? '20px' : '40px' }"
        class="register_btn"
        @click="isRegister = true"
      >
        <div>
          立即注册
        </div>
      </div>
    </div>
    <registerComp v-if="isRegister" @childFn="parentFn" />
  </div>
</template>

<script>
import registerComp from "@/views/main/page/components/registerComp.vue";
import { mapActions } from "vuex";
export default {
  name: "loginComp",
  components: {
    registerComp
  },
  props: {
    loginType: {
      type: String,
      default: "account"
    },
    tabType: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      loginLoding: false, //登录状态
      form: {
        phoneNum: "",
        password: "",
        account: "",
        code: ""
      },
      type: "account",
      isRegister: "",
      codeBtnText: "获取验证码",
      getCodeLeft: "189px",
      getCodeColor: "#10BBB8",
      rules: {
        phoneNum: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            message: "请输入正确的手机号",
            trigger: "blur",
            pattern: /^0?(13|14|15|16|17|18|19)[0-9]{9}$/i
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ],
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            message: "请输入正确的手机号",
            trigger: "blur",
            pattern: /^0?(13|14|15|16|17|18|19)[0-9]{9}$/i
          }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            min: 6,
            max: 6,
            message: "请输入6位验证码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isRegister(val) {
      val &&
        (this.form = {
          phoneNum: "",
          password: "",
          account: "",
          code: ""
        });
    }
  },
  computed: {
    btnDisabled: function() {
      if (this.type === "account") {
        if (!/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(this.form.account)) {
          return true;
        }
        if (this.form.password.length < 6) {
          return true;
        }
      } else {
        if (!/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(this.form.phoneNum)) {
          return true;
        }
        if (this.form.code.length !== 6) {
          return true;
        }
      }
      return false;
    }
  },
  mounted() {
    this.type = this.loginType;
    this.isRegister = this.tabType;
  },
  methods: {
    ...mapActions(["ruoterJump", "login", "get_code", "updatePersonMsg"]),
    parentFn(isRegister) {
      this.isRegister = isRegister;
    },
    changeTab(type) {
      this.loginLoding = false;
      this.type = type;
      this.resetForm("form");
    },
    async getCode() {
      if (this.codeBtnText === "获取验证码") {
        if (!/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(this.form.phoneNum)) {
          this.$refs.loginPhone.focus();
          this.$refs.loginPhone.blur();
          return false;
        }
        let params = {
          type: "loginCheck",
          phone: this.form.phoneNum
        };
        this.codeBtnText = "获取中";
        let result = await this.get_code(params);
        if (result.code === 200) {
          this.codeBtnText = "重新获取(60s)";
          this.getCodeColor = "#9398A1";
          this.getCodeLeft = "170px";
          this.setCodeBtnText(60);
          this.$message.success("验证码发送成功");
        } else {
          this.codeBtnText = "获取验证码";
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
          // 停止
          this.getCodeLeft = "189px";
          this.getCodeColor = "#10BBB8";
          this.codeBtnText = "获取验证码";
        } else {
          this.codeBtnText = "重新获取(" + time + "s)";
          this.setCodeBtnText(time);
        }
      }, 1000);
    },
    resetForm(formName) {
      this.form = {
        phoneNum: "",
        password: "",
        account: "",
        code: ""
      };
      this.$refs[formName].resetFields();
    },
    async loginEvent() {
      if (!this.btnDisabled) {
        let params = {
          loginType: this.type === "account" ? "phone_pwd" : "phone_verify",
          source: "WEB",
          params: {
            acount:
              this.type === "account" ? this.form.account : this.form.phoneNum,
            pwd: this.type === "account" ? this.form.password : this.form.code
          }
        };
        this.loginLoding = true;
        let result = await this.login(params);
        if (result.code === 200) {
          this.loginLoding = false;
          this.ruoterJump({ name: "loading" });
        } else {
          this.loginLoding = false;
          this.$notify({
            message: result.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
          // this.$message.error(result.message);
        }
      } else {
        return false;
      }
    },
    forgetPassword() {
      this.ruoterJump({ name: "resetPassword" });
    }
    // 禁止输入中文、小数点和e
    // changePhoneVal(e, changeform, newval) {
    //   this.$set(changeform, newval, e);
    // }
  }
};
</script>

<style scoped lang="less">
.margin-top-20 {
  margin-top: 20px;
}
.margin-top-32 {
  margin-top: 32px;
}
.margin-top-30 {
  margin-top: 30px;
}
.font-size-13 {
  font-size: 13px;
}
.relative {
  position: relative;
}
.line-height-1 {
  line-height: 1;
}
.text-align-right {
  text-align: right;
}
.cursor-pointer {
  cursor: pointer;
}
.color-9398A1 {
  color: #9398a1;
}
.color10BBB8 {
  background: #10bbb8 !important;
}
.tab {
  width: 330px;
  height: 340px;
  border-radius: 6px;
  background: #ffffff;
  position: fixed;
  right: 240px;
  top: 220px;
  .disable {
    background-color: #88dedc !important;
  }
  .title {
    font-size: 14px;
    height: 46px;
    line-height: 46px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    border-bottom: 1px solid #edeff0;
    span {
      cursor: pointer;
    }
    span:first-child {
      margin-left: 55px;
      margin-right: 52px;
    }
    .active {
      font-weight: bold;
      color: #19233c;
    }
    .native {
      font-weight: 400;
      color: #9398a1;
    }
  }
  .loginBtn {
    border-radius: 4px;
  }
  /deep/ .el-form {
    padding: 0 30px;
    .el-form-item__error {
      top: 114%;
    }
    .el-form-item__content {
      width: 100%;
      line-height: 1;
      .get_code {
        font-size: 13px;
        color: var(--main-primary-color);
        /*color: #10BBB8;*/
        position: absolute;
        left: 189px;
        //170
        top: 12px;
        cursor: pointer;
      }
    }
    .el-input {
      width: 270px;
      .el-input__inner {
        line-height: 38px;
        height: 38px;
      }
    }
    .dgg-button {
      width: 270px;
      height: 38px;
      background: #88dedc;
      font-size: 14px;
    }
  }
  .register_btn {
    font-size: 14px;
    cursor: pointer;
    background: rgba(97, 221, 204, 0.1);
    height: 46px;
    line-height: 46px;
    text-align: center;
    color: var(--main-primary-color);
    /*color: #10BBB8;*/
  }
}
</style>
