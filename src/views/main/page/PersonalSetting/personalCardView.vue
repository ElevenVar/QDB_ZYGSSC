<template>
  <div
    v-loading="loading"
    class="personal-card-view"
  >
    <div
      :style="{ backgroundImage: 'url(' + backImgPage + ')' }"
      class="top-back"
    />
    <div class="bottom-content">
      <div class="user-img">
        <img :src="userDetail.headerUrl">
      </div>
      <div class="scroll-area">
        <div class="basic-info">
          <div class="right-opts">
            <dgg-button
              v-if="!userDetail.isOnline"
              class="dgg-button-nocolor"
              @click="editCard"
            >编辑名片信息</dgg-button>
            <dgg-button
              v-if="userDetail.isOnline === 0"
              class="dgg-button-nocolor"
              @click="publishCard(1)"
            >发布名片</dgg-button>
            <dgg-button
              v-if="userDetail.isOnline === 1"
              class="dgg-button-nocolor"
              style="right:0;"
              @click="publishCard(0)"
            >下架名片</dgg-button>
          </div>

          <h1>{{ userDetail.userName }}</h1>
          <p>
            <span class="line-vertical">{{ userDetail.department }}</span>
            <span class="line-vertical">{{ userDetail.position }}</span>
            <span class="line-vertical">{{
              (userDetail.career &&
                userDetail.career.professionalLife + "年执业经验") ||
                ""
            }}</span>
            <span class="line-vertical">{{
              (userDetail.career &&
                "执业证：" + userDetail.career.professionalCertificate) ||
                ""
            }}</span>
          </p>
          <div class="label-box">
            <div
              v-for="item in userDetail.goodAtField"
              :key="item.id"
              class="label-item"
            >
              <span class="text-one-line">{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="module-box module-box-border">
          <div class="module-title">
            <dgg-icon
              icon-class="icon_lawyer"
              svg-width="22px"
              svg-height="22px"
            />
            <span>律师简介</span>
          </div>
          <ul class="info-list">
            <li>
              <label>学历信息：</label>
              <div
                v-if="userDetail.career"
                class="info-text"
              >
                <span class="line-vertical">{{
                  userDetail.career.educationBackground
                }}</span>
                <span class="line-vertical">执业{{ userDetail.career.professionalLife }}年</span>
              </div>
              <span v-else>无</span>
            </li>
            <li>
              <label>社会职务：</label>
              <div
                v-if="userDetail.socialPosition.length"
                class="info-text"
              >
                <p
                  v-for="(item, index) in userDetail.socialPosition"
                  :key="index"
                >
                  <span v-if="item.positionLabel" style="margin-right:20px">{{ item.positionLabel }}</span>
                  <span v-if="item.organizationName" style="margin-right:20px">{{ item.organizationName }}</span>
                  <span v-if="item.organizationName" style="margin-right:20px">{{ item.positionName }}</span>
                </p>
              </div>
              <span v-else>无</span>
            </li>
            <li>
              <label>社会贡献：</label>
              <div class="info-text">
                <template v-if="userDetail.reward && userDetail.reward.length">
                  <p
                    v-for="(item, index) in userDetail.reward"
                    :key="index"
                  >
                    {{
                      Number(item.rewardTime) | timeFilter("YYYY年MM月DD日")
                    }}&nbsp;&nbsp;&nbsp;获得{{ item.rewardName }}
                  </p>
                </template>
                <span v-else>无</span>
              </div>
            </li>
            <li>
              <label>律师简介：</label>
              <div class="info-text">
                <p>{{ userDetail.presentation || "无" }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="module-box">
          <div class="module-title">
            <dgg-icon
              icon-class="icon_mycase"
              svg-width="22px"
              svg-height="22px"
            />
            <span>真实案例</span>
          </div>
          <div class="case-box">
            <ul class="case-list">
              <template v-for="(item, index) in caseList">
                <li
                  v-if="index + 1 <= page * limit"
                  :key="item.id"
                  @click="jumpToPreview(item)"
                >
                  <h2>
                    <span>
                      <dgg-icon :icon-class="caseTypeRef(item.caseType)" />
                      {{ item.caseType }}
                    </span>
                    <label>{{ item.proType }}</label>
                  </h2>
                  <div class="case-detail">
                    <dgg-tooltip
                      :content="item.caseName"
                      effect="dark"
                      placement="top"
                    >
                      <h3>{{ item.caseName }}</h3>
                    </dgg-tooltip>
                    <p>状态：{{ item.caseStatus }}</p>
                    <div
                      v-for="person in getPartList(item.lawyers)"
                      :key="person.userId"
                      class="people-box"
                    >
                      <dgg-tooltip
                        :content="person.userName"
                        effect="dark"
                        placement="top"
                      >
                        <img
                          :src="person.userFile"
                          @error="imgError(person)"
                          class="person-img"
                        >
                      </dgg-tooltip>
                    </div>
                    <p class="time">
                      更新时间：<span>{{
                        Number(item.updateTime)
                          | timeFilter("YYYY.MM.DD HH:mm:ss")
                      }}</span>
                    </p>
                  </div>
                </li>
              </template>
            </ul>
            <p
              v-if="page * limit < caseList.length"
              class="load-more"
              @click="loadMoreCase"
            >
              展开更多
              <dgg-icon
                icon-class="dgg-down"
                svg-width="6px"
                svg-height="6px"
              />
            </p>
          </div>
        </div>
        <div class="module-box">
          <div class="module-title">
            <dgg-icon
              icon-class="icon_album"
              svg-width="22px"
              svg-height="22px"
            />
            <span>律师相册</span>
          </div>
          <dgg-upload
            :is-preview="true"
            :data="{
              fileId: userId,
              isDeleteOriginalFile: false,
              type: 'merchant_postcards_album_' + XReqYT
            }"
            :list-url="listUrl"
            :download-url="downloadUrl"
            upload-word="上传图片"
          />
        </div>
        <div class="module-box">
          <div class="module-title">
            <dgg-icon
              icon-class="icon_honor"
              svg-width="22px"
              svg-height="22px"
            />
            <span>荣誉奖励</span>
          </div>
          <dgg-upload
            :is-preview="true"
            :data="{
              fileId: userId,
              isDeleteOriginalFile: false,
              type: 'merchant_postcards_contribution_' + XReqYT
            }"
            :list-url="listUrl"
            :download-url="downloadUrl"
            upload-word="上传图片"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex';
