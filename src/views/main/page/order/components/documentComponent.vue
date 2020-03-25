<template>
  <div class="document-component">
    <div class="document-component-head">
      文档管理
      <span
        v-if="
          curTypeItem.type &&
            curTypeItem.type === 'PRODUCTION_FILE' &&
            !getOrderStatusSealName() &&
            orderDetailAuthority.includes($route.name)
        "
        class="fr up-document"
        @click="docModal = true"
      >
        <dgg-icon
          icon-class="icon_upload"
          svg-width="16px"
          svg-height="16px"
          style="vertical-align:middle"
        />
        上传文档
      </span>
    </div>
    <div class="document-component-body">
      <div class="document-component-body-left">
        <ul>
          <li
            v-for="(item, index) of documentList"
            :key="index"
            :class="{ activeItem: item.checked }"
            class="document-component-item"
            @click="itemClick(item)"
          >
            <dgg-icon
              :icon-class="item.icon"
              :svg-width="index === 1 ? '13px' : '16px'"
              :svg-height="index === 1 ? '13px' : '16px'"
              class="document-component-icon"
              style="vertical-align:middle"
            />
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div v-loading="loading" class="document-component-body-right">
        <dgg-edit-table
          ref="documentTable"
          :data="list"
          :hasheight="true"
          :is-request="false"
          :has-pagination="false"
          :columns="columns"
        />
      </div>
    </div>
    <div v-show="imageView" class="img-handle-item">
      <el-image
        ref="imageViewRef"
        :src="imageUrl"
        :preview-src-list="showImgList"
        style="width: 0; height: 0"
      />
    </div>
    <dgg-modal
      :modal="docModal"
      :hasmodal="true"
      :close-on-click-modal="false"
      :loading="fileLoading"
      title="上传文档"
      width="512px"
      class="document-upload-modal"
      @modalQuit="closeModal"
      @modalAffirm="submitModal"
    >
      <dgg-upload-doc
        v-if="docModal"
        ref="uploadDoc"
        :limit="50"
        :auto-upload="false"
        :data="uploadparams"
        :file-list="fileList"
        :accept-type="acceptType"
        :list-url="listUrl"
        :del-url="deleteUrl"
        :action="uploadUrl"
        :onSuccess="onSuccess"
        :onError="fileLoadError"
        class="document-upload-demo"
        multiple
      >
        <dgg-button type="primary" style="width:100px" class="receive-button">
          上传文件
        </dgg-button>
      </dgg-upload-doc>
    </dgg-modal>
    <!-- <pdf
      src="https://dggtechtest.oss-cn-beijing.aliyuncs.com/c9cafee8af4245528548acef3a620bb4_qds_QDS_FLSC_ORDER_7887190469418426368_QDS_FLSC_ORDER_7887190469418426368_DOCUMENT.pdf"
    /> -->

    <!-- 已完结标签 -->
    <!-- v-if="transactionItem.orderStatusCode=='QDS_SC_ORDER_STATUS_CODE04'" -->
    <div
      v-if="
        !orderDetailAuthority.includes($route.name) && getOrderStatusSealName()
      "
      :class="{
        'back-order-seal-active': getOrderStatusSealName() == '已退单'
      }"
      class="finishImg"
      fit="cover"
    >
      <!-- 返回盖章名称 -->
      <p class="finishImg-title">{{ getOrderStatusSealName() }}</p>
      <p class="finishImg-time">
        {{ transactionItem.endTime | timeFilter("YYYY.MM.DD") }}
      </p>
    </div>

    <!-- 右下角订单图标状态 -->
    <orderStatusIconComponents :store-transaction-item="transactionItem" />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
