<template>
  <div
    v-loading="loading"
    class="case-details-preview"
  >
    <div class="title-operation">
      <div class="left-text">
        {{ caseDetail.caseName }}
      </div>
      <div class="right-opts">
        <dgg-button
          v-if="!componentsFrom"
          size="small"
          class="dgg-button-nocolor"
          @click="goBack"
        >返回</dgg-button>
        <dgg-button
          v-else
          size="small"
          class="dgg-button-nocolor"
          @click="close"
        >关闭</dgg-button>
      </div>
    </div>
    <div class="case-module">
      <div
        ref="leftCaseScrollView"
        class="left"
        @scroll="onScroll"
      >
        <template v-for="moduleItem in caseDetail.extendedContents" v-if="caseDetail.showExtendedContents">
          <template v-if="!Array.isArray(moduleItem.content) && moduleItem.show">
            <div
              :id="moduleItem.code"
              :key="moduleItem.code"
              class="module-item"
            >
              <h2 class="item-title">{{ moduleItem.name }}</h2>
              <div class="item-info">
                <div class="desc-text" v-html="moduleItem.content.length>306 && moduleItem.showWord ? moduleItem.content : moduleItem.content.substr(0, 305)"/>
                <div v-if="moduleItem.content.length>305" class="desc-unfold" @click="showWordClick(moduleItem)">{{ moduleItem.showWord? '收起': '展开' }}

                  <dgg-icon
                    :icon-class="moduleItem.showWord? 'icon_retract':'icon_extend'"
                    svg-width="16px"
                    svg-height="12px"
                  />
                </div>
                <div class="gap-16" />
                <div class="file-list">
                  <dgg-upload
                    @list="param=>fileListCallback(param, moduleItem)"
                    :data="{
                      fileId: moduleItem.files || ('qdb-caseinstance-' + moduleItem.code + '-' + caseDetail.caseNo),
                      isDeleteOriginalFile: false,
                    }"
                    :is-preview="true"
                    :accept-type="acceptType"
                    :list-url="listUrl"
                    :download-url="downloadUrl"
                    :upload-url="uploadUrl"
                    :del-url="deleteUrl"
                    upload-word="上传图片"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              v-if="moduleItem.show"
              :id="moduleItem.code"
              :key="moduleItem.code"
              class="module-item"
            >
              <h2 class="item-title">{{ moduleItem.name }}</h2>

              <template v-for="(item, index) in moduleItem.content">
                <div
                  v-if="item.show"
                  :key="item.stageId"
                  class="phase-box"
                >

                  <h4>
                    <div class="title-icon">
                      <dgg-icon
                        icon-class="dgg-icon-step"
                        svg-width="24px"
                        svg-height="24px"
                      />
                    </div>
                    {{ index + 1 | upStrFilter }}、{{ item.stageName }}
                  </h4>
                  <template v-for="(phaseItem, phaseIndex) in item.tasks">
                    <div
                      v-if="phaseItem.show"
                      :key="phaseIndex"
                      class="phase-detail"
                    >
                      <div class="task-top">
                        <div class="task-title">
                          <div class="task-person">
                            <dgg-tooltip
                              :content="phaseItem.lawyer.userName"
                              :disabled="!(phaseItem.lawyer.userName)"
                              effect="dark"
                              placement="top"
                            >
                              <div>
                                <img
                                  v-if="phaseItem.lawyer.userName"
                                  :src="phaseItem.lawyer.userFile"
                                  class="person-img"
                                  @error="imgError(phaseItem.lawyer)"
                                >
                                <span v-if="phaseItem.lawyer.isMainHandle === 1">主</span>
                              </div>
                            </dgg-tooltip>
                          </div><span>{{ phaseItem.taskName }}</span>
                        </div>
                      </div>
                      <div class="item-info">
                        <div class="desc-text">
                          {{ phaseItem.content || '暂无描述' }}
                        </div>
                        <div class="gap-16" />
                        <div class="file-list">
                          <dgg-upload
                            :data="{
                              fileId: phaseItem.taskFiles || ('qdb-caseinstance-' + phaseItem.taskId + '-' + caseDetail.caseNo),
                              isDeleteOriginalFile: false,
                            }"
                            @list="param=>fileListCallback(param, phaseItem)"
                            :is-preview="true"
                            :accept-type="acceptType"
                            :list-url="listUrl"
                            :download-url="downloadUrl"
                            :upload-url="uploadUrl"
                            :del-url="deleteUrl"
                            upload-word="上传图片"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
      <div class="right">
        <div class="right-top">
          <div class="label-box">
            <div
              v-for="item in caseDetail.lables"
              :key="item.lableCode"
              class="label-item"
            >
              <span class="text-one-line">{{ item.lableName }}</span>
            </div>
          </div>
        </div>
        <ul class="detail-box">
          <li><label>案件类型</label><span>{{ caseDetail.caseType }}</span></li>
          <li><label>产品类型</label><span>{{ caseDetail.proType }}</span></li>
          <li
            v-for="item in caseDetail.baseContents"
            :key="item.key"
          >
            <label>{{ item.name }}</label><span>{{ item.val }}</span>
          </li>
          <li><label>持续时长</label><span>{{ caseDetail.continuedTime }}</span></li>
        </ul>
        <div class="lawyer-box">
          <h3 class="detail-title">律师团队</h3>
          <div class="gap-16" />
          <div
            v-for="item in caseDetail.lawyers"
            :key="item.userId"
            class="task-person"
          >
            <dgg-tooltip
              :content="item.userName"
              effect="dark"
              placement="top"
            >
              <div>
                <img
                  :src="item.userFile"
                  class="person-img"
                  @error="imgError(item)"
                >
                <span v-if="item.isMainHandle === 1">主</span>
              </div>
            </dgg-tooltip>
          </div>
        </div>
        <div class="anchor-box">
          <template v-for="item in anchorMenu">
            <div
              v-if="item.show"
              :key="item.id"
              :class="{active: curAnchor === item.id}"
              class="anchor-item"
              @click="changeAnchor(item.id)"
            >
              <a :href="'#' + item.id">{{ item.name }}</a>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex';