import config from '@/service/config';
import backImg from '@/assets/images/workbench/image_platform.png';
import Notification from '@/componentsEl/notification/index.js';
import headImg from "@/assets/images/image_head_default.png";
export default {
  name: 'PersonalCardView',
  components: {},
  data() {
    return {
      backImgPage: backImg,
      loading: false,
      userDetail: {
        areaCode: '',
        career: '',
        caseIds: '',
        createTime: '',
        dataCompleted: '',
        department: '',
        goodAtField: '',
        headerUrl: '',
        isOnline: '',
        phone: '',
        photoAlbum: [],
        position: '',
        presentation: '',
        reward: '',
        socialContribution: [],
        socialPosition: '',
        updateTime: '',
        userId: '',
        userName: ''
      },
      caseList: [],
      hasLastpage: false,
      page: 1,
      limit: 6,
      statusText: {
        overrule: '已驳回',
        edite: '草稿',
        checked: '审核通过',
        checking: '待审核'
      }
    };
  },
  computed: {
    ...mapState(['userId', 'XReqYT']),
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
    // this.getDetail();
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
    ...mapActions(['ruoterJump']),
    ...mapActions('personalSettingModule', [
      'query_usercard_detail',
      'publish',
      'ref_caseids_list'
    ]),
    imgError(it) {
      it.userFile = headImg;
    },
    caseTypeRef(val) {
      switch (val) {
        case '民诉':
          return 'icon_civil';
        case '刑诉':
          return 'icon_criminal';
        case '法律':
          return 'icon_law';
        case '行诉':
          return 'icon_litigation';
        case '非诉':
          return 'icon_nonlitigation';
        default:
          return 'icon_others';
      }
    },
    getPartList(list) {
      if (list && list.length > 5) {
        return list.slice(0, 4);
      }
      return list;
    },
    changeAnchor(id) {
      this.curAnchor = id;
    },
    getDetail() {
      this.loading = true;
      this.query_usercard_detail()
        .then(res => {
          if (res.code === 200) {
            this.userDetail = res.data;
            this.getCaseListByIds();
          } else {
            // this.$message({
            //   message: res.message,
            //   type: "error"
            // });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    // 通过ids获取案例列表
    getCaseListByIds() {
      if (!this.userDetail.caseIds || !this.userDetail.caseIds.length) return;
      this.ref_caseids_list({
        caseIds: this.userDetail.caseIds
      }).then(res => {
        if (res.code === 200) {
          this.caseList = res.data || [];
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      });
    },
    loadMoreCase() {
      this.page++;
    },
    handleAvatarSuccess(res, file) {
      this.personalForm.userImg = URL.createObjectURL(file.raw);
    },
    jumpToPreview(item) {
      this.ruoterJump({
        name: 'caseDetailsPreview',
        params: {
          caseNo: item.caseCenterId,
          title: item.caseName,
          from: 'personalSetting',
          tabindex: 'personalCard'
        }
      });
    },
    editCard() {
      this.$emit('edit-card');
    },
    publishCard(type) {
      const text = type === 1 ? '确认上架名片?' : '确认下架名片?';
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.publish({
            id: this.userDetail.id,
            isOnline: type
          }).then(res => {
            if (res.code === 200) {
              Notification.success({
                message: type === 1 ? '发布成功' : '下架成功'
              });
              // this.$message({
              //   message: type === 1 ? "发布成功" : "下架成功",
              //   type: "success"
              // });
              this.getDetail();
            } else {
              this.$notify({
                message: res.message,
                type: "error",
                customClass: "dgg-tip-msg"
              });
            }
          });
        })
        .catch(() => {});
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(
        file.type
      );
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        Notification.error({
          message: '上传头像图片只能是 JPG、JPEG、PNG 格式!'
        });
        // this.$message.error("上传头像图片只能是 JPG、JPEG、PNG 格式!");
      }
      if (!isLt2M) {
        Notification.error({
          message: '上传头像图片大小不能超过 2MB!'
        });
        // this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleRemove() {},
    submitSave() {},
    submitPreview() {},
    submitRelease() {},
    clickBack() {}
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
.personal-card-view {
  width: 100%;
  .carousel-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .module-title {
    display: flex;
    align-items: center;
    margin: 22px 0 38px;
    span {
      margin-left: 8px;
      font-size: 16px;
      font-weight: bold;
      color: @flsc-main;
    }
  }
  .module-box {
    padding-bottom: 30px;
    & + .module-box {
      border-top: 1px @flsc-border-color solid;
    }
    .module-box-border {
      border-top: 1px @flsc-border-color solid;
    }
  }
  .info-list {
    li {
      display: flex;
      margin-bottom: 20px;
      font-size: 14px;
      color: @flsc-main;
      label {
        width: 94px;
        flex: 0 0 auto;
        color: #666873;
      }
      .info-text {
        line-height: 21px;
        p {
          word-break: break-all;
          word-wrap: break-word;
        }
      }
    }
  }
  .top-back {
    height: 130px;
    padding: 30px 100px;
    box-sizing: border-box;
    background-position: center;
    background-repeat: no-repeat;
    color: #ffffff;
  }
  .bottom-content {
    position: relative;
    margin-left: 230px;
    .scroll-area {
      height: auto;
      padding-right: 50px;
      // overflow: auto;
    }
    .user-img {
      position: absolute;
      top: -32px;
      left: -182px;
      width: 150px;
      height: 150px;
      box-sizing: content-box;
      border: 3px #ffffff solid;
      border-radius: 4px;
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
  }
  .line-vertical {
    display: inline-block;
    margin-right: 10px;
    & + .line-vertical {
      padding-left: 10px;
      border-left: 1px #ededed solid;
    }
  }
  .basic-info {
    position: relative;
    padding-top: 16px;
    h1 {
      font-size: 24px;
      line-height: 33px;
      color: @flsc-main;
      margin-bottom: 16px;
    }
    p {
      color: #666873;
      font-size: 14px;
    }
    .right-opts {
      position: absolute;
      top: 28px;
      right: 0;
    }
  }
  .label-box {
    margin-top: 14px;
    padding-bottom: 16px;
    .label-item {
      display: inline-block;
      background-color: #e7f7f7;
      color: @main;
      font-size: 0;
      height: 30px;
      line-height: 30px;
      padding: 0 14px;
      margin-right: 14px;
      margin-bottom: 14px;
      border-radius: 20px;
      span {
        display: inline-block;
        max-width: 100px;
        font-size: 13px;
        vertical-align: middle;
      }
    }
  }
  .case-box {
    box-sizing: border-box;
    .load-more {
      width: 120px;
      margin: 0 auto;
      text-align: center;
      font-size: 13px;
      color: #9398a1;
      cursor: pointer;
      .dgg-icon {
        vertical-align: middle;
      }
    }
  }
  .case-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    li {
      display: inline-block;
      width: 256px;
      height: 256px;
      margin-right: 32px;
      margin-bottom: 30px;
      cursor: pointer;
      line-height: 1;
      background: linear-gradient(
        180deg,
        rgba(240, 242, 245, 1) 0%,
        rgba(176, 176, 176, 1) 100%
      );
      box-shadow: 0px 3px 8px 0px rgba(181, 181, 181, 0.32);
      border-radius: 6px;
      &:nth-child(3n) {
        margin-right: 0;
      }
      &:hover {
        box-shadow: 0px 14px 18px 0px rgba(181, 181, 181, 0.4);
      }
      h2 {
        display: flex;
        align-items: center;
        height: 40px;
        padding-left: 14px;
        color: #19233c;
        font-size: 13px;
        span {
          display: inline-block;
          min-width: 48px;
          max-width: 35%;
          padding: 0 10px 0 6px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          margin-right: 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: normal;
          color: #fff;
          box-sizing: border-box;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          background: linear-gradient(
            139deg,
            rgba(193, 199, 208, 1) 0%,
            rgba(138, 144, 155, 1) 100%
          );
        }
        label {
          display: inline-block;
          max-width: 60%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .case-detail {
        height: calc(100% - 40px);
        padding: 20px 14px 12px;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0px 3px 8px 0px rgba(181, 181, 181, 0.32);
        h3 {
          height: 46px;
          margin-bottom: 40px;
          line-height: 22px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          color: #19233c;
          font-size: 16px;
          font-weight: bold;
        }
        p {
          font-size: 13px;
          color: #666873;
        }
        .people-box {
          display: inline-block;
          margin-top: 10px;
          & + .people-box {
            margin-left: 10px;
          }
        }
        img {
          border: 1px @main solid;
          border-radius: 100%;
          width: 26px;
          height: 26px;
        }
        .time {
          margin-top: 24px;
          color: #9398a1;
          font-size: 12px;
          span {
            color: #19233c;
          }
        }
      }
    }
  }
}
</style>
