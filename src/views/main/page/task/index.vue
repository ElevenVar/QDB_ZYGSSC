<template>
  <!-- 任务版块 -->
  <div class="task">
    <div class="dgg-task-warp">
      <div class="dgg-stage">
        <div class="stage-content">
          <ul class="stage-lists" v-if="taskList.length > 0">
            <li
              v-for="(item, index) in taskList"
              :key="index"
              class="current-stage"
              :class="{
                'active-stage': item.taskStatusCode == checkedTaskCode
              }"
              @click.stop="searchTaskLsit(item.taskStatusCode)"
            >
              <label v-text="item.taskStatusName" />
              <span>（{{ item.taskAggregation }}）</span>
            </li>
          </ul>
          <!-- 无阶段占位图 -->
          <taskBitMap
            v-if="taskList.length < 1"
            synopsis="暂无任务"
            svg-class="icon_nostage"
            svg-width="58px"
            svg-height="41px"
          />
        </div>
      </div>
      <div class="dgg-task">
        <!-- 搜索 start -->
        <div class="dgg-order-search">
          <dgg-input
            v-model="searchKey"
            clearable
            class="search-input"
            placeholder="请输入任务名称搜索"
            maxlength="30"
            @input="searchKey = searchKey.replace(/\s/g, '')"
            @keyup.enter.native="$event.target.blur"
            @clear="searchTaskKeyWords"
            @blur="searchTaskKeyWords"
          >
            <dgg-icon slot="prefix" icon-class="dgg-search" />
          </dgg-input>
        </div>

        <!-- 全部 start -->
        <div class="all-btn" @click="toAllData($event)">
          <span>{{ showChooseProductName }}</span>
          <dgg-icon
            icon-class="icon_extend"
            class="all-arrow"
            svg-width="8px"
            svg-height="8px"
          />
        </div>

        <!-- 点全部弹框 start -->
        <propComponent
          :up-all-pop="upAllPop"
          :count="taskProductList"
          :checkedProductId="checkedProductId"
          @Clickoutside="upAllPop = false"
          @load="load"
          @chooseProductNameFn="chooseProductNameFn"
          @productKewordsVal="getProductVal"
        />

        <div
          class="task-content"
          v-loading="taskloading"
          v-infinite-scroll="dropdownTaskPage"
          :infinite-scroll-disabled="!taskScrollPage"
        >
          <dgg-row class="task-lists" v-if="taskListData.length > 0">
            <dgg-col
              :span="24"
              class="current-list"
              :class="{
                'active-current-list': listItem.taskId == checkedTaskListId
              }"
              v-for="(listItem, index) in taskListData"
              :key="index"
            >
              <div class="content" style="position:relative">
                <div style="position:absolute;left:25px;top:7px;">
                  <dgg-tooltip
                    :value="showTips"
                    :popper-options="popperOptions"
                    :content="
                      listItem.taskSwitching == 1 ? '激活任务' : '完成任务'
                    "
                    placement="top"
                    class="msg-dot"
                    effect="dark"
                    :disabled="isClickCheckStatus(listItem)"
                  >
                    <dgg-checkbox
                      class="list-checkbox"
                      v-model="listItem.taskSwitching == 1"
                      :checked="listItem.taskSwitching == 0"
                      @change="stateChange(listItem)"
                      :disabled="isClickCheckStatus(listItem)"
                    />
                  </dgg-tooltip>
                </div>
                <div class="top-title" @click.stop="chageTaskListId(listItem)">
                  <div class="list-group">
                    <div class="list-title">
                      <h6 :class="{ deleteLine: listItem.taskSwitching == 1 }">
                        {{ listItem.taskName }}
                      </h6>
                      <dgg-tag
                        class="due-tag"
                        v-if="
                          listItem.aboutExpire == 1 &&
                            checkedTaskCode != 'HEAD_TASK_ITEM_3'
                        "
                        >即将到期</dgg-tag
                      >
                      <dgg-tag
                        class="overdue-tag"
                        v-if="
                          listItem.taskOverTime == 1 &&
                            checkedTaskCode != 'HEAD_TASK_ITEM_4'
                        "
                        >已超期</dgg-tag
                      >
                      <dgg-tooltip
                        :value="showTips"
                        :popper-options="popperOptions"
                        placement="top"
                        class="msg-dot ml-20 list-des"
                        effect="dark"
                        content="关键任务"
                        v-if="listItem.isKeyTask == 1"
                      >
                        <!-- 星星图标 -->
                        <dgg-icon
                          icon-class="icon_star"
                          svg-width="14px"
                          svg-height="14px"
                        />
                      </dgg-tooltip>
                    </div>
                  </div>
                  <!-- 是否质检任务 -->
                  <p class="list-des">{{ listItem.orderStageMixName }}</p>
                </div>
                <!-- 头像 -->
                <dgg-tooltip
                  :value="showTips"
                  :popper-options="popperOptions"
                  :content="listItem.taskManager"
                  placement="top"
                  class="msg-dot ml-20"
                  effect="dark"
                  v-if="listItem.userHeaderAddress"
                >
                  <img
                    :src="listItem.userHeaderAddress"
                    alt=""
                    :onerror="errorDefaultImg"
                    class="headimg"
                  />
                </dgg-tooltip>
              </div>
            </dgg-col>
          </dgg-row>
          <!-- 暂无任务 -->
          <taskBitMap
            v-if="taskListData.length < 1"
            :show-btn="false"
            synopsis="没有搜索到相关结果"
          />
        </div>
      </div>
      <!-- 最右边详情部分 -->
      <div class="dgg-details">
        <!-- 订单号及产品类型 start -->
        <div
          class="detail-oder-code"
          v-if="Object.keys(taskDetailData).length > 0"
        >
          <label
            >生产订单编号：
            <dgg-tooltip
              :value="showTips"
              :popper-options="popperOptions"
              :content="taskDetailData.productOrderNo"
              placement="top"
              class="msg-dot "
              effect="dark"
              :disabled="taskDetailData.productOrderNo.length < 19"
            >
              <span
                @click="
                  toTranstionDetail(
                    taskDetailData,
                    taskDetailData.taskDetailVO.zygsscId
                  )
                "
              >
                {{
                  taskDetailData.productOrderNo
                    ? taskDetailData.productOrderNo
                    : "--"
                }}
              </span>
            </dgg-tooltip>
          </label>
          <label
            >产品：
            <dgg-tooltip
              :value="showTips"
              :popper-options="popperOptions"
              :content="
                taskDetailData.productName
                  ? taskDetailData.productName + '-'
                  : ''
              "
              placement="top"
              class="msg-dot"
              effect="dark"
              :disabled="
                (
                  (taskDetailData.orderName
                    ? taskDetailData.orderName + '-'
                    : '') +
                  (taskDetailData.stageName ? taskDetailData.stageName : '')
                ).length <= 22
              "
            >
              <b>
                {{
                  taskDetailData.productName ? taskDetailData.productName : ""
                }}
              </b>
            </dgg-tooltip>
          </label>
        </div>
        <!-- 订单号及产品类型 end -->
        <!-- 任务     详情 -->
        <div
          class="detail-content"
          v-infinite-scroll="dropdownDetailQueryInventory"
          :infinite-scroll-disabled="queryinfiniteScrollFalg"
          v-if="Object.keys(taskDetailData).length > 0"
        >
          <div class="user-info">
            <div class="name">
              <h6>
                {{
                  taskDetailData.productName ? taskDetailData.productName : "--"
                }}
              </h6>
            </div>
            <div class="date">
              <div>
                <span>开始时间：</span>
                <span style="margin-left:0">
                  <template v-if="taskDetailData.taskDetailVO.beginTime">{{
                    taskDetailData.taskDetailVO.beginTime | filteTime
                  }}</template>
                  <template v-else>--</template>
                </span>
              </div>
              <div style="margin-left:15px">
                <span>完成时间：</span>
                <span style="margin-left:0">
                  <template v-if="taskDetailData.taskDetailVO.complateTime">{{
                    taskDetailData.taskDetailVO.complateTime | filteTime
                  }}</template>
                  <template v-else>--</template>
                </span>
              </div>
              <div style="margin-left:15px">
                <span>办理人：</span>
                <span style="margin-left:0">
                  {{ taskDetailData.taskDetailVO.taskManagerName }}
                </span>
              </div>
            </div>
          </div>
          <div class="transactor transactor-people">
            <dgg-icon
              icon-class="icon_transactor"
              svg-width="16px"
              svg-height="16px"
            />

            <span class="transactor-type">办理人</span>
            <span
              class="show-transactor-people"
              v-if="taskDetailData.taskDetailVO.taskManagerId"
            >
              <img
                :src="
                  taskDetailData.taskDetailVO.addressHandlerPicture
                    ? taskDetailData.taskDetailVO.addressHandlerPicture
                    : taskTransactorImg
                "
                :onerror="errorDefaultImg"
                alt=""
              />
              <dgg-icon
                icon-class="dgg_delete"
                svgWidth="14px"
                svgHeight="14px"
                @click="deleteTransacTorPeople"
                v-if="
                  taskDetailData.taskDetailVO.isCurrenUser == 0 &&
                    !isClickDetails(taskDetailData.taskDetailVO)
                "
              />
            </span>
            <dgg-icon
              icon-class="dgg_add"
              svg-width="18px"
              svg-height="18px"
              class="addTransactor"
              :class="{
                'dgg-not-allowed': isClickDetails(taskDetailData.taskDetailVO)
              }"
              v-if="!taskDetailData.taskDetailVO.taskManagerName"
              @click="
                taskDetailData.taskDetailVO.isCurrenUser == 0 &&
                  isClickDetails(taskDetailData.taskDetailVO) &&
                  addTransactor($event)
              "
            />

            <!-- 办理人选择框 start -->
            <transactorProp
              :up-all-pop="toTransactor"
              :top="'36px'"
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
          </div>
          <div class="transactor ">
            <dgg-icon
              icon-class="icon_deadline"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type">开始时间</span>
            <span class="format-end-time">
              <template v-if="taskDetailData.taskDetailVO.beginTime">{{
                taskDetailData.taskDetailVO.beginTime | filteTime
              }}</template>
              <template v-else>--</template>
            </span>
          </div>
          <div class="transactor ">
            <dgg-icon
              icon-class="icon_deadline"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type">截止时间</span>
            <span class="format-end-time">
              <template v-if="taskDetailData.taskDetailVO.deadLine">{{
                taskDetailData.taskDetailVO.deadLine | filteTime
              }}</template>
              <template v-else>--</template>
            </span>
            <!-- <span class="end-time">{{taskDetailData.deadLine?taskDetailData.deadLine:'--'}}</span> -->
          </div>
          <div class="transactor">
            <dgg-icon
              icon-class="icon_remind"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type">提醒</span>
            <dgg-button
              :dgg-icon="
                isClickDetails(taskDetailData.taskDetailVO)
                  ? 'dgg-plus'
                  : 'icon_plus2'
              "
              class="brabBill-button brabBill-button2"
              @click="showAddRemind = !showAddRemind"
              :disabled="isClickDetails(taskDetailData.taskDetailVO)"
              >添加
            </dgg-button>
          </div>

          <!-- 添加提醒 start -->
          <template
            v-if="taskDetailData.taskDetailVO.taskRemindList.length > 0"
          >
            <div
              v-for="(item, index) in taskDetailData.taskDetailVO
                .taskRemindList"
              :key="index"
              class="transactor transactor-remind"
            >
              <dgg-form class="remind-form">
                <dgg-row :gutter="10">
                  <dgg-col :span="12">
                    <dgg-select v-model="item.reminderConditionName" disabled>
                      <dgg-option
                        :label="item.reminderConditionName"
                        :value="item.reminderConditionName"
                      />
                    </dgg-select>
                  </dgg-col>
                  <dgg-col :span="12">
                    <dgg-select
                      v-model="item.reminderValue"
                      @change="changeRemidItem(item)"
                      :disabled="isClickDetails(taskDetailData.taskDetailVO)"
                    >
                      <dgg-option
                        :label="timeItem.name"
                        :value="timeItem.name + ':' + timeItem.code"
                        v-for="(timeItem, timeIndex) in allRemindTimesData"
                        :key="timeIndex"
                        :disabled="timeItem.name == item.reminderValue"
                      />
                    </dgg-select>
                  </dgg-col>
                </dgg-row>
              </dgg-form>
              <dgg-icon
                icon-class="dgg_delete"
                svg-width="16px"
                svg-height="16px"
                class="remindDelete"
                @click="remindDelete(item)"
                v-if="!isClickDetails(taskDetailData.taskDetailVO)"
              />
            </div>
          </template>
          <!-- 添加提醒的选择框 -->
          <div class="transactor transactor-remind" v-if="showAddRemind">
            <dgg-form class="remind-form">
              <dgg-row :gutter="10">
                <dgg-col :span="12">
                  <dgg-select v-model="defulutTimeKey" disabled>
                    <dgg-option
                      :label="defulutTimeKey"
                      :value="defulutTimeKey"
                    />
                  </dgg-select>
                </dgg-col>
                <dgg-col :span="12">
                  <dgg-select v-model="addReminderTime" @change="addRemidItem">
                    <dgg-option
                      :label="timeItem.name"
                      :value="timeItem.name + ':' + timeItem.code"
                      v-for="(timeItem, timeIndex) in allRemindTimesData"
                      :key="timeIndex"
                      :disabled="
                        choosedTimeReminderTime.includes(timeItem.name)
                      "
                    />
                  </dgg-select>
                </dgg-col>
              </dgg-row>
            </dgg-form>
          </div>

          <div class="transactor " v-if="taskDetailData.taskDetailVO">
            <dgg-icon
              icon-class="icon_explain"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type task-misson-statement">任务说明 </span>
            <dgg-button
              dgg-icon="icon_edit1"
              class="brabBill-button  brabBill-button2"
              @click="
                showTaskMissonContentView(
                  taskDetailData.taskDetailVO.taskExplain
                )
              "
              :disabled="isClickDetails(taskDetailData.taskDetailVO)"
              >编辑
            </dgg-button>
          </div>
          <!-- 编辑任务说明 -->
          <div
            class="add-transactor add-task-misson"
            v-if="showTaskMissonContent"
          >
            <dgg-input
              v-model="taskMissonContent"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 15 }"
              class="remarksTextArea"
              placeholder="请输入任务描述"
              maxlength="1000"
              ref="editTaskMissonContentVal"
              oninput="if(value.length>1000)value=value.slice(0,1000)"
              @keyup.enter.native="$event.target.blur"
              @blur="addtaskKewordsVal(taskMissonContent)"
            />
          </div>
          <div
            class="task-explain-text"
            v-if="
              taskDetailData.taskDetailVO.taskExplain && !showTaskMissonContent
            "
          >
            <div
              :style="{ 'max-height': taskExplainHeight }"
              class="explain-content"
              v-text="
                taskDetailData.taskDetailVO.taskExplain
                  ? taskDetailData.taskDetailVO.taskExplain
                  : ''
              "
            />
            <dgg-button
              :dgg-icon="iconType"
              el-icon--right
              class="brabBill-button"
              v-if="GetLength(taskDetailData.taskDetailVO.taskExplain) > 140"
              @click="changeTaskExplainHight"
              >{{ btnName }}
            </dgg-button>
          </div>

          <div class="transactor ">
            <dgg-icon
              icon-class="icon_enclosure"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type">附件</span>
            <dgg-button
              :dgg-icon="
                isClickDetails(taskDetailData.taskDetailVO)
                  ? 'dgg-plus'
                  : 'icon_plus2'
              "
              class="brabBill-button  brabBill-button2"
              @click="docModal = true"
              :disabled="isClickDetails(taskDetailData.taskDetailVO)"
              >添加</dgg-button
            >
          </div>

          <div
            class="show-detail-filesList"
            v-if="DetailDocumentfileLists.length > 0"
          >
            <ul>
              <li
                v-for="(fileListItem, fileListIndex) in DetailDocumentfileLists"
                :key="fileListIndex"
              >
                <div class="icon-name">
                  <dgg-icon
                    :icon-class="getIconByType(fileListItem)"
                    svg-width="16px"
                    svg-height="16px"
                  />
                  <p>
                    {{ fileListItem.filename ? fileListItem.filename : "--" }}
                  </p>
                </div>
                <div class="dgg-button-group">
                  <dgg-button
                    class="brabBill-button brabBill-button2"
                    @click="
                      viewDocument(fileListItem, getDocumentType(fileListItem))
                    "
                    v-if="
                      getDocumentType(fileListItem) == 'pdf' ||
                        imageTypes.includes(getDocumentType(fileListItem))
                    "
                    >查看
                  </dgg-button>
                  <dgg-button
                    class="brabBill-button brabBill-button2"
                    @click="downloadDocument(fileListItem)"
                    >下载
                  </dgg-button>

                  <dgg-button
                    :class="[
                      'brabBill-button',
                      'brabBill-button2',
                      {
                        'braBill-button-disabled': isClickDetails(
                          taskDetailData.taskDetailVO
                        )
                      }
                    ]"
                    @click="
                      isClickDetails(taskDetailData.taskDetailVO) &&
                        invalidDocument(fileListItem)
                    "
                    >作废
                  </dgg-button>
                </div>
              </li>
            </ul>
          </div>

          <div class="remarks">
            <div class="transactor ">
              <dgg-icon
                icon-class="icon_edit1"
                svg-width="14px"
                svg-height="14px"
              />
              <span class="transactor-type">备注</span>
            </div>
            <dgg-input
              v-model="remarksTextArea"
              type="textarea"
              class="remarksTextArea"
              maxlength="1000"
              oninput="if(value.length>1000)value=value.slice(0,1000)"
              :disabled="isClickDetails(taskDetailData.taskDetailVO)"
              @blur="saveFormatRemarksTextArea(remarksTextArea)"
            />
            <dgg-button
              class="sava-remarks"
              :disabled="remarksTextArea.length < 1"
              :class="{ 'active-save-remarks': remarksTextArea.length > 0 }"
              :loading="saveLodading"
              @click="saveRemarksFn"
              >保存</dgg-button
            >

            <!-- 记录列表 -->
            <dgg-radio-group
              :active-data="activeRadioData"
              :is-button="true"
              :radio-array="radioArray"
              :space="20"
              @change="changeRadioVal"
            />
            <ul class="record-lists" v-if="recordListData.length > 0">
              <li
                class="current-list"
                v-for="(item, index) in recordListData"
                :key="index"
              >
                <img
                  :src="
                    item.createrPictureUrl
                      ? item.createrPictureUrl
                      : userInfoSrc
                  "
                  alt=""
                  :onerror="errorDefaultImg"
                  class="headimg"
                />
                <div class="content">
                  <div class="name-date">
                    <span class="name">{{
                      item.createrName ? item.createrName : "--"
                    }}</span
                    ><span class="date" v-if="item.createTime">{{
                      item.createTime | filteTime
                    }}</span>
                  </div>
                  <p class="desc">
                    {{ item.remarkContent ? item.remarkContent : "--" }}
                  </p>
                </div>
              </li>
            </ul>
            <taskBitMap
              v-if="recordListData.length < 1"
              synopsis="暂无数据"
              style="margin-top:20px;"
            />
          </div>
        </div>
        <!-- 上传附件 -->
        <dgg-modal
          :modal="docModal"
          :hasmodal="true"
          :close-on-click-modal="false"
          :loading="fileLoading"
          title="上传附件"
          width="512px"
          class="document-upload-modal"
          @closeQuit="closeModal"
          @modalQuit="docModal = false"
          @modalAffirm="docModalAffirm"
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
            <dgg-button
              type="primary"
              style="width:100px"
              class="receive-button"
            >
              上传文件
            </dgg-button>
          </dgg-upload-doc>
        </dgg-modal>
        <!-- 图片类预览 -->
        <div v-show="imageView" class="img-handle-item">
          <el-image
            ref="imageViewRef"
            :src="imageUrl"
            style="width: 0; height: 0;"
            :preview-src-list="showImgList"
          />
        </div>
        <!-- 暂无任务详情占位图 -->
        <taskBitMap
          v-if="Object.keys(taskDetailData).length < 1"
          synopsis="暂无任务详情"
        />
      </div>
    </div>
    <!-- 无任务大的占位图 -->
    <div v-if="1 < 0" class="dgg-no-task">
      <!-- 任务无数据占位图 -->
      <taskBitMap :show-btn="true" />
    </div>

    <!-- 已完结标签 -->
    <div v-if="1 < 0" class="finishImg" fit="cover">
      <p class="finishImg-title">已完结</p>
      <p class="finishImg-time">{{ new Date() | timeFilter("YYYY.MM.DD") }}</p>
    </div>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
