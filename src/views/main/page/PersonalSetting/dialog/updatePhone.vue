<template>
  <dgg-modal
    ref="formData"
    :hasmodal="true"
    :affirm-text="active < 2 ? '下一步' : '完成'"
    :modal="modelTel"
    :loading="loading"
    :has-quit="active < 2"
    class="password-pop modal-tel-pop"
    title="修改手机号"
    width="512px"
    @modalAffirm="toformData"
    @modalQuit="close"
  >
    <div class="step">
      <dgg-steps
        :active="active"
        align-center
        finish-status="success"
        style="overflow-x:auto;overflow-y:hidden"
      >
        <dgg-step title="验证手机号" />
        <dgg-step title="设置新手机号" />
        <dgg-step title="完成设置" />
      </dgg-steps>
    </div>
    <dgg-form
      ref="phoneFormRef"
      :model="formData"
      :rules="toPhonerules"
      label-width="110px"
    >
      <div v-if="active == 0" class="amendStep">
        <dgg-form-item label="手机号：">
          <dgg-input
            v-model="formData.mobile"
            maxlength="11"
            @input="formData.mobile = formData.mobile.replace(/[^\d]/g, '')"
            disabled
          />
        </dgg-form-item>
        <dgg-form-item label="验证码：" prop="verifyCodeFirst">
          <dgg-input
            v-model="formData.verifyCodeFirst"
            maxlength="6"
            @input="
              formData.verifyCodeFirst = formData.verifyCodeFirst.replace(
                /[\u4E00-\u9FA5]+/,
                ''
              );
              formData.verifyCodeFirst = formData.verifyCodeFirst.replace(
                /\s+/g,
                ''
              );
            "
            placeholder="请输入验证码"
          />
          <dgg-button
            :style="{ color: getCodeColor }"
            class="authCode"
            @click="getCode"
            >{{ codeBtnText }}</dgg-button
          >
        </dgg-form-item>
      </div>
      <div v-if="active == 1" class="amendStep">
        <dgg-form-item> </dgg-form-item>
        <dgg-form-item label="新手机号：" prop="newMobile">
          <dgg-input
            v-model="formData.newMobile"
            maxlength="11"
            @input="
              formData.newMobile = formData.newMobile.replace(/[^\d]/g, '')
            "
            placeholder="请输入新手机号"
          />
        </dgg-form-item>
        <dgg-form-item label="验证码：" prop="verifyCode">
          <dgg-input
            v-model="formData.verifyCode"
            maxlength="6"
            @input="
              formData.verifyCode = formData.verifyCode.replace(
                /[\u4E00-\u9FA5]+/,
                ''
              );
              formData.verifyCode = formData.verifyCode.replace(/\s+/g, '');
            "
            placeholder="请输入验证码"
          />
          <dgg-button
            :style="{ color: getCodeColorSec }"
            class="authCode"
            @click="getCodeSec"
            >{{ codeBtnTextSec }}</dgg-button
          >
        </dgg-form-item>
        <dgg-form-item label="登录密码：" prop="loginPassword">
          <dgg-input
            v-model="formData.loginPassword"
            type="password"
            maxlength="15"
            @input="
              formData.loginPassword = formData.loginPassword.replace(
                /\s+/g,
                ''
              )
            "
            placeholder="请输入登录密码"
          />
        </dgg-form-item>
        <p class="tips-text">忘记密码，请联系：400962540</p>
      </div>
      <!-- 修改成功状态  start -->
      <task-bit-map
        v-if="active == 2"
        class="modelBit"
        svg-width="100px"
        svg-height="71px"
        tip-title="修改成功"
        btn-name="去认证"
        svg-class="icon_compimg"
        synopsis="恭喜，手机号修改成功"
      />
      <!-- 修改成功状态 end -->
    </dgg-form>
  </dgg-modal>
