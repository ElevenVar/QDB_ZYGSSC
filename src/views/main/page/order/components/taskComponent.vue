<template>
  <!-- 任务详情页面 -->
  <div class="taskComponent common-right-svg-icon">
    <div class="dgg-order-search">
      <div class="search-box">
        <dgg-input
          v-model="searchKey"
          style="width:270px;"
          class="search-input"
          placeholder="请输入关键词搜索"
          :maxlength="30"
          onkeyup="if(value.length>30)value=value.slice(0,30)"
          @input="
            isClickTemplate(transactionItem) &&
              queryTemplateView &&
              selectStageTask(searchKey)
          "
          @clear="
            chooseStateId = '';
            chooseTaskListId = '';
            commonStageListService();
          "
          clearable
        >
          <dgg-icon slot="prefix" icon-class="dgg-search" />
        </dgg-input>
      </div>
      <ul
        class="admin-select-keywords"
        v-if="stageTaskListData.length > 0"
        v-Clickoutside="stageClickoutSide"
      >
        <li
          v-for="(item, index) in stageTaskListData"
          :key="index"
          @click="chooseStageTaskId(item)"
        >
          {{ item.stageName }}{{ item.taskName ? "-" + item.taskName : "" }}
        </li>
      </ul>
    </div>
    <div class="dgg-task-warp" v-if="queryTemplateView">
      <!-- 判断退单或者已完结添加class hidden-add-stage -->
      <div
        :class="[
          'dgg-stage',
          {
            'hidden-dgg-stage': !(
              !getOrderStatusSealName() && $route.name == 'transactionTask'
            )
          }
        ]"
      >
        <!-- 阶段版块、以及无阶段占位图 -->
        <div class="stage-content" v-loading="addLoading">
          <ul class="stage-lists" v-if="stageArray.length > 0">
            <li
              v-for="(item, index) in stageArray"
              :key="index"
              class="current-stage"
              :class="{
                chooseIdActive: item.stageId == chooseStateId
              }"
              @click.stop="changeTaskListsData(item)"
            >
              <div class="detail">
                <p>
                  <span>
                    <dgg-tooltip
                      :value="showTips"
                      :popper-options="popperOptions"
                      class="msg-dot"
                      placement="top"
                      effect="dark"
                      :content="item.stageName"
                      :disabled="item.stageName.length <= 6"
                    >
                      <span>{{ item.stageName }}</span>
                    </dgg-tooltip>
                    <label style="color:#9398A1;"
                      >&nbsp;
                      {{
                        item.tasksCompletedStemp ? item.tasksCompletedStemp : 0
                      }}/{{ item.tasksCompleted }}</label
                    >
                  </span>
                </p>
              </div>
            </li>
          </ul>

          <taskBitMap
            v-if="stageArray.length < 1"
            synopsis="暂无阶段"
            svg-class="icon_nostage"
            svg-width="58px"
            svg-height="41px"
          />
        </div>
      </div>

      <!-- 任务版块、以及无任务占位图、判断退单或者已完结添加class hidden-dgg-task -->
      <div
        :class="[
          'dgg-task',
          {
            'hidden-dgg-task': !(
              !getOrderStatusSealName() && $route.name == 'transactionTask'
            )
          }
        ]"
      >
        <div class="task-content" v-loading="addLoading">
          <dgg-row class="task-lists" v-if="taskArray.length > 0">
            <dgg-col
              :span="24"
              class="current-list"
              :class="{ taskIdActive: taskItem.taskId == chooseTaskListId }"
              v-for="(taskItem, taskIndex) in taskArray"
              :key="taskIndex"
            >
              <div class="content">
                <dgg-tooltip
                  :value="showTips"
                  :popper-options="popperOptions"
                  :content="
                    taskItem.taskSwitching == 1 ? '激活任务' : '完成任务'
                  "
                  placement="top"
                  class="msg-dot"
                  effect="dark"
                  :disabled="
                    isClickCheckStatus(taskItem) || isPauseOrOpen(taskItem)
                  "
                >
                  <dgg-checkbox
                    class="list-checkbox"
                    v-model="taskItem.taskSwitching == 1"
                    :checked="taskItem.taskSwitching == 1"
                    @change="stateChange(taskItem)"
                    :disabled="
                      isClickCheckStatus(taskItem) || isPauseOrOpen(taskItem)
                    "
                  />
                </dgg-tooltip>

                <div
                  class="task-list-warp"
                  @click="selectDetailData(taskItem.taskId)"
                >
                  <div class="top-title">
                    <div class="list-group">
                      <!--<dgg-tooltip
                        :value="showTips"
                        :popper-options="popperOptions"
                        :content="
                          taskItem.taskSwitching == 1 ? '激活任务' : '完成任务'
                        "
                        placement="top"
                        class="msg-dot"
                        effect="dark"
                        :disabled="
                          isClickCheckStatus(taskItem) ||
                            isPauseOrOpen(taskItem)
                        "
                      >
                        <dgg-checkbox
                          class="list-checkbox"
                          v-model="taskItem.taskSwitching == 1"
                          :checked="taskItem.taskSwitching == 1"
                          @change="stateChange(taskItem)"
                          :disabled="
                            isClickCheckStatus(taskItem) ||
                              isPauseOrOpen(taskItem)
                          "
                        />
                      </dgg-tooltip>
                      -->
                      <div class="list-title">
                        <dgg-tag
                          class="due-tag"
                          v-if="
                            !(taskItem.taskSwitching == 1) &&
                              taskItem.aboutExpire == 1
                          "
                          >即将到期</dgg-tag
                        >
                        <dgg-tag
                          class="overdue-tag"
                          v-if="
                            !(taskItem.taskSwitching == 1) &&
                              taskItem.taskOverTime == 1
                          "
                          >已超期</dgg-tag
                        >
                        <dgg-tag
                          class="due-tag"
                          v-if="
                            !(taskItem.taskSwitching == 1) &&
                              taskItem.suspend == 1
                          "
                          >已暂停</dgg-tag
                        >
                        <h6
                          :class="{
                            deleteLine: taskItem.taskSwitching == 1,
                            disabledEl:
                              isClickCheckStatus(taskItem) ||
                              isPauseOrOpen(taskItem)
                          }"
                        >
                          {{ taskItem.taskName }}
                        </h6>

                        <dgg-tooltip
                          :value="showTips"
                          :popper-options="popperOptions"
                          placement="top"
                          class="msg-dot ml-20"
                          effect="dark"
                          content="关键任务"
                          v-if="taskItem.isKeyTask == 1"
                        >
                          <dgg-icon
                            icon-class="icon_star"
                            svg-width="14px"
                            svg-height="14px"
                          />
                        </dgg-tooltip>
                      </div>
                    </div>
                    <!-- isCheck//是否质检任务 0否 1是 是质检才显示 -->
                    <p class="list-des" v-if="taskItem.isCheck == 1">
                      状态：{{ taskItem.qalNspectionsStatusName }}
                    </p>
                    <p class="list-des" v-else>
                      状态：{{ taskItem.taskSwitchingName }}
                    </p>
                  </div>

                  <dgg-tooltip
                    :value="showTips"
                    :popper-options="popperOptions"
                    :content="taskItem.taskManager"
                    placement="top"
                    class="msg-dot ml-20"
                    effect="dark"
                    v-if="taskItem.addressHandlerPicture"
                  >
                    <img
                      :src="taskItem.addressHandlerPicture"
                      alt=""
                      :onerror="errorDefaultImg"
                      class="headimg"
                    />
                  </dgg-tooltip>
                </div>
              </div>
            </dgg-col>
          </dgg-row>

          <taskBitMap
            v-if="taskArray.length < 1"
            :show-btn="false"
            synopsis="暂无任务"
            btn-name="暂无阶段"
          />
        </div>
      </div>
      <!--任务详情版块大版块-->
      <div class="dgg-details" v-loading="addLoading">
        <div
          class="detail-content"
          v-if="Object.keys(taskDetailVo).length > 0 && taskArray.length > 0"
          v-infinite-scroll="dropdownDetailQueryInventory"
          :infinite-scroll-disabled="queryinfiniteScrollFalg"
        >
          <!--完成人模块-->
          <div class="user-info">
            <div class="name">
              <h6>
                {{ taskDetailVo.taskName }}
              </h6>
              <!-- 是否自己添加0否 1是 为1才可以操作 -->
            </div>
            <div class="date">
              <p>
                完成人:{{
                  taskDetailVo.endPersonName ? taskDetailVo.endPersonName : "--"
                }}
              </p>

              <span v-if="taskDetailVo.endTime"
                >完成时间:{{ taskDetailVo.endTime | filteTime }}</span
              >
              <span v-else>完成时间:--</span>
            </div>
            <dgg-button
              class="await-btn"
              @click="
                clickPuseFn(
                  formatTaskSwitchingType(taskDetailVo.taskSwitchingCode)
                )
              "
              v-if="
                !getOrderStatusSealName() &&
                  !isClickCheckStatus(taskDetailVo) &&
                  taskDetailVo.taskSwitchingCode !==
                    'QDS_ZYGSSC_TASKSTATUS_CODE7'
              "
              >{{ formatTaskSwitchingName(taskDetailVo.taskSwitchingCode) }}
            </dgg-button>
          </div>
          <!--办理人模块-->
          <div class="transactor transactor-people">
            <dgg-icon
              icon-class="icon_transactor"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type">办理人</span>

            <span
              class="show-transactor-people"
              v-if="taskDetailVo.taskManagerName"
            >
              <img
                :src="
                  taskDetailVo.addressHandlerPicture
                    ? taskDetailVo.addressHandlerPicture
                    : taskTransactorImg
                "
                alt=""
                :onerror="errorDefaultImg"
              />
              <dgg-icon
                icon-class="dgg_delete"
                svgWidth="14px"
                svgHeight="14px"
                @click="deleteTransacTorPeople"
                v-if="
                  taskDetailVo.isCurrenUser == 0 &&
                    !isClickCheckStatus(taskDetailVo) &&
                    !isPauseOrOpen(taskDetailVo) &&
                    taskDetailVo.taskSwitchingCode !==
                      'QDS_ZYGSSC_TASKSTATUS_CODE7'
                "
              />
            </span>
            <dgg-icon
              icon-class="dgg_add"
              svg-width="18px"
              svg-height="18px"
              class="addTransactor"
              :class="{
                'dgg-not-allowed':
                  isClickCheckStatus(taskDetailVo) ||
                  isPauseOrOpen(taskDetailVo) ||
                  taskDetailVo.taskSwitchingCode ==
                    'QDS_ZYGSSC_TASKSTATUS_CODE7'
              }"
              v-if="!taskDetailVo.taskManagerName"
              @click="
                taskDetailVo.isCurrenUser == 0 &&
                  !isClickCheckStatus(taskDetailVo) &&
                  !isPauseOrOpen(taskDetailVo) &&
                  taskDetailVo.taskSwitchingCode !==
                    'QDS_ZYGSSC_TASKSTATUS_CODE7' &&
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
          <!--开始时间模块-->
          <div class="transactor ">
            <dgg-icon
              icon-class="icon_deadline"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type">开始时间</span>
            <span class="format-end-time">
              <template v-if="taskDetailVo.beginTime">{{
                taskDetailVo.beginTime | filteTime
              }}</template>
              <template v-else>--</template>
            </span>
          </div>
          <!--截止时间模块-->
          <div class="transactor ">
            <dgg-icon
              icon-class="icon_deadline"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type">截止时间</span>
            <span class="format-end-time">
              <template v-if="taskDetailVo.deadLine">{{
                taskDetailVo.deadLine | filteTime
              }}</template>
              <template v-else>--</template>
            </span>
          </div>

          <!--添加提醒模块-->
          <div class="transactor">
            <dgg-icon
              icon-class="icon_remind"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type">提醒</span>
            <dgg-button
              :dgg-icon="
                isClickCheckStatus(taskDetailVo) ||
                isPauseOrOpen(taskDetailVo) ||
                taskDetailVo.taskSwitchingCode == 'QDS_ZYGSSC_TASKSTATUS_CODE7'
                  ? 'dgg-plus'
                  : 'icon_plus2'
              "
              class="brabBill-button brabBill-button2"
              @click="showAddRemind = !showAddRemind"
              :disabled="
                isClickCheckStatus(taskDetailVo) ||
                  isPauseOrOpen(taskDetailVo) ||
                  taskDetailVo.taskSwitchingCode ==
                    'QDS_ZYGSSC_TASKSTATUS_CODE7'
              "
              >添加
            </dgg-button>
          </div>

          <template>
            <div
              v-for="(item, index) in taskDetailVo.taskRemindList"
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
                      :disabled="
                        isClickCheckStatus(taskDetailVo) ||
                          isPauseOrOpen(taskDetailVo) ||
                          taskDetailVo.taskSwitchingCode ==
                            'QDS_ZYGSSC_TASKSTATUS_CODE7'
                      "
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
                v-if="
                  !isClickCheckStatus(taskDetailVo) &&
                    !isPauseOrOpen(taskDetailVo) &&
                    taskDetailVo.taskSwitchingCode !==
                      'QDS_ZYGSSC_TASKSTATUS_CODE7'
                "
              />
            </div>
          </template>

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

          <!-- 任务说明版块 -->
          <div class="transactor ">
            <dgg-icon
              icon-class="icon_explain"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type task-misson-statement">任务说明 </span>
            <dgg-button
              dgg-icon="icon_edit1"
              class="brabBill-button  brabBill-button2"
              @click="showTaskMissonContentView(taskDetailVo.taskExplain)"
              :disabled="
                isClickCheckStatus(taskDetailVo) ||
                  isPauseOrOpen(taskDetailVo) ||
                  taskDetailVo.taskSwitchingCode ==
                    'QDS_ZYGSSC_TASKSTATUS_CODE7'
              "
              >编辑
            </dgg-button>
          </div>
          <div
            class="add-transactor add-task-misson"
            v-if="showTaskMissonContent"
          >
            <dgg-input
              v-model="taskMissonContent"
              type="textarea"
              class="remarksTextArea"
              placeholder="请输入任务描述"
              :autosize="{ minRows: 2, maxRows: 15 }"
              maxlength="1000"
              ref="editTaskMissonContentVal"
              oninput="if(value.length>1000)value=value.slice(0,1000)"
              @keyup.enter.native="$event.target.blur"
              @blur="addtaskKewordsVal(taskMissonContent)"
            />
          </div>
          <div
            class="task-explain-text"
            v-if="taskDetailVo.taskExplain && !showTaskMissonContent"
          >
            <div
              :style="{ 'max-height': taskExplainHeight }"
              class="explain-content"
              v-text="taskDetailVo.taskExplain ? taskDetailVo.taskExplain : ''"
            />
            <dgg-button
              :dgg-icon="iconType"
              el-icon--right
              v-if="GetLength(taskDetailVo.taskExplain) > 140"
              class="brabBill-button"
              @click="changeTaskExplainHight"
              >{{ btnName }}
            </dgg-button>
          </div>
          <!--附件版块-->
          <div class="transactor ">
            <dgg-icon
              icon-class="icon_enclosure"
              svg-width="16px"
              svg-height="16px"
            />
            <span class="transactor-type">附件</span>
            <dgg-button
              :dgg-icon="
                isClickCheckStatus(taskDetailVo) ||
                isPauseOrOpen(taskDetailVo) ||
                taskDetailVo.taskSwitchingCode == 'QDS_ZYGSSC_TASKSTATUS_CODE7'
                  ? 'dgg-plus'
                  : 'icon_plus2'
              "
              class="brabBill-button  brabBill-button2"
              @click="docModal = true"
              :disabled="
                isClickCheckStatus(taskDetailVo) ||
                  isPauseOrOpen(taskDetailVo) ||
                  taskDetailVo.taskSwitchingCode ==
                    'QDS_ZYGSSC_TASKSTATUS_CODE7'
              "
              >添加
            </dgg-button>
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
                        'braBill-button-disabled':
                          isClickCheckStatus(taskDetailVo) ||
                          taskDetailVo.taskSwitchingCode ==
                            'QDS_ZYGSSC_TASKSTATUS_CODE7' ||
                          isPauseOrOpen(taskDetailVo)
                      }
                    ]"
                    @click="
                      !isClickCheckStatus(taskDetailVo) &&
                        !isPauseOrOpen(taskDetailVo) &&
                        taskDetailVo.taskSwitchingCode !==
                          'QDS_ZYGSSC_TASKSTATUS_CODE7' &&
                        invalidDocument(fileListItem)
                    "
                    >作废
                  </dgg-button>
                </div>
              </li>
            </ul>
          </div>

          <!-- 详情备注版块-->
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
              maxlength="1000"
              oninput="if(value.length>1000)value=value.slice(0,1000)"
              class="remarksTextArea"
              :disabled="
                isClickCheckStatus(taskDetailVo) ||
                  isPauseOrOpen(taskDetailVo) ||
                  taskDetailVo.taskSwitchingCode ==
                    'QDS_ZYGSSC_TASKSTATUS_CODE7'
              "
              @blur="saveFormatRemarksTextArea(remarksTextArea)"
            />
            <dgg-button
              class="sava-remarks"
              :disabled="remarksTextArea.length < 1"
              :class="{ 'active-save-remarks': remarksTextArea.length > 0 }"
              @click="saveRemarksFn"
              >保存</dgg-button
            >
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
            <dgg-button
              type="primary"
              style="width:100px"
              class="receive-button"
            >
              上传文件
            </dgg-button>
          </dgg-upload-doc>
        </dgg-modal>
        <!-- 任务暂停 -->
        <dgg-modal
          :modal="taskPauseView"
          :show-close="false"
          :hasmodal="true"
          :close-on-click-modal="false"
          title="任务暂停"
          width="512px"
          class="query-template-modal task-pause-model"
          @modalQuit="taskPauseCloseModal"
          @modalAffirm="taskPauseSubmitModal"
        >
          <dgg-form
            :model="taskPauseData"
            :rules="rules"
            label-width="110px"
            ref="taskPauseForm"
            class=""
          >
            <dgg-form-item label=" 当前任务：" class="current-task-name">
              <span>{{ this.taskDetailVo.taskName }}</span>
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
                :pickerOptions="setPlanBeginTime(taskDetailVo.receiveTime)"
                default-time="12:00:00"
                :disabled="
                  isClickCheckStatus(taskDetailVo) ||
                    isPauseOrOpen(taskDetailVo) ||
                    taskDetailVo.taskSwitchingCode ==
                      'QDS_ZYGSSC_TASKSTATUS_CODE7'
                "
                format="yyyy-MM-dd HH:mm:ss"
                size="small"
                style="width:160px;"
                class="chage-deadline-time "
              />
            </dgg-form-item>
          </dgg-form>
        </dgg-modal>

        <!-- 图片类预览 -->
        <div v-show="imageView" class="img-handle-item">
          <el-image
            ref="imageViewRef"
            :src="imageUrl"
            style="width: 0; height: 0;"
            :preview-src-list="showImgList"
            class="fileimg"
          />
        </div>
        <taskBitMap
          v-if="Object.keys(taskDetailVo).length < 1 || taskArray.length < 1"
          synopsis="暂无任务详情"
        />
      </div>
    </div>
    <!-- 指定任务模板版块 -->
    <div class="dgg-no-task" v-if="!queryTemplateView">
      <taskBitMap
        :show-btn="true"
        :btnName="templateBtnName"
        :sendClassName="isClickTemplate(transactionItem)"
        @click-back="queryTemplateBtnClick(transactionItem)"
      />

      <dgg-modal
        :modal="queryTemplateModalView"
        :show-close="false"
        :hasmodal="true"
        :close-on-click-modal="false"
        title="指定任务模板"
        width="920px"
        class="query-template-modal"
        @modalQuit="queryTemplateCloseModal"
        @modalAffirm="queryTemplateSubmitModal"
      >
        <dgg-input
          v-model="templateSearchKey"
          style="width:270px;"
          class="query-search-input"
          placeholder="请输入关键词搜索"
          :maxlength="30"
          onkeyup="if(value.length>30)value=value.slice(0,30)"
          @blur="templateKeyWordsSearch"
          @clear="templateKeyWordsSearch"
          @keyup.enter.native="$event.target.blur"
          clearable
        >
          <dgg-icon slot="prefix" icon-class="dgg-search" />
        </dgg-input>
        <ul class="templateLists" v-if="templateListsData.length > 0">
          <li
            :class="{
              'active-this-template': templateItem.processId == chooseTemplateId
            }"
            v-for="(templateItem, templateIndex) in templateListsData"
            :key="templateIndex"
            @click="chooseTemplateList(templateItem)"
          >
            <h6>
              <span>{{ templateItem.processName }}</span>
              <dgg-icon
                :icon-class="
                  templateItem.processId == chooseTemplateId
                    ? 'checkbox_selected'
                    : 'checkbox_default'
                "
                svg-width="16px"
                svg-height="16px"
                class="svg-icon"
              />
            </h6>
            <p>
              更新时间：<span>{{ templateItem.updateTime }}</span>
            </p>
          </li>
        </ul>

        <taskBitMap
          v-if="templateListsData.length < 1"
          synopsis="呀，没找到相关模板，请联系管理员处理~~"
        />
      </dgg-modal>
    </div>
    <!-- 已完结标签 -->
    <!-- v-if="transactionItem.orderStatusCode=='QDS_SC_ORDER_STATUS_CODE04'" -->
    <div
      class="finishImg"
      :class="{
        'back-order-seal-active': getOrderStatusSealName() == '已退单'
      }"
      fit="cover"
      v-if="getOrderStatusSealName()"
    >
      <!-- 返回盖章名称 -->
      <p class="finishImg-title">{{ getOrderStatusSealName() }}</p>
      <p class="finishImg-time">
        {{ transactionItem.endTime | timeFilter("YYYY.MM.DD") }}
      </p>
    </div>

    <!-- 右下角订单图标状态 -->
    <orderStatusIconComponents
      :storeTransactionItem="transactionItem"
    ></orderStatusIconComponents>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