import lodash from 'lodash';
import config from '@/service/config';
import headImg from '@/assets/images/image_head_default.png';
export default {
  name: 'CaseDetailsPreview',
  filters: {
    durationFilter(val) {
      return val;
    }
  },
  components: {},
  props: {
    propCaseId: {
      type: String,
      default: () => {
        return '';
      }
    }
  },
  data() {
    return {
      caseDetailChange: 0,
      avatarImg: require('@/assets/images/ls/ls3.jpg'),
      caseNo: '',
      specialModule: 'caseStages',
      scrollTop: 0,
      loading: false,
      isPreview: '',
      caseDetail: {
        caseCenterId: '',
        caseName: '',
        caseNo: '',
        caseStatus: '',
        caseTimeEnd: '',
        caseTimeStart: '',
        caseType: '',
        continuedTime: '',
        court: '',
        extendedContents: [],
        lables: [],
        lawyers: [],
        proId: '',
        proName: '',
        proType: ''
      },
      curAnchor: '',
      acceptType: ['jpg', 'png', 'jpeg'],
      routeParams: {}
    };
  },
  computed: {
    ...mapState('caseModule', ['caseDetailPage']),
    componentsFrom() {
      return typeof this.$parent.activeRoute === 'undefined';
    },
    anchorMenu() {
      let change = this.caseDetailChange;
      return (
        (this.caseDetail.extendedContents &&
          this.caseDetail.extendedContents.map(item => {
            return {
              id: item.code,
              name: item.name,
              show: item.show
            };
          })) ||
        []
      );
    },
    uploadUrl() {
      return config.cmsUploadUrl;
    },
    downloadUrl() {
      return config.cmsDownloadUrl;
    },
    listUrl() {
      return config.cmsListUrl;
    },
    deleteUrl() {
      return config.cmsDeleteUrl;
    }
  },
  watch: {
    propCaseId: {
      immediate: true,
      handler(val) {
        this.caseNo = this.propCaseId;
        // this.componentsFrom = true;
      }
    },
    caseDetailChange() {
      this.caseDetail.showExtendedContents = false;
      const params = this.caseDetail.extendedContents;
      if (params && params instanceof Object) {
        Object.keys(params).forEach((item) => {
          switch (params[item].code) {
            case 'caseIntro':
            case 'partyAppear':
            case 'extend4':
            case 'caseResult':
              params[item].show = (params[item].content.length > 0 || params[item].files.length > 0);
              params[item].show && (this.caseDetail.showExtendedContents = true);
              break;
            case 'caseStages':
              params[item].show = false;
              params[item].content.forEach(val => {
                val.show = false;
                val.tasks.forEach(va => {
                  (va.content.length > 0 || va.taskFiles.length > 0) && (va.show = true) && (val.show = true) && (params[item].show = true) && (this.caseDetail.showExtendedContents = true);
                });
              });
              break;
            default:
          }
        })
      }
    }
  },
  async mounted() {
    //
    if (Object.keys(this.$route.params).length > 0) {
      sessionStorage.setItem(
        'caseDetailsPreviewRouteParams',
        JSON.stringify(this.$route.params)
      );
      this.routeParams = this.$route.params;
    } else {
      const routeParams = sessionStorage.getItem('caseDetailsPreviewRouteParams');
      routeParams !== null && (this.routeParams = JSON.parse(
        sessionStorage.getItem('caseDetailsPreviewRouteParams')
      ));
    }
    !Object.keys(this.routeParams).length &&
      this.ruoterJump({ name: 'workbench' });
    this.caseNo = this.routeParams.caseNo;
    this.isPreview = this.routeParams.type;
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
    ...mapActions(['ruoterJump']),
    ...mapActions('caseModule', ['case_detail', 'case_center_detail']),
    fileListCallback(file, item) {
      if (file.length === 0) {
        // item.show = false;
        item.taskFiles = '';
        item.files = '';
        this.caseDetailChange++
      }
    },
    imgError(it) {
      it.userFile = headImg;
    },
    getDetail() {
      if (this.isPreview === 'preview') {
        this.caseDetail = lodash.cloneDeep(this.caseDetailPage);
        this.caseDetail.extendedContents = this.caseDetail.extendedContents.map(item => {
          item.showWord = false
          return item
        })
        this.caseDetailChange++;
        this.curAnchor = '';
        this.caseDetailPage &&
          this.caseDetailPage.extendedContents &&
          (this.curAnchor = this.caseDetailPage.extendedContents[0].code);
        return;
      }
      this.loading = true;
      const apiFun =
        this.componentsFrom || this.routeParams.from === 'personalSetting'
          ? 'case_center_detail'
          : 'case_detail';
      this[apiFun]({
        caseNo: this.componentsFrom ? this.propCaseId : this.caseNo
      })
        .then(res => {
          if (res.code === 200) {
            this.caseDetail = res.data || {};
            this.caseDetailChange++;
            this.curAnchor = res.data.extendedContents[0].code || '';
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    handleRemove() {},
    changeAnchor(id) {
      const time = setTimeout(() => {
        // to
        this.$set(this, 'curAnchor', id);
        clearTimeout(time);
      });
    },
    close() {
      this.$set(this, 'caseDetail', {});
      this.$emit('close-case');
    },
    goBack() {
      this.ruoterJump({
        name: this.routeParams.from,
        params: {
          id: this.caseId,
          title: this.caseDetail.caseName,
          type: this.routeParams.type || '',
          tabindex: this.routeParams.tabindex || ''
        }
      });
    },
    onScroll() {
      const _article = document.querySelectorAll('.module-item');
      this.scrollTop = this.$refs.leftCaseScrollView.scrollTop;
      _article.forEach((item, index) => {
        if (this.scrollTop >= item.offsetTop) {
          this.curAnchor = item.id;
        }
      });
    },
    showWordClick(item) {
      this.$set(item, 'showWord', !item.showWord)
      this.$forceUpdate()
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
.case-details-preview {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 6px;
  padding-top: 16px;
  .desc-text {
    color: #666873;
    font-size: 13px;
    line-height: 20px;
    // max-height: 300px;
    // overflow: auto;
  }
  .desc-unfold{
    cursor: pointer;
    color: @main-click;
    text-align: center;
  }
  .input-dark {
    font-size: 16px;
    .el-input__inner {
      color: @flsc-main;
    }
  }
  .file-item {
    display: inline-block;
    width: 122px;
    height: 122px;
    margin-right: 12px;
    .el-image {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      .el-image__inner {
        object-fit: cover;
      }
    }
  }
  .title-operation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px 16px;
    border-bottom: 1px @flsc-border-color solid;
    .left-text {
      padding-left: 12px;
      color: @flsc-main;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .none-border {
    .el-textarea__inner {
      border: 0;
      padding-left: 0;
      padding-right: 0;
      color: #666873;
    }
  }
  .gap-16 {
    height: 16px;
  }
  .case-module {
    display: flex;
    height: calc(100% - 49px);
    .left {
      width: 100%;
      height: 100%;
      max-height: 710px;
      overflow: auto;
      padding: 30px 30px 0;
      border-right: 1px @flsc-border-color solid;
      .module-item {
        margin-bottom: 40px;
      }
      .item-title {
        margin-bottom: 12px;
        color: @flsc-main;
        font-size: 16px;
        font-weight: bold;
        &:before {
          content: "";
          display: inline-block;
          width: 3px;
          height: 16px;
          margin-right: 6px;
          margin-bottom: -2px;
          background-color: @main;
        }
      }
      .item-info {
        margin-left: 10px;
      }
    }
    .right {
      flex: 0 0 auto;
      width: 300px;
      max-height: 710px;
      height: 100%;
      overflow: auto;
      .right-top {
        padding: 0 20px;
        border-bottom: 1px @flsc-border-color solid;
      }
      .detail-title {
        color: @flsc-main;
        font-weight: bold;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .phase-box {
    position: relative;
    padding-left: 30px;
    &:before {
      content: "";
      position: absolute;
      left: 14.5px;
      top: 20px;
      bottom: -43px;
      display: block;
      width: 1px;
      background-color: @flsc-border-color;
    }
    h4 {
      position: relative;
      height: 40px;
      padding: 0 16px;
      margin-top: 12px;
      margin-bottom: 16px;
      box-sizing: border-box;
      line-height: 40px;
      font-weight: bold;
      color: @flsc-main;
      border-radius: 4px;
      .title-icon {
        position: absolute;
        left: -26px;
        top: 50%;
        margin-top: -12px;
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 100%;
        background-color: #ffffff;
        .dgg-icon {
          vertical-align: top;
        }
      }
    }
    .phase-detail {
      padding-left: 16px;
      .task-top {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        &:before {
          position: absolute;
          left: -37px;
          top: 50%;
          margin-top: -6px;
          content: "";
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background-color: #edeff0;
          border: 2px #ffffff solid;
        }
        .task-title {
          color: @flsc-main;
          font-size: 14px;
        }
      }
      .task-person {
        margin-right: 16px;
      }
      .item-info {
        margin-left: 42px;
        margin-bottom: 30px;
      }
    }
    &:last-child {
      .phase-detail {
        &:last-child {
          .item-info {
            position: relative;
            &:before {
              content: "";
              position: absolute;
              left: -73px;
              top: -18px;
              bottom: -43px;
              display: block;
              width: 1px;
              background-color: #ffffff;
            }
          }
        }
      }
    }
  }
  .detail-box {
    padding: 20px;
    border-bottom: 1px @flsc-border-color solid;
    li {
      display: flex;
      align-items: flex-start;
      font-size: 14px;
      & + li {
        margin-top: 20px;
      }
      label {
        display: inline-block;
        flex: 0 0 auto;
        width: 100px;
        color: #666873;
      }
      span {
        color: @flsc-main;
      }
    }
  }
  .lawyer-box {
    padding: 20px;
    border-bottom: 1px @flsc-border-color solid;
  }
  .task-person {
    position: relative;
    display: inline-block;
    margin-right: 12px;
    img {
      height: 26px;
      width: 26px;
      object-fit: cover;
      border-radius: 50%;
    }
    span {
      display: inline-block;
      position: absolute;
      right: -8px;
      top: -8px;
      width: 18px;
      height: 18px;
      line-height: 16px;
      text-align: center;
      border-radius: 50%;
      background-color: #ffae4b;
      color: #fff;
      font-size: 12px;
    }
  }
  .anchor-box {
    position: relative;
    padding: 18px 20px;
    &:before {
      content: "";
      position: absolute;
      left: 24.5px;
      top: 44px;
      display: block;
      width: 1px;
      background-color: @flsc-border-color;
      height: calc(100% - 88px);
    }
    .anchor-item {
      position: relative;
      height: 44px;
      font-size: 14px;
      color: @flsc-main;
      line-height: 44px;
      padding: 0 6px 0 30px;
      border-radius: 4px;
      a {
        display: block;
        color: @flsc-main;
      }
      &:not(.active) {
        &:hover {
          a {
            color: @main;
          }
        }
      }
      &:before {
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -6px;
        content: "";
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background-color: #edeff0;
        border: 2px #ffffff solid;
      }
      &.active {
        &:before {
          background-color: @main;
        }
        a {
          color: @main;
        }
      }
    }
  }
  .label-box {
    margin-top: 30px;
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
      .gray-text-btn {
        vertical-align: middle;
        margin-left: 4px;
      }
      & + .dgg-button {
        margin-left: -8px;
      }
    }
    .gray-icon-btn {
      width: 18px;
      height: 18px;
      margin-bottom: -6px;
      vertical-align: middle;
      border-radius: 50%;
      padding: 0;
      border: 0;
      font-size: 12px;
      background-color: #c8cfdb;
    }
    .gray-text-btn {
      color: #bbcec5;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
