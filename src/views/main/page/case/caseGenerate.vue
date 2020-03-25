<template>
  <div
    v-loading="loading"
    class="case-generate"
  >
    <div class="title-operation">
      <dgg-input
        v-model="caseDetail.caseName"
        style="width:364px;"
        size="small"
        maxlength="30"
        class="input-dark"
        placeholder="请输入"
        @change="setDefaultTitle"
      />
      <div class="right">
        <dgg-button
          size="small"
          class="dgg-button-nocolor"
          @click="reset"
        >重置</dgg-button>
        <dgg-button
          size="small"
          class="dgg-button-nocolor"
          @click="save"
        >保存</dgg-button>
        <dgg-button
          size="small"
          class="dgg-button-nocolor"
          @click="pageToPreview"
        >预览</dgg-button>
        <dgg-button
          size="small"
          class="dgg-button-nocolor"
          @click="publish"
        >发布</dgg-button>
      </div>
    </div>
    <div class="case-module">
      <div
        ref="leftCaseScrollView"
        class="left"
        @scroll="onScroll"
      >
        <template v-for="moduleItem in caseDetail.extendedContents">
          <template v-if="moduleItem.code !== specialModule">
            <div
              :id="moduleItem.code"
              :key="moduleItem.code"
              class="module-item"
            >
              <h2 class="item-title">{{ moduleItem.name }}</h2>
              <div class="item-info">
                <dgg-input
                  ref="inputCaseRef"
                  v-model="moduleItem.content"
                  :autosize="textAutosize"
                  resize="none"
                  size="small"
                  placeholder="请输入描述"
                  type="textarea"
                />
                <div class="gap-16" />
                <dgg-upload
                  v-if="updateFiles"
                  ref="uploadCaseRef"
                  :data="{
                    fileId: moduleItem.files || ('qdb-caseinstance-' + moduleItem.code + '-' + caseDetail.caseNo),
                    isDeleteOriginalFile: false,
                  }"
                  :limit="20"
                  :accept-type="acceptType"
                  :list-url="listUrl"
                  :download-url="downloadUrl"
                  :upload-url="uploadUrl"
                  :del-url="deleteUrl"
                  :is-cms="true"
                  upload-word="上传图片"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <div
              :id="moduleItem.code"
              :key="moduleItem.code"
              class="module-item"
            >
              <h2 class="item-title">{{ moduleItem.name }}</h2>
              <div
                v-for="(item, index) in moduleItem.content"
                :key="item.stageId"
                class="phase-box"
              >
                <h4>{{ index + 1 | upStrFilter }}、{{ item.stageName }}</h4>
                <div
                  v-for="(phaseItem, phaseIndex) in item.tasks"
                  :key="phaseIndex"
                  class="phase-detail"
                >
                  <div class="task-top">
                    <div class="task-title"><span>任务</span>{{ phaseItem.taskName }}</div>
                    <div class="task-person" v-if="phaseItem.lawyer">
                      <dgg-tooltip
                        :content="phaseItem.lawyer.userName"
                        effect="dark"
                        placement="top"
                      >
                        <div>
                          <img
                            :src="phaseItem.lawyer.userFile"
                            class="person-img"
                            @error="imgError(phaseItem.lawyer)"
                          >
                          <span v-if="phaseItem.lawyer.isMainHandle === 1">主</span>
                        </div>
                      </dgg-tooltip>
                    </div>
                  </div>
                  <div class="item-info">
                    <dgg-input
                      ref="inputCaseRef"
                      v-model="phaseItem.content"
                      :autosize="textAutosize"
                      resize="none"
                      size="small"
                      placeholder="请输入描述"
                      type="textarea"
                    />
                    <div class="gap-16" />
                    <dgg-upload
                      ref="uploadCaseRef"
                      :data="{
                        fileId: phaseItem.taskFiles || ('qdb-caseinstance-' + phaseItem.taskId + '-' + caseDetail.caseNo),
                        isDeleteOriginalFile: false,
                      }"
                      v-if="updateFiles"
                      :limit="20"
                      :accept-type="acceptType"
                      :list-url="listUrl"
                      :download-url="downloadUrl"
                      :upload-url="uploadUrl"
                      :del-url="deleteUrl"
                      :is-cms="true"
                      upload-word="上传图片"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
      <div class="right">
        <div class="progress-bar">
          <p>完善度</p>
          <div class="progress-box">
            <el-progress
              :percentage="finished"
              :stroke-width="4"
            />
            <dgg-tooltip
              content="更新完善度"
              effect="dark"
              placement="top"
            >
              <dgg-icon
                svg-width="14px"
                svg-height="14px"
                icon-class="dgg-renovate"
                @click="updateFinishNum"
              />
            </dgg-tooltip>
          </div>
        </div>
        <div class="anchor-box">
          <div
            v-for="item in anchorMenu"
            :key="item.id"
            :class="{active: curAnchor === item.id}"
            class="anchor-item"
            @click="changeAnchor(item.id)"
          >
            <a :href="'#' + item.id">{{ item.name }}</a>
          </div>
        </div>
        <div class="label-box">
          <div
            v-for="item in caseDetail.lables"
            :key="item.lableCode"
            class="label-item"
          >
            <span class="text-one-line">{{ item.lableName }}</span>
            <dgg-button
              type="text"
              class="gray-text-btn"
              icon="el-icon-close"
              @click="removeLabel(item)"
            />
          </div>
          <dgg-tooltip
            content="添加标签"
            effect="dark"
            placement="top"
          >
            <dgg-button
              type="primary"
              class="gray-icon-btn"
              icon="el-icon-plus"
              @click="addLabel"
            />
          </dgg-tooltip>
        </div>
      </div>
    </div>
    <add-label
      ref="addLabelView"
      :max-label="maxLabel"
      @add-callback="addCallback"
    />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapMutations, mapActions } from 'vuex';
