<template>
  <div class="transaction transaction-order">
    <!-- 头部 -->
    <div
      v-if="
        [
          'processPlan',
          'transactionTask',
          'transactionDocument',
          'transactionBill',
          'transactionDynamic'
        ].includes($route.name)
      "
      class="dgg-order-nav"
    >
      <span class="dgg-order-state">{{ transactionItem.orderStatusName }}</span>
      <el-menu :default-active="defaultActive" class="dgg-submenu-nav" mode="horizontal">
        <el-menu-item key="1" index="1" @click="menuJump('transactionTask')">任务</el-menu-item>
        <el-menu-item key="2" index="2" @click="menuJump('transactionDocument')">文档</el-menu-item>
        <!--  <el-menu-item key="3" index="3" @click="menuJump('transactionBill')"
          >底单</el-menu-item
        >-->
        <el-menu-item key="4" index="4" @click="menuJump('transactionDynamic')">动态</el-menu-item>
      </el-menu>
      <div class="dgg-details-member">
        <div class="memberImgLists">
          <el-image
            v-for="(member, memberIndex) in memberImgLists"
            :key="memberIndex"
            :src="member"
            style="width: 27px; height: 27px"
            fit="cover"
          />
        </div>
        <dgg-icon
          class="more-member"
          icon-class="icon_more"
          svg-width="26px"
          svg-height="26px"
          @click="openMemberSet"
        />
      </div>
    </div>
    <!-- 列表 -->
    <div v-show="$route.name === 'transaction'" class="tabs-item-head">
      <div>
        <dgg-icon
          :icon-class="searchState ? 'icon_screen_selected' : 'icon_screen'"
          class="dgg-search"
          svg-width="15px"
          svg-height="15px"
          @click="searchState = !searchState"
        />
        <dgg-input
          v-model="searchData"
          :maxlength="30"
          oninput="this.value=this.value.replace(/\s/g,'')"
          class="search"
          style="width:270px;"
          placeholder="客户名称/生产单编号"
        >
          <dgg-icon slot="prefix" icon-class="dgg-search" svg-width="15px" svg-height="15px" />
        </dgg-input>
        <dgg-button
          v-if="!searchState"
          plain
          class="receive-button default-btn-with"
          @click="searchClick"
        >搜 索</dgg-button>
        <dgg-button
          v-if="!searchState"
          plain
          class="dgg-button-nocolor default-btn-with"
          @click="resetClick"
        >重 置</dgg-button>
        <div class="fr transaction-radio">
          <dgg-radio-group
            :active-data="activeData"
            :is-button="true"
            :radio-array="radioArray"
            :space="0"
            @change="change"
          />
        </div>
      </div>

      <div v-if="searchState" class="tabs-item-query">
        <dgg-query
          ref="query"
          :query-list="queryList"
          :can-export="false"
          clear-value
          @resetEvent="resetQuery"
          @search="search"
          @changeEvent="queryEmit"
        />
      </div>
    </div>
    <!-- 订单模式列表  -->
    <div v-show="$route.name === 'transaction'" v-if="activeData === '1'" class="transaction-body">
      <dgg-edit-table
        :data="dataList.records"
        :columns="columns"
        :request-data-api="get_order_model_by_status"
        :params="params"
        :page-info="dataList.total"
      />
    </div>
    <!-- 产品模式列表 -->
    <div v-show="$route.name === 'transaction'" v-if="activeData === '2'" class="transaction-body">
      <dgg-edit-table
        :data="productList.records"
        :columns="productColumns"
        :request-data-api="get_product_model_by_status"
        :params="productParams"
        :page-info="productList.total"
        @row-click="rowClick"
      />
    </div>
    <router-view />
    <el-drawer
      v-if="memberSet"
      :visible.sync="memberSetDrawer"
      :modal-append-to-body="false"
      :before-close="memberSetClose"
      :append-to-body="false"
      :modal="false"
      title="成员设置"
      direction="rtl"
      custom-class="order-member-set"
      style="position: absolute;"
      size="300px"
    >
      <div class="dgg-member-info">
        <div class="person-charge">
          <p class="top">
            <span>项目负责人</span>
            <dgg-button
              dgg-icon="icon_change"
              class="brabBill-button"
              @click="changeProjectMember($event, 'manager')"
            >更换</dgg-button>
            <transactorProp
              :up-all-pop="toTransactor_1"
              :top="teamMemberTop"
              :left="'50%'"
              :tab-names="tabNames"
              :count="transactorData"
              :currentTab="storeFlagUser"
              :chooseStoreId="thisCheckedStoreId"
              :thisStoreRealName="thisStoreRealName"
              :thisStorePhone="thisStorePhone"
              @Clickoutside="closeStoreProp"
              @changeStoreFlagUser="changeStoreFlagUser"
              @storeKeyWordsFn="storeKeyWordsFn"
              @clearNamePhone="clearNamePhone"
              @chooseStoreDataFn="chooseStoreDataFn"
              @load="load"
            />
          </p>
          <p class="bottom" v-if="Object.keys(this.projectManager).length > 0">
            <img
              :src="
                projectManager.addressHandlerPicture
                  ? projectManager.addressHandlerPicture
                  : taskTransactorImg
              "
              class="headImg"
              alt
            />
            <span>{{ projectManager.memberName }}</span>
          </p>
        </div>

        <div class="project-members">
          <p class="top">
            <span>项目成员</span>
            <dgg-button
              dgg-icon="dgg-plus"
              class="brabBill-button"
              @click="changeProjectMember($event, 'member')"
            >添加</dgg-button>
          </p>
        </div>

        <ul class="members-list">
          <li v-for="(item, index) in assistHandle" :key="index" class="current-list">
            <div class="left">
              <img
                :src="item.addressHandlerPicture"
                alt
                class="headImg"
                :onerror="errorTaskTransactorImg"
              />
              <span>{{ item.memberName }}</span>
              <dgg-icon
                icon-class="cancel_distribution"
                svg-width="16px"
                svg-height="16px"
                class="cancel-merber-icon"
                @click="deleteUser(item)"
              />
            </div>
            <span>{{ item.phoneNumber }}</span>
          </li>
        </ul>
      </div>
    </el-drawer>
    <!-- 退单 -- 弹窗 -->
    <el-dialog
      :visible.sync="backCodeDialog"
      @close="
        backCodeForm.code = '';
        backCodeForm.remark = '';
        deleteFiles(DetailDocumentfileLists);
      "
      title="退单"
      width="400px"
    >
      <el-form ref="form" :model="backCodeForm" :rules="rules">
        <el-form-item label="退单类型：" prop="code">
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
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            show-word-limit
            maxlength="500"
          />
        </el-form-item>
        <el-form-item label="退单附件：" prop="file">
          <el-input v-model="backCodeForm.file" v-if="false" />
          <span
            class="file-add"
            @click="
              fileType = 'back';
              docModal = true;
            "
          >+添加</span>
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
                  class="file-name"
                  :title="fileListItem.filename ? fileListItem.filename : '--'"
                >
                  {{
                  fileListItem.filename ? fileListItem.filename : "--"
                  }}
                </span>
              </span>
              <span class="dgg-button-group file-handel">
                <span
                  @click="
                    viewDocument(fileListItem, getDocumentType(fileListItem))
                  "
                  v-if="
                    getDocumentType(fileListItem) == 'pdf' ||
                      imageTypes.includes(getDocumentType(fileListItem))
                  "
                >查看</span>
                <span @click="downloadDocument(fileListItem)">下载</span>
                <span @click="invalidDocument(fileListItem)">删除</span>
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
        >取 消</el-button>
        <el-button type="primary" @click="backOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 结项弹窗 -->
    <el-dialog
      :visible.sync="caseAuditDialog"
      @close="
        caseAuditForm.code = '';
        caseAuditForm.remark = '';
        deleteFiles(DetailDocumentfileLists);
      "
      title="结项申请"
      width="400px"
    >
      <el-form ref="form" :model="caseAuditForm" :rules="rules">
        <el-form-item label="结项类型：" prop="code">
          <el-select v-model="caseAuditForm.code" placeholder="请选择结项类型">
            <el-option
              v-for="item in caseAuditOption"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="结项说明：" class="back-memo" prop="remark">
          <el-input
            v-model="caseAuditForm.remark"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            show-word-limit
            maxlength="500"
          />
        </el-form-item>
        <el-form-item label="结项附件：" prop="file">
          <el-input v-model="caseAuditForm.file" v-if="false" />
          <span
            class="file-add"
            @click="
              fileType = 'audit';
              docModal = true;
            "
          >+添加</span>
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
                  class="file-name"
                  :title="fileListItem.filename ? fileListItem.filename : '--'"
                >
                  {{
                  fileListItem.filename ? fileListItem.filename : "--"
                  }}
                </span>
              </span>
              <span class="dgg-button-group file-handel">
                <span
                  @click="
                    viewDocument(fileListItem, getDocumentType(fileListItem))
                  "
                  v-if="
                    getDocumentType(fileListItem) == 'pdf' ||
                      imageTypes.includes(getDocumentType(fileListItem))
                  "
                >查看</span>
                <span @click="downloadDocument(fileListItem)">下载</span>
                <span @click="invalidDocument(fileListItem)">删除</span>
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
        >取 消</el-button>
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
      @modalAffirm="submitModal"
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
        :onError="fileLoadError"
        class="document-upload-demo"
        multiple
      >
        <dgg-button type="primary" style="width:100px" class="receive-button">上传文件</dgg-button>
      </dgg-upload-doc>
    </dgg-modal>
    <div v-show="imageView" class="img-handle-item">
      <el-image
        class="imageViewRef"
        ref="imageViewRef"
        :src="imageUrl"
        style="width: 0; height: 0;"
        :preview-src-list="showImgList"
      />
    </div>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