import taskBitMap from "@/views/main/page/components/taskBitMap.vue";
import moment from "moment";
import config from "@/service/config";
import propComponent from "../components/propComponent.vue";
import transactorProp from "../components/transactorProp.vue";
import taskTransactorImg from "@/assets/images/image_portrait_fault.png";

export default {
  name: "Task",
  filters: {
    filteTime(val) {
      return moment(Number(val)).format("YYYY-MM-DD");
    }
  },
  components: {
    taskBitMap, // 任务无数据占位图
    propComponent, //任务列表产品弹窗
    transactorProp //添加办理人弹窗
  },
  data() {
    return {
      //--------------------------ZL 修改
      saveLodading: false, // 保存防重复点击
      checkedTaskCode: null, //选中的任务订单状态code\默认选中全部状态
      taskList: [], // 任务类型 -- 最左侧数据
      taskListData: [], //任务列表数据
      defaultTaskDetailItem: "", //获取详情的默认item
      DetailDocumentfileLists: [], //查询的详情附件列表
      activeRadioData: "1", //默认选中备注
      cloneClickLiskItem: {}, // 获取到输入框点击的 相关数据
      // externalCount, // 添加办理人外部合作
      toTransactor: false, // 办理人选择框默认值
      STOREID: null, //
      fileLoading: false, // 上传附件的加载效果
      taskScrollPage: false, //任务滑动分页
      //--------------------------ZL 修改 end
      queryinfiniteScrollFalg: false, //是否可无限滚动
      scrollQueryDataFlag: true, //是否可滚动备注和记录
      DetailQueryInventoryPage: 1, //备注和记录分页
      clonetDetaildeadLineTime: "", //克隆截止时间

      list: [],
      fileList: [],
      showImgList: [],
      imageView: false,
      imageUrl: "",
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
      DetailDocumentfileId: "", //上传的附件ID
      officeTypes: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"],
      imageTypes: ["jpg", "jpeg", "gif", "png", "bmp"],
      docModal: false, // 上传附件控制模态框的
      taskMissonContent: "", //任务说明内容
      showTaskMissonContent: false, //显示添加任务说明
      cloneTaskDetailVoTaskMisson: "", //克隆初始化任务说明
      defulutTimeKey: "截止前",
      taskTransactorImg: taskTransactorImg, //办理人默认头像
      errorDefaultImg: 'this.src="' + taskTransactorImg + '"', //默认图地址
      userInfoSrc: require("@/assets/images/image_head_default.png"), //默认记录头像
      productKeywordsVal: "", //筛选产品名称
      taskloading: false,
      productCode: "", //搜索的产品id
      checkedProductId: "", //选中产品名称
      checkedTaskListId: "", //默认选中的列表

      popperOptions: {
        boundariesElement: "body"
      },
      taskpage: 1,
      taskLimit: 20,
      showTips: false,
      taskProductList: [], //从后台返回的产品列表集合
      taskDetailData: {}, //任务详情数据
      btnName: "开展更多",
      iconType: "icon_extend",
      tabNames: ["店铺成员", "外部合作"], // 办理人切换标题
      count: 0, // 添加办理人本所律师
      upAllPop: false, // 点全部时的默认值
      radioArray: [
        {
          label: "备注",
          value: "1"
        },
        {
          label: "记录",
          value: "2"
        }
      ],
      taskDetailQueryType: 1, //查询备注和记录内容类型
      taskDetailTerminal: "caserecode_type_25",
      recordListData: [], //备注数据
      remarksTextArea: "", // 备注
      searchKey: "", // 搜索关键字
      taskExplainHeight: "48px", // 任务说明固定高度
      storeFlagUser: 0, //默认本店店铺
      transactorData: [], //选择店铺数据
      thisStoreRealName: "", //搜索办理人姓名关键字
      thisStorePhone: "", //搜索办理人手机号
      thisCheckedStoreId: "", //选定的办理人id
      formatTimesArr: [], //处理数据字典时间集合未id
      choosedTimeReminderTime: [], //处理选定的时间提醒
      addReminderTime: "", //添加的时间提醒
      showAddRemind: false, //显示添加提醒
      showChooseProductName: "全部" //显示选定产品名称
    };
  },
  computed: {
    ...mapState([
      "userId",
      "taskStatusCodes",
      "XReqYT",
      "orderStatus",
      "allRemindTimesData",
      "storeQalNspectionsStatus", //质检任务返回名称
      "transactionItem"
    ]),
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
    //上传文件
    uploadparams() {
      let fid = this.DetailDocumentfileId.split("_");
      return {
        fileId: fid[0] + "_" + fid[1],
        fileIdAdd: fid[2] + "_" + fid[3],
        isDeleteOriginalFile: false,
        type: fid[4] + "_" + fid[5]
      };
    }
  },
  watch: {},
  created() {
    let sessionCheckedTaskCode = sessionStorage.getItem(
      "workBrenchTaskStageId"
    );
    let sessionCheckedTaskListId = sessionStorage.getItem(
      "workBrenchTaskTaskId"
    );
    if (sessionCheckedTaskCode) {
      this.checkedTaskCode = sessionCheckedTaskCode; // 赋值默认的code
    }
    if (sessionCheckedTaskListId) {
      this.checkedTaskListId = sessionCheckedTaskListId;
    }
    this.statisticalTaskFn(); //任务统计接口
    this.getSearch_product(); // 任务产品名称获取
  },
  mounted() {
    console.log(new Date().getDate())
    //处理数据字典时间集合
    this.formatTimesArr = this.allRemindTimesData.map((val, index) => {
      return val.name;
    });
  },
  beforeDestroy() {
    this.setWorkBrenchTaskStageId("");
    this.setWorkBrenchTaskTaskId("");
  },
  methods: {
    ...mapActions(["ruoterJump"]),
    ...mapActions("workbenchTaskModule", [
      "search_product", //任务产品名称获取
      "task_detail_generate", //添加备注接口、任务说明添加跟更改接口
      "task_query_inventory", //查询跟案记录
      "task_add_reminder", //设置提醒
      "task_updtae_reminder", //修改提醒
      "task_delete_reminder", //删除提醒
      "get_store_user", //获取店铺和外部人员信息
      "task_setting_manager", //添加办理人
      "deleter_setting_manger", //删除办理人
      "task_description_change", //添加任务说
      "queryTaskRecordPage" //查询任务记录列表
    ]),
    ...mapActions("workbenchModule", [
      "zygs_workbench_taskList" //即将到期、已超期、我的待办、我分配的
    ]),
    ...mapActions("transactionModule", ["search_files", "update_files"]),
    ...mapActions("commonModule", [
      "genera_tetemplate" // 记录文档操作
    ]),
    ...mapMutations([
      "setTransactionItem",
      "setTransactionStageId", //设置办理阶段id
      "setTransactionTaskId", //设置办理任务id
      "setWorkBrenchTaskStageId",
      "setWorkBrenchTaskTaskId"
    ]),
    ...mapMutations(["receiveModule"]),
    // ----------------张浪新增
    ...mapActions("homeTaskModule", [
      "zysc_homeTask_list", // 查询任务统计
      "zysc_homeTask_c", // 查询具体某个类型的任务
      "zysc_homeTask_details", // 查询任务详情
      "zysc_homeTask_record", // 查询任务记录表
      "zysc_homeTask_record_add", // 添加任务备注
      "zysc_homeTask_getProduct", // 查询产品列表
      "zysc_complete_task_service", //即将到期、已超期、我的待办、我分配的下面列表复选框---任务已完成、任务未完成、激活任务接口
      "zysc_manageTaskHandler_operation", // 添加/删除/修改 办理人
      "ztsc_task_updtae_reminder", // 修改任务提醒
      "zysc_task_delete_reminder", //删除 任务提醒
      "zysc_get_production_order_details_data" // 跳转查询订单详情
    ]),
    //请求详情附件列表
    searchFilesFn() {
      this.search_files({
        fileId: this.DetailDocumentfileId
      }).then(res => {
        if (res.code == 200 && res.data.length > 0) {
          //赋值附件列表数据
          this.DetailDocumentfileLists = res.data;
        } else {
          this.DetailDocumentfileLists = [];
        }
        this.$forceUpdate();
      });
    },
    //编辑点击 --  任务说明图标点击
    showTaskMissonContentView(content) {
      this.showTaskMissonContent = !this.showTaskMissonContent; // 任务说明输入框
      if (this.showTaskMissonContent) {
        this.$nextTick(() => {
          this.$refs.editTaskMissonContentVal.$refs.textarea.focus();
        });
      }
      if (content) {
        this.taskMissonContent = content;
        this.cloneTaskDetailVoTaskMisson = content;
      } else {
        this.taskMissonContent = "";
      }
    },
    //添加任务说明 --  任务说明输入框 失去焦点
    addtaskKewordsVal(content) {
      this.task_description_change({
        zygsscId: this.defaultTaskDetailItem.taskDetailVO.zygsscId, //专业公司生产ID
        explainComent: content, // 输入的内容
        taskId: this.defaultTaskDetailItem.taskDetailVO.taskId
      }).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "提示",
            message: res.message,
            type: "success",
            customClass: "dgg-tip-msg"
          });
          this.DetailQueryInventoryPage = 1;
          this.clearDetailData(); //清除详情数据
          this.updateDeatailData(); //更新详情数据
        } else {
          this.$notify({
            type: "error",
            message: res.message,
            customClass: "dgg-tip-msg"
          });
          this.$nextTick(() => {
            this.showTaskMissonContent = false;
            this.taskDetailData.taskDetailVO.taskExplain = this.cloneTaskDetailVoTaskMisson;
          });
        }
      });
    },
    //任务统计接口 -- 最左侧数据显示
    statisticalTaskFn() {
      this.zysc_homeTask_list({ storeId: "123" }).then(res => {
        if (res.code == 200) {
          this.taskList = res.data ? res.data : [];
          if (res.data.length > 0) {
            if (this.checkedTaskCode) {
              this.taskListCodeFn(this.checkedTaskCode, "", "");
            } else {
              this.checkedTaskCode = res.data[0].taskStatusCode;
              this.taskListCodeFn(res.data[0].taskStatusCode, "", ""); // 查询中间 任务列表
            }
          }
        }
      });
    },
    // 左侧 任务分类点击
    searchTaskLsit(code) {
      this.taskpage = 1; //重置分页
      this.checkedTaskCode = code; // 选中点击的分类
      this.taskListCodeFn(code, "", ""); //搜索任务列表
      this.showChooseProductName = "全部";
      this.clearAllDetailData(); //清除公共详情数据
      this.checkedTaskListId = "";
      this.checkedProductId = ""; //清空选定下拉产品id
    },
    //任务列表--  中间数据显示
    taskListCodeFn(state, queryWord, productId, search) {
      // 如果是筛选的话，先情况数据再赋值
      if (search) {
        this.taskListData = [];
      }
      this.zysc_homeTask_c({
        storeId: "123", //商户ID
        queryWord: queryWord, // 搜索关键字
        headTaskItemCode: state, // 任务类型
        productId: productId, // 产品ID
        limit: this.taskLimit,
        start: this.taskpage
      }).then(res => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.taskListData = [...this.taskListData, ...res.data.records];
          });
          // this.$set(this, "taskListData", [
          //   ...this.taskListData,
          //   ...res.data.records
          // ]);

          if (res.data.records.length < this.taskLimit) {
            this.taskScrollPage = false; //滑动分页
          } else {
            this.taskScrollPage = true; //滑动分页
            this.taskpage++;
          }
          if (
            res.data.records.length > 0 &&
            Object.keys(this.taskDetailData).length < 1
          ) {
            //点击列表事件
            if (!this.checkedTaskListId) {
              this.checkedTaskListId = res.data.records[0].taskId;
              this.cloneClickLiskItem = res.data.records[0];
            }
            this.STOREID = res.data.records[0].storeId;
            this.chageTaskListId(); // 默认查询第一条数据的详情
          }
          if (res.data.total < 1) {
            this.$nextTick(() => {
              this.taskDetailData = {};
            });
          }
        } else {
          //不成功弹窗
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
          this.taskloading = false;
          this.taskScrollPage = false;
          this.taskpage = 1;
          this.taskListData = [];
        }
      });
    },
    //添加提醒
    addRemidItem(item) {
      this.task_add_reminder({
        zygsscId: this.defaultTaskDetailItem.taskDetailVO.zygsscId,
        taskId: this.defaultTaskDetailItem.taskDetailVO.taskId, //任务id
        remindConditionCode: this.defulutTimeKey, // 提醒条件字典编码
        remindConditionName: this.defulutTimeKey, // 提醒条件名字
        remindValueCode: item.split(":")[1], // 提醒值字典编码
        remindValueName: item.split(":")[0] // 提醒值名字
      }).then(res => {
        if (res.code == 200) {
          this.getTaskQueryInentory(); // 查询备注
          this.$notify({
            title: "提示",
            message: res.message,
            type: "success",
            customClass: "dgg-tip-msg"
          });
          this.clearDetailData(); //清除详情数据
          this.updateDeatailData(); //更新详情数据
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
          return;
        }
      });
    },
    //修改提醒
    changeRemidItem(item) {
      this.$nextTick(() => {
        this.ztsc_task_updtae_reminder({
          zygsscId: this.defaultTaskDetailItem.taskDetailVO.zygsscId,
          taskId: this.defaultTaskDetailItem.taskDetailVO.taskId, //任务id
          remindConditionCode: this.defulutTimeKey, // 提醒条件字典编码
          remindConditionName: this.defulutTimeKey, // 提醒条件名字
          remindId: item.id, // 提醒ID
          remindValueCode: item.reminderValue.split(":")[1], // 提醒值字典编码
          remindValueName: item.reminderValue.split(":")[0] // 提醒值名字
        }).then(res => {
          if (res.code == 200) {
            this.DetailQueryInventoryPage = 1;
            this.clearDetailData();
            this.getTaskQueryInentory(); // 查询备注信息
            this.$notify({
              title: "提示",
              message: res.message,
              type: "success",
              customClass: "dgg-tip-msg"
            });
            this.clearDetailData(); //清除详情数据
            this.updateDeatailData(); //更新详情数据
          } else {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
        });
      });
    },
    // 删除 任务提醒
    remindDelete(item) {
      this.$confirm("是否删除本条提醒时间？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.zysc_task_delete_reminder({
            remindId: item.id,
            taskId: this.defaultTaskDetailItem.taskDetailVO.taskId //任务id
          }).then(res => {
            if (res.code == 200) {
              this.DetailQueryInventoryPage = 1;
              this.clearDetailData(); // 清除相关数据
              this.getTaskQueryInentory(); // 查询备注
              this.$notify({
                title: "提示",
                type: "success",
                message: res.message,
                customClass: "dgg-tip-msg"
              });
              this.clearDetailData(); //清除详情数据
              this.updateDeatailData(); //更新详情数据
            } else {
              this.$notify({
                type: "error",
                message: res.message,
                customClass: "dgg-tip-msg"
              });
            }
          });
        })
        .catch({});
    },
    //添加备注接口、任务说明添加跟更改接口
    saveRemarksFn() {
      this.saveLodading = true;
      if (this.remarksTextArea && this.defaultTaskDetailItem) {
        this.task_detail_generate({
          zygsscId: this.taskDetailData.taskDetailVO.zygsscId, //专业生产ID -- 订单ID
          taskName: this.taskDetailData.taskDetailVO.taskName,
          taskId: this.checkedTaskListId, // 任务ID
          remarkContent: this.remarksTextArea // 内容
        })
          .then(res => {
            this.saveLodading = false;
            if (res.code == 200) {
              this.$notify({
                title: "提示",
                message: res.message,
                type: "success",
                customClass: "dgg-tip-msg"
              });

              this.remarksTextArea = ""; //清空任务说明
              //查询记录和备注信息
              this.DetailQueryInventoryPage = 1;
              this.recordListData = [];
              this.getTaskQueryInentory(); // 查询备注
            } else {
              this.$notify({
                message: res.message,
                type: "error",
                customClass: "dgg-tip-msg"
              });
              return;
            }
          })
          .catch(error => {});
      }
    },
    //查询记录和备注信息
    getTaskQueryInentory() {
      this.task_query_inventory({
        start: this.DetailQueryInventoryPage, //页数，默认为0
        limit: 20, //页数，默认为0
        taskId: this.checkedTaskListId, // 任务ID
        zygsscId: this.defaultTaskDetailItem.taskDetailVO.zygsscId // 订单ID
      }).then(res => {
        if (res.code == 200) {
          if (res.data.records.length < 20) {
            this.scrollQueryDataFlag = false;
            this.queryinfiniteScrollFalg = true;
          } else {
            this.scrollQueryDataFlag = true;
            this.queryinfiniteScrollFalg = false;
            this.DetailQueryInventoryPage++;
          }
          this.$nextTick(() => {
            this.recordListData = [...this.recordListData, ...res.data.records];
          });
        } else {
          this.DetailQueryInventoryPage = 1;
          this.scrollQueryDataFlag = false;
          this.queryinfiniteScrollFalg = true;
          this.recordListData = [];
        }
      });
    },
    //查询任务记录列表
    queryTaskRecordPageFn() {
      this.queryTaskRecordPage({
        start: this.DetailQueryInventoryPage, //页数，默认为0
        limit: 20, //页数，默认为0
        taskId: this.checkedTaskListId, // 任务ID
        zygsscId: this.taskDetailData.taskDetailVO.zygsscId // 订单ID
      }).then(res => {
        if (res.code == 200) {
          if (res.data.records.length < 20) {
            this.scrollQueryDataFlag = false;
            this.queryinfiniteScrollFalg = true;
          } else {
            this.scrollQueryDataFlag = true;
            this.queryinfiniteScrollFalg = false;
            this.DetailQueryInventoryPage++;
          }
          this.$nextTick(() => {
            this.recordListData = [...this.recordListData, ...res.data.records];
          });
        } else {
          this.DetailQueryInventoryPage = 1;
          this.scrollQueryDataFlag = false;
          this.queryinfiniteScrollFalg = true;
          this.recordListData = [];
        }
      });
    },
    //触底更新备注或记录
    dropdownDetailQueryInventory() {
      //下拉分页效果记录和备注
      if (this.scrollQueryDataFlag) {
        if (this.activeRadioData == 1) {
          this.getTaskQueryInentory(); // 查询备注
        } else {
          this.queryTaskRecordPageFn(); // 查询记录
        }
      }
    },
    // 备注/记录 切换
    changeRadioVal(data) {
      this.queryinfiniteScrollFalg = true;
      this.scrollQueryDataFlag = true;
      this.DetailQueryInventoryPage = 1;
      this.recordListData = [];
      this.activeRadioData = data;
      //1 代表备注  2代表记录
      if (data == 1) {
        this.getTaskQueryInentory();
      } else {
        this.queryTaskRecordPageFn();
      }
    },
    //----------------------------新增（修改） 结束
    //是否可以点击操作框
    isClickCheckStatus(item) {
      // 已完成任务
      if (item.taskSwitching == 1) {
        // 是否 质检任务：0 ：否， 1： 是
        if (item.isCheck == 1) {
          //待质检
          if (item.qalNspectionsStatus == "NODE_QUALITY_AWAIT") {
            return true;
          }
          if (item.qalNspectionsStatus == "NODE_QUALITY_REVIEW") {
            return true;
          }
          //质检已通过
          if (item.qalNspectionsStatus == "NODE_QUALITY_COMPLETE") {
            return true;
          }
          //质检驳回
          if (item.qalNspectionsStatus == "NODE_QUALITY_REFUSE") {
            return false;
          }
        } else {
          return false;
        }
      } else {
        //  暂停任务 不可以操作
        if (item.taskSwitchingCode == "QDS_ZYGSSC_TASKSTATUS_CODE3") {
          return true;
        } else {
          return false;
        }
      }
    },
    // 详情部分是否可以操作判断
    isClickDetails(item) {
      if (
        item.taskSwitchingCode == "QDS_ZYGSSC_TASKSTATUS_CODE7" ||
        item.taskSwitchingCode == "QDS_ZYGSSC_TASKSTATUS_CODE3" ||
        item.taskSwitching == 1
      ) {
        return true;
      }
    },
    //搜搜列表关键词查询
    searchTaskKeyWords() {
      this.$nextTick(() => {
        this.taskpage = 1;
        this.taskListData = [];
        // this.showChooseProductName = this.searchKey;
        this.taskListCodeFn(this.checkedTaskCode, this.searchKey, "", "search");
      });
    },
    //跳转到办理中订单详情
    toTranstionDetail(item, orderid) {
      if (item.userInProject == 0) {
        this.$notify({
          title: "提示",
          message: "您不是此项目成员！",
          type: "warning",
          customClass: "dgg-tip-msg"
        });
        return;
      }
      if (orderid) {
        this.zysc_get_production_order_details_data({
          id: orderid
        }).then(res => {
          if (res.code == 200) {
            if (item.stageId) {
              this.setTransactionStageId(item.stageId);
            }
            if (item.taskId) {
              this.setTransactionTaskId(item.taskId);
            }
            this.ruoterJump({
              name: "transactionTask",
              params: {
                title: `${res.data.customerName}-${res.data.scOrderNo}`
              }
            });
            this.setTransactionItem(res.data);
          }
        });
      }
    },
    //处理字符串长度
    GetLength(str) {
      ///<summary>获得字符串实际长度，中文2，英文1</summary>
      var realLength = 0,
        len = str.length,
        charCode = -1;
      for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
      }
      return realLength;
    },
    //任务下拉分页
    dropdownTaskPage() {
      if (this.taskScrollPage) {
        //任务订单列表
        this.taskListCodeFn(this.checkedTaskCode, "", "");
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
    // 查看文档 // 图片预览
    viewDocument(item, type) {
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
              this.$notify({
                title: "提示",
                message: "操作成功",
                type: "success",
                customClass: "dgg-tip-msg"
              });

              this.invalidDocumentRecords("", item); //添加作废记录
              this.searchFilesFn(); //请求详情附件列表
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
    //关闭文件上传模态框
    closeModal() {
      this.docModal = false;
      //请求详情附件列表
      this.searchFilesFn();
    },
    //更新详情数据
    updateDeatailData() {
      //点击列表事件
      this.chageTaskListId(this.defaultTaskDetailItem.taskDetailVO);
    },
    saveFormatRemarksTextArea(e) {
      this.remarksTextArea = e.replace(/(^\s*)|(\s*$)/g, "");
    },
    //获取搜索产品名称
    getProductVal(val) {
      this.productKeywordsVal = val;
      // 任务产品名称获取
      this.getSearch_product();
    },
    // 任务产品名称获取
    getSearch_product() {
      this.zysc_homeTask_getProduct({
        queryWord: this.XReqYT
        // queryWord:this.productKeywordsVal
      }).then(res => {
        if (res.code == 200 && res.data.length > 0) {
          let da = [{ productName: "全部", productId: "0" }];
          this.taskProductList = da.concat(res.data);
        } else {
          this.taskProductList = [{ productName: "全部", productId: "0" }];
        }
      });
    },
    //选中查询出来的产品名称
    chooseProductNameFn(item) {
      this.checkedProductId = item.productId;
      this.productCode = item.productName;
      this.showChooseProductName = item.productName;
      this.upAllPop = !this.upAllPop; //隐藏下拉框
      this.taskpage = 1;
      if (item.productName == "全部") {
        this.productCode = "";
        this.taskListCodeFn(this.checkedTaskCode, "", "", "search");
      } else {
        this.taskListCodeFn(this.checkedTaskCode, "", item.productId, "search");
      }
    },

    //点击列表事件（查询任务详情）
    chageTaskListId(item) {
      let taskId;
      // 点击任务列表的时候查询数据
      if (item) {
        this.STOREID = item.storeId;
        this.checkedTaskListId = item.taskId; // 点击的任务ID
        taskId = item.taskId;
      } else {
        // 进来默认查询数据
        taskId = this.checkedTaskListId;
      }

      this.clearDetailData(); //清除详情数据
      // this.clearNamePhone();//清空办理人手机号和姓名
      //调用详情数据
      this.zysc_homeTask_details({
        taskId: taskId
      }).then(res => {
        if (res.code == 200) {
          this.taskDetailData = res.data;
          this.$nextTick(() => {
            this.taskDetailData = res.data; // 详情数据赋值
            this.defaultTaskDetailItem = res.data;
            //查询详情成功赋值上传附件id
            this.DetailDocumentfileId = `ZYGSSC_${res.data.taskDetailVO.scOrderId}_TASK_${res.data.taskDetailVO.taskId}_TASK_ANNEX`;
            this.searchFilesFn(); //请求详情附件列表
            this.getTaskQueryInentory(); //查询记录和备注信息
          });
        } else {
          this.$nextTick(() => {
            this.taskDetailData = {};
          });
        }
      });
    },
    //清除公共详情数据
    clearAllDetailData() {
      this.checkedProductId = ""; //清空选中产品id
      this.productCode = ""; //清空选中的下拉产品名称
      this.searchKey = ""; //清空搜索关键字
      this.toTransactor = false; //关闭添加办理人弹窗
      this.thisCheckedStoreId = ""; //清空选中的办理人
      this.taskListData = [];
      this.taskDetailData = {};
      this.remarksTextArea = ""; //清空记录
      this.choosedTimeReminderTime = []; //清空处理好的时间提醒集合
      this.addReminderTime = ""; //清空选定的值
      this.showAddRemind = false; //显示添加按钮
      this.taskMissonContent = ""; //清空任务说明
      this.showTaskMissonContent = false; //隐藏修改任务说明
      this.DetailDocumentfileLists = []; //查询的详情附件列表
      this.DetailDocumentfileId = ""; //上传的附件ID
      this.taskDetailQueryType = 1;
      this.activeRadioData = "1";
      this.defaultTaskDetailItem = {};
      this.recordListData = [];
    },
    //清除详情数据
    clearDetailData() {
      this.toTransactor = false; //关闭添加办理人弹窗
      this.thisCheckedStoreId = ""; //清空选中的办理人
      this.taskDetailData = {};
      this.remarksTextArea = ""; //清空记录
      this.choosedTimeReminderTime = []; //清空处理好的时间提醒集合
      this.addReminderTime = ""; //清空选定的值
      this.showAddRemind = false; //显示添加按钮
      this.taskMissonContent = ""; //清空任务说明
      this.showTaskMissonContent = false; //隐藏修改任务说明
      this.DetailDocumentfileLists = []; //查询的详情附件列表
      this.DetailDocumentfileId = ""; //上传的附件ID
      this.taskDetailQueryType = 1;
      this.activeRadioData = "1";
      this.recordListData = [];
      this.DetailQueryInventoryPage = 1;
    },
    // 即将到期、已超期、我的待办、我分配的下面列表复选框---任务已完成、任务未完成、激活任务接口
    requestCompleteTaskService(item, num) {
      this.zysc_complete_task_service({
        isActive: num, //是否为激活任务 0：完成 1：激活
        isCheck: item.isCheck, // 是否为质检任务 0：否，1：是|
        isKeyTask: item.isKeyTask, //是否为关键任务 0：否 ，1：是
        stageId: item.stageId, // 阶段ID
        storeId: this.STOREID, // 店铺ID / 商户ID
        taskId: item.taskId, // 任务ID
        taskSwitchingCode: item.taskSwitchingCode, // 任务状态字典
        zygsscId: item.zygsscId // 专业公司生产ID
      }).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "提示",
            message: res.message,
            type: "success",
            customClass: "dgg-tip-msg"
          });
          this.$nextTick(() => {
            item.taskSwitching = num;

            this.taskListData = []; //清空任务列表数据
            this.taskpage = 1; //修改分页起始页数
            this.clearAllDetailData(); // 清空数据
            this.statisticalTaskFn(); //任务统计接口
            // this.taskListCodeFn(this.checkedTaskCode, "", "");
          });
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      });
    },
    // 点击复选框
    stateChange(item) {
      this.checkedTaskListId = item.taskId;
      this.cloneClickLiskItem = item;
      if (!(item.isCheck == 1) && !(item.taskSwitching == 1)) {
        // isKeyTask： 0， 1  taskSwitching：0，1
        this.$confirm("确认完成任务？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(res => {
            this.requestCompleteTaskService(item, 0);
          })
          .catch(error => {
            item.taskSwitching = 0;
          });
      }
      if (item.isCheck == 1 && !(item.taskSwitching == 1)) {
        this.$confirm(
          "该任务为关键任务，点击完成后将提交至后台进行质检，确认完成？",
          "提示",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(res => {
            this.requestCompleteTaskService(item, 0);
          })
          .catch(error => {
            item.taskSwitching = 0;
          });
      }
      if (item.taskSwitching == 1) {
        this.$confirm(
          "激活任务后，任务将重新显示为未完成状态，任务信息不改变，确认激活？",
          "提示",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(res => {
            this.requestCompleteTaskService(item, 1);
          })
          .catch(error => {
            item.taskSwitching = 1;
          });
      }
    },
    // 改变任务说明内容高度
    changeTaskExplainHight() {
      if (this.taskExplainHeight == "48px") {
        this.taskExplainHeight = "none";
        this.btnName = "收起";
        this.iconType = "icon_retract";
      } else {
        this.taskExplainHeight = "48px";
        this.btnName = "展开更多";
        this.iconType = "icon_extend";
      }
    },
    // 添加办理人选择框内tab切换
    changeStoreFlagUser(val) {
      this.storeFlagUser = val;
      //查询店铺信息
      this.requestStoreUser();
    },
    // 选择办理人弹框内的列表无限加载
    load() {
      return;
      this.count += 2;
    },
    // 添加办理人 图标点击
    addTransactor(event) {
      const evt = window.event || event;
      evt.preventDefault();
      evt.stopPropagation();
      this.toTransactor = !this.toTransactor; // 添加办理人弹窗
      //查询店铺信息
      this.requestStoreUser();
    },
    //查询店铺信息
    requestStoreUser() {
      this.get_store_user({
        storeId: this.STOREID, //店铺ID
        realName: this.thisStoreRealName, //用户姓名，只有flag为0时有效
        phone: this.thisStorePhone, //手机号
        flag: this.storeFlagUser, //0:获取本店铺的用户 1：获取店铺外的店铺
        isCertification: 1,
        currentStatus: "EMPLOYEE_STATUS_1"
      })
        .then(res => {
          if (res.code == 200) {
            this.transactorData = res.data;
          }
        })
        .catch(error => {});
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
    //清空办理人手机号和姓名
    clearNamePhone() {
      this.thisStoreRealName = "";
      this.thisStorePhone = "";
    },
    //关闭办理人店铺筛选
    closeStoreProp() {
      this.toTransactor = false;
      this.storeFlagUser = 0; //改变为本店店铺
      this.thisCheckedStoreId = ""; //清空选定办理人id

      //清空办理人手机号和姓名
      this.clearNamePhone();
    },
    //选定办理人Id
    chooseStoreDataFn(item) {
      this.thisCheckedStoreId = item.userId;
      this.$nextTick(() => {
        //添加办理人
        this.zysc_manageTaskHandler_operation({
          isDelete: 0, // 是否删除 （0：否， 1：是
          memberId: item.userId, //成员ID
          memberName: item.realName, // 成员名字
          taskId: this.defaultTaskDetailItem.taskDetailVO.taskId, //任务ID
          zygsscId: this.defaultTaskDetailItem.taskDetailVO.zygsscId // 专业公司生产ID
        }).then(res => {
          if (res.code == 200) {
            this.$notify({
              title: "提示",
              message: res.message,
              type: "success",
              customClass: "dgg-tip-msg"
            });
            this.$nextTick(() => {
              this.taskpage = 1;
              this.taskListData = [];
              //更新任务列表
              this.taskListCodeFn(this.checkedTaskCode, "", "");
              //更新详情数据
              this.chageTaskListId(this.checkedTaskListId);

              //即将到期、已超期、我的待办、我分配的下面列表复选框---任务已完成、任务未完成、激活任务接口
              if (
                this.checkedTaskCode == this.taskStatusCodes.TOTAL_TASK ||
                this.checkedTaskCode == this.taskStatusCodes.MY_DISTRIBUTION
              ) {
                this.checkedTaskListId = this.cloneClickLiskItem.taskId;
              } else {
                this.checkedTaskListId = "";
              }
              let statenum = 1;
              if (this.cloneClickLiskItem.taskSwitching == 1) {
                statenum = 0;
              } else {
                statenum = 1;
              }
              // this.requestCompleteTaskService(
              //   this.cloneClickLiskItem,
              //   statenum
              // );
            });
          } else {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
        });
      });
    },
    //办理人删除
    deleteTransacTorPeople() {
      this.zysc_manageTaskHandler_operation({
        isDelete: 1, // 是否删除 （0：否， 1：是
        memberId: this.defaultTaskDetailItem.taskDetailVO.taskManagerId, //办理人id
        memberName: this.defaultTaskDetailItem.taskDetailVO.taskManagerName, //办理人
        taskId: this.defaultTaskDetailItem.taskDetailVO.taskId, //任务ID
        zygsscId: this.defaultTaskDetailItem.taskDetailVO.zygsscId // 专业公司生产ID
      }).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "提示",
            message: res.message,
            type: "success",
            customClass: "dgg-tip-msg"
          });
          this.$nextTick(() => {
            this.taskpage = 1;
            this.taskListData = [];
            //更新任务列表
            this.taskListCodeFn(this.checkedTaskCode, "", "");
            //更新详情数据
            this.chageTaskListId(this.checkedTaskListId);

            //即将到期、已超期、我的待办、我分配的下面列表复选框---任务已完成、任务未完成、激活任务接口
            if (
              this.checkedTaskCode == this.taskStatusCodes.TOTAL_TASK ||
              this.checkedTaskCode == this.taskStatusCodes.MY_DISTRIBUTION
            ) {
              this.checkedTaskListId = this.cloneClickLiskItem.taskId;
            } else {
              this.checkedTaskListId = "";
            }
            let statenum = 1;
            if (this.cloneClickLiskItem.taskSwitching == 1) {
              statenum = 0;
            } else {
              statenum = 1;
            }
            // this.requestCompleteTaskService(this.cloneClickLiskItem, statenum);
          });
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      });
    },
    // 点全部的下拉
    toAllData(event) {
      const evt = window.event || event;
      evt.preventDefault();
      evt.stopPropagation();
      if (this.taskProductList.length > 0) {
        this.upAllPop = !this.upAllPop;
      }
    },
    Clickoutside() {
      this.upAllPop = false;
    },
    fileLoadError() {
      this.fileLoading = false;
    },
    async docModalAffirm() {
      this.fileLoading = true;
      await this.$refs["uploadDoc"].$refs["upload-inner"].manualUpload(() => {
        this.docModal = false;
        this.fileLoading = false;
        this.searchFilesFn();
      });
    },
    async onSuccess(res, file) {
      if (this.defaultTaskDetailItem.taskDetailVO) {
        let _parmas = {
          code: "ZYGSSC_TASK_RECORD_OPT_5",
          id: this.defaultTaskDetailItem.taskDetailVO.zygsscId, //生产单id
          name: file.name, //文件名称
          taskId: this.defaultTaskDetailItem.taskDetailVO.taskId // 任务ID
        };
        await this.genera_tetemplate(_parmas);
        this.getTaskQueryInentory(); // 查询记录
      }
    },
    //作废添加记录
    async invalidDocumentRecords(res, itemfile) {
      if (this.defaultTaskDetailItem.taskDetailVO) {
        let _parmas = {
          code: "ZYGSSC_TASK_RECORD_OPT_25",
          id: this.defaultTaskDetailItem.taskDetailVO.zygsscId, //生产单id
          name: itemfile.filename, //文件名称
          taskId: this.defaultTaskDetailItem.taskDetailVO.taskId // 任务ID
        };
        await this.genera_tetemplate(_parmas);
        this.getTaskQueryInentory(); // 查询记录
      }
    }
  }
};
</script>
<style lang="less">
.startPage {
  .task-page-keep {
    height: calc(100% - 124px);
  }

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

  .transaction-document-head {
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

  .transaction-document-body {
    display: flex;
    height: 600px;

    .transaction-document-body-left {
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

    .transaction-document-body-right {
      flex: 1;
      height: 100%;

      .el-table td,
      .el-table th {
        padding: 0 6px;
      }
    }

    .transaction-document-item {
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

    .transaction-document-item:hover {
      background: #f2f4f7;
      color: #10bbb8;

      .transaction-document-icon {
        color: #10bbb8;
      }
    }

    .activeItem {
      background: #f2f4f7;
      color: #10bbb8;

      .transaction-document-icon {
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
</style>
<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件

.task {
  background-color: #fff;
  width: 100%;
  height: 100%;
  height: 100%;
  padding: 0;
  border-radius: 6px;

  .dgg-no-task {
    height: 100%;
  }

  .dgg-task-warp {
    overflow: hidden;
    height: 100%;
    flex-wrap: nowrap;
    text-align: center;
    position: relative;

    .add-stage {
      height: 38px;
      line-height: 38px;
      overflow: hidden;
      word-break: break-all;
      word-wrap: break-word;
      border-top: 1px solid #edeff0;

      .brabBill-button {
        border: 0;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        -webkit-transition: all 0.35s;
        transition: all 0.35s;
      }
    }

    .dgg-stage {
      position: absolute;
      flex-shrink: 0;
      width: 250px;
      height: 100%;

      border-right: 1px solid #edeff0;

      .stage-content {
        height: 100%;
        overflow-y: auto;
        padding: 8px;

        .stage-lists {
          .current-stage {
            width: 100%;
            height: 44px;
            line-height: 44px;
            text-align: left;
            padding: 0 20px;
            font-size: 14px;
            margin: 0 0 8px;
            cursor: pointer;

            &.active-stage {
              background-color: #f5f7fa;

              label {
                color: #10bbb8;
              }

              span {
                color: #10bbb8;
              }
            }

            label {
              color: #19233c;
              font-weight: 400;
            }

            span {
              color: #9398a1;
            }
          }
        }

        .current-stage:hover,
        .this-stage {
          background: #f5f7fa;
        }
      }
    }

    .dgg-task {
      position: absolute;
      left: 250px;
      height: 100%;
      box-sizing: border-box;
      flex-shrink: 0;
      width: 300px;
      border-right: 1px solid #edeff0;

      .dgg-order-search {
        border: none;
        height: 60px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #edeff0;

        /deep/ .el-input__inner {
          background: none;
          border: 1px solid #e3e4e6;
          height: 30px;
          line-height: 30px;
          cursor: pointer;

          &:hover {
            border-color: #10bbb8;
          }

          &:focus {
            border-color: #10bbb8;
          }
        }
      }

      .task-content {
        height: calc(100% - 104px);
        overflow-y: auto;
        position: relative;

        .task-lists {
          height: 100%;

          .current-list {
            box-sizing: border-box;
            width: 100%;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            height: 80px;
            overflow: hidden;
            border-bottom: 1px solid #edeff0;
            padding: 8px 0;

            &.active-current-list {
              .content {
                background-color: #f0f2f5;
              }
            }

            &:hover {
              .content {
                background-color: #f0f2f5;
              }
            }

            .content {
              width: 100%;
              height: 100%;
              padding: 0 22px;
              overflow: hidden;
              word-break: break-all;
              word-wrap: break-word;
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: nowrap;
              .top-title {
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: center;
                overflow: hidden;
                cursor: pointer;

                .list-group {
                  flex: 1;
                  display: flex;
                  flex-wrap: nowrap;
                  justify-content: center;
                  align-items: center;
                  height: 20px;

                  /deep/ .el-checkbox {
                    flex-shrink: 0;
                    margin-right: 10px;
                    margin-top: -5px;

                    .el-checkbox__input {
                      vertical-align: middle;
                      margin-top: 0;
                    }
                  }

                  .list-title {
                    flex: 1;
                    margin-left: 23px;
                    overflow: hidden;
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    height: 20px;

                    /deep/ .el-tag {
                      height: 18px;
                      border-radius: 10px;
                      font-size: 12px;
                      line-height: 16px;
                      font-weight: 400;
                      background-color: transparent;
                      margin-right: 5px;
                      flex-shrink: 0;
                      max-width: 70px;
                      text-align: center;
                      .dgg-text-ellip;

                      &.due-tag {
                        color: #fd8e26;
                        border-color: #fd8e26;
                      }

                      &.overdue-tag {
                        color: #f10940;
                        border-color: #f10940;
                      }
                    }

                    & > h6 {
                      height: 100%;
                      text-align: left;
                      font-weight: 550;
                      color: #19233c;
                      line-height: 20px;
                      .dgg-text-ellip;
                      font-size: 14px;

                      &.deleteLine {
                        text-decoration: line-through;
                        color: #9398a1;
                      }
                    }

                    & > .dgg-icon {
                      margin-left: 4px;
                      flex-shrink: 0;
                    }
                  }
                }

                .list-des {
                  text-indent: 24px;
                  font-size: 13px;
                  color: #9398a1;
                  line-height: 18px;
                  margin-top: 7px;
                  text-align: left;
                  .dgg-text-ellip;
                }
              }

              .headimg {
                flex-shrink: 0;
                width: 27px;
                height: 27px;
                border-radius: 50%;
              }
            }
          }
        }
      }

      .all-btn {
        width: 100%;
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        color: #19233c;
        border-bottom: 1px solid #edeff0;
        cursor: pointer;

        &:hover {
          color: #10bbb8;

          .dgg-icon {
            color: #10bbb8;
          }
        }

        .all-arrow {
          color: #666873;
          vertical-align: middle;
          margin-left: 5px;
        }
      }
    }

    .dgg-details {
      float: right;
      height: 100%;
      flex-shrink: 0;
      width: 630px;
      border-right: 1px solid #edeff0;
      position: relative;

      .detail-oder-code {
        width: 100%;
        padding: 0 30px;
        border-bottom: 1px solid #edeff0;
        height: 60px;
        line-height: 60px;
        text-align: left;

        label {
          font-size: 14px;
          color: #666873;
          padding-right: 55px;
          display: inline-block;
          max-width: 300px;

          &:last-child {
            max-width: 300px;
            padding-right: 0;
          }

          .dgg-text-ellip;

          span {
            color: #10bbb8;
            cursor: pointer;
          }

          b {
            font-weight: 400;
            color: #000;
          }
        }
      }

      .detail-content {
        text-align: left;
        position: relative;
        overflow-y: auto;
        height: calc(100% - 60px);

        .user-info {
          height: 90px;
          border-bottom: 1px solid #edeff0;
          overflow: hidden;
          padding: 18px 12px 0 21px;

          .name {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;

            & > h6 {
              flex: 1;
              .dgg-text-ellip;
              text-align: left;
              font-size: 16px;
              font-weight: 550;
              color: #19233c;
              line-height: 22px;
            }

            & > span {
              flex-shrink: 0;
              font-size: 0;

              .dgg-icon {
                cursor: pointer;

                &:last-child {
                  margin-left: 10px;
                }
              }
            }
          }

          .date {
            display: flex;
            flex-wrap: nowrap;
            margin-top: 12px;
            font-size: 14px;
            font-weight: 400;
            color: #666873;
            line-height: 20px;

            & > p {
              .dgg-text-ellip;
              max-width: calc(100% - 220px);
            }

            & > span {
              .dgg-text-ellip;
              max-width: 220px;
              flex-shrink: 0;
              margin-left: 27px;
            }
          }
        }

        .transactor {
          height: 40px;
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          padding: 0 30px;
          margin-bottom: 4px;
          position: relative;

          &.transactor-people {
            margin-top: 10px;

            & > .dgg-icon {
              &:last-child {
                cursor: pointer;
              }

              &.dgg-not-allowed {
                cursor: not-allowed;
              }
            }

            .show-transactor-people {
              display: inline-block;
              width: 26px;
              height: 26px;
              position: relative;
              font-size: 0;

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
                top: -2px;
                right: -8px;
                cursor: pointer;
              }
            }
          }

          .addTransactor {
            color: #c8cfdb;
          }

          .addTransactor:hover {
            color: #dae0eb;
          }

          .remind-form {
            padding: 0 10px 0 30px;
            width: 280px;
          }

          .transactor-type {
            display: inline-block;
            margin-left: 13px;
            width: 100px;
            color: #666873;
            font-size: 14px;

            &.task-misson-statement:hover {
              cursor: pointer;
              color: #10bbb8;
            }

            .dgg-text-ellip;
          }

          & > .dgg-button {
            padding: 7px 0;
            border-color: transparent;

            &.is-disabled {
              background-color: transparent;
            }
          }
        }

        // 添加任务说明
        .add-transactor {
          padding: 0 30px;

          .remarksTextArea {
            /deep/.el-textarea__inner {
              min-height: 80px !important;
              word-break: break-all;
              word-wrap: break-word;
            }
          }
        }

        .transactor-remind {
          margin: -10px 0 10px;

          .remindDelete {
            cursor: pointer;
          }
        }

        .task-explain-text {
          text-align: center;

          .explain-content {
            text-align: left;
            padding: 0 20px 0 60px;
            overflow: hidden;
            word-break: break-all;
            word-wrap: break-word;
            color: #9398a1;
            font-size: 14px;
          }

          .dgg-button {
            margin-top: 12px;
            border-color: transparent;
            color: #666873;

            &:hover {
              color: #10bbb8;
            }

            /deep/ .dgg-icon {
              float: right;
              margin-left: 4px;
            }
          }
        }

        .remarks {
          border-top: 1px solid #edeff0;
          padding: 10px 30px 30px;

          .transactor {
            padding: 0;

            .dgg-icon {
              color: #666873;
            }
          }

          /deep/ .dgg-radio-group {
            height: 20px;
            line-height: 20px;
            overflow: hidden;
            margin-top: 30px;

            .el-radio-button {
              width: auto;
            }

            .el-radio-button__inner {
              background-color: transparent;
              height: 20px;
              line-height: 20px;
              font-size: 14px;
              padding: 0;
              border: 0;
              width: 30px;
              text-align: center;
              font-weight: 400;
              color: #666873;

              &:hover {
                color: #10bbb8;
              }
            }

            .el-radio-button__orig-radio:checked + .el-radio-button__inner {
              box-shadow: none !important;
              color: #10bbb8;
            }
          }

          .remarksTextArea {
            /deep/ .el-textarea__inner {
              min-height: 80px !important;
            }
          }

          .sava-remarks {
            margin-top: 12px;
            background-color: #88dedc;
            border-color: #88dedc;
            color: #fff;
            font-size: 12px;

            &.active-save-remarks {
              background-color: #10bbb8;
              border-color: #10bbb8;
            }
          }

          .record-lists {
            padding-top: 30px;

            .current-list {
              display: flex;
              flex-wrap: nowrap;
              padding-bottom: 28px;

              .headimg {
                width: 27px;
                height: 27px;
                border-radius: 50%;
                flex-shrink: 0;
                margin-right: 14px;
              }

              .content {
                flex: 1;
                .name-date {
                  display: flex;
                  align-items: center;
                  color: #19233c;
                  font-size: 14px;
                  font-weight: 400;
                  line-height: 20px;

                  span {
                    &.name {
                      .dgg-text-ellip;
                    }

                    &.date {
                      font-size: 13px;
                      color: #9398a1;
                      // max-width: 125px;
                      flex-shrink: 0;
                      margin-left: 8px;
                    }
                  }
                }

                .desc {
                  font-size: 14px;
                  font-weight: 400;
                  color: #666873;
                  line-height: 20px;
                  margin-top: 10px;
                  word-break: break-all;
                  word-wrap: break-word;
                }
              }
            }
          }

          .no-remarks {
            font-size: 13px;
            font-weight: 400;
            color: #9398a1;
            line-height: 18px;
            .dgg-text-ellip;
            text-align: center;
            margin-top: 20px;
          }
        }
      }

      .transactor-pop {
        width: 314px;
        height: 343px;
        background: #fff;
        box-shadow: 0px 2px 19px 5px rgba(218, 221, 230, 1);
        border-radius: 4px;
        position: absolute;
        right: 145px;
        top: 195px;
        z-index: 55;

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

        .tab-content {
          padding-bottom: 20px;
        }

        .infinite-list {
          padding: 0 15px;
          max-height: 245px;

          > li {
            cursor: pointer;
            width: 100%;
            font-size: 14px;
            color: #19233c;
            line-height: 20px;
            margin: 0 0 20px;

            span:first-child {
              padding-right: 80px;
            }
          }
        }
      }

      /deep/ .brabBill-button2:focus,
      /deep/ .brabBill-button2:hover {
        /*  border-color: #e7f7f7;
        background-color: #e7f7f7;
        width: 70px; */
      }
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
  -ms-transform: rotate(-30deg);
  /* IE 9 */
  -moz-transform: rotate(-30deg);
  /* Firefox */
  -webkit-transform: rotate(-30deg);
  /* Safari 和 Chrome */
  -o-transform: rotate(-30deg);
  /* Opera */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px;
  overflow: hidden;

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

          &.braBill-button-disabled {
            cursor: not-allowed;
          }

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

//修改截止时间值
/deep/.chage-deadline-time {
  width: 160px;
  cursor: pointer;

  .el-date-editor {
    width: 100%;
    cursor: pointer;
  }

  .el-input__prefix {
    display: none;
    z-index: -1 !important;
  }

  .el-input__prefix {
    display: none;
    z-index: -1 !important;
  }

  .el-input__inner {
    cursor: pointer;
    padding-left: 0;
    padding-right: 0;
    width: 100%;
    border: 0;
    position: relative;
  }

  .el-input.is-disabled .el-input__inner {
    background-color: transparent;
    cursor: not-allowed;
  }
}
</style>
