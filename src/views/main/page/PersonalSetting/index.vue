<template>
  <div class="personal-setting">
    <dgg-tabs
      v-model="activeName"
      class="normal-tabs"
      :before-leave="beforeTableave"
      @tab-click="handleClick"
    >
      <dgg-tab-pane label="个人信息" name="userInfo">
        <div class="personal-message">
          <!-- 顶部个人信息 start -->
          <div class="personal-message-top">
            <div class="message-user-text">
              <!-- 上传头像 start -->
              <div class="user-avatar">
                <el-upload
                  :show-file-list="false"
                  :data="{
                    fileId: idUserHeader,
                    isDeleteOriginalFile: true
                  }"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :action="uploadUrl"
                  class="avatar-uploader"
                >
                  <div v-if="userImg" class="avatar-box">
                    <div class="avatar-shadow">
                      <p class="upload-text">上传</p>
                    </div>
                    <img
                      :src="userImg"
                      draggable="false"
                      class="user-img avatar"
                    />
                  </div>
                  <div v-else class="avatar-uploader-icon">
                    <dgg-icon
                      class="upload-icon"
                      icon-class="icon_upload_head"
                      svg-width="30px"
                      svg-height="30px"
                    />
                    <!-- <p class="upload-text">上传头像</p> -->
                  </div>
                </el-upload>
              </div>
              <!-- 上传头像 end -->
              <section>
                <p>{{ userVerifyInfo.realName }}</p>
                <span>{{ userVerifyInfo.phone }}</span>
              </section>
            </div>
            <div class="personal-button">
              <dgg-button dgg-icon="icon_tel" @click="showPhoneModal"
                >修改手机号
              </dgg-button>
              <dgg-button dgg-icon="icon_lock" @click="showPswModal"
                >设置密码</dgg-button
              >
            </div>
          </div>
          <!-- 顶部个人信息 end -->

          <!-- 实名认证  start -->
          <dgg-form
            v-if="!isVerify"
            ref="ruleFormRef"
            :model="personalForm"
            :rules="personalFormRules"
            label-width="120px"
            class="personal-certification"
          >
            <h3>实名认证</h3>
            <dgg-col :span="9" class="certification-left">
              <!-- 上传身份证 start -->
              <div class="left-card">
                <!-- 上传正面 start -->
                <div class="front-card">
                  <el-upload
                    :show-file-list="false"
                    :data="{ fileId: idCardUploadIdOn }"
                    :on-success="handleAvatarSuccess2"
                    :before-upload="beforeAvatarUpload"
                    :action="uploadUrl"
                    class="card-uploader"
                  >
                    <div v-if="personalForm.cardFrontImg" class="avatar-box">
                      <div class="avatar-shadow">
                        <div class="card-uploader-box">
                          <dgg-icon
                            class="upload-icon"
                            icon-class="icon_camera"
                            svg-width="24px"
                            svg-height="20px"
                          />
                        </div>
                        <p class="upload-text">修改</p>
                      </div>
                      <img
                        :src="personalForm.cardFrontImg"
                        draggable="false"
                        class="avatar"
                      />
                    </div>

                    <div v-else class="card-uploader-icon">
                      <div class="card-uploader-box">
                        <dgg-icon
                          class="upload-icon"
                          icon-class="icon_camera"
                          svg-width="24px"
                          svg-height="20px"
                        />
                      </div>
                      <p class="upload-text">点击上传</p>
                    </div>
                  </el-upload>
                  <p>上传身份证正面</p>
                </div>
                <!-- 上传正面 end -->
                <!-- 上传反面 start -->
                <div class="front-card">
                  <el-upload
                    :show-file-list="false"
                    :data="{
                      fileId: idCardUploadIdOff,
                      isDeleteOriginalFile: true
                    }"
                    :on-success="handleAvatarSuccess3"
                    :before-upload="beforeAvatarUpload"
                    :action="uploadUrl"
                    class="card-uploader"
                  >
                    <div v-if="personalForm.cardContraryUrl" class="avatar-box">
                      <div class="avatar-shadow">
                        <div class="card-uploader-box">
                          <dgg-icon
                            class="upload-icon"
                            icon-class="icon_camera"
                            svg-width="24px"
                            svg-height="20px"
                          />
                        </div>
                        <p class="upload-text">修改</p>
                      </div>
                      <img
                        :src="personalForm.cardContraryUrl"
                        draggable="false"
                        class="avatar"
                      />
                    </div>

                    <div v-else class="card-uploader-icon">
                      <div class="card-uploader-box">
                        <dgg-icon
                          class="upload-icon"
                          icon-class="icon_camera"
                          svg-width="24px"
                          svg-height="20px"
                        />
                      </div>
                      <p class="upload-text">点击上传</p>
                    </div>
                  </el-upload>
                  <p>上传身份证反面</p>
                </div>
                <!-- 上传反面 end -->
              </div>
              <!-- 上传身份证 end -->

              <!-- 姓名身份证号码信息 start -->
              <div class="card-form">
                <dgg-form-item label="姓名：" prop="name">
                  <dgg-input
                    v-model="personalForm.name"
                    placeholder="自动识别"
                  />
                </dgg-form-item>
                <dgg-form-item label="身份证号：" prop="idNumber">
                  <dgg-input
                    v-model="personalForm.idNumber"
                    placeholder="自动识别"
                  />
                </dgg-form-item>
                <dgg-form-item label="手机号码：" prop="telPhone">
                  <dgg-input
                    v-model="personalForm.telPhone"
                    maxlength="11"
                    @input="
                      personalForm.telPhone = personalForm.telPhone.replace(
                        /[^\d]/g,
                        ''
                      )
                    "
                    placeholder="请输入手机号码"
                  />
                </dgg-form-item>
                <div class="btns-group">
                  <dgg-button
                    v-if="!isVerify"
                    type="primary"
                    style="width:60px;"
                    @click="goVerify"
                    >确定</dgg-button
                  >
                </div>
              </div>
              <!-- 姓名身份证号码信息 end -->
            </dgg-col>
            <dgg-col :span="15" class="certification-right">
              <!-- 正面面示例 start -->
              <div class="card-right-tips">
                <div class="card-img-tips">
                  <img
                    draggable="false"
                    src="../../../../assets/images/workbench/image_idcard1.png"
                    alt=""
                  />
                  <p>示例</p>
                </div>
                <div class="card-text-tips">
                  <p>• 请上传本人身份证正面头部照片</p>
                  <p>• 必须看清证件信息，且证件信息不能被遮挡</p>
                  <p>• 仅支持.jpg .bmp .png .gif的图片格式</p>
                  <p>• 图片大小不超过4M</p>
                  <p>• 您提供的照片企大宝将予以保护，不会用于其他用途</p>
                </div>
              </div>
              <!-- 正面示例 end -->
              <!-- 反面示例 start -->
              <div class="card-right-tips">
                <div class="card-img-tips">
                  <img
                    draggable="false"
                    src="../../../../assets/images/workbench/image_idcard2.png"
                    alt=""
                  />
                  <p>示例</p>
                </div>
                <div class="card-text-tips">
                  <p>• 必须看清证件信息，且证件信息不能被遮挡</p>
                  <p>• 仅支持.jpg .bmp .png .gif的图片格式</p>
                  <p>• 图片大小不超过4M</p>
                  <p>• 您提供的照片企大宝将予以保护，不会用于其他用途</p>
                </div>
              </div>
            </dgg-col>
            <!-- 反面示例 end -->
          </dgg-form>
          <!-- 实名认证  end -->

          <!-- 已实名认证  start-->
          <div v-if="isVerify" class="verified-box personal-certification">
            <h3>实名认证</h3>
            <dgg-row>
              <dgg-col :span="16" class="certification-left">
                <!-- 上传身份证 start -->
                <div class="left-card">
                  <!-- 上传正面 start -->
                  <div class="front-card">
                    <img
                      :src="userVerifyInfo.cardLeftUrl"
                      draggable="false"
                      alt=""
                    />
                    <p>身份证正面</p>
                  </div>
                  <!-- 上传正面 end -->
                  <!-- 上传反面 start -->
                  <div class="front-card">
                    <img
                      :src="userVerifyInfo.cardRightUrl"
                      draggable="false"
                      alt=""
                    />
                    <p>身份证反面</p>
                  </div>
                  <!-- 上传反面 end -->
                </div>
                <!-- 上传身份证 end -->

                <!-- 姓名身份证号码信息 start -->
                <div class="card-form">
                  <div class="form-info">
                    <div class="info-item">
                      <label class="item-label">姓名：</label>
                      <span class="item-value">{{
                        userVerifyInfo.realName
                      }}</span>
                    </div>
                    <div class="info-item">
                      <label class="item-label">身份证号：</label>
                      <span class="item-value">{{
                        userVerifyInfo.idCardNo
                      }}</span>
                    </div>
                    <div class="info-item">
                      <label class="item-label">手机号码：</label>
                      <span class="item-value">{{ userVerifyInfo.phone }}</span>
                    </div>
                  </div>
                  <div class="btns-group">
                    <dgg-button type="primary" @click="gobackHome"
                      >返回首页</dgg-button
                    >
                    <!--                    v-if="storeInfoData.storeStatus !== 0 && storeInfoData.storeStatus !== 1"-->
                    <dgg-button
                      v-if="
                        storeInfoData.storeStatus !== 1 &&
                          storeInfoData.otherStore.length === 0
                      "
                      plain
                      :disabled="settleBtn"
                      @click="toEnterShop"
                      >{{ settleText }}</dgg-button
                    >
                  </div>
                </div>
                <!-- 姓名身份证号码信息 end -->
              </dgg-col>
              <dgg-col :span="8">
                <div class="success-text">
                  <dgg-icon
                    icon-class="icon_success"
                    svg-width="16px"
                    svg-height="16px"
                  />信息认证通过
                </div>
              </dgg-col>
            </dgg-row>
          </div>
          <!-- 已实名认证  end -->
        </div>
      </dgg-tab-pane>
      <dgg-tab-pane label="我的名片" name="businessCard">
        <!-- 无认证时占位图 start -->
        <task-bit-map
          v-if="!isVerify"
          class="task-bit-map"
          svg-width="100px"
          svg-height="100px"
          tip-title="未实名认证"
          btn-name="去认证"
          svg-class="icon_nonamed"
          synopsis="您还未实名认证，请实名认证后使用名片"
          show-btn
          @click-back="activeName = 'userInfo'"
        />
        <!-- 无认证时占位图 end -->
        <template v-if="isVerify">
          <personal-card-view
            v-if="!editCardFlag"
            ref="personalCardViewRef"
            @edit-card="loadCardEdit"
          />
          <personal-card
            v-if="editCardFlag"
            ref="personalCardRef"
            @preview-card="loadCardView"
          />
        </template>
      </dgg-tab-pane>
    </dgg-tabs>

    <!-- 修改密码dialog start -->
    <change-psw ref="changePswRef" @update-info="pageInit" />
    <!-- 修改密码dialog end -->
    <!-- 修改手机号dialog start -->
    <update-phone ref="updatePhoneRef" @update-info="pageInit" />
    <!-- 修改手机号dialog end -->
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
import config from "@/service/config";
import PersonalCard from "./personalCard";
import PersonalCardView from "./personalCardView";
import TaskBitMap from "./../components/taskBitMap";
import UpdatePhone from "./dialog/updatePhone";
import ChangePsw from "./dialog/changePsw";
import validate from "@/utils/validate";
import Notification from "@/componentsEl/notification/index.js";
export default {
  name: "PersonalSetting",
  components: {
    PersonalCard,
    PersonalCardView,
    TaskBitMap,
    UpdatePhone,
    ChangePsw
  },
  data() {
    return {
      settleText: "入驻开店",
      settleBtn: false,
      activeName: "userInfo",
      modalPassword: false, // 修改密码弹窗
      idUserHeader: "",
      idCardUploadIdOn: "",
      idCardUploadIdOff: "",
      userImg: "",
      editCardFlag: false,
      isCertification: false,
      weixinSetting: false,
      alipaySetting: false,
      phoneNumberSetting: false,
      pswSetting: false,
      alipay: "",
      weixin: "",
      phoneNumber: "",
      psw: "",
      // 上传身份证和姓名信息
      personalForm: {
        telPhone: "", // 手机号码
        idNumber: "", // 身份证号
        name: "", // 姓名
        cardContraryUrl: "", // 身份证反面
        cardFrontImg: "" // 身份证正面
      },
      // 输入身份证号码验证
      personalFormRules: {
        telPhone: validate.phoneNumberValid, // 手机号码
        idNumber: validate.idNumberValid, // 身份证号
        name: { required: true, message: "请输入姓名", trigger: "blur" }, // 姓名
        cardContraryUrl: {
          required: true,
          message: "请上传身份证反面",
          trigger: "blur"
        }, // 身份证反面
        cardFrontImg: {
          required: true,
          message: "请上传身份证正面",
          trigger: "blur"
        } // 身份证正面
      }
    };
  },
  computed: {
    ...mapState(["userId", "storeInfoData"]),
    ...mapState("personalSettingModule", ["userVerifyInfo", "userBasicInfo"]),
    isVerify() {
      return this.userVerifyInfo.certificationStatus === 1;
    },
    uploadUrl() {
      return config.uploadUrl;
    },
    downloadUrl() {
      return config.downloadUrl;
    },
    listUrl() {
      return config.listUrl;
    }
  },
  watch: {},
  async mounted() {
    if (this.storeInfoData.storeStatus === 0) {
      this.settleText = "入驻审核中";
      this.settleBtn = true;
    }
    let globalPersonMsg = JSON.parse(sessionStorage.getItem("globalPersonMsg"));
    globalPersonMsg &&
      Object.keys(globalPersonMsg).length &&
      (this.personalForm.telPhone = globalPersonMsg.phone);
    // console.log(this.$route.params,'------------------')
    if (this.$route.params && this.$route.params.tabindex === "personalCard") {
      this.isVerify && (this.activeName = "businessCard");
    }
    this.get_photo_file_id(this.userId).then(res => {
      if (res.code === 200) {
        this.idUserHeader = res.data;
      } else {
        // this.$message({
        //   message: res.message,
        //   type: "error"
        // });
      }
    });
    await this.pageInit();
    if (this.$route.params && this.$route.params.tabindex === "personalCard") {
      this.requestCardInfo();
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
    ...mapActions(["ruoterJump", "updatePersonMsg"]),
    ...mapActions("personalSettingModule", [
      "verify_realname",
      "query_verify_info",
      "query_userinfo_setup",
      "get_card_file_id",
      "get_photo_file_id",
      "identify_IDCard"
    ]),
    // 切换tab之前
    beforeTableave(activeName, oldActiveName) {
      if (oldActiveName === "businessCard" && this.editCardFlag) {
        return new Promise((resolve, reject) => {
          this.$confirm("名片信息未保存，确认切换？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        });
      }
    },
    handleClick(tabItem) {
      if (tabItem.name === "businessCard") {
        this.requestCardInfo();
      }
    },
    requestCardInfo() {
      if (this.isVerify) {
        !this.editCardFlag && this.$refs.personalCardViewRef.getDetail();
        this.editCardFlag && this.$refs.personalCardRef.getDetail();
      }
    },
    async pageInit() {
      await this.query_userinfo_setup({ userId: this.userId });
      this.userImg = this.userBasicInfo.photoUrl;
      await this.query_verify_info({ userId: this.userId });
      if (this.userVerifyInfo.certificationStatus !== 1) {
        this.get_card_file_id(this.userId).then(res => {
          if (res.code === 200) {
            this.idCardUploadIdOn = res.data.left;
            this.idCardUploadIdOff = res.data.right;
          } else {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
        });
      }
    },
    handleAvatarSuccess(res, file) {
      this.userImg = res.data.filepath;
      this.updatePersonMsg(this.userId);
    },
    // 上传身份证正面
    handleAvatarSuccess2(res, file) {
      this.personalForm.cardFrontImg = res.data.filepath;
      const params = {
        url: res.data.filepath,
        detect_type: "DETECT_ID_CARD",
        id_card_side: "front"
      };
      const formData = new FormData();
      Object.keys(params).forEach(key => {
        formData.append(key, params[key]);
      });
      this.identify_IDCard(formData).then(res => {
        if (res.code === 0) {
          this.personalForm.name = res.data[0].name || "";
          this.personalForm.idNumber = res.data[0].id_card || "";
          this.userVerifyInfo.realName = res.data[0].name || "";
          this.userVerifyInfo.idCardNo = res.data[0].id_card || "";
        } else {
          Notification.error("识别失败，请重新上传清晰的身份证图片");
          // this.$message({
          //   message: "识别失败，请重新上传清晰的身份证图片",
          //   type: "error"
          // });
          this.personalForm.cardFrontImg = "";
        }
      });
    },
    // 上传身份证反面
    handleAvatarSuccess3(res, file) {
      this.personalForm.cardContraryUrl = res.data.filepath;
      const params = {
        url: res.data.filepath,
        detect_type: "DETECT_ID_CARD",
        id_card_side: "back"
      };
      const formData = new FormData();
      Object.keys(params).forEach(key => {
        formData.append(key, params[key]);
      });
      this.identify_IDCard(formData).then(res => {
        if (res.code !== 0 || !res.data[0].issue) {
          Notification.error("识别失败，请重新上传清晰的身份证图片");
          // this.$message({
          //   message: "识别失败，请重新上传清晰的身份证图片",
          //   type: "error"
          // });
          this.personalForm.cardContraryUrl = "";
        }
      });
    },
    beforeAvatarUpload(file) {
      const typeLimit = ["image/jpeg", "image/png", "image/bmp", "image/gif"];
      const isJPG = typeLimit.includes(file.type);
      const isLt4M = file.size / 1024 / 1024 < 50;

      if (!isJPG) {
        Notification.error("上传图片格式不正确");
        // this.$message.error("上传头像图片格式不正确!");
      }
      if (!isLt4M) {
        Notification.error("上传头像图片大小不能超过 50MB!");
        // this.$message.error("上传头像图片大小不能超过 50MB!");
      }
      return isJPG && isLt4M;
    },
    // 打开手机号码弹窗
    showPhoneModal() {
      this.$refs.updatePhoneRef.showModal(this.userVerifyInfo.phone);
    },
    // 点击修改密码
    showPswModal() {
      this.$refs.changePswRef.showModal();
    },
    gobackHome() {
      this.ruoterJump({
        name: "workbench"
      });
    },
    // 点击入驻开店
    toEnterShop() {
      this.ruoterJump({
        name: "settled"
      });
    },
    // 实名认证
    goVerify() {
      if (!this.personalForm.cardFrontImg) {
        Notification.error("请上传身份证正面照");
        // this.$message({
        //   message: "请上传身份证正面照",
        //   type: "warning"
        // });
        return;
      }
      if (!this.personalForm.cardContraryUrl) {
        Notification.error("请上传身份证反面照");
        // this.$message({
        //   message: "请上传身份证反面照",
        //   type: "warning"
        // });
        return;
      }
      this.$refs.ruleFormRef.validate(async valid => {
        if (valid) {
          const params = {
            userId: this.userId,
            idCardNo: this.personalForm.idNumber,
            idCardName: this.personalForm.name,
            contactPhone: this.personalForm.telPhone
          };
          this.verify_realname(params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: "认证成功",
                type: "success"
              });
              this.pageInit();
            } else {
              this.$notify({
                message: res.message,
                type: "error",
                customClass: "dgg-tip-msg"
              });
            }
          });
        }
      });
    },
    loadCardEdit() {
      this.editCardFlag = true;
      this.$nextTick(() => {
        this.$refs.personalCardRef.getDetail();
      });
    },
    loadCardView() {
      this.editCardFlag = false;
      this.$nextTick(() => {
        this.$refs.personalCardViewRef.getDetail();
      });
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
.personal-setting {
  width: 100%;
  min-height: 100%;
  border-radius: 4px;
  background-color: #ffffff;
  margin-bottom: 36px;
  .success-text {
    margin-top: 120px;
    padding-left: 20px;
    color: @main;
    font-size: 14px;
    .dgg-icon {
      margin-right: 6px;
      vertical-align: middle;
    }
  }
  .task-bit-map {
    margin: 200px auto;
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .modelBit {
    padding: 30px 0 55px;
    p {
      font-size: 12px;
      margin: 4px 0 0;
    }
  }
  // 修改手机号和密码按钮 start
  /deep/.personal-button {
    .el-button {
      width: 123px;
      text-align: center;
      height: 30px;
      background: #edeff0;
      border-radius: 15px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @flsc-main;
      border: none;
      margin-top: 35px;
    }
    .el-button:hover {
      background: #18ccc9;
      color: #fff !important;
    }
  }
  // 修改手机号和密码按钮 end
  .personal-message {
    width: 100%;
    padding: 30px 30px 15px;
    .personal-message-top {
      width: 100%;
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      padding: 0 20px;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      background: url("../../../../assets/images/workbench/personage_background.png")
        no-repeat center center;
      height: 101px;
      .message-user-text {
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flex;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        color: #fff;
        // 上传头像 start
        .user-avatar {
          position: relative;
          width: 60px;
          height: 60px;
          background: rgba(216, 216, 216, 1);
          border: 2px solid #fff;
          margin-right: 20px;
          overflow: hidden;
          border-radius: 50%;
          .user-img {
            width: 60px;
            height: 60px;
            border-radius: 100%;
            object-fit: cover;
          }
          .avatar-uploader {
            display: inline-block;
            margin-left: -2px;
            margin-top: -2px;
            .avatar-uploader-icon {
              display: block;
              width: 60px;
              height: 60px;
              border-radius: 100%;
              text-align: center;
              line-height: 60px;
              background-color: #f0f2f5;
              .dgg-icon {
                vertical-align: middle;
              }
            }
            .avatar-box {
              &:hover {
                .avatar-shadow {
                  display: block;
                  border-radius: 100%;
                  text-align: center;
                }
              }
              .avatar-shadow {
                position: absolute;
                display: none;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.3);
                p {
                  font-size: 14px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #ffffff;
                  text-align: center;
                  line-height: 60px;
                }
              }
            }
          }
        }
        // 上传头像 end
        section {
          p {
            font-weight: 500;
            font-size: 24px;
            font-family: PingFangSC-Medium, PingFang SC;
            letter-spacing: 1px;
            line-height: 33px;
            margin: 0 0 5px;
          }
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 20px;
          }
        }
      }
    }
    // 实名认证 start
    .personal-certification {
      h3 {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 550;
        color: #19233c;
        line-height: 22px;
        padding: 30px 0 18px;
      }
      .left-card {
        padding: 23px 0 9px;
        border-radius: 6px;
        background: #f5f7fa;
        margin: 0 0 30px;
        .front-card {
          text-align: center;
          &:first-child {
            margin: 0 0 32px;
          }
          .card-uploader {
            width: 200px;
            height: 125px;
            border-radius: 6px;
            border: 1px solid #f5f7fa;
            overflow: hidden;
            background: #fff;
            margin: 0 auto;
            text-align: center;
            -webkit-transform: all 0.35s;
            transform: all 0.35s;
            .el-upload {
              width: 100%;
              height: 100%;
            }
            &:hover {
              border: 1px dashed #18ccc9;
              box-sizing: border-box;
              .upload-text {
                color: #18ccc9;
              }
              .card-uploader-box {
                background: #18ccc9;
              }
            }
            .avatar-box {
              position: relative;
              &:hover {
                .avatar-shadow {
                  display: block;
                }
              }
              .avatar-shadow {
                position: absolute;
                display: none;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.3);
                p {
                  color: #ffffff;
                }
              }
            }
            .avatar {
              width: 200px;
              height: 125px;
              object-fit: cover;
              display: block;
              border-radius: 6px;
            }
            .card-uploader-box {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              text-align: center;
              background: #e3e4e6;
              margin: 25px auto 8px;
              text-align: center;
              line-height: 50px;
              .upload-icon {
                color: #fff !important;
                margin: -10px 0 0;
              }
            }
            .upload-text {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #c9cbd0;
              line-height: 20px;
            }
          }
          > p {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #9398a1;
            line-height: 20px;
            padding: 10px 0;
          }
        }
      }
      .card-form {
        padding: 0 0 25px;
        /deep/.el-form-item {
          display: -webkit-flex;
          display: flex;
          -webkit-align-items: center;
          align-items: center;
          margin-bottom: 10px;
        }
        /deep/.el-form-item__content {
          width: calc(100% - 100px);
        }
        /deep/.el-form-item__label {
          width: 120px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666873;
          padding-right: 22px;
          text-align: right;
        }
        .btns-group {
          text-align: center;
          padding: 22px 0 0;
          /deep/.el-button {
            border-radius: 4px;
          }
        }
      }
      .certification-right {
        padding: 23px 0 0 70px;
        .card-right-tips {
          -webkit-display: flex;
          display: flex;
          -webkit-align-items: flex-start;
          align-items: flex-start;
          p {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #9398a1;
          }
          .card-img-tips {
            width: 200px;
            text-align: center;
            margin: 0 30px 35px 0;
            > p {
              font-size: 14px;
              line-height: 20px;
              padding: 10px 0;
            }
            .card-text-tips {
              p {
                font-size: 13px;
                padding: 0;
              }
            }
          }
        }
      }
      &.verified-box {
        .left-card {
          text-align: center;
          padding-top: 60px;
        }
        .front-card {
          display: inline-block;
          &:last-child {
            margin-left: 80px;
          }
          img {
            width: 200px;
            height: 126px;
          }
        }
        .form-info {
          .info-item {
            margin-bottom: 20px;
          }
          .item-label {
            display: inline-block;
            width: 76px;
            text-align: right;
            font-size: 14px;
            color: #666873;
          }
          .item-text {
            font-size: 14px;
            color: @flsc-main;
          }
        }
      }
    }
    // 实名认证 end
  }
  // 修改密码弹窗
  .password-pop {
    /deep/.el-dialog {
      border-radius: 6px;
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__header {
        padding: 20px;
        height: 60px;
      }
      .el-dialog__title {
        color: #19233c;
        line-height: 23px;
        font-weight: 550;
        display: block;
        width: 100%;
        text-align: left;
      }
      .el-form-item__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666873;
        padding-right: 25px;
        box-sizing: border-box;
      }
    }
    .el-dialog__body {
      width: 100%;
      padding: 40px 55px 10px;
      border-top: 1px solid #e3e4e6;
      border-bottom: 1px solid #e3e4e6;
      margin: 0 0 7px;
      .el-form {
        width: 100%;
        .el-form-item {
          margin: 0 0 18px;
        }
        .el-form-item__content {
          margin: 0 !important;
          width: calc(100% - 135px);
        }
      }
      .el-form-item__error {
        top: 109%;
      }
    }
  }
  .modal-tel-pop {
    position: relative;
    .el-dialog__body {
      padding: 30px 0 10px;
      .tips-text {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #9398a1;
        line-height: 18px;
        position: absolute;
        left: 30px;
        bottom: 26px;
      }
    }
    .step {
      // 重定义步骤条 start
      /deep/ .el-step__line {
        height: 1px;
        margin-left: 25px;
        margin-right: 25px !important;
      }
      /deep/.el-step__icon {
        width: 28px;
        height: 28px;
        border: 1px solid #d9d9d9;
        font-size: 13px;
        .el-step__icon-inner {
          font-weight: 500;
        }
      }
      /deep/.el-step__head.is-process {
        color: #fff;
        border-color: var(--main-primary-color);
      }
      /deep/.el-step__head.is-finish {
        color: var(--main-primary-color);
        border-color: var(--main-primary-color);
      }
      /deep/.el-step.is-horizontal .el-step__head.is-success .el-step__line {
        background-color: var(--main-primary-color);
      }
      /deep/.el-step__title {
        color: #666873;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 17px;
        padding: 6px 0;
      }
      /deep/.el-step__title.is-process {
        color: #19233c;
        font-weight: 550;
      }
      .el-step__icon-inner.is-status {
        color: #10bbb8;
      }
      /deep/.el-step__head.is-success {
        .el-step__icon.is-text {
          border-color: #10bbb8 !important ;
        }
      }
      .el-step__line-inner {
        border-color: #10bbb8;
      }
    }
    .el-step__head.is-process .el-step__icon {
      border-color: transparent !important;
    }
    .dgg-steps .el-step__line {
      margin: 0 20px !important;
      height: 1px;
      top: 14px;
    }
    .el-form {
      padding: 20px 77px 0 64px;
    }
    // 重定义步骤条 end
    /deep/.el-dialog {
      .el-dialog__body {
        .el-form-item__content {
          position: relative;
          width: calc(100% - 110px);
        }
        .el-form-item {
          margin: 0 0 14px;
        }
        .authCode {
          font-size: 13px;
          line-height: 30px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #10bbb8;
          background: none !important;
          position: absolute;
          right: 0;
          top: -2px;
          border: none;
          padding: 0 11px;
          height: 44px;
        }
      }
      .el-form-item__error {
        top: 105%;
      }
    }
  }
}
</style>