import config from "@/service/config";
import Notification from "@/componentsEl/notification/index.js";
import taskTransactorImg from "@/assets/images/image_portrait_fault.png";
import transactorProp from "@/views/main/page/components/transactorProp.vue";
import moment from "moment";

export default {
  name: "Transaction",
  components: {
    transactorProp //添加办理人弹窗
  },
  data() {
    return {
      fileLoading: false,
      taskTransactorImg: taskTransactorImg, //办理人默认头像

      errorTaskTransactorImg: 'this.src="' + taskTransactorImg + '"', //默认图地址
      chooseStoreId: "",
      receiveOption: [],
      searchStorePhone: "",
      choosePeopleData: {}, //选定人的信息
      showChoosePeopleDialog: false,
      deleteFile: true,
      productListRecords: true,
      docModal: false,
      imageView: false,
      imageUrl: "",
      fileList: [],
      showImgList: [],
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
      rules: {
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
        code: [{ required: true, message: "", trigger: "blur" }],
        file: [{ required: true, message: "请上传附件", trigger: "blur" }]
      },
      backCodeForm: {
        code: "",
        remark: ""
      },
      caseAuditForm: {
        code: "",
        remark: ""
      },
      popperOptions: {
        boundariesElement: "body"
      },
      memberSetDrawer: false, // 打开成员设置
      searchKey: "", // 搜索关键字
      orderStateVal: "", // 左侧订单状态值
      activeData: "1",
      showTips: false,
      isMainHandleOption: [
        {
          label: "项目主办",
          value: 1
        },
        {
          label: "项目协办",
          value: 2
        }
      ],
      radioArray: [
        {
          label: "订 单",
          value: "1"
        },
        {
          label: "产 品",
          value: "2"
        }
      ],
      activeName: "first",
      search1: "",
      searchState: false,
      columns: [
        {
          prop: "productName",
          width: "175",
          label: "业务产品",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="padding-bottom:5px;">
                <span style="border-bottom: 1px solid #10bbb8 !important;padding-bottom:3px;padding-right:3px;vertical-align: top;">
                  {params.row.businessProductName}
                </span>
                <span
                  class="dgg-text-ellip"
                  style="display:inline-block; width:90px;vertical-align: top;"
                >
                  {params.row.productName}
                </span>
              </div>
            );
          }
        },
        {
          prop: "scOrderNo",
          label: "生产单编号",
          width: "160",
          type: "isrender",
          render: (h, params) => {
            return (
              <div
                style="color:#10BBB8;cursor: pointer;"
                class="dgg-text-ellip"
                onClick={e => {
                  this.rowClick(params.row);
                }}
              >
                {params.row.scOrderNo}
              </div>
            );
          }
        },
        {
          prop: "customerName",
          width: "160",
          label: "客户名称",
          type: "isrender",
          render: (h, params) => {
            return <div class="dgg-text-ellip">{params.row.customerName}</div>;
          }
        },
        { prop: "region", width: "100", label: "办理地区" },
        { prop: "proScAttrName", label: "产品属性" },
        { prop: "contractNo", label: "合同编号" },
        { prop: "orderStatusName", label: "订单状态" },
        { prop: "scAttrStatusName", label: "属性状态" },
        {
          label: "操作",
          width: "170",
          type: "isrender",
          render: (h, params) => {
            // 先判断产品属性： 标件: 直接判断订单状态；非标件：先判断属性状态， 再判断订单状态：
            // 标件 -- 判断订单状态（显示不同的按钮
            if (
              params.row.orderStatus == "QDS_SC_ORDER_STATUS_CODE01" || // 办理中
              params.row.orderStatus == "QDS_SC_ORDER_STATUS_CODE19" || // 退单驳回
              params.row.orderStatus == "QDS_SC_ORDER_STATUS_CODE29" // 结项驳回
            ) {
              if (
                params.row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE1" || // 方案待提交
                params.row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE4" // 方案审核驳回
              ) {
                return (
                  <div>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.Submission(params.row);
                      }}
                    >
                      提 交
                    </dgg-button>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.backConfirm(params.row);
                      }}
                    >
                      退 单
                    </dgg-button>
                    <dgg-button
                      style="width:50px;margin-left:10px;"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.showAuditDialog(params.row);
                      }}
                    >
                      结 项
                    </dgg-button>
                  </div>
                );
              } else if (
                params.row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE2"
              ) {
                // 方案待审核
                return (
                  <div>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.withdraw(params.row);
                      }}
                    >
                      撤 回
                    </dgg-button>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.backConfirm(params.row);
                      }}
                    >
                      退 单
                    </dgg-button>
                    <dgg-button
                      style="width:50px;margin-left:10px;"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.showAuditDialog(params.row);
                      }}
                    >
                      结 项
                    </dgg-button>
                  </div>
                );
              } else {
                return (
                  <div>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.backConfirm(params.row);
                      }}
                    >
                      退 单
                    </dgg-button>
                    <dgg-button
                      style="width:50px;margin-left:10px;"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.showAuditDialog(params.row);
                      }}
                    >
                      结 项
                    </dgg-button>
                  </div>
                );
              }
            }
            if (
              params.row.orderStatus == "QDS_SC_ORDER_STATUS_CODE02" || //退单待审核
              params.row.orderStatus == "QDS_SC_ORDER_STATUS_CODE03" || // 完结(结项)待审核
              params.row.orderStatus == "QDS_SC_ORDER_STATUS_CODE27" // 暂停待审核
            ) {
              if (
                params.row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE1" || // 方案待提交
                params.row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE4" // 方案审核驳回
              ) {
                return (
                  <div>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.Submission(params.row);
                      }}
                    >
                      提 交
                    </dgg-button>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.withdraw(params.row);
                      }}
                    >
                      撤 回
                    </dgg-button>
                  </div>
                );
              } else if (
                params.row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE2"
              ) {
                // 方案待审核
                return (
                  <div>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.withdraw(params.row);
                      }}
                    >
                      撤 回
                    </dgg-button>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.withdraw(params.row);
                      }}
                    >
                      撤 回
                    </dgg-button>
                  </div>
                );
              } else {
                return (
                  <div>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.withdraw(params.row);
                      }}
                    >
                      撤 回
                    </dgg-button>
                  </div>
                );
              }
            }
            if (params.row.orderStatus == "QDS_SC_ORDER_STATUS_CODE26") {
              // 暂停
              if (
                params.row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE1" || // 方案待提交
                params.row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE4" // 方案审核驳回
              ) {
                return (
                  <div>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.Submission(params.row);
                      }}
                    >
                      提 交
                    </dgg-button>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.recovery(params.row);
                      }}
                    >
                      恢 复
                    </dgg-button>
                  </div>
                );
              } else if (
                params.row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE2"
              ) {
                // 方案待审核
                return (
                  <div>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.withdraw(params.row);
                      }}
                    >
                      撤 回
                    </dgg-button>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.recovery(params.row);
                      }}
                    >
                      恢 复
                    </dgg-button>
                  </div>
                );
              } else {
                return (
                  <div>
                    <dgg-button
                      style="width:50px"
                      class="dgg-button-nocolor"
                      onClick={e => {
                        this.recovery(params.row);
                      }}
                    >
                      恢 复
                    </dgg-button>
                  </div>
                );
              }
            }
          }
        }
      ],
      // 产品模式 表头
      productColumns: [
        {
          prop: "productName",
          width: "380",
          label: "业务产品",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="height:90px;padding:20px 0;">
                <div style="line-height:20px;height:20px">
                  <span class="transaction-name-lable">
                    <span
                      class={
                        parseInt(params.row.overdueStatus) === 1
                          ? "transaction-name-sate"
                          : parseInt(params.row.overdueStatus) === 2
                          ? "transaction-name-yewllo"
                          : ""
                      }
                    >
                      {parseInt(params.row.overdueStatus) === 1
                        ? "已超期"
                        : parseInt(params.row.overdueStatus) === 2
                        ? "即将到期"
                        : ""}
                    </span>
                    {params.row.productName}
                  </span>
                </div>
                <div
                  class="transaction-name-cumtorName dgg-text-ellip"
                  style="display:inline-block; width:300px;vertical-align: top;"
                >
                  客户：{params.row.customerName}
                </div>
              </div>
            );
          }
        },
        {
          prop: "latestProgressNum",
          width: "370",
          label: "最新任务/进度",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="height:90px;padding:20px 0;">
                <div style="line-height:20px;height:20px">
                  <el-progress
                    percentage={new Number(
                      this.decimal(
                        isNaN(
                          parseInt(params.row.completeTaskNum) /
                            parseInt(params.row.taskTotal)
                        )
                          ? 0
                          : parseInt(params.row.completeTaskNum) /
                              parseInt(params.row.taskTotal)
                      ) * 100
                    ).toFixed()}
                    stroke-width={4}
                    style="width:220px"
                  ></el-progress>
                </div>
                <div class="transaction-name-cumtorName">
                  最新阶段：{params.row.latestCasePhaseName}
                </div>
              </div>
            );
          }
        },
        {
          prop: "projectMembers",
          width: "200",
          label: "负责人/办理人",
          type: "isrender",
          render: (h, params) => {
            const _arary = params.row.projectMembers;
            return (
              <div style="padding:20px 0;height:90px;">
                <div>
                  <el-tooltip class="msg-dot" effect="dark" placement="top">
                    <div slot="content">{params.row.projectManagerName}</div>
                    <el-image
                      style="width: 27px; height: 27px; border-radius: 27px;margin-right:5px"
                      src={
                        params.row.headPortrait
                          ? params.row.headPortrait
                          : taskTransactorImg
                      }
                    ></el-image>
                  </el-tooltip>
                </div>
                <div>
                  {_arary &&
                    _arary.length &&
                    _arary.map(item => {
                      return (
                        <el-tooltip
                          class="msg-dot"
                          effect="dark"
                          placement="top"
                        >
                          <div slot="content">{item.projectMembersName}</div>
                          <el-image
                            src={
                              item.headPortrait
                                ? item.headPortrait
                                : taskTransactorImg
                            }
                            style="width: 27px; height: 27px; border-radius: 27px;margin-right:5px"
                            fit="cover"
                          />
                        </el-tooltip>
                      );
                    })}
                </div>
              </div>
            );
          }
        },
        {
          prop: "orderDeadlineTimeStamp",
          label: "到期时间",
          type: "isrender",
          render: (h, params) => {
            return (
              <div
                class={
                  parseInt(params.row.overTimeStatus) === 3
                    ? "deadline-red"
                    : parseInt(params.row.overTimeStatus) === 2
                    ? "deadline-yellow"
                    : "deadline-text"
                }
              >
                {params.row.orderDeadline}
              </div>
            );
          }
        }
      ],
      list1: [],
      searchData: "",
      paramsData: {},
      paramsSearchData: {},
      caseAuditDialog: false,
      caseAuditOption: [],
      caseAuditRow: "", // 完结订单
      backCodeDialog: false, // 拒接类型弹窗
      backCodeOption: [],
      backOrderRow: "", // 拒接订单
      assistHandle: [], // 项目成员
      projectManager: {}, // 项目管理员
      memberSettingDialog: false,
      memberSettingDialogTitle: "添加成员",
      memberSettingDialogLabel: "成员：",
      memberSettingDialogOption: [],
      memberSettingDialogValue: "",
      memberSettingDialogMultiple: false,
      fileType: "back",
      DetailDocumentfileLists: [],
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
      routeParam: {},
      toTransactor_1: false,
      tabNames: ["本店成员", "外部合作"], // 办理人切换标题
      transactorData: [], //选择店铺数据
      storeFlagUser: 0, //默认本店店铺
      thisCheckedStoreId: "", //选定的办理人id
      thisStoreRealName: "", //搜索办理人姓名关键字
      thisStorePhone: "", //搜索办理人手机号
      type: "",
      teamMemberTop: ""
    };
  },
  computed: {
    ...mapState([
      "userId",
      "transactionItem",
      "orderStatusName",
      "storeInfoData"
    ]),
    ...mapState("transactionModule", ["dataList", "productList"]),
    ...mapState("orderModule", [
      "productOptions", // 业务
      "productDataList", // 产品列表
      "orderStatusList" //订单状态数据
    ]),
    params() {
      return {
        ...this.paramsData,
        ...this.routeParam
      };
    },
    productParams() {
      return {
        ...this.paramsData,
        ...this.routeParam
      };
    },
    memberImgLists() {
      const imgArr = [];
      imgArr.push(this.projectManager.addressHandlerPicture);
      this.assistHandle.forEach((item, index) => {
        imgArr.push(item.addressHandlerPicture);
      });
      return imgArr;
    },
    // 查询头 --  更多搜索条件
    queryList() {
      return [
        {
          field: "businessProductCode",
          type: "select",
          label: "业务",
          width: "220px",
          value: "",
          options:
            [
              ...[{ label: "全部", value: "" }],
              ...this.productOptions.map(item => {
                return {
                  value: item.code,
                  label: item.name
                };
              })
            ] || []
        },
        {
          field: "productId",
          type: "select",
          label: "产品",
          value: "",
          width: "220px",
          options:
            [
              ...[{ label: "全部", value: "" }],
              ...this.productDataList.map(item => {
                return {
                  value: item.id,
                  label: item.name
                };
              })
            ] || []
        },
        {
          field: "orderStatus",
          type: "select",
          label: "状态",
          width: "220px",
          value: "",
          options:
            this.orderStatusList.map(item => {
              return {
                value: item.code,
                label: item.name
              };
            }) || []
        },
        {
          field: ["startTime", "endTime"],
          type: "daterange",
          label: "时间",
          width: "220px",
          value: ""
        },
        {
          label: "佣金",
          width: "220px",
          children: [
            {
              field: "miniCommission",
              type: "input",
              label: "test1",
              width: "97px",
              placeholder: "最低",
              value: ""
            },
            {
              field: "maxCommission",
              type: "input",
              label: "test1",
              width: "97px",
              placeholder: "最高",
              value: ""
            }
          ]
        },
        {
          field: "teamName",
          type: "input",
          label: "团队",
          width: "220px",
          placeholder: "请输入",
          value: ""
        }
      ];
    },
    memberSet() {
      return [
        "transactionTask",
        "transactionDocument",
        "transactionBill",
        "transactionDynamic"
      ].includes(this.$route.name);
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
        fileId:
          this.fileType === "back"
            ? `ZYGSSC_${this.backOrderRow.scOrderId}`
            : `ZYGSSC_${this.caseAuditRow.scOrderId}`,
        isDeleteOriginalFile: false,
        type: this.fileType === "back" ? "REFUND_APPLY" : "CASE_AUDIT_APPLY"
      };
    },
    defaultActive() {
      let _key = "1";
      if (this.$route.name === "transactionTask") {
        _key = "1";
      }
      if (this.$route.name === "transactionDocument") {
        _key = "2";
      }
      if (this.$route.name === "transactionBill") {
        _key = "3";
      }
      if (this.$route.name === "transactionDynamic") {
        _key = "4";
      }
      return _key;
    }
  },
  watch: {
    async memberSet(val) {
      if (val) {
        const res = await this.get_assist_handle({
          zygsscId: this.transactionItem.id,
          searchWord: ""
        });
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.assistHandle = res.data.filter((item, index, arr) => {
              return item.isManager == 0;
            });
            let formtatManagerData = res.data.filter((item, index, arr) => {
              return item.isManager == 1;
            });
            this.projectManager =
              formtatManagerData.length > 0 ? formtatManagerData[0] : {};
          } else {
            this.assistHandle = [];
            this.projectManager = {};
          }
        }
      }
    }
  },
  // 路由离开之前，记录跳转到哪个页面了
  beforeRouteLeave(to, from, next) {
    sessionStorage.processPlanRoute = from.fullPath;
    next();
  },
  async mounted() {
    // 判断是否是产品模式
    if (this.$route.params && this.$route.params.tabindex === "productMode") {
      this.activeData = "2";
    }
    if (
      [
        "transactionTask",
        "transactionDocument",
        "transactionBill",
        "transactionDynamic"
      ].includes(this.$route.name)
    ) {
      const res = await this.get_assist_handle({
        zygsscId: this.transactionItem.id
      });
      if (res.code === 200) {
        if (res.data && res.data.length > 0) {
          this.assistHandle = res.data.filter((item, index, arr) => {
            return item.isManager == 0;
          });
          let formtatManagerData = res.data.filter((item, index, arr) => {
            return item.isManager == 1;
          });
          this.projectManager =
            formtatManagerData.length > 0 ? formtatManagerData[0] : {};
        } else {
          this.assistHandle = [];
          this.projectManager = {};
        }
      }
    }
  },
  activated() {
    //
  },
  created() {
    //判断是否订单模式或者产品模式
    if (sessionStorage.getItem("transtionOrderModel")) {
      this.activeData = sessionStorage.getItem("transtionOrderModel");
    }
    this.routeParam = this.$route.params;
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions("orderModule", [
      "zysc_find_product" // 查询产品信息
    ]),
    ...mapActions(["ruoterJump"]),
    ...mapActions("transactionModule", [
      "get_order_model_by_status", // 订单列表
      "get_product_model_by_status", // 查询办理中 -- 产品列表
      "apply_back_order_audit", // 确定 退单
      "apply_case_audit", //确认结项
      "get_assist_handle",
      "delete_assist_handle", // 删除项目成员
      "update_project_manager", // 修改项目管理员
      "add_assist_handle" // 添加项目成员
    ]),
    ...mapActions("transactionModule", [
      "search_files",
      "update_files",
      "delete_files", // 删除文档
      "undo_case_audit", // 标件 -- 撤回订单
      "undo_back_order_audit", // 非标件 -- 撤回订单
      "undo_case_recovery", // 标件 -- 恢复订单
      "undo_case_submission" // 非标件 -- 方案审核驳回 --  提交
    ]),
    ...mapActions("workbenchTaskModule", ["get_store_user"]),
    ...mapMutations(["setTransactionItem", "setTranstionOrderModel"]),
    ...mapActions("receiveModule", ["refuse_code_tree_book_list"]),
    ...mapActions("transactionTaskModule", [
      "zygs_queryMemberNonMerchantVO" //专业公司查询成员列表数据
    ]),
    checkBtnJurisdiction(item) {
      if (this.storeInfoData.roles.indexOf("MERCHANT_STORE_OWNER") !== -1) {
        return true;
      }
      if (item.projectManagerId === this.userId) {
        return true;
      }
      let res = false;
      if (item.projectMemberJson) {
        JSON.parse(item.projectMemberJson).forEach(it => {
          it.userId === this.userId && (res = true);
        });
      }
      return res;
    },
    resetQuery() {
      this.searchData = "";
    },
    async receiveOrderDialogFn() {
      if (this.transactionItem.teamId) {
        const res = await this.get_store_user({
          userOrPhone: this.searchStorePhone, //用户名或手机号
          storeId: this.transactionItem.teamId,
          merCheck: 0,
          isCertification: 1,
          flag: 0,
          currentStatus: "EMPLOYEE_STATUS_1"
        });
        if (res.code === 200) {
          const list = [];
          res.data.forEach((item, inx) => {
            if (item.currentStatus === "EMPLOYEE_STATUS_1") {
              item.value = item.userId;
              item.label = item.realName;
              list.push(item);
            }
          });
          this.receiveOption = list;
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      }
    },
    //  撤回按钮点击
    async withdraw(row) {
      this.$confirm("确认要撤回退单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          if (
            row.scAttrStatus &&
            row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE2"
          ) {
            // 有属性状态且 属性状态为：方案待审核
            let res = await this.undo_back_order_audit({ id: row.id });
            if (res.code === 200) {
              this.$message.success("操作成功");
              this.searchClick();
            } else {
              this.$notify({
                message: res.message,
                type: "error",
                customClass: "dgg-tip-msg"
              });
            }
          } else {
            let res = await this.undo_case_audit({ id: row.id });
            if (res.code === 200) {
              this.$message.success("操作成功");
              this.searchClick();
            } else {
              this.$notify({
                message: res.message,
                type: "error",
                customClass: "dgg-tip-msg"
              });
            }
          }
        })
        .catch(() => {});
    },
    // 恢复按钮点击
    async recovery(row) {
      this.$confirm("确认要恢复订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.undo_case_recovery({ id: row.id });
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.searchClick();
          } else {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
        })
        .catch(() => {});
    },
    // 提交 按钮点击
    async Submission(row) {
      // , title: `${params.row.productName}-${params.row.scOrderNo}`
      sessionStorage.proccessPlanID = row.id; // 提交流程方案页面的ID
      this.ruoterJump({
        name: "processPlan",
        params: { id: row.id }
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
    //获取文件类型
    getDocumentType(item) {
      const type =
        item.filename &&
        item.filename.substr(item.filename.lastIndexOf(".") + 1);
      return type;
    },
    async searchFile(type) {
      await this.$nextTick();
      // 请求附件列表
      let id =
        this.uploadparams.fileId +
        (this.fileType === "back" ? "_REFUND_APPLY" : "_CASE_AUDIT_APPLY");
      let res = await this.search_files({ fileId: id });
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
    async changeProjectMember(event, type) {
      const evt = window.event || event;
      evt.preventDefault();
      evt.stopPropagation();
      this.requestStoreUser();
      this.toTransactor_1 = true;
      this.type = type;
      type === "member" && (this.teamMemberTop = "210px");
      type === "manager" && (this.teamMemberTop = "110px");
      return;
    },
    deleteUser(item) {
      console.log(JSON.parse(JSON.stringify(item)), "删除成员接口+++++++");
      this.$confirm("是否确定删除项目成员", "删除成员", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.delete_assist_handle({
            memberId: item.memberId,
            zygsscId: this.transactionItem.id
          });
          if (res.code !== 200) {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          } else {
            this.$notify({
              message: res.message,
              type: "success",
              customClass: "dgg-tip-msg"
            });
            const resp = await this.get_assist_handle({
              zygsscId: this.transactionItem.id
            });
            if (resp.code === 200) {
              if (resp.data.length > 0) {
                this.assistHandle = resp.data.filter((item, index, arr) => {
                  return item.isManager == 0;
                });
                let formtatManagerData = resp.data.filter(
                  (item, index, arr) => {
                    return item.isManager == 1;
                  }
                );
                this.projectManager =
                  formtatManagerData.length > 0 ? formtatManagerData[0] : {};
              } else {
                this.assistHandle = [];
                this.projectManager = {};
              }
            }
          }
        })
        .catch(async () => {
          //取消删除成员方法
          return;
        });
    },
    // -----------------------退单相关
    // 退单按钮点击
    backConfirm(row) {
      this.$confirm(
        "该订单根据您的行为及数据进行匹配，建议不要轻易退单，退单将会影响您的接单排名分数哟~~",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          this.showBackCodeDialog(row);
        })
        .catch(() => {});
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
    // 退单
    async backOrder() {
      if (this.backCodeForm.code.length === 0) {
        Notification.error("请选择退单原因");
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
        this.backCodeDialog = false;
        this.deleteFile = false;
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    //----------------------------退单相关结束
    async showAuditDialog(params) {
      if (params.orderDeadline && params.periodSuspension) {
        let orderDeadlineS = new Date(params.orderDeadline).getTime(),
          periodSuspensionS = new Date(params.periodSuspension).getTime(),
          dateS = new Date().getTime();
        this.rules.remark = [
          { required: true, message: "请填写结项备注", trigger: "blur" }
        ];
        this.fileType = "audit";
        this.searchFile();
        if (
          Number(orderDeadlineS) < Number(periodSuspensionS) ||
          Number(dateS) > Number(periodSuspensionS)
        ) {
          let csaeData = [];
          csaeData.push({ name: "延期结项", code: "QDS_ZYGSSC_ENDTYPE_CODE2" });
          this.caseAuditOption = csaeData;
          this.caseAuditDialog = true;
          this.caseAuditRow = params;
        } else {
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
        }
      } else {
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
      }
    },
    // -----------------------结项
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
        this.caseAuditDialog = false;
        this.deleteFile = false;
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    change(data) {
      if (this.searchState) {
        this.$refs.query.resetAll();
      }
      this.resetClick();
      this.activeData = data;
      //设置办理中订单记录订单模式和产品模式
      this.setTranstionOrderModel(data);
    },
    rowClick(row) {
      sessionStorage.proccessPlanID = row.id;
      this.setTransactionItem(row);
      // 非标件 -- 方案待提交，方案审核驳回
      if (
        row.proScAttr == "QDS_ZYGSSC_ATTR_CODE2" &&
        (row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE4" ||
          row.scAttrStatus == "QDS_ZYGSSC_ATTRSTATUS_CODE1")
      ) {
        this.ruoterJump({
          name: "processPlan",
          params: { id: row.id }
        });
        return;
      }
      // 行点击事件
      this.ruoterJump({
        name: "transactionTask",
        params: {
          title: `${this.transactionItem.productName}-${this.transactionItem.scOrderNo}`
        }
      });
    },
    getorderStatus(val) {
      switch (val) {
        case "QDS_SC_ORDER_STATUS_CODE01": // 办理中
          return "办理中";
        case "QDS_SC_ORDER_STATUS_CODE02": // 退单待审核
          return "退单待审核";
        case "QDS_SC_ORDER_STATUS_CODE03": // 完结待审核
          return "完结待审核";
        case "QDS_SC_ORDER_STATUS_CODE04": // 已完结
          return "已完结";
        case "QDS_SC_ORDER_STATUS_CODE05": // 已退单
          return "已退单";
        case "QDS_SC_ORDER_STATUS_CODE06": // 生产订单生成中
          return "生产订单生成中";
        case "QDS_SC_ORDER_STATUS_CODE07": // 待接收
          return "待接收";
        case "QDS_SC_ORDER_STATUS_CODE08": // 已退回
          return "已退回";
        case "QDS_SC_ORDER_STATUS_CODE09": // 待分配
          return "待分配";
      }
    },
    // 打开成员设置界面
    openMemberSet() {
      this.memberSetDrawer = true; // 打开成员设置
    },
    memberSetClose(done) {
      done();
      return false;
    },
    decimal(floatvar) {
      var fX = parseFloat(floatvar);
      if (isNaN(fX)) {
        return 0;
      }
      fX = Math.round(fX * 100) / 100;
      var sX = fX.toString();
      var posDecimal = sX.indexOf(".");
      if (posDecimal < 0) {
        posDecimal = sX.length;
        sX += ".";
      }
      while (sX.length <= posDecimal + 2) {
        sX += "0";
      }
      return Number(sX);
    },
    // 联动查询 产品 （ 选择 业务 -- 产品
    async queryEmit(val, field) {
      if (field === "businessProductCode") {
        await this.zysc_find_product({
          proType: val
        });
        this.$refs["query"].resetFieldValue("productId");
      }
    },
    search(val) {
      this.paramsSearchData = val;
      this.paramsData = this.paramsSearchData;
    },
    // 搜索点击
    searchClick() {
      this.paramsData = {
        keyWord: this.searchData
      };
    },
    resetClick() {
      this.searchData = "";
      this.paramsData = {};
    },
    menuJump(name) {
      console.log(
        JSON.parse(JSON.stringify(this.transactionItem)),
        "传递的订单的值"
      );
      // 顶部导航栏跳转
      this.ruoterJump({
        name: name,
        params: {
          title: `${this.transactionItem.productName}-${this.transactionItem.scOrderNo}`
        }
      });
    },
    fileLoadError() {
      this.fileLoading = false;
    },
    async submitModal() {
      this.fileLoading = true;
      await this.$refs["uploadDoc"].$refs["upload-inner"].manualUpload(() => {
        this.docModal = false;
        this.fileLoading = false;
        this.searchFile();
      });
    },

    //选择项目人
    chooseStoreData(item) {
      this.$nextTick(() => {
        this.memberSettingDialogValue = item.value;
        this.showChoosePeopleDialog = false;
        this.choosePeopleData = item;
      });
    },
    //删除选择的项目人
    deleteChoosePeople() {
      this.$nextTick(() => {
        this.choosePeopleData = "";
        this.memberSettingDialogValue = "";
      });
    },
    //关闭办理人店铺筛选
    closeStoreProp() {
      this.toTransactor_1 = false;
      this.storeFlagUser = 0; //改变为本店店铺
      this.thisCheckedStoreId = ""; //清空选定办理人id

      //清空办理人手机号和姓名
      this.clearNamePhone();
    },
    //清空办理人手机号和姓名
    clearNamePhone() {
      this.thisStoreRealName = "";
      this.thisStorePhone = "";
    },
    // 添加办理人选择框内tab切换
    changeStoreFlagUser(val) {
      this.storeFlagUser = val;
      //查询店铺信息
      this.requestStoreUser();
    },
    //查询店铺信息
    requestStoreUser() {
      if (this.transactionItem && this.transactionItem.teamId) {
        this.zygs_queryMemberNonMerchantVO({
          storeId: this.transactionItem.teamId, //店铺ID
          userName: this.thisStoreRealName, //用户姓名，只有flag为0时有效
          phoneNumber: this.thisStorePhone, //手机号
          isOutside: this.storeFlagUser, //0:获取本店铺的用户 1：获取店铺外的店铺
          zygsscId: this.transactionItem.id
        })
          .then(res => {
            if (res.code == 200) {
              this.transactorData = res.data;
            }
          })
          .catch(error => {});
      }
    },
    //获取关键字
    storeKeyWordsFn(state, val) {
      if (state == 0) {
        //0为本店铺
        this.thisStoreRealName = val;
      } else {
        //外部店铺
        this.thisStorePhone = val;
      }
      //查询店铺信息
      this.requestStoreUser();
    },
    //选定办理人Id
    async chooseStoreDataFn(item) {
      this.$nextTick(async () => {
        const params = {
          memberId: item.userId,
          memberName: item.realName,
          zygsscId: this.transactionItem.id,
          memberPhone: item.phone,
          isFeign: this.storeFlagUser //内部0 外部1
        };
        let res = "";
        if (this.type === "member") {
          // 添加成员
          res = await this.add_assist_handle(params);
        } else {
          params.storeId = this.transactionItem.teamId;
          res = await this.update_project_manager(params);
          // 修改管理
        }
        if (res.code === 200) {
          if (this.type === "member") {
            this.$notify({
              message: "添加成员成功",
              type: "success",
              customClass: "dgg-tip-msg"
            });
          } else {
            this.$notify({
              message: "项目负责人更换成功",
              type: "success",
              customClass: "dgg-tip-msg"
            });
          }

          // 修改管理/添加成员成功，刷新列表
          this.toTransactor_1 = false;
          const res = await this.get_assist_handle({
            zygsscId: this.transactionItem.id
          });
          if (res.code === 200) {
            if (res.data && res.data.length > 0) {
              this.assistHandle = res.data.filter((item, index, arr) => {
                return item.isManager == 0;
              });
              let formtatManagerData = res.data.filter((item, index, arr) => {
                return item.isManager == 1;
              });
              this.projectManager =
                formtatManagerData.length > 0 ? formtatManagerData[0] : {};
            } else {
              this.assistHandle = [];
              this.projectManager = {};
            }
          }
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      });
    },
    // 选择办理人弹框内的列表无限加载
    load() {
      return;
      this.count += 2;
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/main.less"; //引入全局less文件
// 上传附件
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

.transaction {
  border-radius: 6px;

  .imageViewRef {
    z-index: 2100;
    width: 0;
    height: 0;
  }

  /deep/ .el-image {
    /*z-index: 2100;*/
  }

  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 0 0 6px 6px;
  position: absolute;
  min-height: calc(100% - 36px);

  .file-add {
    color: var(--main-primary-color);
    cursor: pointer;
  }

  .search {
    width: 270px;
    height: 30px;
    margin-left: 20px;

    > input {
      background: rgba(240, 242, 245, 1);
      border: none;
    }
  }

  .member-setting-dialog {
    .el-dialog__body {
      text-align: center;
    }
  }

  .el-tabs__nav-scroll {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dgg-search {
    margin-left: 30px;
    cursor: pointer;
  }

  .icon_info {
    cursor: pointer;
    margin-right: 30px;
    line-height: 30px;
  }

  .tabs-item-head {
    min-height: 70px;
    padding: 20px 0px;
  }

  .transaction-body {
    padding: 0 10px;
  }

  .transaction-button {
    border-radius: 4px;
    border: 1px solid rgba(16, 187, 184, 1);
  }

  .transaction-radio {
    margin-right: 30px;
  }

  .transaction-name-sate {
    height: 18px;
    border-radius: 10px;
    border: 1px solid rgba(241, 9, 64, 1);
    color: #f10940;
    font-size: 12px;
    padding: 0 10px;
    box-sizing: border-box;
    margin-right: 5px;
  }

  .transaction-name-yewllo {
    height: 18px;
    border-radius: 10px;
    border: 1px solid #fd8e26;
    color: #fd8e26;
    font-size: 12px;
    padding: 0 10px;
    box-sizing: border-box;
    margin-right: 5px;
  }

  .transaction-name-lable {
    width: 350px;
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: rgba(25, 35, 60, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
    font-weight: bold;
  }

  .transaction-name-cumtorName {
    font-size: 13px;
    font-weight: 400;
    color: rgba(147, 152, 161, 1);
    margin: 10px 0 0;
  }

  .el-radio-button {
    width: 60px;

    > input {
      width: 60px;
    }

    > span {
      width: 60px;
    }
  }

  // todo 黄伟
  // .el-button.is-plain:focus,
  // .el-button.is-plain:hover {
  //   color: #fff !important;
  //   border-color: #10bbb8;
  //   background: #10bbb8;
  // }

  .el-table td .cell {
    .deadline-text {
      height: 90px;
      padding: 20px 0;
      line-height: 50px;
      color: #19233c;
      font-weight: 400;
    }

    .deadline-red {
      height: 90px;
      padding: 20px 0;
      line-height: 50px;
      color: #f10940;
    }

    .deadline-yellow {
      height: 90px;
      padding: 20px 0;
      line-height: 50px;
      color: #fd8e26;
    }
  }

  //  重定义胶囊按钮边框颜色
  .el-radio-button__inner {
    border-color: #e5e9f2;
    border-left: none;
    font-size: 14px;
  }

  .el-radio-button:first-child .el-radio-button__inner {
    border-color: #e5e9f2;
  }
}
</style>
<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件

.transaction {
  border-radius: 6px;
  width: 100%;
  margin: 0 0 40px;

  /deep/ .el-form {
    .el-form-item {
      font-size: 14px;
      /*text-align: center;*/
      padding-left: 45px;
      display: flex;
      align-items: center;

      .el-form-item__label {
        float: none;
        line-height: 30px;
        vertical-align: top;
      }

      .el-form-item__content {
        float: none;
        display: inline-block;
      }

      .el-textarea {
        width: 175px;
      }

      .el-textarea__inner {
        padding-bottom: 15px;
      }
    }
  }
}

.dgg-order-nav {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
  overflow: hidden;
  padding: 0 30px;
  border-bottom: 1px solid #e3e4e6;
  border-radius: 6px 6px 0 0;

  .dgg-order-state {
    width: 80px;
    line-height: 26px;
    .dgg-text-ellip;
    display: inline-block;
  }

  .dgg-button-group {
    height: 100%;
    display: flex;
    align-content: center;
    flex-wrap: nowrap;

    /deep/.el-button {
      padding: 0 15px;
      margin-left: 10px;
      border: 0;
      border-bottom: 1px solid transparent;

      &:first-child {
        margin-left: 0;
      }

      &:hover {
        color: #10bbb8;
        border-color: #10bbb8;
      }
    }
  }

  .dgg-submenu-nav {
    .el-menu-item {
      height: 50px;
      line-height: 50px;
      margin-left: 10px;

      &.first-child {
        margin-left: 0;
      }
    }
  }

  .dgg-details-member {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    .memberImgLists {
      display: flex;
      align-items: center;

      .el-image {
        width: 27px;
        height: 27px;
        overflow: hidden;
        border-radius: 50%;

        &:not(:first-child) {
          margin-left: -6px;
        }

        /deep/.el-image__inner {
          width: 27px;
          height: 27px;
          overflow: hidden;
          border-radius: 50%;
          border: 2px solid #fff;
        }
      }
    }

    .more-member {
      border-radius: 50%;
      margin-left: -6px;
      z-index: 10;
      cursor: pointer;
    }
  }
}

.dgg-order-search {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #edeff0;

  /deep/.el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}

//成员设置
/deep/.order-member-set {
  padding: 0 10px;
  overflow-y: scroll;

  .el-drawer__header {
    margin: 0;
    height: 60px;
    color: #19233c;
    padding: 0 10px;
    line-height: 60px;
    font-size: 16px;
    font-weight: 500;
    .dgg-text-ellip;
  }

  .dgg-member-info {
    .person-charge {
      height: 100px;
      border-top: 1px solid #edeff0;
      border-bottom: 1px solid #edeff0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px 10px 18px 10px;

      .top {
        height: 18px;
        line-height: 18px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        & > span {
          display: inline-block;
          flex: 1;
          .dgg-text-ellip;
          font-size: 13px;
          font-weight: 400;
          color: #9398a1;
        }

        .dgg-button {
          line-height: 18px;
          padding-left: 10px;
          max-width: 62px;
          font-size: 13px;
          border: none;
        }
      }

      .bottom {
        display: flex;
        align-items: center;
        height: 28px;

        .headImg {
          width: 27px;
          height: 27px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        & > span {
          margin-left: 14px;
          flex: 1;
          .dgg-text-ellip;
          font-size: 14px;
          color: #666873;
        }
      }
    }

    .project-members {
      padding: 20px 20px 12px 10px;

      .top {
        height: 18px;
        line-height: 18px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        & > span {
          display: inline-block;
          flex: 1;
          .dgg-text-ellip;
          font-size: 13px;
          font-weight: 400;
          color: #9398a1;
        }

        .dgg-button {
          line-height: 18px;
          padding: 0 10px;
          max-width: 62px;
          font-size: 13px;
          border: none;
          padding-right: 0;
        }
      }
    }

    .members-list {
      .current-list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        height: 34px;
        margin-bottom: 14px;
        padding-right: 20px;
        padding-left: 10px;
        .dgg-text-ellip;
        overflow: visible;
        .left {
          position: relative;
          height: 100%;
          flex-shrink: 0;
          width: 134px;
          border-radius: 18px;
          font-size: 14px;
          display: flex;
          align-items: center;
          flex-wrap: nowrap;

          &:hover {
            background-color: #f5f7fa;

            .cancel-merber-icon {
              display: block;
            }
          }

          .headImg {
            width: 27px;
            height: 27px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          & > span {
            height: 100%;
            display: inline-block;
            line-height: 34px;
            margin-left: 14px;
            flex: 1;
            .dgg-text-ellip;
          }

          .cancel-merber-icon {
            display: none;
            position: absolute;
            right: -5px;
            top: -5px;
            cursor: pointer;
          }
        }
        > span {
          display: inline-block;
          max-width: 100px;
          .dgg-text-ellip;
        }
        .memberTypeSet {
          width: 80px;
          border: none;

          .el-input__suffix {
            width: 16px;
          }

          .el-input--suffix .el-input__inner {
            padding-right: 16px;
            border: none;
          }

          .el-input__icon {
            width: 16px;
          }
        }
      }
    }
  }
}

.handling-table {
  /deep/.elx-editable-row:hover {
    cursor: pointer;

    .transaction-name-lable {
      color: #10bbb8;
    }
  }

  /deep/.elx-editable-column {
    .cell {
      > div {
        .dgg-text-ellip;
      }
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

        .dgg-button {
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

.receiveDialog-alert {
  /deep/.el-from {
    width: 100%;
  }

  /deep/.el-form-item {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;

    &.choose-people {
      position: relative;

      .project-people-dialog {
        position: absolute;
      }

      .show-transactor-people {
        display: inline-block;
        width: 26px;
        height: 26px;
        position: relative;
        font-size: 0;
        vertical-align: top;

        &:hover {
          .dgg-icon {
            display: inline;
          }
        }

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
        }

        .dgg-icon {
          display: none;
          position: absolute;
          top: 0px;
          right: -8px;
          cursor: pointer;
        }
      }

      .show-transactor-name {
        display: inline-block;
        vertical-align: middle;
        max-width: 200px;
        .dgg-text-ellip;
      }

      .project-people-dialog {
        width: 282px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 19px 0px #dadde6;
        border-radius: 4px;
        z-index: 35;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 40px;

        .infinite-list {
          max-height: 300px;
          padding: 0 15px;
          padding-top: 20px;
          text-align: left;

          > li {
            width: 100%;
            font-size: 14px;
            color: #19233c;
            line-height: 20px;
            margin: 0 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            &.active-product-list {
              color: #10bbb8;
            }

            .dgg-text-ellip;

            &:hover {
              color: #10bbb8;
              cursor: pointer;
            }

            span {
              display: inline-block;
              .dgg-text-ellip;

              &:first-child {
                max-width: 60px;
                flex-shrink: 0;
              }

              &:last-child {
                flex: 1;
                text-align: right;
                padding-left: 14px;
              }
            }
          }
        }

        .tab-top {
          width: 100%;

          span {
            display: inline-block;
            width: 50%;
            text-align: center;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #666873;
            font-weight: 500;
            border-bottom: 2px solid #e3e4e6;
            cursor: pointer;
          }

          .this-btn,
          span:hover {
            color: #10bbb8;
            border-color: #10bbb8;
          }
        }

        .dgg-order-search {
          display: flex;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #edeff0;

          .el-input__inner {
            height: 30px;
            line-height: 30px;
            background: none !important;
            border: 1px solid #e3e4e6 !important;
          }
        }

        .no-data {
          max-width: 100%;
          text-align: center;
        }
      }
    }

    .addTransactor {
      color: #c8cfdb;
      vertical-align: middle;
      cursor: pointer;
    }

    > label {
      vertical-align: middle;
      width: 100px;
      text-align: right;
      flex-shrink: 0;
    }

    .el-form-item__content {
      flex: 1;
      text-align: left;

      p {
        max-width: 200px;
        text-align: left;

        .dgg-text-ellip;
      }
    }
  }
}
</style>
