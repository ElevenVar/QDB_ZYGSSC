<template>
  <div>
    <!-- 右下角订单图标状态 -->
    <ul class="order-status-btn-icon">
      <li
        v-for="(orderItem, orderIndex) in orderStatusBtnSvgs"
        v-if="transactionItem.orderStatus == orderItem.type"
        :key="orderIndex"
        @click="orderStatusClick(transactionItem, orderItem)"
      >
        <dgg-tooltip
          :value="showTips"
          :popper-options="popperOptions"
          :content="orderItem.title"
          placement="top"
          class="msg-dot"
          effect="dark"
        >
          <dgg-icon
            :icon-class="orderItem.iconClass"
            svg-width="88px"
            svg-height="88px"
          />
        </dgg-tooltip>
      </li>
    </ul>
    <div>
      <el-dialog
        :visible.sync="backCodeDialog"
        title="退单"
        width="400px"
        @close="
          backCodeForm.code = '';
          backCodeForm.remark = '';
          deleteFiles(DetailDocumentfileLists);
        "
      >
        <el-form ref="form" :model="backCodeForm" :rules="rules">
          <el-form-item
            label="退单类型："
            prop="code"
            class="return-order-type"
          >
            <el-select v-model="backCodeForm.code" placeholder="请选择退单类型">
              <el-option
                v-for="item in backCodeOption"
                :label="item.name"
                :value="item.code"
                :key="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="退单备注：" class="back-memo" prop="remark">
            <el-input
              v-model="backCodeForm.remark"
              :autosize="{ minRows: 4, maxRows: 4 }"
              type="textarea"
              show-word-limit
              maxlength="500"
            />
          </el-form-item>
          <el-form-item label="附件上传：" prop="file">
            <el-input v-if="false" v-model="backCodeForm.file" />
            <span
              class="file-add"
              @click="
                fileType = 'back';
                docModal = true;
              "
              >+添加</span
            >
          </el-form-item>
          <el-form-item>
            <ul>
              <li
                v-for="(fileListItem, fileListIndex) in DetailDocumentfileLists"
                :key="fileListIndex"
              >
                <span class="icon-name">
                  <dgg-icon
                    :icon-class="getIconByType(fileListItem)"
                    svg-width="16px"
                    svg-height="16px"
                  />
                  <span
                    :title="
                      fileListItem.filename ? fileListItem.filename : '--'
                    "
                    class="file-name"
                    >{{
                      fileListItem.filename ? fileListItem.filename : "--"
                    }}</span
                  >
                </span>
                <span class="dgg-button-group file-handel">
                  <span
                    v-if="
                      getDocumentType(fileListItem) == 'pdf' ||
                        imageTypes.includes(getDocumentType(fileListItem))
                    "
                    @click="
                      viewDocument(fileListItem, getDocumentType(fileListItem))
                    "
                    >查看
                  </span>
                  <span @click="downloadDocument(fileListItem)">下载 </span>
                  <span @click="invalidDocument(fileListItem)">删除 </span>
                </span>
              </li>
            </ul>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="
              backCodeDialog = false;
              backCodeForm.code = '';
              backCodeForm.remark = '';
              deleteFiles(DetailDocumentfileLists);
            "
            >取 消</el-button
          >
          <el-button type="primary" @click="backOrder">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="caseAuditDialog"
        title="结项"
        width="400px"
        @close="
          caseAuditForm.code = '';
          caseAuditForm.remark = '';
          deleteFiles(DetailDocumentfileLists);
        "
      >
        <el-form ref="form" :model="caseAuditForm" :rules="rules">
          <el-form-item
            label="结项类型："
            prop="code"
            class="return-order-type"
          >
            <el-select
              v-model="caseAuditForm.code"
              placeholder="请选择结项类型"
            >
              <el-option
                v-for="item in caseAuditOption"
                :label="item.name"
                :value="item.code"
                :key="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="结项备注：" class="back-memo" prop="remark">
            <el-input
              v-model="caseAuditForm.remark"
              :autosize="{ minRows: 4, maxRows: 4 }"
              type="textarea"
              show-word-limit
              maxlength="500"
            />
          </el-form-item>
          <el-form-item label="附件上传：" prop="file">
            <el-input v-if="false" v-model="caseAuditForm.file" />
            <span
              class="file-add"
              @click="
                fileType = 'audit';
                docModal = true;
              "
              >+添加</span
            >
          </el-form-item>
          <el-form-item>
            <ul>
              <li
                v-for="(fileListItem, fileListIndex) in DetailDocumentfileLists"
                :key="fileListIndex"
              >
                <span class="icon-name">
                  <dgg-icon
                    :icon-class="getIconByType(fileListItem)"
                    svg-width="16px"
                    svg-height="16px"
                  />
                  <span
                    :title="
                      fileListItem.filename ? fileListItem.filename : '--'
                    "
                    class="file-name"
                    >{{
                      fileListItem.filename ? fileListItem.filename : "--"
                    }}</span
                  >
                </span>
                <span class="dgg-button-group file-handel">
                  <span
                    v-if="
                      getDocumentType(fileListItem) == 'pdf' ||
                        imageTypes.includes(getDocumentType(fileListItem))
                    "
                    @click="
                      viewDocument(fileListItem, getDocumentType(fileListItem))
                    "
                    >查看
                  </span>
                  <span @click="downloadDocument(fileListItem)">下载 </span>
                  <span @click="invalidDocument(fileListItem)">删除 </span>
                </span>
              </li>
            </ul>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="
              caseAuditDialog = false;
              caseAuditForm.code = '';
              caseAuditForm.remark = '';
              deleteFiles(DetailDocumentfileLists);
            "
            >取 消</el-button
          >
          <el-button type="primary" @click="auditOrder">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 上传附件 -->
      <dgg-modal
        :modal="docModal"
        :hasmodal="true"
        :close-on-click-modal="false"
        :loading="fileLoading"
        affirm-text="确定"
        title="上传文档"
        width="512px"
        class="document-upload-modal"
        @modalAffirm="docModalAffirm"
        @modalQuit="docModal = false"
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
          class="document-upload-demo"
          :onError="fileLoadError"
          multiple
        >
          <dgg-button type="primary" style="width:100px" class="receive-button">
            上传文件
          </dgg-button>
        </dgg-upload-doc>
      </dgg-modal>
      <!-- 图片pdf预览 -->
      <div v-show="imageView" class="img-handle-item">
        <el-image
          ref="imageViewRef"
          :src="imageUrl"
          :preview-src-list="showImgList"
          class="imageViewRef fileimg"
        />
      </div>

      <!-- 任务暂停 -->
      <dgg-modal
        :modal="orderPauseView"
        :show-close="false"
        :hasmodal="true"
        :close-on-click-modal="false"
        title="订单暂停"
        width="512px"
        class="query-template-modal task-pause-model"
        @modalQuit="orderPauseCloseModal"
        @modalAffirm="orderPauseSubmitModal"
      >
        <dgg-form
          :model="taskPauseData"
          :rules="orderPauseRules"
          label-width="110px"
          ref="orderPauseForm"
          class=""
        >
          <dgg-form-item label=" 订单名称：" class="current-task-name">
            <span>{{ transactionItem.productName }}</span>
          </dgg-form-item>
          <dgg-form-item label="暂停原因：" prop="reason">
            <dgg-input
              v-model="taskPauseData.reason"
              type="textarea"
              class="remarksTextArea"
              placeholder="请输入暂停原因"
              :autosize="{ minRows: 4, maxRows: 15 }"
              maxlength="1000"
              oninput="if(value.length>1000)value=value.slice(0,1000)"
            />
          </dgg-form-item>
          <dgg-form-item
            label="计划开启时间："
            prop="planBeginTime"
            class="plan-begin-picker-time"
          >
            <dgg-picker
              v-model="taskPauseData.planBeginTime"
              dateType="datetime"
              placeholder="请选择计划开始时间"
              :pickerOptions="setPlanBeginTime()"
              default-time="12:00:00"
              format="yyyy-MM-dd HH:mm:ss"
              size="small"
              style="width:160px;"
              class="chage-deadline-time "
            />
          </dgg-form-item>
        </dgg-form>
      </dgg-modal>
    </div>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
