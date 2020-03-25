<template>
  <div class="receive">
    <!-- 头部 -->
    <div
      v-if="
        [
          'finishDetailsTask',
          'finishDetailsDocument',
          'finishDetailsBill',
          'finishDetailsDynamic'
        ].includes($route.name)
      "
      class="dgg-order-nav"
    >
      <span class="dgg-order-state">{{ transactionItem.orderStatusName }}</span>

      <el-menu
        :default-active="defaultActive"
        class="dgg-submenu-nav"
        mode="horizontal"
      >
        <el-menu-item key="1" index="1" @click="menuJump('finishDetailsTask')"
          >任务</el-menu-item
        >
        <el-menu-item
          key="2"
          index="2"
          @click="menuJump('finishDetailsDocument')"
          >文档</el-menu-item
        >
        <el-menu-item
          key="4"
          index="4"
          @click="menuJump('finishDetailsDynamic')"
          >动态</el-menu-item
        >
      </el-menu>
      <div class="dgg-details-member">
        <div class="memberImgLists">
          <el-image
            v-for="member in memberImgLists"
            :key="member"
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
    <!--  列表 -->
    <div v-show="$route.name === 'allOrder'" class="receive-content">
      <div class="tabs-item-head">
        <div>
          <!-- oninput="this.value=this.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" -->
          <dgg-input
            v-model="searchData"
            :maxlength="30"
            oninput="this.value=this.value.replace(/\s/g,'')"
            onkeyup="if(value.length>30)value=value.slice(0,30)"
            class="search"
            placeholder="客户名称/生产单编号"
          >
            <dgg-icon
              slot="prefix"
              icon-class="dgg-search"
              svg-width="15px"
              svg-height="15px"
            />
          </dgg-input>
          <dgg-button
            plain
            class="receive-button default-btn-with"
            @click="searchClick"
          >
            搜 索
          </dgg-button>
          <dgg-button
            plain
            class="dgg-button-nocolor default-btn-with"
            @click="resetClick"
          >
            重 置
          </dgg-button>
          <div class="fr receive-radio"></div>
          <el-tooltip
            effect="dark"
            popper-class="grab-tooltip"
            :content="receiptTime"
            placement="top"
          >
            <div class="fr icon_info">
              <dgg-icon
                icon-class="icon_info"
                svg-width="15px"
                svg-height="30px"
              />
            </div>
          </el-tooltip>
        </div>
      </div>
      <!-- 表格 -->
      <div v-if="activeData === '1'" class="receive-body">
        <dgg-edit-table
          :data="allOrderData.records"
          :columns="columns"
          :request-data-api="zysc_get_allOrder_list"
          :params="params"
          :page-info="allOrderData.total"
        />
      </div>
    </div>
    <el-dialog
      :visible.sync="singleBackCodeDialog"
      title="拒接订单"
      width="400px"
      @close="
        singleBackCodeForm.code = '';
        singleBackCodeForm.remark = '';
      "
    >
      <el-form ref="form" :model="singleBackCodeForm">
        <el-form-item label="拒接原因：">
          <el-select
            v-model="singleBackCodeForm.code"
            placeholder="请选择拒接原因"
          >
            <el-option
              v-for="item in singleBackCodeOption"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="拒接备注：" class="refuse-memo">
          <el-input
            v-model="singleBackCodeForm.remark"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            show-word-limit
            maxlength="500"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            singleBackCodeDialog = false;
            singleBackCodeForm.code = '';
            singleBackCodeForm.remark = '';
          "
          >取 消
        </el-button>
        <el-button type="primary" @click="refusedOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 接收 --弹窗  -->
    <el-dialog
      :visible.sync="receiveDialog"
      title="接收订单"
      width="400px"
      class="receiveDialog-alert"
      @close="
        receiveForm.code = '';
        receiveForm.name = '';
        receiveForm.projectMembersPhone = '';
        searchStorePhone = '';
        choosePeopleData = {};
      "
    >
      <el-form :model="receiveForm">
        <el-form-item label="生产单编号：">
          <p>
            {{ this.receiveItem.scOrderNo ? this.receiveItem.scOrderNo : "--" }}
          </p>
        </el-form-item>
        <el-form-item label="合同编号：">
          <p>
            {{
              this.receiveItem.contractNo ? this.receiveItem.contractNo : "--"
            }}
          </p>
        </el-form-item>
        <el-form-item label="项目负责人：" class="choose-people">
          <template v-if="Object.keys(choosePeopleData).length > 0">
            <span class="show-transactor-people">
              <img
                :src="
                  choosePeopleData.photoUrl
                    ? choosePeopleData.photoUrl
                    : taskTransactorImg
                "
                :onerror="errorTaskTransactorImg"
                alt=""
              />
              <dgg-icon
                icon-class="dgg_delete"
                svg-width="14px"
                svg-height="14px"
                sdafsadfasdffas
                @click="deleteChoosePeople"
              />
            </span>
            <span class="show-transactor-name">{{
              choosePeopleData.label
            }}</span>
          </template>
          <dgg-icon
            v-if="Object.keys(choosePeopleData).length < 1"
            icon-class="dgg_add"
            svg-width="18px"
            svg-height="18px"
            class="addTransactor"
            @click="showChoosePeopleDialog = !showChoosePeopleDialog"
          />
          <!-- 显示接收弹窗选择 -->
          <div v-if="showChoosePeopleDialog" class="project-people-dialog">
            <div class="dgg-order-search">
              <dgg-input
                v-model="searchStorePhone"
                class="search-input"
                placeholder="输入成员姓名或手机号搜索"
                maxlength="30"
                @input="searchStorePhone = searchStorePhone.replace(/\s/g, '')"
                @keyup.enter.native="$event.target.blur"
                @blur="receiveOrderDialogFn"
              >
                <dgg-icon slot="prefix" icon-class="dgg-search" />
              </dgg-input>
            </div>
            <!-- 搜索 end -->
            <ul
              v-if="receiveOption.length > 0"
              class="infinite-list"
              style="overflow:auto"
            >
              <li
                v-for="(item, index) in receiveOption"
                :key="index"
                :class="{ 'active-product-list': item.userId == chooseStoreId }"
                class="infinite-list-item"
                @click="chooseStoreData(item)"
              >
                <span>{{ item.label ? item.label : "--" }}</span>
                <span>{{ item.value ? item.phone : "--" }}</span>
              </li>
            </ul>
            <p v-if="receiveOption.length < 1" class="no-data">暂无数据！</p>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            receiveDialog = false;
            receiveForm.code = '';
            receiveForm.name = '';
            receiveForm.projectMembersPhone = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="receiveOrder" :loading = receiveButton>确 定</el-button>
      </span>
    </el-dialog>
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
                  class="file-name"
                  :title="fileListItem.filename ? fileListItem.filename : '--'"
                  >{{
                    fileListItem.filename ? fileListItem.filename : "--"
                  }}</span
                >
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
                  class="file-name"
                  :title="fileListItem.filename ? fileListItem.filename : '--'"
                  >{{
                    fileListItem.filename ? fileListItem.filename : "--"
                  }}</span
                >
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
    <!-- 上传附件弹窗 -->
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
        <dgg-button type="primary" style="width:100px" class="receive-button">
          上传文件
        </dgg-button>
      </dgg-upload-doc>
    </dgg-modal>
    <router-view />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