</template>
<script>
import { mapState, mapActions } from "vuex";
import validate from "@/utils/validate";
import TaskBitMap from "../../components/taskBitMap";
export default {
  name: "UpdatePhone",
  components: {
    TaskBitMap
  },
  data() {
    return {
      modelTel: false, // 修改手机
      loading: false,
      codeBtnText: "获取验证码", // 修改手机号获取验证码
      getCodeColor: "#10BBB8",
      codeBtnTextSec: "获取验证码", // 第二步修改手机号获取验证码
      getCodeColorSec: "#10BBB8",
      active: 0,
      // 修改手机号
      formData: {
        verifyCode: "", // 验证码
        verifyCodeFirst: "", // 第二步验证码
        mobile: "", // 手机号
        loginPassword: "", // 登录密码
        newMobile: "" // 新手机号
      },
      // 修改手机号码验证
      toPhonerules: {
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            min: 6,
            max: 6,
            message: "请输入6位验证码",
            trigger: "blur"
          }
        ],
        verifyCodeFirst: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            min: 6,
            max: 6,
            message: "请输入6位验证码",
            trigger: "blur"
          }
        ],
        newMobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            message: "请输入正确的手机号",
            trigger: "blur",
            pattern: /^0?(13|14|15|16|17|18|19)[0-9]{9}$/i
          }
        ],
        loginPassword: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState(["userId"])
  },
  methods: {
    ...mapActions("personalSettingModule", [
      "change_phone",
      "send_sms",
      "verify_Code"
    ]),
    ...mapActions(["ruoterJump", "logout"]),
    showModal(phone) {
      this.modelTel = true;
      this.$set(this.formData, "mobile", phone);
    },
    // 点击获取验证码
    getCode() {
      if (this.codeBtnText === "获取验证码") {
        this.codeBtnText = "获取中";
        this.send_sms({
          type: "cophone",
          userId: this.userId
          // msgCode:'MERCHANT_MSG_BWAJ'
        }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: "获取成功",
              type: "success"
            });
            if (this.codeBtnText === "获取中") {
              this.codeBtnText = "重新获取(60s)";
              this.getCodeColor = "#9398A1";
              this.setCodeBtnText(60);
            }
          } else {
            this.codeBtnText = "获取验证码";
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
        });
      }
    },
    getCodeSec() {
      if (this.codeBtnTextSec === "获取验证码") {
        this.codeBtnTextSec = "获取中";
        this.send_sms({
          type: "cnphone",
          userId: this.userId,
          phone: this.formData.newMobile
          //  msgCode:'MERCHANT_MSG_BWAJ'
        }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: "获取成功",
              type: "success"
            });
            if (this.codeBtnTextSec === "获取中") {
              this.codeBtnTextSec = "重新获取(60s)";
              this.getCodeColorSec = "#9398A1";
              this.setCodeBtnTextSec(60);
            }
          } else {
            this.codeBtnTextSec = "获取验证码";
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
        });
      }
    },
    // 验证码倒计时
    setCodeBtnText(time) {
      setTimeout(() => {
        time--;
        if (time === 0) {
          this.getCodeColor = "#10BBB8";
          this.codeBtnText = "获取验证码";
          // 停止
        } else {
          this.codeBtnText = "重新获取(" + time + "s)";
          this.setCodeBtnText(time);
        }
      }, 1000);
    },
    // 验证码倒计时
    setCodeBtnTextSec(time) {
      setTimeout(() => {
        time--;
        if (time === 0) {
          this.getCodeColorSec = "#10BBB8";
          this.codeBtnTextSec = "获取验证码";
          // 停止
        } else {
          this.codeBtnTextSec = "重新获取(" + time + "s)";
          this.setCodeBtnTextSec(time);
        }
      }, 1000);
    },
    async toformData() {
      if (this.active === 2) {
        // 完成
        const logout = await this.logout();
        if (logout.code === 200) {
          this.ruoterJump({ name: "login" });
        }
        this.$message({
          message: "修改成功，请登录",
          type: "success"
        });
        this.close();
      } else {
        // 前两步
        this.$refs.phoneFormRef.validate(async valid => {
          if (valid) {
            this.active === 0 && this.verifyPhoneCode();
            this.active === 1 && this.submitFormData();
          }
        });
      }
    },
    submitFormData() {
      const params = {
        userId: this.userId,
        phone: this.formData.newMobile,
        pwd: this.formData.loginPassword,
        smsCode: this.formData.verifyCode
      };
      this.loading = true;
      this.change_phone(params)
        .then(async res => {
          if (res.code === 200) {
            this.active++;
          } else {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    verifyPhoneCode() {
      this.loading = true;
      this.verify_Code({
        smsCode: this.formData.verifyCodeFirst,
        userId: this.userId
      })
        .then(res => {
          if (res.code === 200) {
            this.active++;
            this.formData = {
              verifyCode: "", // 验证码
              verifyCodeFirst: "", // 第二步验证码
              mobile: "", // 手机号
              loginPassword: "", // 登录密码
              newMobile: "" // 新手机号
            };
            this.$refs.phoneFormRef.resetFields();
          } else {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    reset() {
      this.active = 0;
      this.$refs.phoneFormRef.resetFields();
    },
    close() {
      this.reset();
      this.modelTel = false;
    }
  }
};
</script>
<style lang="less" scoped></style>