import config from "@/service/config";
import orderStatusIconComponents from "@/views/main/page/components/orderStatusIcon.vue";
import moment from "moment";
import lodash from "lodash";
// import pdf from 'vue-pdf';
export default {
  name: "TransactionDocument",
  components: {
    orderStatusIconComponents // 右下角订单图标状态
    // pdf
  },
  data() {
    return {
      fileLoading: false,
      docModal: false, // 控制模态框的
      imageView: false,
      loading: false,
      imageUrl: "",
      curTypeItem: {},
      acceptType: [
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "mp3",
        "wma",
        "wav",
        "pdf",
        "pptx",
        "txt",
        "jpg",
        "jpeg",
        "gif",
        "png",
        "bmp",
        "rar",
        "zip",
        "gz",
        "mp4",
        "wmv",
        "avi",
        "3gp",
        "mkv"
      ],
      docIconList: {
        ".doc.docx": "icon_word",
        ".xls.xlsx": "icon_excel",
        ".ppt.pptx": "icon_ppt",
        ".txt": "icon_txt",
        ".mp3.wma.wav": "icon_music",
        ".mp4.wmv.avi.3gp.mkv": "icon_video",
        ".jpg.jpeg.gif.png.bmp": "icon_pic",
        ".rar.zip.gz": "icon_package",
        ".pdf": "icon_pdf"
      },
      officeTypes: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"],
      imageTypes: ["jpg", "jpeg", "gif", "png", "bmp"],
      columns: [
        {
          prop: "transaction_name",
          label: "文件名",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="height:60px;line-height:60px">
                <span>
                  <dgg-icon
                    class="fl"
                    icon-class={this.getIconByType(params.row)}
                    style="margin-right:10px;margin-top:21px;"
                    svg-width="18px"
                    svg-height="18px"
                  />
                  <span style="font-size:14px;color:rgba(25,35,60,1)">
                    {params.row.filename}
                  </span>
                </span>
              </div>
            );
          }
        },
        {
          prop: "transaction_name",
          width: "150",
          label: "更新人",
          type: "isrender",
          render: (h, params) => {
            const userName =
              (params.row.content && JSON.parse(params.row.content).name) || "";
            return (
              <div style="height:60px;line-height:60px">
                <span style="font-size:14px;color:rgba(25,35,60,1)">
                  {(userName && decodeURI(userName)) || "-"}
                </span>
              </div>
            );
          }
        },
        {
          prop: "transaction_name",
          width: "190",
          label: "更新时间",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="height:60px;line-height:60px">
                <span style="font-size:14px;color:rgba(25,35,60,1)">
                  {params.row.filedate
                    ? moment(params.row.filedate).format("YYYY.MM.DD HH:mm:ss")
                    : "-"}
                </span>
              </div>
            );
          }
        },
        {
          prop: "transaction_name",
          width: "100",
          label: "大小",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="height:60px;line-height:60px">
                <span style="font-size:14px;color:rgba(25,35,60,1)">-</span>
              </div>
            );
          }
        }
      ],
      list: [],
      fileList: [],
      showImgList: []
    };
  },
  computed: {
    ...mapState([
      "userId",
      "transactionItem",
      "storeInfoData",
      "storeInfoData",
      "orderStatus",
      "orderDetailAuthority"
    ]),
    documentList() {
      return [
        {
          name: "生产文档",
          code: `ZYGSSC_${this.transactionItem.scOrderId}`,
          icon: "icon_product",
          type: "PRODUCTION_FILE",
          checked: true
        },
        {
          name: "作废文档",
          code: `ZYGSSC_${this.transactionItem.scOrderId}`,
          icon: "icon_disable",
          type: "DISABLED_FILE",
          checked: false
        }
      ];
    },
    uploadUrl() {
      return config.uploadUrl;
    },
    listUrl() {
      return config.listUrl;
    },
    downloadUrl() {
      return config.downloadUrl;
    },
    deleteUrl() {
      return config.deleteUrl;
    },
    uploadparams() {
      return {
        fileId: this.curTypeItem.code,
        isDeleteOriginalFile: false,
        type: "DOCUMENT"
      };
    },
    imgFileList() {
      return this.list
        .filter(item => {
          const type =
            item.filename &&
            item.filename.substr(item.filename.lastIndexOf(".") + 1);
          return this.imageTypes.includes(type);
        })
        .map(it => {
          return it.filepath;
        });
    }
  },
  watch: {
    curTypeItem: {
      immediate: true,
      deep: true,
      handler() {
        const opsColumns = {
          label: "操作",
          width: "260px",
          type: "isrender",
          render: (h, params) => {
            let viewBtn = "";
            let restorebtn = "";
            let downloadBtn = "";
            let invalidBtn = "";
            const type =
              params.row.filename &&
              params.row.filename.substr(
                params.row.filename.lastIndexOf(".") + 1
              );
            // 恢复按钮
            if (this.curTypeItem.type === "DISABLED_FILE") {
              if (
                !this.getOrderStatusSealName() &&
                this.orderDetailAuthority.includes(this.$route.name)
              ) {
                restorebtn = (
                  <dgg-button
                    style="width:50px;margin-right:10px;"
                    class="dgg-button-nocolor"
                    onClick={e => {
                      this.restoreDocument(params.row);
                    }}
                  >
                    恢 复
                  </dgg-button>
                );
              } else {
                restorebtn = "";
              }
            }
            // 查看按钮
            if (
              (type === "pdf" || this.imageTypes.includes(type)) &&
              this.curTypeItem.type !== "DISABLED_FILE"
            ) {
              //  <a href={params.row.filepath}>查看</a>
              viewBtn = (
                <dgg-button
                  style="width:50px;margin-right:10px;"
                  class="dgg-button-nocolor"
                  onClick={e => {
                    this.viewDocument(params.row, type);
                  }}
                >
                  查 看
                </dgg-button>
              );
            }
            // 下载按钮
            if (this.curTypeItem.type !== "DISABLED_FILE") {
              downloadBtn = (
                <dgg-button
                  style="width:50px;margin-right:10px;"
                  class="dgg-button-nocolor"
                  onClick={e => {
                    this.downloadDocument(params.row);
                  }}
                >
                  下 载
                </dgg-button>
              );
            }
            // 作废按钮
            if (
              this.curTypeItem.type === "PRODUCTION_FILE" &&
              params.row.showInvalid !== "hidden"
            ) {
              if (
                !this.getOrderStatusSealName() &&
                this.orderDetailAuthority.includes(this.$route.name)
              ) {
                invalidBtn = (
                  <dgg-button
                    style="width:50px;margin-right:10px;"
                    class="dgg-button-nocolor"
                    onClick={e => {
                      this.invalidDocument(params.row);
                    }}
                  >
                    作 废
                  </dgg-button>
                );
              } else {
                invalidBtn = "";
              }
            }
            return (
              <div>
                {viewBtn}
                {restorebtn}
                {downloadBtn}
                {invalidBtn}
              </div>
            );
          }
        };
        this.$set(this.columns, this.columns.length - 1, opsColumns);
        this.$forceUpdate();
      }
    },
    imageUrl() {
      const curImgIndex = this.imgFileList.findIndex(
        res => res === this.imageUrl
      );
      if (curImgIndex < 1 || this.imgFileList.length === 1) {
        this.$set(this, "showImgList", this.imgFileList);
      }
      const copyArr = lodash.cloneDeep(this.imgFileList);
      const newArr = [
        ...copyArr.slice(curImgIndex),
        ...copyArr.slice(0, curImgIndex)
      ];
      this.$set(this, "showImgList", newArr);
    }
  },
  async mounted() {
    console.log(this.transactionItem.orderStatusCode);
    const typeItem = this.documentList.find(it => it.checked);
    this.$set(this, "curTypeItem", typeItem);
    this.$nextTick(() => {
      this.getDocumentList();
    });
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
    ...mapActions("transactionModule", [
      "search_files",
      "update_files",
      "search_files_cms"
    ]),
    ...mapActions("commonModule", [
      // 记录当前操作信息
      "genera_tetemplate"
    ]),
    // 返回订单盖章名称
    getOrderStatusSealName() {
      switch (this.transactionItem.orderStatus) {
        case this.orderStatus.QDS_SC_ORDER_FINISH: // 已完结
          return "已完结";
          break;
        case this.orderStatus.QDS_SC_ORDER_REFUND: // 已退单
          return "已退单";
          break;
        default:
          return "";
          break;
      }
    },
    itemClick(item) {
      this.documentList.forEach(el => {
        el.checked = false;
      });
      this.$set(item, "checked", true);
      const typeItem = this.documentList.find(it => it.checked);
      this.$set(this, "curTypeItem", typeItem);
      this.$nextTick(() => {
        this.getDocumentList();
      });
    },
    getDocumentList() {
      this.loading = true;
      const params = {
        fileId: this.curTypeItem.code
      };
      if (this.curTypeItem.type === "DISABLED_FILE") {
        params.state = 0;
      }
      const apiUrl = this.curTypeItem.isCms
        ? "search_files_cms"
        : "search_files";
      this[apiUrl](params)
        .then(res => {
          if (res.code === 200) {
            res.data.forEach(item => {
              if (
                this.transactionItem.orderStatusCode ===
                "QDS_SC_ORDER_STATUS_CODE03"
              ) {
                if (
                  item.fileid.substring(
                    item.fileid.length - "CASE_AUDIT_APPLY".length
                  ) === "CASE_AUDIT_APPLY"
                ) {
                  console.log(item);
                  item.showInvalid = "hidden";
                }
              } else if (
                this.transactionItem.orderStatusCode ===
                "QDS_SC_ORDER_STATUS_CODE02"
              ) {
                if (
                  item.fileid.substring(
                    item.fileid.length - "REFUND_APPLY".length
                  ) === "REFUND_APPLY"
                ) {
                  console.log(item);
                  item.showInvalid = "hidden";
                }
              }
              // fileid后缀：CASE_AUDIT_APPLY       订单状态：QDS_SC_ORDER_STATUS_CODE03  不显示作废
              // fileid后缀：REFUND_APPLY     订单状态：QDS_SC_ORDER_STATUS_CODE02   不显示作废
            });
            this.list = res.data;
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    // 根据文件类型返回icon
    getIconByType(item) {
      const type =
        item.filename &&
        item.filename.substr(item.filename.lastIndexOf(".") + 1);
      const typeItem = Object.keys(this.docIconList).find(
        ty => ty.indexOf(type) > -1
      );
      return this.docIconList[typeItem] || "icon_others";
    },
    // 恢复文档
    restoreDocument(item) {
      this.update_files({
        fileId: item.fileid,
        fileName: item.filename,
        state: 1
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getDocumentList();
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    // 查看文档
    viewDocument(item, type) {
      // 图片预览
      if (this.imageTypes.includes(type)) {
        this.imageUrl = "";
        this.imageView = true;
        this.imageUrl = item.filepath;
        this.$forceUpdate();
        this.$refs.imageViewRef.clickHandler();
      } else {
        // 其他文件查看
        const fileName = encodeURI(encodeURI(item.filename));
        window.open(item.filepath + "?title=" + fileName);
      }
    },
    // 下载文档
    downloadDocument(item) {
      const fileName = encodeURI(encodeURI(item.filename));
      const url =
        this.downloadUrl +
        "?fileUrl=" +
        item.filepath +
        "&fileName=" +
        fileName;
      window.open(url, "_blank");
    },
    // 作废文档
    invalidDocument(item) {
      this.$confirm(
        "作废后可在作废文件夹中找回该文件，确认要作废该文件？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // 作废操作
          this.update_files({
            fileId: item.fileid,
            fileName: item.filename,
            state: 0
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.getDocumentList();
              this.invalidRecords(item);
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          //
        });
    },
    closeModal() {
      this.docModal = false;
      this.getDocumentList();
    },
    fileLoadError() {
      this.fileLoading = false;
    },
    async submitModal() {
      this.fileLoading = true;
      await this.$refs["uploadDoc"].$refs["upload-inner"].manualUpload(() => {
        this.docModal = false;
        this.fileLoading = false;
        this.getDocumentList();
      });
    },
    // 文档上传成功
    async onSuccess(res, file) {
      if (this.transactionItem) {
        const _parmas = {
          code: "ZYGSSC_TASK_RECORD_OPT_4",
          id: this.transactionItem.id,
          name: file.name,
        };
        await this.genera_tetemplate(_parmas);
      }
    },
    // 添加作废记录
    async invalidRecords(file) {
      if (this.transactionItem) {
        const _parmas = {
          code: "ZYGSSC_TASK_RECORD_OPT_24",
          id: this.transactionItem.id,
          name: file.filename
        };
        await this.genera_tetemplate(_parmas);
      }
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/main.less"; //引入全局less文件
.document-component {
  width: 100%;
  height: 100%;
  position: relative;
  .document-upload-modal {
    .el-dialog__headerbtn {
      display: none;
    }
    .el-dialog__header {
      padding: 20px;
      height: 60px;
      .el-dialog__title {
        color: #19233c;
        line-height: 23px;
        font-weight: 550;
        display: block;
        width: 100%;
        text-align: left;
      }
    }
    .el-dialog__body {
      border-top: 1px solid #e3e4e6;
    }
  }
  .document-upload-demo {
    position: relative;

    .el-upload {
      position: absolute;
      top: -70px;
      right: 0;
    }
    .el-upload-list {
      height: 300px;
      overflow-y: auto;

      .el-upload-list__item {
        margin-top: 10px;
        font-size: 14px;
        .dgg-icon {
          width: 18px !important;
          height: 18px !important;
          vertical-align: middle;
        }
        .el-icon-circle-close {
          top: 2px;
          color: #f10940;
        }
        &:first-child {
          margin-top: 0;
        }
        i {
          font-size: 18px;
        }
      }
    }
  }
  .document-component-head {
    height: 53px;
    line-height: 53px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(25, 35, 60, 1);
    padding-left: 30px;
    border-bottom: 1px solid #e3e4e6;
    .upload-file {
      display: inline-block;
    }
  }
  .document-component-body {
    display: flex;
    height: 710px;
    .document-component-body-left {
      width: 200px;
      border-right: 1px solid #edeff0;
      box-sizing: border-box;
      ul {
        li {
          .dgg-icon {
            &:nth-child(2) {
              width: 14px !important;
              height: 14px !important;
            }
          }
        }
      }
    }
    .document-component-body-right {
      flex: 1;
      height: 100%;
      .el-table td,
      .el-table th {
        padding: 0 6px;
      }
    }
    .document-component-item {
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-bottom: 1px solid #edeff0;
      cursor: pointer;
      width: 200px;
      span {
        vertical-align: middle;
      }
    }
    .document-component-item:hover {
      background: #f2f4f7;
      color: #10bbb8;
      .document-component-icon {
        color: #10bbb8;
      }
    }
    .activeItem {
      background: #f2f4f7;
      color: #10bbb8;
      .document-component-icon {
        color: #10bbb8;
      }
    }
  }
  .up-document {
    color: #10bbb8;
    font-size: 14px;
    font-weight: 400;
    color: rgba(16, 187, 184, 1);
    margin-right: 30px;
    cursor: pointer;
    &:hover {
      color: #18ccc9;
    }
    &:focus {
      color: #0d9391;
    }
  }
}

.finishImg {
  top: -20px;
  right: 180px;
  position: absolute;
  z-index: 100;
  background: url("~assets/images/icon_chapter_red.png") no-repeat;
  background-size: 100% 100%;
  width: 127px;
  height: 50px;
  padding: 5px;
  color: #f10940;
  text-align: center;
  transform: rotate(-30deg);
  -ms-transform: rotate(-30deg); /* IE 9 */
  -moz-transform: rotate(-30deg); /* Firefox */
  -webkit-transform: rotate(-30deg); /* Safari 和 Chrome */
  -o-transform: rotate(-30deg); /* Opera */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px;
  overflow: hidden;
  &.back-order-seal-active {
    background: url("~assets/images/icon_chapter_grey_back.png") no-repeat;
    background-size: 100% 100%;
    color: #d0d0d0;
  }
  .finishImg-time {
    font-size: 12px;
    font-weight: 400;
    font-size: 12px;
    font-weight: 400;
    height: 20px;
    line-height: 20px;
    .dgg-text-ellip;
    padding: 0 10px;
  }
  .finishImg-title {
    font-size: 18px;
    font-weight: 500;
    height: 24px;
    line-height: 24px;
    .dgg-text-ellip;
    padding: 0 20px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 10px;
  }
}
</style>