import moment from "moment";
import config from "@/service/config";
import Notification from "@/componentsEl/notification/index.js";
import taskTransactorImg from "@/assets/images/image_portrait_fault.png";

export default {
  name: "Receive",
  components: {},
  data() {
    return {
      taskTransactorImg: taskTransactorImg, // 办理人默认头像
      errorTaskTransactorImg: 'this.src="' + taskTransactorImg + '"', // 默认图地址
      showChoosePeopleDialog: false,
      chooseStoreId: "",
      choosePeopleData: {}, // 选定人的信息
      searchStorePhone: "",
      receiveForm: {
        code: "",
        name: "",
        projectMembersPhone: ""
      },
      //-----------------接收
      receiveDialog: false, //接收 弹窗
      receiveButton:false, // 确定防重复点击
      receiveOption: [],
      receiveItem: "",
      singleBackCodeForm: {
        code: ""
      },
      activeData: "1",
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
      columns: [
        {
          prop: "businessProductName",
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
          width: "140",
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
          label: "客户名称" ,
          type: "isrender",
          render:(h, params)=>{
            return(<div class="dgg-text-ellip">{params.row.customerName}</div>)
          }
        },
        { prop: "region", width: "100", label: "办理地区" },
        { prop: "proScAttrName", label: "产品属性" },
        { prop: "orderStatusName", label: "订单状态" },
        { prop: "scAttrStatusName", label: "属性状态" },
        {
          label: "操作",
          width: "170",
          type: "isrender",
          render: (h, params) => {
            //订单 -- 待接受
            if (params.row.orderStatus == "QDS_SC_ORDER_STATUS_CODE07") {
              // isReject == 1:接受，拒绝，否者： 接受
              if (!params.row.isReject) {
                return (
                  <div>
                    <dgg-button
                      plain
                      style="width:50px"
                      class="receive-button"
                      onClick={res => {
                        this.receiveOrderDialog(params.row);
                      }}
                    >
                      接 收
                    </dgg-button>
                  </div>
                );
              } else {
                return (
                  <div>
                    <dgg-button
                      plain
                      style="width:50px"
                      class="receive-button"
                      onClick={res => {
                        this.receiveOrderDialog(params.row);
                      }}
                    >
                      接 收
                    </dgg-button>
                    <dgg-button
                      plain
                      style="width:50px;margin-left:10px;"
                      class="dgg-button-nocolor"
                      onClick={res => {
                        this.refuseConfirm(params.row);
                      }}
                    >
                      拒 绝
                    </dgg-button>
                  </div>
                );
              }
            }
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
      receiptTime: null, //接单时间
      allSearch: {},
      searchData: "", //搜索的字段
      paramsData: {},
      paramsSearchData: {},
      singleBackCodeDialog: false, // 拒接类型弹窗
      singleBackCodeOption: [],
      refusedOrderRow: "", // 拒接订单
      // ---------------- 退单相关
      backCodeDialog: false, //退单 弹窗
      backCodeOption: [],
      DetailDocumentfileLists: [],
      backOrderRow: "", // 拒接订单
      caseAuditRow: "", // 完结订单
      backCodeForm: {
        code: "",
        remark: ""
      },
      rules: {
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
        code: [{ required: true, message: "", trigger: "blur" }],
        file: [{ required: true, message: "请上传附件", trigger: "blur" }]
      },
      //  ----------上传附件
      docModal: false, //附件弹窗
      fileLoading: false, //按钮防重复点击
      fileList: [],
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
      imageTypes: ["jpg", "jpeg", "gif", "png", "bmp"],
      //-------------结项相关
      caseAuditOption: [],
      caseAuditDialog: false, //结项弹窗
      caseAuditForm: {
        code: "",
        remark: ""
      }
    };
  },
  computed: {
    ...mapState(["storeInfoData", "transactionItem"]),
    ...mapState("orderModule", [
      "areaOptions",
      "productOptions",
      "orderTeamOptions"
    ]),
    ...mapState("receiveModule", ["allOrderData", "commodityOptions"]),
    params() {
      return {
        ...this.paramsData
      };
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
    uploadUrl() {
      return config.uploadUrl;
    },
    listUrl() {
      return config.listUrl;
    },
    deleteUrl() {
      return config.deleteUrl;
    }
  },
  watch: {},
  // 路由离开之前，记录跳转到哪个页面了
  beforeRouteLeave(to, from, next) {
    sessionStorage.processPlanRoute = from.fullPath;
    next();
  },
  async mounted() {
    this.zysc_get_setTimeS();
  },
  activated() {
    //
  },
  created() {
    if (this.$route.params.overdue) {
      this.paramsData.overdue = this.$route.params.overdue;
    }
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions(["ruoterJump"]),
    ...mapActions("receiveModule", [
      "get_store_peoples", //查询店铺成员
      "zysc_get_allOrder_list", // 查询列表
      "get_order_model_by_status",

      "receive_order", // 确认接收
      "refused_order", // 确认拒绝
      "refuse_code_tree_book_list",
      "zysc_get_setTime" // 查询生产中心 设置的抢单，接单 时间
    ]),
    ...mapActions("transactionModule", [
      "search_files",
      "apply_back_order_audit", // 确认退单
      "undo_case_submission", // 非标件 -- 方案审核驳回 --  提交
      "undo_case_audit", // 标件 -- 撤回订单
      "undo_back_order_audit", // 非标件 -- 撤回订单
      "undo_case_recovery", // 标件 -- 恢复订单
      "apply_case_audit", // 提交结项数据
      "delete_files" // 删除文档
    ]),
    ...mapActions("teamSettingModule", ["get_store_user"]),
    ...mapMutations(["setTransactionItem", "setTranstionOrderModel"]),
    // 生成单编号点击
    rowClick(row) {
      sessionStorage.proccessPlanID = row.id;
      this.setTransactionItem(row);
      if (row.orderStatus == "QDS_SC_ORDER_STATUS_CODE07") {
        // 待接收不跳详情
        return;
      }
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
      if (
        // 办理中，以及办理相关的 跳统一的详情
        row.orderStatus == "QDS_SC_ORDER_STATUS_CODE01" ||
        row.orderStatus == "QDS_SC_ORDER_STATUS_CODE19" ||
        row.orderStatus == "QDS_SC_ORDER_STATUS_CODE29" ||
        row.orderStatus == "QDS_SC_ORDER_STATUS_CODE02" ||
        row.orderStatus == "QDS_SC_ORDER_STATUS_CODE03" ||
        row.orderStatus == "QDS_SC_ORDER_STATUS_CODE27" ||
        row.orderStatus == "QDS_SC_ORDER_STATUS_CODE26"
      ) {
        this.ruoterJump({
          name: "transactionTask",
          params: {
            title: `${row.productName}-${row.scOrderNo}`
          }
        });
      }
      if (row.orderStatus == "QDS_SC_ORDER_STATUS_CODE04") {
        // 订单 -- 完结
        this.ruoterJump({
          name: "finishDetailsTask",
          params: {
            title: `${row.customerName}-${row.scOrderNo}`
          }
        });
      }
      if (row.orderStatus == "QDS_SC_ORDER_STATUS_CODE05") {
        // 订单 -- 退单
        this.ruoterJump({
          name: "chargeBackDetailsTask",
          params: {
            title: `${row.customerName}-${row.scOrderNo}`
          }
        });
      }
    },
    // -----------------------退单相关，开始
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
    // 退单确认操作
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
    // 退单弹窗 确定按钮 --  确定退单
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
    // -------------------------- 退单相关结束
    //----------------------------结项相关开始
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
    // 提交结项数据
    async auditOrder() {
      if (this.caseAuditForm.code.length === 0) {
        Notification.error("请选择结项原因");
        return;
      }
      if (this.caseAuditForm.remark.trim().length === 0) {
        Notification.error("请填写结项说明");
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
    //----------------------------结项相关结束
    //----------------------------提交订单
    // 提交 按钮点击
    async Submission(row) {
      // , title: `${params.row.productName}-${params.row.scOrderNo}`
      sessionStorage.proccessPlanID = row.id; // 提交流程方案页面的ID
      this.ruoterJump({
        name: "processPlan",
        params: { id: row.id }
      });
    },
    //----------------------------撤回订单
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
    //----------------------------恢复订单
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
    // ---------------------------上传附件 开始
    // 请求附件列表
    async searchFile(type) {
      await this.$nextTick();
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
    async submitModal() {
      this.fileLoading = true;
      await this.$refs["uploadDoc"].$refs["upload-inner"].manualUpload(() => {
        this.docModal = false;
        this.fileLoading = false;
        this.searchFile();
      });
    },
    fileLoadError() {
      this.fileLoading = false;
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
    // 删除文件
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
    // --------------------------- 上传附件 结束
    //拒接 （按钮点击
    refuseConfirm(row) {
      this.$confirm(
        "该订单根据您的行为及数据进行匹配，建议不要轻易拒接订单，拒接订单将会影响您的接单排名分数哟~~",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
          // type: 'warning'
        }
      )
        .then(() => {
          this.showSingleBackCodeDialog(row);
        })
        .catch(() => {});
    },
    //接受按钮点击事件
    receiveOrderDialog(params) {
      this.receiveItem = params;
      this.receiveDialog = true;
      this.receiveOrderDialogFn();
    },
    //  查询人员
    async receiveOrderDialogFn() {
      if (this.searchStorePhone == "") {
        if (this.storeInfoData.storeId) {
          const res = await this.get_store_peoples({
            storeId: this.storeInfoData.storeId
          });
          if (res.code === 200) {
            const list = [];
            res.data.forEach((item, inx) => {
              if (item.currentStatus === "EMPLOYEE_STATUS_1") {
                item.value = item.userId;
                item.label = item.userName;
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
      } else {
        // 输入了值
        if (this.receiveOption.length > 0) {
          this.receiveOption = this.receiveOption.filter(item => {
            return (
              item.label == this.searchStorePhone ||
              item.value == this.searchStorePhone
            );
          });
        }
      }
    },
    // 选择项目人
    chooseStoreData(item) {
      this.$nextTick(() => {
        this.receiveForm.code = item.value;
        this.receiveForm.name = item.userName;
        this.receiveForm.projectMembersPhone = item.phone;
        this.showChoosePeopleDialog = false;
        this.choosePeopleData = item;
      });
    },
    // 删除选择的项目人
    deleteChoosePeople() {
      this.$nextTick(() => {
        this.choosePeopleData = "";
        this.receiveForm.code = "";
        this.receiveForm.name = "";
        this.receiveForm.projectMembersPhone = "";
      });
    },
    // 接收订单
    async receiveOrder() {
      if (this.receiveForm.code.length === 0) {
        this.$notify({
          message: "请选择项目负责人",
          type: "error",
          customClass: "dgg-tip-msg"
        });
        return;
      }
      const params = this.receiveItem;
      this.receiveButton = true;
      const res = await this.receive_order({
        projectManagerId: this.receiveForm.code,
        projectManagerName: this.receiveForm.name,
        id: params.id,
        projectMembersPhone: this.receiveForm.projectMembersPhone,
        id: params.id
      });
      this.receiveButton = false;
      if (res.code === 200) {
        this.receiveDialog = false;
        this.$message.success("接单成功");
        this.receiveForm.code = "";
        this.receiveForm.name = "";
        this.receiveForm.projectMembersPhone = "";
        this.searchClick();
        this.$bus.$emit("receiveRefresh");
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    async showSingleBackCodeDialog(params) {
      const res = await this.refuse_code_tree_book_list({
        code: "QDS_ZYGSSC_REFUSEREASON",
        type: 1,
        level: 1
      });
      if (res.code === 200) {
        this.singleBackCodeOption = res.data;
        this.singleBackCodeDialog = true;
        this.refusedOrderRow = params;
      }
    },
    // 确认拒绝 --  提交确认数据
    async refusedOrder() {
      if (this.singleBackCodeForm.code.length === 0) {
        this.$message.error("请选择拒接原因");
        return;
      }
      const res = await this.refused_order({
        id: this.refusedOrderRow.id,
        refuseReason: this.singleBackCodeForm.code,
        refuseRemark: this.singleBackCodeForm.remark
      });
      if (res.code === 200) {
        this.$message.success("操作成功");
        this.searchClick();
        this.singleBackCodeDialog = false;
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    //搜索--点击
    searchClick() {
      this.paramsData = {
        keyWord: this.searchData
      };
    },
    //重置--点击
    resetClick() {
      this.searchData = "";
      this.paramsData = {};
    },
    //查询生产中心 设置的抢单，接单 时间
    async zysc_get_setTimeS() {
      const res = await this.zysc_get_setTime({});
      if (res.code == 200) {
        this.receiptTime =
          "请在" + res.data + "小时内接单，否则订单将退回且影响您的排名";
      }
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/main.less"; //引入全局less文件

.receive {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  margin: 0 0 40px;
  border-radius: 0 0 6px 6px;

  .search {
    width: 270px;
    height: 30px;
    margin-left: 20px;

    > input {
      background: rgba(240, 242, 245, 1);
      border: none;
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
    font-size: 0;
    min-height: 70px;
    padding: 20px 0px;
  }

  .receive-body {
    padding: 0 10px;
  }

  .receive-button {
    border-radius: 4px;
    border: 1px solid rgba(16, 187, 184, 1);
  }

  .receive-radio {
    margin-right: 30px;
  }

  .service-name-sate {
    width: 50px;
    height: 18px;
    border-radius: 10px;
    border: 1px solid rgba(241, 9, 64, 1);
    color: #f10940;
    font-size: 12px;
    padding: 0 6px;
    box-sizing: border-box;
  }

  .service-name-lable {
    width: 350px;
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: rgba(25, 35, 60, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .service-name-cumtorName {
    font-size: 13px;
    font-weight: 400;
    color: rgba(147, 152, 161, 1);
    margin-top: 10px;
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

  .icon_info {
    cursor: pointer;
    margin-right: 30px;
    line-height: 30px;
  }
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
  .el-textarea .el-input__count {
    line-height: 1;
  }
}

.receiveDialog-alert {
  .el-from {
    width: 100%;
  }

  .el-form-item {
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