import config from '@/service/config';
import lodash from 'lodash';
import addLabel from './dialog/addLabel';
import headImg from '@/assets/images/image_head_default.png';
export default {
  name: 'CaseGenerate',
  components: {
    addLabel
  },
  data() {
    return {
      updateFiles: true,
      caseNo: '',
      scrollTop: 0,
      finished: 0,
      maxLabel: 10,
      loading: false,
      specialModule: 'caseStages',
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
      acceptType: ['jpg', 'png', 'jpeg'],
      textAutosize: { minRows: 3, maxRows: 4 },
      curAnchor: ''
    };
  },
  computed: {
    ...mapState('caseModule', ['caseDetailPage', 'originalDetail']),
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
    },
    anchorMenu() {
      return (
        (this.caseDetail.extendedContents &&
          this.caseDetail.extendedContents.map(item => {
            return {
              id: item.code,
              name: item.name
            };
          })) ||
        []
      );
    }
  },
  watch: {
    caseDetail() {
      this.$nextTick(() => {
        this.addFilesId();
      });
      setTimeout(() => {
        this.updateFinishNum();
      }, 500);
    }
  },
  created() {},
  async mounted() {
    if (Object.keys(this.$route.params).length > 0) {
      sessionStorage.setItem('caseDetailsPreviewRouteParams', JSON.stringify(this.$route.params));
      this.routeParams = this.$route.params;
    } else {
      this.ruoterJump({ name: 'case' });
      this.routeParams = JSON.parse(sessionStorage.getItem('caseDetailsPreviewRouteParams'));
    }
    !Object.keys(this.routeParams).length && this.ruoterJump({ name: 'case' });
    this.caseNo = this.routeParams.caseNo;
    this.isPreview = this.routeParams.type;

    // this.caseNo = this.$route.params.caseNo;
    // this.isPreview = this.$route.params.type;
    this.getDetail();
  },
  activated() {
    //
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapMutations('caseModule', ['mergePageCasePreview']),
    ...mapActions(['ruoterJump']),
    ...mapActions('caseModule', [
      'case_detail',
      'case_edit_detail',
      'case_edite',
      'publish_two',
      'case_publish',
      'regenerate'
    ]),
    imgError(it) {
      it.userFile = headImg;
    },
    async getDetail() {
      if (this.isPreview === 'preview') {
        this.caseDetail = lodash.cloneDeep(this.caseDetailPage);
        this.curAnchor = this.caseDetailPage.extendedContents[0].code || '';
        return;
      }
      this.loading = true;
      const apiFun =
        this.routeParams.from === 'newEdit'
          ? 'case_edit_detail'
          : 'case_detail';
      await this[apiFun]({
        caseNo: this.caseNo
      })
        .then(res => {
          if (res.code === 200) {
            this.caseDetail = res.data || {};
            this.finished = res.data.finished || 0;
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
    pageToPreview() {
      this.mergePageCasePreview(this.caseDetail);
      this.jumpToPreview('preview');
    },
    setDefaultTitle() {
      if (!this.caseDetail.caseName) {
        this.caseDetail.caseName =
          this.caseDetail.customerName + this.caseDetail.proType;
      }
    },
    jumpToPreview(type) {
      this.ruoterJump({
        name: 'caseDetailsPreview',
        params: {
          caseNo: this.caseNo,
          type: type || '',
          title: this.caseDetail.caseName,
          from: 'caseGenerate'
        }
      });
    },
    handleRemove() {},
    changeAnchor(id) {
      const time = setTimeout(() => {
        this.curAnchor = id;
        clearTimeout(time);
      });
    },
    removeLabel(data) {
      this.$confirm('是否移除该标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const itemIndex = this.caseDetail.lables.findIndex(
          item => item.lableCode === data.lableCode
        );
        if (itemIndex > -1) {
          this.caseDetail.lables.splice(itemIndex, 1);
        }
      });
    },
    addLabel() {
      if (this.caseDetail.lables.length >= this.maxLabel) {
        this.$message({
          message: '一个案例最多只能添加' + this.maxLabel + '个标签',
          type: 'warning'
        });
        return;
      }
      const labelIds = this.caseDetail.lables.map(it => it.lableCode);
      this.$refs.addLabelView.showModel(true, labelIds);
    },
    addCallback(list) {
      this.$set(this.caseDetail, 'lables', [
        ...lodash.cloneDeep(this.caseDetail.lables),
        ...lodash.cloneDeep(list)
      ]);
    },
    async reset() {
      this.$confirm(
        '确认重置案例内容，重置后您填写的内容将被清空，恢复到默认填充状态?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          // regenerate
          const res = await this.regenerate({ proId: this.caseDetail.fvProId });
          if (res.code === 200) {
            this.caseNo = res.data.caseNo;
            await this.getDetail();
            console.log(111);
            this.caseDetail = lodash.cloneDeep(this.originalDetail);
            this.updateFiles = false;
            await this.$nextTick(() => {
              this.updateFiles = true;
            });
          }
        })
        .catch(() => {});
    },
    /**
     * @author wj
     * 深度克隆object
     * @param obj object 克隆对象
     * @param setNull bool 是否将空字符串''改为null
     * @param cache default param []
     */
    setNull(obj, setNull = false, cache = []) {
      // typeof [] => 'object'
      // typeof {} => 'object'
      if (obj === null || typeof obj !== 'object') {
        if (setNull && typeof obj === 'string' && obj.length === 0) {
          return null;
        }
        return obj
      }
      // 如果传入的对象与缓存的相等, 则递归结束, 这样防止自引用循环
      /**
       * 类似下面这种
       * var a = {b:1}
       * a.c = a
       */
      const hit = cache.filter(c => c.original === obj)[0];
      if (hit) {
        return hit.copy
      }
      const copy = Array.isArray(obj) ? [] : {};
      // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
      cache.push({
        original: obj,
        copy
      });
      Object.keys(obj).forEach(key => {
        copy[key] = this.setNull(obj[key], setNull, cache)
      });
      return copy
    },
    save() {
      // 保存案例编辑
      let params = {
        ...this.caseDetail
      };
      params = this.setNull(params, true);
      this.case_edite(params)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.successCallback();
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
    publish() {
      // 发布案例编辑
      this.$confirm(
        '案例发布并通过案例中心审核后，可对外展示无法撤回，确定发布？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let params = {
            ...this.caseDetail
          };
          params = this.setNull(params, true);
          this.publish_two(params)
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '案例保存并发布成功',
                  type: 'success'
                });
                this.successCallback();
              } else {
                // this.$message({
                //   message: res.message,
                //   type: 'error'
                // });
              }
              this.loading = false;
            })
            .catch(e => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    addFilesId() {
      this.caseDetail.extendedContents.forEach(item => {
        if (!item.files && !Array.isArray(item.content)) {
          item.files =
            'qdb-caseinstance-' + item.code + '-' + this.caseDetail.caseNo;
        } else if (Array.isArray(item.content)) {
          item.content.forEach(contItem => {
            if (contItem.tasks) {
              contItem.tasks.forEach(taskItem => {
                if (!taskItem.taskFiles) {
                  taskItem.taskFiles =
                    'qdb-caseinstance-' +
                    taskItem.taskId +
                    '-' +
                    this.caseDetail.caseNo;
                }
              });
            }
          });
        }
      });
    },
    updateFinishNum() {
      const inputLen =
        (this.$refs.inputCaseRef && this.$refs.inputCaseRef.length) || 0;
      const uploadlen =
        (this.$refs.uploadCaseRef && this.$refs.uploadCaseRef.length) || 0;
      const hasInputVal =
        (this.$refs.uploadCaseRef &&
          this.$refs.inputCaseRef.filter(it => {
            return it.value;
          })) ||
        0;
      const hasUploadVal =
        (this.$refs.uploadCaseRef &&
          this.$refs.uploadCaseRef.filter(it => {
            return it.fileList.length;
          })) ||
        0;
      const nameInput = this.caseDetail.caseName ? 1 : 0;
      const hasValKeysLen =
        hasInputVal.length + hasUploadVal.length + nameInput;
      const keyTotalLen = inputLen + uploadlen + 1;
      const percentVal = hasValKeysLen / keyTotalLen;
      this.finished = isNaN(percentVal) ? 0 : Math.ceil(percentVal * 100);
    },
    successCallback() {
      this.ruoterJump({
        name: 'case',
        params: {
          isFresh: true
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
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
.case-generate {
  width: 100%;
  background: #fff;
  border-radius: 6px;
  padding-top: 16px;
  height: 100%;
  .input-dark {
    font-size: 16px;
    .el-input__inner {
      color: @flsc-main;
    }
  }
  .title-operation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px 16px;
    border-bottom: 1px @flsc-border-color solid;
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
      height: 100%;
      overflow: auto;
      padding-top: 30px;
      .progress-bar {
        padding: 0 30px 14px 20px;
        border-bottom: 1px @flsc-border-color solid;
        .progress-box {
          display: flex;
          .el-progress {
            width: calc(100% - 10px);
          }
          .dgg-icon {
            cursor: pointer;
            color: @flsc-main;
            &:hover {
              color: @main;
            }
          }
        }
        p {
          color: #9398a1;
          font-size: 13px;
          margin-bottom: 4px;
        }
        .el-progress__text {
          color: @main;
          font-size: 13px;
        }
      }
    }
  }
  .phase-box {
    h4 {
      height: 40px;
      padding: 0 20px;
      margin-top: 12px;
      margin-bottom: 16px;
      box-sizing: border-box;
      line-height: 40px;
      font-weight: bold;
      color: @flsc-main;
      background-color: #f5f7fa;
      border-radius: 4px;
    }
    .phase-detail {
      padding-left: 16px;
      .task-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .task-title {
          color: @flsc-main;
          font-size: 12px;
          span {
            display: inline-block;
            width: 36px;
            height: 18px;
            margin-right: 6px;
            border-radius: 10px;
            border: 1px @main solid;
            color: @main;
            line-height: 16px;
            text-align: center;
            font-size: 12px;
          }
        }
        .task-person {
          position: relative;
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
      }
      .item-info {
        margin-left: 0;
        margin-bottom: 30px;
      }
    }
  }
  .anchor-box {
    padding: 18px 14px;
    border-bottom: 1px @flsc-border-color solid;
    .anchor-item {
      height: 44px;
      font-size: 14px;
      color: @flsc-main;
      line-height: 44px;
      padding: 0 6px;
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
      &.active {
        background-color: #f5f7fa;
        &:hover {
          a {
            color: @flsc-main;
          }
        }
      }
    }
  }
  .label-box {
    padding: 20px;
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