import Notification from "@/componentsEl/notification/index.js";
import config from "@/service/config";
import moment from "moment";
export default {
  name: "OrderStatusIcon",
  components: {},
  props: {
    storeTransactionItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      orderPauseRules: {
        planBeginTime: [
          { required: true, message: "请选择计划开启时间", trigger: "blur" }
        ],
        reason: [{ required: true, message: "请输入暂停原因", trigger: "blur" }]
      },
      taskPauseData: {
        //订单暂停数据
        planBeginTime: "",
        reason: ""
      },
      orderPauseView: false, //显示任务暂停弹窗
      fileList: [],
      fileLoading: false,
      deleteFile: true,
      transactionItem: {}, // 默认订单传递下来的值
      imageView: false,
      imageUrl: "",
      showImgList: [],
      paramsData: {},
      caseAuditRow: "", // 完结订单
      backOrderRow: "", // 拒接订单
      docModal: false,
      caseAuditOption: [],
      caseAuditDialog: false,
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
      DetailDocumentfileLists: [],
      fileType: "back",
      backCodeOption: [],
      backCodeForm: {
        code: "",
        remark: ""
      },
      caseAuditForm: {
        code: "",
        remark: ""
      },
      rules: {
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
        code: [{ required: true, message: "", trigger: "blur" }],
        file: [{ required: true, message: "请上传附件", trigger: "blur" }]
      },
      showTips: false,
      backCodeDialog: false, // 拒接类型弹窗
      popperOptions: {
        boundariesElement: "body"
      },
      time: 0,
      orderStatusBtnSvgs: [
        {
          // 完结待审核
          title: "撤回",
          iconClass: "icon_revoke",
          operationOrderStatus: "cancel_order",
          type: "QDS_SC_ORDER_STATUS_CODE03"
        },
        {
          // 退单待审核
          title: "撤回",
          iconClass: "icon_revoke",
          operationOrderStatus: "reback_order",
          type: "QDS_SC_ORDER_STATUS_CODE02"
        },
        {
          // 已完结
          title: "生成案例",
          iconClass: "icon_generate",
          operationOrderStatus: "over_case_order",
          type: "QDS_ZYGSSC_ATTRSTATUS_CODE4"
        },
        {
          // 办理中
          title: "退单",
          iconClass: "icon_withdraw123",
          operationOrderStatus: "refuse_order",
          type: "QDS_SC_ORDER_STATUS_CODE01"
        },
        {
          title: "完结",
          iconClass: "icon_over",
          operationOrderStatus: "case_order",
          type: "QDS_SC_ORDER_STATUS_CODE01"
        },
        {
          title: "暂停",
          iconClass: "icon_zanting_order",
          operationOrderStatus: "pause_order",
          type: "QDS_SC_ORDER_STATUS_CODE01"
        },
        {
          title: "退单",
          iconClass: "icon_withdraw123",
          operationOrderStatus: "refuse_order",
          type: "QDS_SC_ORDER_STATUS_CODE19"
        },
        {
          title: "完结",
          iconClass: "icon_over",
          operationOrderStatus: "case_order",
          type: "QDS_SC_ORDER_STATUS_CODE19"
        },
        {
          title: "暂停",
          iconClass: "icon_zanting_order",
          operationOrderStatus: "pause_order",
          type: "QDS_SC_ORDER_STATUS_CODE19"
        },
        {
          title: "暂停",
          iconClass: "icon_zanting_order",
          operationOrderStatus: "pause_order",
          type: "QDS_SC_ORDER_STATUS_CODE28"
        },
        {
          title: "退单",
          iconClass: "icon_withdraw123",
          operationOrderStatus: "refuse_order",
          type: "QDS_SC_ORDER_STATUS_CODE29"
        },
        {
          title: "完结",
          iconClass: "icon_over",
          operationOrderStatus: "case_order",
          type: "QDS_SC_ORDER_STATUS_CODE29"
        },
        {
          title: "暂停",
          iconClass: "icon_zanting_order",
          operationOrderStatus: "pause_order",
          type: "QDS_SC_ORDER_STATUS_CODE29"
        },
        {
          title: "恢复订单",
          iconClass: "icon_revoke",
          operationOrderStatus: "icon_withdraw123",
          type: "QDS_SC_ORDER_STATUS_CODE26"
        },
        {
          //暂停待审核
          title: "撤回",
          iconClass: "icon_revoke",
          operationOrderStatus: "icon_revoke",
          type: "QDS_SC_ORDER_STATUS_CODE27"
        }
      ]
    };
  },
  computed: {
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
        fileId:
          this.fileType === "back"
            ? `ZYGSSC_${this.backOrderRow.scOrderId}`
            : `ZYGSSC_${this.caseAuditRow.scOrderId}`,
        isDeleteOriginalFile: false,
        type: this.fileType === "back" ? "REFUND_APPLY" : "CASE_AUDIT_APPLY"
      };
    }
  },
  watch: {},
  async mounted() {
    console.log(
      JSON.parse(JSON.stringify(this.storeTransactionItem)),
      "orderStatusIcon--------transactionItem"
    );
  },
  activated() {
    //
  },
  created() {
    this.$nextTick(() => {
      this.transactionItem = this.storeTransactionItem;
      console.log(this.transactionItem, 222);
      console.log(this.transactionItem.orderStatusCode, 111);
    });
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions(["ruoterJump"]),
    ...mapActions("caseModule", ["case_edit_detail"]),
    ...mapActions("transactionModule", [
      "apply_case_audit",
      "apply_back_order_audit",
      "search_files",
      "update_files",
      "delete_files",

      "undo_case_audit",
      "undo_back_order_audit",
      "zygs_handingOrder_applyStop"
    ]),
    ...mapActions("receiveModule", ["refuse_code_tree_book_list"]),
    ...mapActions("transactionDynamicModule", [
      "get_production_order_details_data", // 获取订单详情
      "zygs_handingOrder_recoveryStopOrder"
    ]),
    ...mapMutations(["setTransactionItem"]),
    // 订单状态点击
    async orderStatusClick(orderItem, item) {
      console.log(orderItem, item);
      let time = new Date().getTime();
      if (time - this.time < 2000) {
        return;
      }
      this.time = time;

      // 已完结订单生成案列
      if (orderItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE04") {
        const res = await this.case_edit_detail({
          proId: orderItem.id
        });
        if (res.code === 200) {
          if (res.data.times !== 0) {
            if (Object.keys(res.data).length > 0) {
              this.ruoterJump({
                name: "caseDetailsPreview",
                params: {
                  caseNo: res.data.caseNo,
                  title: res.data.caseName,
                  from: this.$route.name
                }
              });
              return;
            }
          }
          this.$confirm("已生成默认案例，前往查看或修改", "提示", {
            confirmButtonText: "编辑",
            cancelButtonText: "我知道了"
          })
            .then(() => {
              if (Object.keys(res.data).length > 0) {
                this.ruoterJump({
                  name: "caseGenerate",
                  params: {
                    caseNo: res.data.caseNo,
                    title: res.data.caseName,
                    from: this.$route.name
                  }
                });
              }
            })
            .catch(error => {
              return;
            });
        }
      }
      // 办理中订单 退单和完结操作
      if (orderItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE01") {
        if (item.operationOrderStatus == "refuse_order") {
          // 退单
          this.$confirm(
            "该订单根据您的行为及数据进行匹配，建议不要轻易退单，退单将会影响您的接单排名分数哟~~",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(res => {
              this.showBackCodeDialog(orderItem);
            })
            .catch(errpr => {});
        } else if (item.operationOrderStatus == "case_order") {
          // 完结
          this.showAuditDialog(orderItem);
        } else {
          this.orderPauseView = true;
        }
      }
      // 退单撤销事件
      if (orderItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE02") {
        this.$confirm("确认要撤回退单？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(res => {
            this.undo(orderItem);
          })
          .catch(errpr => {
            return;
          });
      }
      // 结项撤销事件
      if (orderItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE03") {
        this.$confirm("确定撤销结项？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(res => {
            this.undo(orderItem);
          })
          .catch(errpr => {
            return;
          });
      }
      if (
        orderItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE19" ||
        orderItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE29"
      ) {
        if (item.operationOrderStatus == "refuse_order") {
          // 退单
          this.$confirm(
            "该订单根据您的行为及数据进行匹配，建议不要轻易退单，退单将会影响您的接单排名分数哟~~",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(res => {
              this.showBackCodeDialog(orderItem);
            })
            .catch(errpr => {});
        } else if (item.operationOrderStatus == "pause_order") {
          this.orderPauseView = true;
        } else {
          // 完结
          this.showAuditDialog(orderItem);
        }
      }
      // 暂停订单
      if (orderItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE28") {
        this.orderPauseView = true;
      }
      // 恢复订单
      if (orderItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE26") {
        this.$confirm("确认恢复订单", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.zygs_handingOrder_recoveryStopOrder({
              id: this.transactionItem.id
            })
              .then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: "提示",
                    message: res.message,
                    type: "success",
                    customClass: "dgg-tip-msg"
                  });
                  this.toTranstionDetail(this.transactionItem.id);
                } else {
                  this.$notify({
                    title: "提示",
                    message: res.message,
                    type: "error",
                    customClass: "dgg-tip-msg"
                  });
                }
              })
              .catch(error => {});
          })
          .catch(error => {
            return;
          });
      }
      //暂停待审核恢复订单
      if (orderItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE27") {
        this.$confirm("确认撤回订单", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.undo(orderItem);
          })
          .catch(error => {
            return;
          });
      }
    },
    //设置开启任务时间
    setPlanBeginTime(beginTime) {
      return {
        disabledDate(time) {
          let _now = Date.now();
          return time.getTime() < _now - 86400000;
        }
      };
    },
    //关闭订单暂停弹窗
    orderPauseCloseModal() {
      this.orderPauseView = false;
      this.$refs.orderPauseForm.resetFields();
    },
    //确定订单暂停弹窗
    orderPauseSubmitModal() {
      this.$refs.orderPauseForm.validate(valid => {
        if (valid) {
          //验证通过执行方法
          this.zygs_handingOrder_applyStop({
            id: this.transactionItem.id,
            planBeginTime: this.taskPauseData.planBeginTime,
            reason: this.taskPauseData.reason
          })
            .then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: "提示",
                  message: res.message,
                  type: "success",
                  customClass: "dgg-tip-msg"
                });
                this.orderPauseView = false;
                this.toTranstionDetail(this.transactionItem.id);
              } else {
                this.$notify({
                  message: res.message,
                  type: "error",
                  customClass: "dgg-tip-msg"
                });
              }
            })
            .catch(error => {});
        } else {
          //验证未通过执行发放
        }
      });
    },
    // 结单
    async auditOrder() {
      if (this.caseAuditForm.code.length === 0) {
        Notification.error("请选择结项原因");

        return;
      }
      if (this.caseAuditForm.remark.trim().length === 0) {
        Notification.error("请填写结项备注");
        // this.$message.error("请填写结项备注");
        return;
      }
      if (this.DetailDocumentfileLists.length === 0) {
        Notification.error("请上传结项附件");
        return;
      }
      const res = await this.apply_case_audit({
        id: this.caseAuditRow.id,
        retreatOrEndType: this.caseAuditForm.code,
        remark: this.caseAuditForm.remark
      });
      if (res.code === 200) {
        this.$message.success("操作成功");
        this.searchClick();
        this.caseAuditForm.code = "";
        this.caseAuditForm.remark = "";
        this.deleteFile = false;
        this.caseAuditDialog = false;
        // 刷新订单
        this.toTranstionDetail(this.transactionItem.id);
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    // 退单
    async backOrder() {
      if (this.backCodeForm.code.length === 0) {
        Notification.error("请选择退单原因");
        // this.$message.error("请选择退单原因");
        return;
      }
      if (this.backCodeForm.remark.trim().length === 0) {
        Notification.error("请填写退单备注");
        return;
      }
      if (this.DetailDocumentfileLists.length === 0) {
        Notification.error("请上传退单附件");
        return;
      }
      const res = await this.apply_back_order_audit({
        id: this.backOrderRow.id,
        retreatOrEndType: this.backCodeForm.code,
        remark: this.backCodeForm.remark
      });
      if (res.code === 200) {
        this.$message.success("操作成功");
        this.searchClick();
        this.backCodeForm.code = "";
        this.backCodeForm.remark = "";
        this.deleteFile = false;
        this.backCodeDialog = false;
        this.$notify({
          title: "提示",
          message: "操作成功",
          type: "success",
          customClass: "dgg-tip-msg"
        });
        // 刷新订单
        this.toTranstionDetail(this.transactionItem.id);
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    async showAuditDialog(params) {
      this.rules.remark = [
        { required: true, message: "请填写结项备注", trigger: "blur" }
      ];
      this.fileType = "audit";
      this.searchFile();
      const res = await this.refuse_code_tree_book_list({
        code: "QDS_ZYGSSC_ENDTYPE",
        type: 1,
        level: 1
      });
      if (res.code === 200) {
        this.caseAuditOption = res.data;
        this.caseAuditDialog = true;
        this.caseAuditRow = params;
      }
    },
    async showBackCodeDialog(params) {
      this.rules.remark = [
        { required: true, message: "请填写退单备注", trigger: "blur" }
      ];
      this.fileType = "back";
      const res = await this.refuse_code_tree_book_list({
        code: "QDS_ZYGSSC_CHARGEBACKTYPE",
        type: 1,
        level: 1
      });
      if (res.code === 200) {
        this.backCodeOption = res.data;
        this.searchFile();
      }
      this.backCodeDialog = true;
      this.backOrderRow = params;
    },
    // 撤回
    async undo(row) {
      if (
        row.scAttrStatus &&
        row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE2"
      ) {
        const res = await this.undo_back_order_audit({ id: row.id });
        if (res.code === 200) {
          this.$notify({
            title: "提示",
            message: `已撤销退单，前往办理中订单查看`,
            type: "success",
            customClass: "dgg-tip-msg"
          });
          // 刷新订单
          this.toTranstionDetail(this.transactionItem.id);

          this.searchClick();
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      } else {
        const res = await this.undo_case_audit({ id: row.id });
        if (res.code === 200) {
          if (row.orderStatus == "QDS_SC_ORDER_STATUS_CODE27") {
            this.$notify({
              title: "提示",
              message: `已撤销订单，前往办理中订单查看`,
              type: "success",
              customClass: "dgg-tip-msg"
            });
          } else {
            this.$notify({
              title: "提示",
              message: `已撤销结项，前往办理中订单查看`,
              type: "success",
              customClass: "dgg-tip-msg"
            });
          }

          // 刷新订单
          this.toTranstionDetail(this.transactionItem.id);
          this.searchClick();
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      }
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
    // 查看文档
    viewDocument(item, type) {
      // 图片预览
      if (this.imageTypes.includes(type)) {
        this.imageUrl = "";
        this.imageView = true;
        this.imageUrl = item.filepath;
        this.showImgList = [this.imageUrl];
        this.$forceUpdate();
        this.$refs.imageViewRef.clickHandler();
      } else {
        // 其他文件查看
        const fileName = encodeURI(encodeURI(item.filename));
        window.open(item.filepath + "?title=" + fileName);
      }
    },
    // 获取文件类型
    getDocumentType(item) {
      const type =
        item.filename &&
        item.filename.substr(item.filename.lastIndexOf(".") + 1);
      return type;
    },
    async searchFile(type) {
      await this.$nextTick();
      // 请求附件列表
      const id =
        this.uploadparams.fileId +
        (this.fileType === "back" ? "_REFUND_APPLY" : "_CASE_AUDIT_APPLY");
      const res = await this.search_files({ fileId: id });
      if (type === "back") {
        // 退单附件列表
        if (res.code === 200 && res.data.length > 0) {
          this.DetailDocumentfileLists = res.data;
        } else {
          this.DetailDocumentfileLists = [];
        }
      } else {
        // 结项附件列表
        if (res.code === 200 && res.data.length > 0) {
          this.DetailDocumentfileLists = res.data;
        } else {
          this.DetailDocumentfileLists = [];
        }
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
    // 删除文档
    deleteFiles(item) {
      if (Array.isArray(item) && item.length > 0 && this.deleteFile) {
        item.forEach(it => {
          this.delete_files({
            fileId: it.fileid,
            fileName: it.filename,
            form: 1
          }).then(res => {});
        });
      }
      this.deleteFile = true;
    },
    invalidDocument(item) {
      this.$confirm("确认要删除该文件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete_files({
            fileId: item.fileid,
            fileName: item.filename,
            form: 1
          }).then(res => {
            if (res.code === 200) {
              this.$notify({
                title: "提示",
                message: "操作成功",
                type: "success",
                customClass: "dgg-tip-msg"
              });
              this.searchFile();
            }
          });
        })
        .catch(() => {
          //
        });
    },
    // 刷新订单数据
    toTranstionDetail(orderid) {
      if (orderid) {
        this.get_production_order_details_data({
          id: orderid
        }).then(res => {
          if (res.code == 200) {
            this.$nextTick(() => {
              this.setTransactionItem(res.data);
              this.transactionItem = res.data;
              console.log(
                JSON.parse(JSON.stringify(this.transactionItem)),
                "asdfsadf"
              );
            });
          }
        });
      }
    },
    searchClick() {
      this.paramsData = {
        customerOrScOrderNoOrContractNo: this.searchData
      };
    },
    fileLoadError() {
      this.fileLoading = false;
    },
    async docModalAffirm() {
      this.fileLoading = true;
      await this.$refs["uploadDoc"].$refs["upload-inner"].manualUpload(() => {
        this.docModal = false;
        this.fileLoading = false;
        this.searchFile();
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件
.order-status-btn-icon {
  /* position: absolute;
  width: 90px;
  position: absolute;
  bottom: 140px;
  right: -90px; */
  position: fixed;
  width: 90px;
  bottom: calc(50% - 14px);
  right: calc(50% - 45px);
  transform: translate(635px, 50%);
  & > li {
    height: 88px;
    overflow: hidden;
    cursor: pointer;
    font-size: 0;
  }
}
.imageViewRef {
  z-index: 2100;
  width: 0;
  height: 0;
}

// 弹窗文件
/deep/ .el-form {
  .el-form-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    /*text-align: center;*/
    padding-left: 45px;
    .el-form-item__label {
      float: none;
      line-height: 30px;
      vertical-align: top;
    }
    .el-form-item__content {
      float: none;
      display: inline-block;
    }
    &.return-order-type {
      /deep/.el-select {
        width: 175px;
      }
    }
    .el-textarea {
      width: 175px;
    }
  }
}
.back-memo {
  /deep/ .el-textarea .el-input__count {
    line-height: 1;
  }
}
.file-name {
  display: inline-block;
  max-width: 190px;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.4;
  vertical-align: middle;
}
.file-handel {
  color: var(--main-primary-color);
  cursor: pointer;
}
//附件显示
.show-detail-filesList {
  padding-left: 60px;
  padding-right: 30px;
  ul {
    width: 100%;
    li {
      overflow: hidden;
      line-height: 26px !important;
      box-sizing: border-box;
      margin-bottom: 14px;

      .icon-name {
        display: flex;
        align-items: center;
        /deep/.dgg-icon {
          vertical-align: middle;
        }
        p {
          margin-left: 14px;
          .dgg-text-ellip;
          max-width: 180px;
        }
      }
      display: flex;
      align-items: center;
      justify-content: space-between;
      /deep/.dgg-button-group {
        align-items: center;
        flex-wrap: nowrap;
        justify-content: flex-end;
        flex: 1;
        overflow: hidden;
        text-align: right;
        display: none;
        /deep/.dgg-button {
          line-height: 26px;
          padding: 0 12px;
          border: 0;
          border-radius: 4px;
          margin-left: 4px;
          &:hover {
            background-color: #e7f7f7;
          }
        }
      }

      &:hover {
        .icon-name {
          .dgg-icon {
            color: #10bbb8;
          }
          p {
            color: #10bbb8;
          }
        }
        /deep/.dgg-button-group {
          display: flex;
        }
      }
    }
  }
}

//图片预览
/deep/ .el-image {
  &.fileimg {
    z-index: 5000;
    .el-image-viewer__wrapper {
      z-index: 6000;
      .el-image-viewer__close {
        background-color: #fff;
        z-index: 7000;
      }
    }
  }
}

//任务暂停
.query-template-modal {
  .el-dialog__header {
    overflow: hidden;
    border-bottom: 1px solid #e3e4e6;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-dialog__headerbtn {
    display: none;
  }
  &.task-pause-model {
    .el-form {
      .el-form-item {
        padding-left: 0;
        &.current-task-name {
          .el-form-item__content {
            max-width: 300px;
            > span {
              max-width: 100%;
              display: inline-block;
              .dgg-text-ellip;
              vertical-align: top;
            }
          }
        }
        &.plan-begin-picker-time {
          .el-form-item__content {
            max-width: 300px;
          }
        }
        .el-textarea {
          width: 300px;
        }
        .el-form-item__label {
          margin-right: 20px;
        }
      }
    }
    .el-dialog__body {
      min-height: 220px;
      > div {
        min-height: 220px !important;
      }
    }
  }
  .el-dialog__body {
    padding: 22px 20px !important;
    border-bottom: 1px solid #e3e4e6;
    min-height: 360px;
    > div {
      position: relative;
      min-height: 360px !important;
      .query-search-input {
        width: 270px;
        position: absolute;
        top: -68px;
        right: 0;
        > .el-input__inner {
          background-color: #f0f2f5;
        }
      }
    }
    .taskBitMap {
      min-height: 360px;
      p {
        margin-top: 20px;
      }
    }
  }
  .el-dialog__footer {
    height: 70px;
    display: flex;
    align-items: center;
    padding: 0;
    justify-content: flex-end;
    padding-right: 20px;
  }
  .templateLists {
    display: flex;
    flex-wrap: wrap;

    li {
      width: 278px;
      height: 100px;
      margin-right: 22px;
      margin-bottom: 22px;
      border-radius: 4px;
      border: 1px solid #e3e4e6;
      padding: 14px;
      cursor: pointer;
      &:nth-child(3n) {
        margin-right: 0;
      }
      &.active-this-template {
        border-color: #10bbb8;
        .dgg-icon {
          color: #10bbb8;
        }
      }
      > h6 {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        height: 20px;
        overflow: hidden;
        font-weight: 500;
        color: #19233c;
        .dgg-text-ellip;
        span {
          flex: 1;
        }
        .dgg-icon {
          flex-shrink: 0;
          color: #e3e4e6;
        }
      }
      > p {
        height: 18px;
        font-size: 12px;
        color: #9398a1;
        line-height: 18px;
        .dgg-text-ellip;
        span {
          color: #19233c;
        }
      }
    }
  }
}
</style>