import taskBitMap from "@/views/main/page/components/taskBitMap.vue";
import orderStatusIconComponents from "@/views/main/page/components/orderStatusIcon.vue";
import moment from "moment";
import config from "@/service/config";
import fixedNotice from "@/views/main/page/components/fixedNotice.vue";
import taskTransactorImg from "@/assets/images/image_portrait_fault.png";
import transactorProp from "@/views/main/page/components/transactorProp.vue";
export default {
  name: "taskComponent",
  filters: {
    filteTime(val) {
      return moment(Number(val)).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  components: {
    taskBitMap, // 任务无数据占位图
    fixedNotice,
    transactorProp, //添加办理人弹窗
    orderStatusIconComponents //右下角订单图标状态
  },
  data() {
    return {
      rules: {
        planBeginTime: [
          { required: true, message: "请选择计划开启时间", trigger: "blur" }
        ],
        reason: [{ required: true, message: "请输入暂停原因", trigger: "blur" }]
      },
      addLoading: false,
      templateBtnName: "指定任务模板",
      fileLoading: false,
      queryinfiniteScrollFalg: false, //是否可无限滚动
      scrollQueryDataFlag: true, //是否可滚动备注和记录
      DetailQueryInventoryPage: 1, //备注和记录分页
      templateSlectState: true, //查询模板状态
      chooseAdminTemplateData: {}, //选定模板数据
      chooseTemplateId: "", //选定模板id
      templateListsData: [], //模板数据
      taskPauseView: false, //显示任务暂停弹窗
      taskPauseData: {
        //任务暂停数据
        planBeginTime: "",
        reason: ""
      },
      queryTemplateModalView: false, //显示指定模板弹窗
      queryTemplateView: false, //是否显示指定模板
      transactorData: [], //选择店铺数据
      thisStoreRealName: "", //搜索办理人姓名关键字
      thisStorePhone: "", //搜索办理人手机号
      thisCheckedStoreId: "", //选定的办理人id
      formatTimesArr: [], //处理数据字典时间集合未id
      choosedTimeReminderTime: [], //处理选定的时间提醒
      addReminderTime: "", //添加的时间提醒
      showAddRemind: false, //显示添加提醒
      thisStoreRealName: "", //搜索办理人姓名关键字
      storeFlagUser: 0, //默认本店店铺
      taskExplainHeight: "48px", // 任务说明固定高度
      taskTransactorImg: taskTransactorImg, //办理人默认头像
      errorDefaultImg: 'this.src="' + taskTransactorImg + '"', //默认图地址
      chooseStateId: "", //选定的阶段id
      chooseTaskListId: "", //选定的任务列表id
      stageTaskListData: [], //即时搜索下拉列表
      showTips: false,
      popperOptions: {
        boundariesElement: "body"
      },

      btnName: "展开更多",
      iconType: "icon_extend",
      // 任务名称列表
      taskList: [],
      reminds: [], // 提醒
      toTransactor: false, // 办理人选择框默认值
      tabNames: ["本店成员", "外部合作"], // 办理人切换标题
      currentTab: 0, // 添加办理人选项默认值
      count: 0, // 添加办理人本所律师
      activeRadioData: "1",
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
      taskDetailTerminal: "caserecode_type_25",
      recordListData: [], //备注数据
      remarksTextArea: "", // 备注
      searchKey: "", // 搜索关键字
      templateSearchKey: "", //模板搜索关键字
      taskExplainAuto: true, // 默认隐藏
      stageArray: [],
      taskArray: [],
      taskDetailVo: {},
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
      DetailDocumentfileLists: [], //查询的详情附件列表
      DetailDocumentfileId: "", //上传的附件ID
      officeTypes: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"],
      imageTypes: ["jpg", "jpeg", "gif", "png", "bmp"],
      docModal: false, // 上传附件控制模态框的
      taskMissonContent: "", //任务说明内容
      cloneTaskDetailVoTaskMisson: "", //克隆初始化任务说明
      showTaskMissonContent: false, //显示添加任务说明
      defulutTimeKey: "截止前",
      userInfoSrc: require("@/assets/images/image_head_default.png"), //默认记录头像
      taskloading: false
    };
  },
  computed: {
    ...mapState([
      "userId",
      "transactionItem",
      "storeInfoData",
      "orderStatus",
      "orderStatusName",
      "storeQalNspectionsStatus", //质检任务返回名称
      "allRemindTimesData",
      "storeInfoData" //店铺信息
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
  created() {
    if (this.transactionItem.processId) {
      let sessionChooseStageId = sessionStorage.getItem("transactionStageId");
      let sessionChooseTaskId = sessionStorage.getItem("transactionTaskId");
      if (sessionChooseStageId) {
        this.chooseStateId = sessionChooseStageId;
      }
      if (sessionChooseTaskId) {
        this.chooseTaskListId = sessionChooseTaskId;
      }
      //查询封装的列表接口
      this.queryTemplateView = true;
      this.clearDetailData();
      this.commonStageListService();
    }

    if (this.transactionItem.proScAttr == "QDS_ZYGSSC_ATTR_CODE2") {
      this.templateBtnName = "创建方案";
    } else {
      this.templateBtnName = "指定任务模板";
    }
  },
  async mounted() {},
  beforeDestroy() {
    this.setTransactionStageId("");
    this.setTransactionTaskId("");
  },

  methods: {
    ...mapActions("transactionTaskModule", [
      "search_stage_and_task", //任务的搜索匹配
      "orderdetail_queryTaskPanael", //阶段列表接口
      "query_template", //模板列表接口
      "template_demapnotes", //指定模板详情接口

      "zygs_applyTaskTimeOut", //暂停任务
      "zygs_TaskBeginHanding", //开启任务
      "zygs_queryMemberNonMerchantVO" //专业公司查询成员列表数据
    ]),
    ...mapActions("workbenchTaskModule", [
      "task_detail_generate", //添加备注接口、任务说明添加跟更改接口
      "task_query_inventory", //查询任务备注列表
      "queryTaskRecordPage", //查询任务记录列表
      "task_add_reminder", //添加提醒
      "task_updtae_reminder", //修改提醒
      "task_delete_reminder", //删除提醒
      "task_setting_manager", //添加办理人
      "task_description_change", //修改任务说明
      "deleter_setting_manger" //删除办理人
    ]),
    ...mapActions("homeTaskModule", [
      "zysc_complete_task_service", //
      "zysc_manageTaskHandler_operation" // 添加/删除/修改 办理人
    ]),
    ...mapActions("transactionModule", ["search_files", "update_files"]),

    ...mapActions("commonModule", [
      // 记录当前操作信息
      "genera_tetemplate"
    ]),
    ...mapMutations([
      "setTransactionStageId", //设置办理阶段id
      "setTransactionTaskId", //设置办理任务id
      "setTransactionItem"
    ]),
    ...mapActions(["ruoterJump"]),
    ...mapActions("transactionDynamicModule", [
      "get_production_order_details_data" // 获取订单详情
    ]),
    //触底更新备注或记录
    dropdownDetailQueryInventory() {
      //下拉分页效果记录和备注
      if (this.scrollQueryDataFlag) {
        if (this.activeRadioData == 1) {
          this.getTaskQueryInentory();
        } else {
          this.queryTaskRecordPageFn();
        }
      }
    },
    //返回订单盖章名称
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
    isPauseOrOpen(item) {
      if (item.taskSwitchingCode == "QDS_ZYGSSC_TASKSTATUS_CODE3") {
        //  暂停任务 不可以操作
        return true;
      } else {
        return false;
      }
    },
    //是否可以点击操作框
    isClickCheckStatus(item) {
      if (
        //已退单和已完结返回为true
        this.transactionItem.orderStatus ==
          this.orderStatus.QDS_SC_ORDER_FINISH ||
        this.transactionItem.orderStatus == this.orderStatus.QDS_SC_ORDER_REFUND
      ) {
        return true;
      }
      if (
        //26暂停状态、27暂停待审核
        this.transactionItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE26" ||
        this.transactionItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE27" ||
        this.transactionItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE02" ||
        this.transactionItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE03"
      ) {
        //  订单暂停不可操作
        return true;
      }
      //已完成任务不可操作
      /*    if (item.taskSwitchingCode == "QDS_ZYGSSC_TASKSTATUS_CODE7") {
        return true;
      } */
      // 0 未完成，1：完成
      if (item.taskSwitching == 1) {
        if (item.isCheck == 1) {
          // 是否 质检任务：0 ：否， 1： 是
          //待质检
          if (item.qalNspectionsStatus == "NODE_QUALITY_AWAIT") {
            return true;
          }
          //质检中
          else if (item.qalNspectionsStatus == "NODE_QUALITY_REVIEW") {
            return true;
          }
          //质检已通过
          else if (item.qalNspectionsStatus == "NODE_QUALITY_COMPLETE") {
            return true;
          }
          //质检驳回
          else if (item.qalNspectionsStatus == "NODE_QUALITY_REFUSE") {
            return false;
          } else {
            return true;
          }
        } else {
          //非质检
          return false;
        }
      } else {
        //未完成全部可以点击
        return false;
      }
    },
    //通过关键字查询模板
    templateKeyWordsSearch() {
      this.templateSlectState = false;
      //查询指定模板
      this.queryTemplateFn();
    },
    //查询指定模板
    queryTemplateFn() {
      this.query_template({
        id: this.transactionItem.id,
        searchKey: encodeURIComponent(this.templateSearchKey)
      }).then(res => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.queryTemplateView = false;
            this.templateListsData = res.data;
          });
        }
      });
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
    //选择模板
    chooseTemplateList(item) {
      this.chooseTemplateId = item.processId;
    },
    //关闭指定模板弹窗
    queryTemplateCloseModal() {
      this.templateSearchKey = "";
      this.queryTemplateModalView = false;
      this.chooseTemplateId = ""; //重置选定模板id
    },
    //关闭任务暂停弹窗
    taskPauseCloseModal() {
      this.taskPauseView = false;
      this.$refs.taskPauseForm.resetFields();
    },
    //确定任务暂停弹窗
    taskPauseSubmitModal() {
      this.$refs.taskPauseForm.validate(valid => {
        if (valid) {
          //验证通过执行方法
          this.zygs_applyTaskTimeOut({
            id: this.transactionItem.id,
            planBeginTime: this.taskPauseData.planBeginTime,
            reason: this.taskPauseData.reason,
            taskId: this.chooseTaskListId
          })
            .then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: "提示",
                  message: res.message,
                  type: "success",
                  customClass: "dgg-tip-msg"
                });
                this.$refs.taskPauseForm.resetFields();
                this.taskPauseView = false;
                this.queryTemplateModalView = false;
                this.queryTemplateView = true;
                this.templateSearchKey = "";
                //查询封装的列表接口
                this.clearDetailData();
                this.commonStageListService();
              } else {
                this.$notify({
                  message: res.message,
                  type: "error",
                  customClass: "dgg-tip-msg"
                });
              }
            })
            .catch((error = {}));
        } else {
          //验证未通过执行发放
        }
      });
    },
    //关闭指定模板弹窗
    queryTemplateSubmitModal() {
      if (this.chooseTemplateId) {
        this.template_demapnotes({
          processId: this.chooseTemplateId,
          id: this.transactionItem.id
        })
          .then(res => {
            if (res.code == 200) {
              this.$nextTick(() => {
                this.queryTemplateModalView = false;
                this.queryTemplateView = true;
                this.templateSearchKey = "";
                //查询封装的列表接口
                this.clearDetailData();
                this.commonStageListService();

                //修改订单数据
                this.get_production_order_details_data({
                  id: this.transactionItem.id
                }).then(res => {
                  if (res.code == 200) {
                    this.$nextTick(() => {
                      this.setTransactionItem(res.data);
                    });
                  }
                });
              });
            } else {
              this.$notify({
                message: res.message,
                type: "warning",
                customClass: "dgg-tip-msg"
              });
            }
          })
          .catch(error => {
            this.$notify({
              message: res.message,
              type: "warning",
              customClass: "dgg-tip-msg"
            });
          });
        return;
      } else {
        this.$notify({
          type: "warning",
          message: "未选择模板，请选择后再进行操作。",
          customClass: "dgg-tip-msg"
        });
      }
    },

    // 点击复选框
    stateChange(item) {
      if (!(item.isCheck == 1) && !(item.taskSwitching == 1)) {
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
            //即将到期、已超期、我的待办、我分配的下面列表复选框---任务已完成、任务未完成、激活任务接口
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
    //
    requestCompleteTaskService(item, num) {
      console.log(item, "itemtask++++++");
      this.zysc_complete_task_service({
        isActive: num, //是否为激活任务 0：完成 1：激活
        isCheck: item.isCheck, // 是否为质检任务 0：否，1：是|
        isKeyTask: item.isKeyTask, //是否为关键任务 0：否 ，1：是
        stageId: item.stageId, // 阶段ID
        // storeId: this.storeInfoData.storeId, // 店铺ID / 商户ID
        storeId: this.transactionItem.teamId, // 店铺ID / 商户ID
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
            this.chooseTaskListId = item.taskId;
            this.DetailQueryInventoryPage = 1;
            this.clearDetailData();
            this.commonStageListService();
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
              this.invalidDocumentRecords("", item);
              //请求详情附件列表
              this.searchFilesFn();
            } else {
              this.$notify({
                message: res.message,
                type: "error",
                customClass: "dgg-tip-msg"
              });
            }
          });
        })
        .catch(() => {
          //
        });
    },
    isClickTemplate(item) {
      if (
        this.$route.name == "finishDetailsTask" ||
        this.$route.name == "chargeBackDetailsTask" ||
        this.transactionItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE26" ||
        this.transactionItem.orderStatus == "QDS_SC_ORDER_STATUS_CODE27"
      ) {
        return false;
      } else {
        return true;
      }
    },
    //点击指定任务模板事件、查询模板列表
    queryTemplateBtnClick(item) {
      console.log(item, "缓存的订单id");
      if (item.proScAttr == "QDS_ZYGSSC_ATTR_CODE2") {
        this.ruoterJump({
          name: "processPlan",
          params: { id: item.id }
        });
      } else {
        this.queryTemplateFn();
        this.queryTemplateModalView = true;
      }
    },

    //关闭文件上传模态框
    closeModal() {
      this.docModal = false;

      //请求详情附件列表
      this.searchFilesFn();
    },

    //编辑任务说明
    showTaskMissonContentView(content) {
      this.showTaskMissonContent = !this.showTaskMissonContent;
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
    //提交任务说明
    addtaskKewordsVal(content) {
      this.task_description_change({
        zygsscId: this.transactionItem.id,
        explainComent: content,
        taskId: this.chooseTaskListId
      }).then(res => {
        if (res.code == 200) {
          this.clearDetailData();
          this.$notify({
            title: "提示",
            type: "success",
            message: res.message,
            customClass: "dgg-tip-msg"
          });
          this.DetailQueryInventoryPage = 1;
          this.commonStageListService();
        } else {
          this.$notify({
            type: "error",
            message: res.message,
            customClass: "dgg-tip-msg"
          });
          this.$nextTick(() => {
            this.showTaskMissonContent = false;
            this.taskDetailVo.taskExplain = this.cloneTaskDetailVoTaskMisson;
          });

          return;
        }
      });
    },
    //添加任务提醒
    addRemidItem(item) {
      this.task_add_reminder({
        remindConditionCode: this.defulutTimeKey,
        remindConditionName: this.defulutTimeKey,
        remindValueCode: item.split(":")[1],
        remindValueName: item.split(":")[0],
        taskId: this.chooseTaskListId,
        zygsscId: this.transactionItem.id
      }).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "提示",
            type: "success",
            message: res.message,
            customClass: "dgg-tip-msg"
          });
          this.DetailQueryInventoryPage = 1;
          this.clearDetailData();
          this.commonStageListService();
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
    //删除任务提醒
    remindDelete(item) {
      this.$confirm("是否删除本条提醒时间？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.task_delete_reminder({
            remindId: item.id,
            taskId: this.chooseTaskListId
          }).then(res => {
            if (res.code == 200) {
              this.$notify({
                title: "提示",
                type: "success",
                message: res.message,
                customClass: "dgg-tip-msg"
              });
              this.DetailQueryInventoryPage = 1;
              this.clearDetailData();
              this.commonStageListService();
            } else {
              this.$notify({
                type: "error",
                message: res.message,
                customClass: "dgg-tip-msg"
              });
              return;
            }
          });
        })
        .catch(() => {
          return;
        });
    },
    //修改提醒
    changeRemidItem(item) {
      console.log(JSON.parse(JSON.stringify(item)), "修改提醒当条数据+++");
      this.$nextTick(() => {
        this.task_updtae_reminder({
          remindConditionCode: this.defulutTimeKey,
          remindConditionName: this.defulutTimeKey,
          remindId: item.id,
          remindValueCode: item.reminderValue.split(":")[1],
          remindValueName: item.reminderValue.split(":")[0],
          taskId: this.chooseTaskListId,
          zygsscId: this.transactionItem.id
        }).then(res => {
          if (res.code == 200) {
            this.$notify({
              title: "提示",
              type: "success",
              message: res.message,
              customClass: "dgg-tip-msg"
            });
            this.DetailQueryInventoryPage = 1;
            this.clearDetailData();
            this.commonStageListService();
          } else {
            this.$notify({
              type: "error",
              message: res.message,
              customClass: "dgg-tip-msg"
            });
            return;
          }
        });
      });
    },

    saveFormatRemarksTextArea(e) {
      this.remarksTextArea = e.replace(/(^\s*)|(\s*$)/g, "");
    },
    //添加任务备注
    saveRemarksFn() {
      if (this.remarksTextArea) {
        this.task_detail_generate({
          zygsscId: this.transactionItem.id,
          taskName: this.taskDetailVo.taskName,
          taskId: this.chooseTaskListId,
          remarkContent: this.remarksTextArea
        })
          .then(res => {
            if (res.code == 200) {
              this.$notify({
                title: "提示",
                type: "success",
                message: res.message,
                customClass: "dgg-tip-msg"
              });
              this.activeRadioData = 1;
              this.remarksTextArea = "";
              this.DetailQueryInventoryPage = 1;
              this.recordListData = [];
              this.getTaskQueryInentory();
            } else {
              this.$notify({
                type: "error",
                message: res.message,
                customClass: "dgg-tip-msg"
              });
              return;
            }
          })
          .catch(error => {});
      }
    },
    //查询任务备注列表、
    getTaskQueryInentory() {
      this.task_query_inventory({
        start: this.DetailQueryInventoryPage, //页数，默认为0
        limit: 20, //页数，默认为0
        taskId: this.chooseTaskListId,
        zygsscId: this.transactionItem.id
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
      if (!this.scrollQueryDataFlag) {
        this.recordListData = [];
      }
      this.queryTaskRecordPage({
        start: this.DetailQueryInventoryPage, //页数，默认为0
        limit: 20, //页数，默认为0
        taskId: this.chooseTaskListId,
        zygsscId: this.transactionItem.id
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
    // 点添加办理人icon
    addTransactor(event) {
      const evt = window.event || event;
      evt.preventDefault();
      evt.stopPropagation();
      this.toTransactor = !this.toTransactor;
      //查询店铺信息
      this.requestStoreUser();
    },
    //查询店铺信息
    requestStoreUser() {
      if (this.transactionItem.teamId) {
        this.zygs_queryMemberNonMerchantVO({
          isOutside: this.storeFlagUser, //0:获取本店铺的用户 1：获取店铺外的店铺
          phoneNumber: this.thisStorePhone, //手机号
          storeId: this.transactionItem.teamId, //店铺ID
          userName: this.thisStoreRealName, //用户姓名，只有flag为0时有效
          zygsscId: this.transactionItem.id
        })
          .then(res => {
            if (res.code == 200) {
              this.transactorData = res.data;
            }
          })
          .catch(error => {});
      } else {
        this.transactorData = [];
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
        this.task_setting_manager({
          isDelete: 0, //是否删除(0:否代表添加 1:是 代表删除)
          memberId: item.userId, //办理人id
          memberName: item.realName, //办理人
          taskId: this.chooseTaskListId,
          zygsscId: this.transactionItem.id
        }).then(res => {
          if (res.code == 200) {
            this.$notify({
              title: "提示",
              type: "success",
              message: res.message,
              customClass: "dgg-tip-msg"
            });
            this.$nextTick(() => {
              this.DetailQueryInventoryPage = 1;
              this.clearDetailData();
              this.commonStageListService();
            });
          } else {
            this.$notify({
              type: "error",
              message: res.message,
              customClass: "dgg-tip-msg"
            });
            return;
          }
        });
      });
    },
    //办理人删除
    deleteTransacTorPeople() {
      this.deleter_setting_manger({
        isDelete: 1, //是否删除(0:否代表添加 1:是 代表删除)
        taskId: this.chooseTaskListId,
        zygsscId: this.transactionItem.id,
        memberId: this.taskDetailVo.taskManagerId,
        memberName: this.taskDetailVo.taskManagerName
      }).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "提示",
            type: "success",
            message: res.message,
            customClass: "dgg-tip-msg"
          });
          this.DetailQueryInventoryPage = 1;
          this.clearDetailData();
          this.commonStageListService();
        } else {
          this.$notify({
            type: "error",
            message: res.message,
            customClass: "dgg-tip-msg"
          });
          return;
        }
      });
    },
    //切换任务查询详情
    selectDetailData(taskid) {
      this.chooseTaskListId = taskid;
      //清空办理人手机号和姓名
      this.clearNamePhone();
      this.clearDetailData();
      this.commonStageListService();
    },

    //清空详情数据
    clearDetailData() {
      this.$nextTick(() => {
        this.toTransactor = false; //关闭添加办理人弹窗
        this.thisCheckedStoreId = ""; //清空选中的办理人
        this.taskDetailVo = {};
        this.remarksTextArea = ""; //清空记录
        this.choosedTimeReminderTime = []; //清空处理好的时间提醒集合
        this.addReminderTime = ""; //清空选定的值
        this.showAddRemind = false; //显示添加按钮
        this.taskMissonContent = ""; //清空任务说明
        this.showTaskMissonContent = false; //隐藏修改任务说明
        this.DetailDocumentfileLists = []; //查询的详情附件列表
        this.DetailDocumentfileId = ""; //上传的附件ID
        this.activeRadioData = "1";
        this.DetailQueryInventoryPage = 1;
        this.recordListData = [];
      });
    },

    //关闭即时搜索框
    stageClickoutSide() {
      this.stageTaskListData = [];
    },
    //查询任务搜索smartbox项值
    selectStageTask(val) {
      if (val.length > 0) {
        this.search_stage_and_task({
          searchWord: val,
          zygsscId: this.transactionItem.id
        })
          .then(res => {
            if (res.code == 200) {
              if (res.data.length > 0) {
                this.$nextTick(() => {
                  this.stageTaskListData = res.data;
                });
              } else {
                this.$nextTick(() => {
                  this.stageTaskListData = [];
                });
              }
            }
          })
          .catch(error => {
            this.$nextTick(() => {
              this.stageTaskListData = [];
            });
          });
      } else {
        this.$nextTick(() => {
          this.stageTaskListData = [];
        });
      }
    },
    //选定查询出来的搜索条件
    chooseStageTaskId(item) {
      if (item.stageId) {
        this.chooseStateId = item.stageId;
      }
      if (item.taskId) {
        this.chooseTaskListId = item.taskId;
      } else {
        this.chooseTaskListId = "";
      }
      this.searchKey =
        item.stageName + (item.taskName ? "-" + item.taskName : "");
      this.stageTaskListData = [];
      this.clearDetailData();
      this.commonStageListService();
    },

    //查询任务tab页各面板数据
    commonStageListService() {
      this.addLoading = true;
      //如果是暂停中或者退单完结、就不能查询
      if (this.queryTemplateView) {
        this.orderdetail_queryTaskPanael({
          zygsscId: this.transactionItem.id,
          stageId: this.chooseStateId,
          taskId: this.chooseTaskListId
        })
          .then(res => {
            this.addLoading = false;
            if (res.code == 200) {
              this.$nextTick(() => {
                if (Object.keys(res.data).length > 0) {
                  this.$nextTick(() => {
                    this.stageArray = res.data.stageArray;
                    this.taskArray = res.data.taskArray;
                    this.taskDetailVo =
                      res.data.taskArray.length > 0
                        ? res.data.taskDetailVo
                        : {};
                    if (!this.chooseStateId && res.data.stageArray.length > 0) {
                      this.chooseStateId = res.data.stageArray[0].stageId;
                    }
                    if (
                      !this.chooseTaskListId &&
                      res.data.taskArray.length > 0
                    ) {
                      this.chooseTaskListId = res.data.taskArray[0].taskId;
                    }
                    if (Object.keys(this.taskDetailVo).length > 0) {
                      //查询详情成功赋值上传附件id
                      // this.DetailDocumentfileId = `ZYGSSC_${this.transactionItem.id}_TASK_${this.taskDetailVo.taskId}_TASK_ANNEX`;
                      this.DetailDocumentfileId = `ZYGSSC_${this.transactionItem.scOrderId}_TASK_${this.taskDetailVo.taskId}_TASK_ANNEX`;
                      this.searchFilesFn();
                      this.getTaskQueryInentory();
                    }
                  });
                } else {
                  this.$nextTick(() => {
                    this.chooseStateId = ""; //选定的阶段id
                    this.chooseTaskListId = ""; //选定的任务列表id
                    this.stageArray = [];
                    this.taskArray = [];
                    this.taskDetailVo = {};
                  });
                }
              });
            }
          })
          .catch(error => {
            this.addLoading = false;
          });
      }
    },
    //选择阶段
    changeTaskListsData(item) {
      // this.chooseTaskListId = "";
      // this.clearDetailData();

      this.chooseStateId = item.stageId;
      this.chooseTaskListId = "";
      //清空办理人手机号和姓名
      this.clearNamePhone();
      this.clearDetailData();
      this.commonStageListService();
    },

    fileLoadError() {
      this.fileLoading = false;
    },
    // 上传附件列表
    async submitModal() {
      this.fileLoading = true;
      await this.$refs["uploadDoc"].$refs["upload-inner"].manualUpload(() => {
        this.fileLoading = false;
        this.docModal = false;
        this.searchFilesFn();
      });
    },
    //查询附件列表
    searchFilesFn() {
      this.search_files({
        fileId: this.DetailDocumentfileId
      }).then(res => {
        if (res.code == 200 && res.data.length > 0) {
          this.DetailDocumentfileLists = res.data;
        } else {
          this.DetailDocumentfileLists = [];
        }
      });
    },
    async onSuccess(res, file) {
      if (Object.keys(this.taskDetailVo).length > 0) {
        let _parmas = {
          code: "ZYGSSC_TASK_RECORD_OPT_5",
          id: this.transactionItem.id,
          name: file.name,
          taskId: this.taskDetailVo.taskId
        };
        await this.genera_tetemplate(_parmas);
        this.activeRadioData = "1";
        this.DetailQueryInventoryPage = 1;
        this.recordListData = [];
        this.getTaskQueryInentory();
      }
    },
    async invalidDocumentRecords(res, itemfile) {
      if (Object.keys(this.taskDetailVo).length > 0) {
        let _parmas = {
          code: "ZYGSSC_TASK_RECORD_OPT_25",
          id: this.transactionItem.id,
          name: itemfile.filename,
          taskId: this.taskDetailVo.taskId
        };
        await this.genera_tetemplate(_parmas);
        this.activeRadioData = "1";
        this.DetailQueryInventoryPage = 1;
        this.recordListData = [];
        this.getTaskQueryInentory();
      }
    },
    //任务暂停、开启任务
    formatTaskSwitchingName(code) {
      switch (code) {
        case "QDS_ZYGSSC_TASKSTATUS_CODE1":
          return "任务暂停";
        case "QDS_ZYGSSC_TASKSTATUS_CODE4":
          return "任务暂停";
        case "QDS_ZYGSSC_TASKSTATUS_CODE5":
          return "任务暂停";
        case "QDS_ZYGSSC_TASKSTATUS_CODE6":
          return "任务暂停";
        case "QDS_ZYGSSC_TASKSTATUS_CODE3":
          return "任务开启";
        default:
          break;
          return;
      }
    },
    //开启任务、暂停任务状态
    formatTaskSwitchingType(code) {
      switch (code) {
        case "QDS_ZYGSSC_TASKSTATUS_CODE1":
          return "pause";
        case "QDS_ZYGSSC_TASKSTATUS_CODE4":
          return "pause";
        case "QDS_ZYGSSC_TASKSTATUS_CODE5":
          return "pause";
        case "QDS_ZYGSSC_TASKSTATUS_CODE6":
          return "pause";
        case "QDS_ZYGSSC_TASKSTATUS_CODE3":
          return "open";
        default:
          break;
      }
    },

    //点击暂停或者开启任务
    clickPuseFn(state) {
      if (state == "pause") {
        this.taskPauseView = true;
      } else {
        this.$confirm("确认开启该任务吗，开启后将继续进行该任务！", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(res => {
            this.zygs_TaskBeginHanding({
              taskId: this.chooseTaskListId
            }).then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: "提示",
                  message: res.message,
                  type: "success",
                  customClass: "dgg-tip-msg"
                });
                this.DetailQueryInventoryPage = 1;
                this.clearDetailData();
                this.commonStageListService();
              } else {
                this.$notify({
                  message: res.message,
                  type: "error",
                  customClass: "dgg-tip-msg"
                });
              }
            });
          })
          .catch(error => {});
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
//指定模板弹窗
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
<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件
.dgg-order-search {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #edeff0;
  position: relative;
  z-index: 10;
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }

  .admin-select-keywords {
    position: absolute;
    width: 270px;
    top: 50%;
    margin-top: 20px;
    z-index: 20;
    background-color: #fff;
    max-height: 300px;
    overflow: scroll;
    box-shadow: 0px 1px 8px 0px rgba(97, 112, 136, 0.1);
    li {
      line-height: 30px;
      .dgg-text-ellip;
      padding: 0 10px;
      cursor: pointer;
      &:hover {
        color: #10bbb8;
      }
    }
  }
}
.breadcrumb-page-keep {
  min-height: calc(100% - 124px);
  background: #fff;
}
.taskComponent {
  background-color: #fff;
  position: absolute;
  height: calc(100% - 36px);
  position: absolute;
  width: 100%;
  .dgg-no-task {
    height: calc(100% - 70px);
  }
  .dgg-task-warp {
    height: calc(100% - 48px);
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    text-align: center;
    background-color: #fff;
    margin-bottom: 36px;
    border-radius: 6px;
    .add-stage {
      padding: 0 8px;
      height: 46px;
      line-height: 46px;
      overflow: hidden;
      word-break: break-all;
      word-wrap: break-word;
      .brabBill-button {
        height: 100%;
        width: 100%;
        border: 0;
        font-size: 14px;
        font-weight: 400;
        &.is-disabled {
          background-color: transparent;
        }

        border-top: 1px solid #edeff0;
        span {
          margin-left: 3px;
        }
      }
    }
    .dgg-stage {
      flex-shrink: 0;
      width: 250px;
      border-right: 1px solid #edeff0;
      .stage-content {
        height: calc(100% - 20px);
        overflow-y: scroll;
        padding: 8px;
        .stage-lists {
          .current-stage {
            height: 36px;
            text-align: left;
            margin-bottom: 16px;

            &.chooseIdActive {
              background-color: #f0f2f5;
            }
            &.chooseIdFocusActive {
              background-color: transparent;
              &:hover {
                background-color: transparent;
              }
            }

            .detail {
              overflow: hidden;
              height: 100%;
              display: flex;
              flex-wrap: nowrap;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
              padding: 0 12px 0 22px;
              &:hover {
                background-color: #f0f2f5;
                .dgg-task-btn {
                  line-height: 100%;
                  & > span {
                    display: inline-block;
                  }
                }
              }
              & > p {
                flex: 1;
                overflow: hidden;
                font-size: 14px;
                font-weight: 400;
                color: #9398a1;
                line-height: 20px;
                & > span {
                  font-size: 14px;
                  font-weight: 500;
                  color: #19233c;
                  display: inline-block;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  white-space: nowrap;
                  just-content: flex-start;
                  span {
                    display: inline-block;
                    max-width: 120px;
                    .dgg-text-ellip;
                    flex-shrik: 0;
                  }
                  label {
                    display: inline-block;
                    flex: 1;
                    .dgg-text-ellip;
                    cursor: pointer;
                  }
                }
              }
              .dgg-task-btn {
                flex-shrink: 0;
                font-size: 0;
                & > span {
                  display: none;
                  height: 100%;
                  font-size: 0;
                }
                .dgg-icon:last-child {
                  margin-left: 10px;
                }
              }
            }
            .detail-isedit {
              overflow: hidden;
              height: 100%;
              display: flex;
              flex-wrap: nowrap;
              align-items: center;
              cursor: pointer;
              padding: 0 12px 0 22px;
              &:hover {
                .dgg-task-btn {
                  line-height: 100%;
                  & > span {
                    display: inline-block;
                  }
                }
              }
            }
          }
        }
      }
      &.hidden-dgg-stage {
        .stage-content {
          /*height: 100%;*/
          .stage-lists {
            .current-stage {
              .detail {
                & > p {
                  max-width: 100%;
                }
              }
            }
          }
        }
      }
    }
    .dgg-task {
      height: 100%;
      flex-shrink: 0;
      width: 300px;
      border-right: 1px solid #edeff0;
      .task-content {
        height: calc(100% - 20px);

        overflow-y: scroll;
        padding: 0 8px;
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
            &:last-child {
              border-bottom: 0;
            }
            &.taskIdActive {
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
              > .el-checkbox.list-checkbox {
                flex-shrink: 0;
                margin-right: 10px;
                margin-top: -26px;
              }
              > .task-list-warp {
                display: flex;
                flex: 1;
                flex-wrap: nowrap;
                align-items: center;
                overflow: hidden;
              }
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
                  .el-checkbox {
                    flex-shrink: 0;
                    margin-right: 10px;
                    margin-top: -2px;
                    .el-checkbox__input {
                      vertical-align: middle;
                      margin-top: 0;
                    }
                  }
                  .list-title {
                    flex: 1;
                    overflow: hidden;
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    height: 20px;
                    .el-tag {
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
                      }
                      &.disabledEl {
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
                  // text-indent: 24px;
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
      &.hidden-dgg-task {
        .task-content {
          /*height: 100%;*/
        }
      }
    }
    .dgg-details {
      height: 100%;
      // height: calc(100% - 46px);
      flex-shrink: 0;
      width: 630px;
      border-right: 1px solid #edeff0;
      overflow-y: scroll;
      .detail-content {
        text-align: left;
        .user-info {
          height: 90px;
          border-bottom: 1px solid #edeff0;
          overflow: hidden;
          padding: 18px 12px 0 21px;
          position: relative;
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
              color: #19233c;
              line-height: 22px;
              font-weight: 550;
              max-width: 500px;
            }
            & > span {
              display: inline-block;
              height: 22px;
              flex-shrink: 0;
              font-size: 0;
              display: flex;
              align-items: center;
              .dgg-icon {
                cursor: pointer;
                &:hover,
                &:focus {
                  color: #10bbb8;
                }
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
          .await-btn {
            position: absolute;
            right: 20px;
            top: 18px;
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
                &.dgg-not-allowed {
                  cursor: not-allowed;
                }
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
          .format-end-time {
            .dgg-text-ellip;
            display: inline-block;
            max-width: 400px;
          }

          & > .dgg-button {
            padding: 7px 0;
            border-color: transparent;
            &.is-disabled {
              background-color: transparent;
              cursor: not-allowed;
            }
          }
        }
        .add-transactor {
          padding: 0 30px;
          .remarksTextArea {
            .el-textarea__inner {
              min-height: 80px !important;
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

            .dgg-icon {
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

          .dgg-radio-group {
            height: 20px;
            line-height: 20px;
            overflow: hidden;
            margin-top: 30px;

            /deep/ .el-radio-button {
              width: auto;
            }

            /deep/.el-radio-button__inner {
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
            /deep/.el-radio-button__orig-radio:checked
              + .el-radio-button__inner {
              box-shadow: none !important;
              color: #10bbb8;
            }
          }

          .remarksTextArea {
            .el-textarea__inner {
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
              &:last-child {
                padding-bottom: 0;
              }

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
              max-width: 130px;
            }
          }
        }
      }
    }

    .add-stage-input {
      .el-input__inner {
        text-align: center;
        border-color: #10bbb8;
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
  .is-disabled.el-input {
    background-color: transparent;
    .el-input__inner {
      background-color: transparent;
      cursor: not-allowed;
    }
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
      .dgg-button-group {
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
        .dgg-button-group {
          display: flex;
        }
      }
    }
  }
}
//图片预览
.el-image {
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
</style>
