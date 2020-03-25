<template>
  <div >
    <div class="billComponent">
      <dgg-form
        :model="orderBusiness"
        labdgg-width="100px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <div class="form-top">
          <div class="time-left">
            <dgg-icon
              slot="icon"
              svg-width="14px"
              svg-height="14px"
              icon-class="dgg_time"
            />
            <span v-html="orderBusiness.update" />
          </div>
          <div class="dggBtn">
            <dgg-button
              v-if="update"
              type="primary"
              dgg-icon="dgg_save"
              @click="edit('save')"
            >保存</dgg-button>
            <dgg-button
              v-if="update"
              type="primary"
              dgg-icon="dgg_save"
              @click="edit('cancelEdit')"
            >取消</dgg-button>
            <dgg-button
              v-if="!getOrderStatusSealName() && !update"
              type="primary"
              dgg-icon="dgg_edit"
              @click="edit()"
            >编辑</dgg-button>
            <!-- <dgg-button type="primary" v-html="update ? '保存' : '编辑'" @click="edit()"  :dggIcon="update ? 'dgg_save' :'dgg_edit'">保存</dgg-button> -->
          </div>
        </div>

        <div class="form-content">
          <!-- 案件信息 start -->
          <div class="content">
            <h3>案件信息</h3>
            <dgg-row>
              <dgg-col :span="20">
                <dgg-form-item
                  label="签单时间："
                  prop="signTime"
                >
                  <span v-html="orderBusiness.lawCaseInfo.signTime" />
                </dgg-form-item>
              </dgg-col>
              <dgg-col :span="20">
                <dgg-form-item
                  label="案件类型："
                  prop="caseTypeName"
                >
                  <span v-html="orderBusiness.lawCaseInfo.caseTypeName?orderBusiness.lawCaseInfo.caseTypeName:'无'" />
                </dgg-form-item>
              </dgg-col>
              <dgg-col
                :span="20"
                v-if="false"
              >
                <dgg-form-item
                  label="案件渠道："
                  prop="caseChannelName"
                >
                  <el-select
                    v-if="update"
                    v-model="flscChannelText"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in flscChannel"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                  <span
                    v-if="!update"
                    v-html="orderBusiness.lawCaseInfo.caseChannelName?orderBusiness.lawCaseInfo.caseChannelName:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
            </dgg-row>
            <dgg-row>
              <dgg-col :span="20">
                <dgg-form-item
                  label="案件管辖地："
                  prop="caseVenue"
                >
                  <el-cascader
                    v-if="update"
                    :props="props"
                    ref="caseArea"
                    :placeholder="caseVenueText"
                    @change="changeCaseVenueText"
                  ></el-cascader>
                  <span
                    v-else
                    v-html="orderBusiness.lawCaseInfo.caseAreaName?orderBusiness.lawCaseInfo.caseAreaName:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
              <dgg-col :span="20">
                <dgg-form-item
                  label="详细地址："
                  prop="caseAreaAddress"
                >
                  <dgg-input
                    v-if="update"
                    v-model="orderBusiness.lawCaseInfo.caseAreaAddress"
                  />
                  <span
                    v-else
                    v-html="orderBusiness.lawCaseInfo.caseAreaAddress?orderBusiness.lawCaseInfo.caseAreaAddress:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
            </dgg-row>
          </div>
          <!-- 案件信息 end -->

          <!-- 审理信息 start -->
          <div class="content">
            <h3>审理信息</h3>
            <dgg-row>
              <dgg-col :span="20">
                <dgg-form-item
                  label="案号："
                  prop="caseNo"
                >
                  <dgg-input
                    v-if="update"
                    v-model="orderBusiness.trialInfo.caseNo"
                  />
                  <span
                    v-else
                    v-html="orderBusiness.trialInfo.caseNo?orderBusiness.trialInfo.caseNo:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
              <dgg-col :span="20">
                <!--              orderBusiness.trialInfo.trailCourtId-->
                <dgg-form-item
                  label="审理法院："
                  prop="trailCourt"
                >
                  <el-select
                    v-if="update"
                    v-model="courtSelect"
                    filterable
                    remote
                    reserve-keyword
                    :placeholder="courtSelectPlaceholder"
                    :remote-method="getCourtSearch"
                    @change="getMoreCourt"
                    :loading="loading"
                  >
                    <el-option
                      v-for="item in courts"
                      :key="item.id"
                      :label="item.courtName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                  <span
                    v-else
                    v-html="orderBusiness.trialInfo.trailCourt?orderBusiness.trialInfo.trailCourt:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
              <dgg-col :span="20">
                <dgg-form-item
                  label="联系方式："
                  prop="trailContact"
                >
                  <dgg-input
                    v-if="update"
                    v-model="orderBusiness.trialInfo.trailContact"
                    @input="orderBusiness.trialInfo.trailContact = orderBusiness.trialInfo.trailContact.replace(/[^\d]/g, '');"
                    :maxlength="11"
                  />
                  <span
                    v-else
                    v-html="orderBusiness.trialInfo.trailContact?orderBusiness.trialInfo.trailContact:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
            </dgg-row>
            <dgg-row>
              <dgg-col :span="20">
                <dgg-form-item
                  label="审理级别："
                  prop="trailLevalName"
                >
                  <el-select
                    v-if="update"
                    v-model="orderBusiness.trialInfo.trailLevalCode"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in trailLeval"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                  <span
                    v-else
                    v-html="orderBusiness.trialInfo.trailLevalName?orderBusiness.trialInfo.trailLevalName:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
              <dgg-col :span="20">
                <dgg-form-item
                  label="承办法官："
                  prop="undertookJudge"
                >
                  <dgg-input
                    v-if="update"
                    v-model="orderBusiness.trialInfo.undertookJudge"
                  />
                  <span
                    v-else
                    v-html="orderBusiness.trialInfo.undertookJudge?orderBusiness.trialInfo.undertookJudge:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
            </dgg-row>
          </div>
          <!-- 审理信息 end -->

          <!-- 委托人信息 start -->
          <div class="content">
            <h3>委托人信息</h3>
            <dgg-row>
              <dgg-col :span="20">
                <dgg-form-item
                  label="姓名："
                  prop="clientInfo.clientName"
                >
                  <dgg-input
                    v-if="update"
                    v-model="orderBusiness.clientInfo.clientName"
                  />
                  <span
                    v-else
                    v-html="orderBusiness.clientInfo.clientName?orderBusiness.clientInfo.clientName:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
              <dgg-col :span="20">
                <dgg-form-item
                  label="联系电话："
                  prop="clientInfo.clientContact"
                >
                  <dgg-input
                    v-if="update"
                    v-model="orderBusiness.clientInfo.clientContact"
                    @input="orderBusiness.clientInfo.clientContact = orderBusiness.clientInfo.clientContact.replace(/[^\d]/g, '');"
                    :maxlength="11"
                  />
                  <span
                    v-else
                    v-html="orderBusiness.clientInfo.clientContact?orderBusiness.clientInfo.clientContact:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
              <dgg-col :span="20">
                <dgg-form-item
                  label="有无身份证："
                  prop="clientHaveIdCard"
                >
                  <dgg-select
                    v-if="update"
                    v-model="orderBusiness.clientInfo.clientHaveIdCard"
                    placeholder="请选择"
                  >
                    <dgg-option
                      label="有"
                      value="1"
                    />
                    <dgg-option
                      label="无"
                      value="0"
                    />
                  </dgg-select>
                  <span
                    v-else
                    v-html="orderBusiness.clientInfo.clientHaveIdCard==1?'有':'无'"
                  />
                </dgg-form-item>
              </dgg-col>
            </dgg-row>
            <dgg-row>
              <dgg-col :span="20">
                <dgg-form-item
                  label="性别："
                  prop="clientSexCode"
                >
                  <dgg-select
                    v-if="update"
                    v-model="orderBusiness.clientInfo.clientSexCode"
                    placeholder="请选择"
                  >
                    <dgg-option
                      label="男"
                      value="1"
                    />
                    <dgg-option
                      label="女"
                      value="0"
                    />
                  </dgg-select>
                  <span
                    v-else
                    v-html="orderBusiness.clientInfo.clientSexCode==1?'男':'女'"
                  />
                </dgg-form-item>
              </dgg-col>
              <dgg-col :span="20">
                <dgg-form-item
                  label="是否为当事人："
                  prop="clientIsParty"
                >
                  <dgg-select
                    v-if="update"
                    v-model="orderBusiness.clientInfo.clientIsParty"
                    placeholder="请选择"
                  >
                    <dgg-option
                      label="是"
                      value="1"
                    />
                    <dgg-option
                      label="否"
                      value="0"
                    />
                  </dgg-select>
                  <span
                    v-else
                    v-html="orderBusiness.clientInfo.clientIsParty==1?'是':'否'"
                  />
                </dgg-form-item>
              </dgg-col>
            </dgg-row>
          </div>
          <!-- 委托人信息 end -->

          <!-- 是当事人的时候显示对方当事人 start -->
          <div v-if="orderBusiness.clientInfo.clientIsParty == 1">
            <div
              class="content"
              v-for="(item,index) in orderBusiness.otherPartyInfoList"
              :key="index"
            >
              <h3>对方当事人
                <span
                  :class="index !==0 ?'contern-add-btn' : ''"
                  v-if="update"
                  @click="index==0?addDSR():removeDSR(index)"
                >
                <dgg-icon
                  icon-class="icon_append"
                  svg-width="13px"
                  svg-height="13px"
                />
                {{index==0?"增加":"删除"}}
              </span>
              </h3>
              <dgg-row>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="姓名："
                    prop="sideName"
                  >
                    <dgg-input
                      v-if="update"
                      v-model="item.otherPartyName"
                    />
                    <span
                      v-else
                      v-html="item.otherPartyName?item.otherPartyName:'无'"
                    />
                  </dgg-form-item>
                </dgg-col>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="联系电话："
                    prop="sidePhone"
                  >
                    <dgg-input
                      v-if="update"
                      v-model="item.otherPartyContact"
                      @input="item.otherPartyContact = item.otherPartyContact.replace(/[^\d]/g, '');"
                      :maxlength="11"
                    />
                    <span
                      v-else
                      v-html="item.otherPartyContact?item.otherPartyContact:'无'"
                    />
                  </dgg-form-item>
                </dgg-col>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="性别："
                    prop="sideSex"
                  >
                    <dgg-select
                      v-if="update"
                      v-model="item.otherPartySexCode"
                      placeholder="请选择"
                    >
                      <dgg-option
                        label="男"
                        value="1"
                      />
                      <dgg-option
                        label="女"
                        value="0"
                      />
                    </dgg-select>
                    <span
                      v-else
                      v-html="item.otherPartySexCode==1?'男':'女'"
                    />
                  </dgg-form-item>
                </dgg-col>
              </dgg-row>
              <dgg-row>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="有无身份证："
                    prop="card"
                  >
                    <dgg-select
                      v-if="update"
                      v-model="item.otherPartyHaveIdCard"
                      placeholder="请选择"
                    >
                      <dgg-option
                        label="有"
                        value="1"
                      />
                      <dgg-option
                        label="无"
                        value="0"
                      />
                    </dgg-select>
                    <span
                      v-else
                      v-html="item.otherPartyHaveIdCard==1?'有':'无'"
                    />
                  </dgg-form-item>
                </dgg-col>
              </dgg-row>
            </div>
          </div>
          <!-- 是当事人的时候显示对方当事人 end -->

          <!-- 不是当事人的时候显示原告与被告模块 start -->
          <div v-if="orderBusiness.clientInfo.clientIsParty == 0">
            <!-- 案件原告 start -->
            <div
              class="content"
              v-for="(item,index) in orderBusiness.casePlaintiffList"
              :key="index"
            >
              <h3>案件原告
                <span
                  :class="index !==0 ?'contern-add-btn' : ''"
                  v-if="update"
                  @click="index==0?addPlaintiff():removePlaintiff(index)"
                >
                <dgg-icon
                  icon-class="icon_append"
                  svg-width="13px"
                  svg-height="13px"
                />
                {{ index==0?"增加":"删除" }}
              </span>
              </h3>
              <dgg-row>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="姓名："
                    prop="sideName"
                  >
                    <dgg-input
                      v-if="update"
                      v-model="item.plaintiffName"
                    />
                    <span
                      v-else
                      v-html="item.plaintiffName?item.plaintiffName:'无'"
                    />
                  </dgg-form-item>
                </dgg-col>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="性别："
                    prop="sideSex"
                  >
                    <dgg-select
                      v-if="update"
                      v-model="item.plaintiffSexCode"
                      placeholder="请选择"
                    >
                      <dgg-option
                        label="男"
                        value="1"
                      />
                      <dgg-option
                        label="女"
                        value="0"
                      />
                    </dgg-select>
                    <span
                      v-else
                      v-html="item.plaintiffSex"
                    />
                  </dgg-form-item>
                </dgg-col>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="联系电话："
                    prop="sidePhone"
                  >
                    <dgg-input
                      v-if="update"
                      v-model="item.plaintiffContact"
                      @input="item.plaintiffContact = item.plaintiffContact.replace(/[^\d]/g, '');"
                      :maxlength="11"
                    />
                    <span
                      v-else
                      v-html="item.plaintiffContact?item.plaintiffContact:'无'"
                    />
                  </dgg-form-item>
                </dgg-col>
              </dgg-row>
              <dgg-row>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="有无身份证："
                    prop="card"
                  >
                    <dgg-select
                      v-if="update"
                      v-model="item.plaintiffHaveIdCard"
                      placeholder="请选择"
                    >
                      <dgg-option
                        label="有"
                        value="1"
                      />
                      <dgg-option
                        label="无"
                        value="0"
                      />
                    </dgg-select>
                    <span
                      v-else
                      v-html="item.plaintiffHaveIdCardStr"
                    />
                  </dgg-form-item>
                </dgg-col>
              </dgg-row>
            </div>
            <!-- 案件被告 start -->
            <div
              class="content"
              v-for="(item,index) in orderBusiness.caseDefendantList"
              :key="index"
            >
              <h3>案件被告
                <span
                  :class="index !==0 ?'contern-add-btn' : ''"
                  v-if="update"
                  @click="index==0?addAccused():removeaAccused(index)"
                >
                <dgg-icon
                  icon-class="icon_append"
                  svg-width="13px"
                  svg-height="13px"
                />
                {{ index==0?"增加":"删除" }}
              </span>
              </h3>
              <dgg-row>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="姓名："
                    prop="sideName"
                  >
                    <dgg-input
                      v-if="update"
                      v-model="item.defendantName"
                    />
                    <span
                      v-else
                      v-html="item.defendantName?item.defendantName:'无'"
                    />
                  </dgg-form-item>
                </dgg-col>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="性别："
                    prop="sideSex"
                  >
                    <dgg-select
                      v-if="update"
                      v-model="item.defendantSexCode"
                      placeholder="请选择"
                    >
                      <dgg-option
                        label="男"
                        value="1"
                      />
                      <dgg-option
                        label="女"
                        value="0"
                      />
                    </dgg-select>
                    <span
                      v-else
                      v-html="item.defendantSex"
                    />
                  </dgg-form-item>
                </dgg-col>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="联系电话："
                    prop="sidePhone"
                  >
                    <dgg-input
                      v-if="update"
                      v-model="item.defendantContact"
                      @input="item.defendantContact = item.defendantContact.replace(/[^\d]/g, '');"
                      :maxlength="11"
                    />
                    <span
                      v-else
                      v-html="item.defendantContact?item.defendantContact:'无'"
                    />
                  </dgg-form-item>
                </dgg-col>
              </dgg-row>
              <dgg-row>
                <dgg-col :span="20">
                  <dgg-form-item
                    label="有无身份证："
                    prop="card"
                  >
                    <dgg-select
                      v-if="update"
                      v-model="item.defendantHaveIdCard"
                      placeholder="请选择"
                    >
                      <dgg-option
                        label="有"
                        value="1"
                      />
                      <dgg-option
                        label="无"
                        value="0"
                      />
                    </dgg-select>
                    <span
                      v-else
                      v-html="item.defendantHaveIdCardStr"
                    />
                  </dgg-form-item>
                </dgg-col>
              </dgg-row>
            </div>
          </div>
          <!-- 不是当事人的时候显示原告与被告模块 end -->
          <!--案件详情-->
          <div class="content textarea-content">
            <h3>案件详情</h3>
            <dgg-row>
              <dgg-col :span="24">
                <dgg-form-item
                  label="基本信息："
                  prop="caseDetail"
                >
                  <dgg-input
                    v-if="update"
                    type="textarea"
                    :resize="'none'"
                    :rows="5"
                    v-model="orderBusiness.caseDetail.baseInfo"
                    @keyup.enter.native="$root.onEnter($event)"
                  >
                  </dgg-input>
                  <span
                    v-else
                    v-html="orderBusiness.caseDetail.baseInfo?orderBusiness.caseDetail.baseInfo:'无'"
                  ></span>
                </dgg-form-item>
              </dgg-col>
            </dgg-row>
          </div>
          <!-- 案件内容 start -->
          <div class="content textarea-content">
            <h3>案件内容</h3>
            <dgg-row>
              <dgg-col :span="24">
                <dgg-form-item
                  label="当事人诉求："
                  prop="clientAppeal"
                >
                  <dgg-input
                    v-if="update"
                    type="textarea"
                    :resize="'none'"
                    :rows="5"
                    v-model="orderBusiness.caseContent.clientAppeal"
                    @keyup.enter.native="$root.onEnter($event)"
                  >
                  </dgg-input>
                  <span
                    v-else
                    v-html="orderBusiness.caseContent.clientAppeal?orderBusiness.caseContent.clientAppeal:'无'"
                  ></span>
                </dgg-form-item>
              </dgg-col>
              <dgg-col :span="24">
                <dgg-form-item
                  label="面谈时给予方案："
                  prop="interviewPlan"
                >
                  <dgg-input
                    v-if="update"
                    type="textarea"
                    :resize="'none'"
                    :rows="5"
                    v-model="orderBusiness.caseContent.interviewPlan"
                    @keyup.enter.native="$root.onEnter($event)"
                  >
                  </dgg-input>
                  <span
                    v-else
                    v-html="orderBusiness.caseContent.interviewPlan?orderBusiness.caseContent.interviewPlan:'无'"
                  ></span>
                </dgg-form-item>
              </dgg-col>
            </dgg-row>
          </div>
          <!-- 案件内容 end -->

          <!-- 案件材料 start -->
          <div class="content textarea-content">
            <h3>案件材料</h3>
            <dgg-row>
              <dgg-col :span="24">
                <dgg-form-item
                  label="基础信息材料："
                  prop="type"
                >
                  <dgg-checkbox-group v-model="baseInfoMaterialList">
                    <dgg-checkbox
                      v-if="orderBusiness.clientInfo.clientIsParty == 1"
                      :disabled="!update"
                      label="对方身份证信息"
                      value="otherPartyIdCard"
                    />
                    <dgg-checkbox
                      :disabled="!update"
                      label="地址"
                      value="address"
                    />
                    <dgg-checkbox
                      :disabled="!update"
                      label="电话"
                      value="phoneNumber"
                    />
                    <dgg-checkbox
                      :disabled="!update"
                      label="身份证复印件"
                      value="clientIdCard"
                    />
                    <dgg-checkbox
                      :disabled="!update"
                      label="户口本"
                      value="householdRegister"
                    />
                    <dgg-checkbox
                      v-if="orderBusiness.clientInfo.clientIsParty != 1"
                      :disabled="!update"
                      label="原告身份信息"
                      value="plaintiffIdCard"
                    />
                    <dgg-checkbox
                      v-if="orderBusiness.clientInfo.clientIsParty != 1"
                      :disabled="!update"
                      label="被告身份信息"
                      value="defendantIdCard"
                    />
                  </dgg-checkbox-group>
                </dgg-form-item>
              </dgg-col>
              <dgg-col :span="24">
                <dgg-form-item
                  label="其他资料："
                  prop="otherData"
                >
                  <dgg-input
                    v-if="update"
                    :resize="'none'"
                    :rows="3"
                    v-model="orderBusiness.caseMaterial.otherMaterial"
                    type="textarea"
                    @keyup.enter.native="$root.onEnter($event)"
                  />
                  <span
                    v-else
                    v-html="orderBusiness.caseMaterial.otherMaterial?orderBusiness.caseMaterial.otherMaterial:'无'"
                  />
                </dgg-form-item>
              </dgg-col>
            </dgg-row>
          </div>
          <!-- 案件材料 end -->
        </div>
      </dgg-form>

      <!-- 已完结标签 -->
      <!-- v-if="transactionItem.orderStatusCode=='QDS_SC_ORDER_STATUS_CODE04'" -->
      <div
        class="finishImg"
        :class="{'back-order-seal-active':getOrderStatusSealName()=='已退单'}"
        fit="cover"
        v-if="getOrderStatusSealName()"
      >
        <!-- 返回盖章名称 -->
        <p class="finishImg-title">{{getOrderStatusSealName()}}</p>
        <p class="finishImg-time">{{ transactionItem.endTime | timeFilter('YYYY.MM.DD') }}</p>
      </div>
    </div>
    <!-- 右下角订单图标状态 -->
    <orderStatusIconComponents :storeTransactionItem="transactionItem"></orderStatusIconComponents>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
import orderStatusIconComponents from "@/views/main/page/components/orderStatusIcon.vue";
import Notification from '@/componentsEl/notification/index.js';
export default {
  name: "billComponent",
  components: {
    orderStatusIconComponents //右下角订单图标状态
  },
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad: async (node, resolve) => {
          let code = node.level === 0 ? null : node.data.code;
          let area =
            node.level === 0
              ? await this.get_area()
              : await this.get_area({ code: code });
          if (area.code === 200) {
            area.data.forEach((item, inx) => {
              item.value = item.code;
              item.label = item.name;
            });
            resolve(area.data);
          } else {
            //error notice
          }
        }
      },
      caseVenueText: "案件管辖地",
      baseInfoMaterialList: [],
      flscChannel: [],
      flscChannelText: "",
      baseInfoMaterialVal: {
        plaintiffIdCard: "原告身份信息",
        defendantIdCard: "被告身份信息",
        otherPartyIdCard: "对方身份证信息",
        address: "地址",
        phoneNumber: "电话",
        clientIdCard: "身份证复印件",
        householdRegister: "户口本"
      },
      rules: {
        'clientInfo.clientName': [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        'clientInfo.clientContact': [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            message: "请输入正确的手机号",
            trigger: "blur",
            pattern: /^0?(13|14|15|16|17|18|19)[0-9]{9}$/i
          }
        ],
        clientHaveIdCard: [
          { required: true, message: "请选择是否有身份证号", trigger: "blur" },
        ],
        clientSexCode: [
          { required: true, message: "请选择性别", trigger: "blur" },
        ],
        clientIsParty: [
          { required: true, message: "请选择是否为当事人", trigger: "blur" },
        ]
      },
      orderBusiness: {
        update: "",
        trialInfo: {},
        caseDetail: {},
        clientInfo: {},
        caseContent: {},
        lawCaseInfo: {},
        caseMaterial: {
          otherMaterial: "",
          baseInfoMaterial: {}
        },
        caseDefendantList: [],
        casePlaintiffList: [],
        otherPartyInfoList: []
      },
      originalOrderBusiness: {},
      trailLeval: [],
      update: false,
      disabled: false,
      texts: [],
      courtPage: {
        currentPage: 1,
        start: 1,
        limit: 10
      },
      courts: [],
      orginClientContact: '',
      courtSearch: "",
      courtSelect: "",
      loading: false,
      courtSelectPlaceholder: "请选择审理法院"
    };
  },
  computed: {
    ...mapState(["userId", "transactionItem", "orderStatus", "orderStatusName"])
  },
  watch: {
    'orderBusiness.clientInfo.clientIsParty': function() {
      console.log(this.orderBusiness);
    }
  },
  async mounted() {
    this.getCourt();
    this.getOrderBusiness();
    const res = await this.refuse_code_tree_book_list({
      code: "QDS_BOTTOM_SHEET_TRAIL_LEVEL",
      type: 1,
      level: 1
    });
    if (res.code === 200) {
      this.trailLeval = res.data;
    }
    const result = await this.refuse_code_tree_book_list({
      code: "SC_FLSC_CHANNEL",
      type: 1,
      level: 1
    });
    if (result.code === 200) {
      this.flscChannel = result.data;
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
    ...mapActions("teamSettingModule", ["get_area"]),
    ...mapActions("transactionModule", [
      "get_order_business",
      "edit_bottom_sheet",
      "get_court_with_page"
    ]),
    ...mapActions("receiveModule", ["refuse_code_tree_book_list"]),
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
    getCourtSearch(query) {
      this.courts = [];
      this.getCourt({ ...this.courtPage, courtName: query });
    },
    async getCourt(page) {
      page && (this.courtPage = page);
      let params = {
        ...this.courtPage
      };
      let res = await this.get_court_with_page(params);
      if (res.code === 200) {
        this.courts.pop();
        this.courts.push(...res.data.records);
        // 判断返回total === courts.length 不添加更多选项
        res.data.totalCount !== this.courts.length &&
          this.courts.push({ id: "all", courtName: "更多" });
      }
    },
    async getMoreCourt(val) {
      // val === 'all' && (this.courtPage.start++ && !this.getCourt() && (this.courtSelect = ''));
      val === "all" && this.courtPage.start++ && !this.getCourt();
      val === "all" &&
        this.$nextTick(() => {
          this.courtSelect = "";
        });
      val !== "all" && (this.courtSelectPlaceholder = "请选择审理法院");
    },
    // 获取底单
    async getOrderBusiness() {
      let res = await this.get_order_business({ id: this.transactionItem.id }); //  this.transactionItem.id
      if (res.code === 200) {
        this.orderBusiness = res.data.sheetData;
        this.orderBusiness.update = `更新时间：${res.data.updateTime}`;
        // otherPartyInfoList  对方当事人  casePlaintiffList 案件原告  caseDefendantList 案件被告   orderBusiness.caseDefendantList
        if (this.orderBusiness.caseDefendantList.length === 0) {
          this.orderBusiness.caseDefendantList.push(
            {
              defendantName: "",
              defendantSexCode: "",
              defendantContact: "",
              defendantHaveIdCar: ''
            }
          );
        }
        if (this.orderBusiness.otherPartyInfoList.length === 0) {
          this.orderBusiness.otherPartyInfoList.push({
            otherPartyName: "",
            otherPartySexCode: "",
            otherPartyContact: "",
            otherPartyHaveIdCar: ""
          });
        }
        if (this.orderBusiness.casePlaintiffList.length === 0) {
          this.orderBusiness.casePlaintiffList.push(
            {
              plaintiffName: "",
              plaintiffSexCode: "",
              plaintiffContact: "",
              plaintiffHaveIdCar: ""
            }
            // { name: '', sex: '1', phone: '', card: '1' }
          );
        }
        // 初始化已选择审理法院
        this.courtSelectPlaceholder = this.orderBusiness.trialInfo.trailCourt
          ? this.orderBusiness.trialInfo.trailCourt
          : "请选择审理法院";
        this.courtSelect = this.orderBusiness.trialInfo.trailCourtId
          ? this.orderBusiness.trialInfo.trailCourtId
          : "";
        // 案件渠道
        this.flscChannelText = this.orderBusiness.lawCaseInfo.caseChannel;
        for (let key in this.orderBusiness.caseMaterial.baseInfoMaterial) {
          if (this.orderBusiness.caseMaterial.baseInfoMaterial[key] === "1") {
            this.baseInfoMaterialList.push(this.baseInfoMaterialVal[key]);
          }
        }
        this.originalOrderBusiness = JSON.parse(
          JSON.stringify(this.orderBusiness)
        );
        if (this.orderBusiness.lawCaseInfo.caseAreaName.length > 0) {
          this.caseVenueText = this.orderBusiness.lawCaseInfo.caseAreaName;
        }
        this.orginClientContact = this.orderBusiness.clientInfo.clientContact;
      }
    },
    changeCaseVenueText(val) {
      this.orderBusiness.lawCaseInfo.caseAreaCode = val.join(",");
      let node = this.$refs.caseArea.getCheckedNodes()[0];
      let areaName = node.data.name;
      node.parent && (areaName = node.parent.data.name + "," + areaName);
      node.parent &&
        node.parent.parent &&
        (areaName = node.parent.parent.data.name + "," + areaName);
      this.orderBusiness.lawCaseInfo.caseAreaName = areaName;
    },
    async edit(type) {
      if (type === "cancelEdit") {
        this.orderBusiness = JSON.parse(
          JSON.stringify(this.originalOrderBusiness)
        );
        console.log(this.orderBusiness);
      } else if (type === "save") {
        if (this.orderBusiness.clientInfo && Object.keys(this.orderBusiness.clientInfo).length) {
          if (!this.orderBusiness.clientInfo.clientName) {
            Notification.error({
              message: '请输入委托人姓名'
            })
            return;
          }
          if (!/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(this.orderBusiness.clientInfo.clientContact) && this.orderBusiness.clientInfo.clientContact !== this.orginClientContact) {
            Notification.error({
              message: '请输入委托人联系方式'
            });
            return;
          }
        } else {
          Notification.error({
            message: '请输入委托人信息'
          });
          return;
        }
        //
        this.orderBusiness.caseDefendantList = this.orderBusiness.caseDefendantList.filter(item => {
          console.log(item.defendantName || item.defendantContact)
          return item.defendantName || item.defendantContact;
        });
        this.orderBusiness.casePlaintiffList = this.orderBusiness.casePlaintiffList.filter(item => {
          return item.plaintiffName || item.plaintiffContact;
        });
        this.orderBusiness.otherPartyInfoList = this.orderBusiness.otherPartyInfoList.filter(item => {
          return item.otherPartyName || item.otherPartyContact;
        });
        console.log(this.orderBusiness.caseDefendantList);
        //
        let { caseMaterial, lawCaseInfo, trialInfo } = this.orderBusiness;
        for (let key in caseMaterial.baseInfoMaterial) {
          if (
            this.baseInfoMaterialList.includes(this.baseInfoMaterialVal[key])
          ) {
            caseMaterial.baseInfoMaterial[key] = "1";
          } else {
            caseMaterial.baseInfoMaterial[key] = "0";
          }
        }
        lawCaseInfo.caseChannel = this.flscChannelText;
        let name = this.flscChannel.filter(item => {
          return item.code === this.flscChannelText;
        });
        name.length &&
          name[0].name &&
          (lawCaseInfo.caseChannelName = name[0].name);
        this.courtSelect && (trialInfo.trailCourtId = this.courtSelect);
        let arr = JSON.parse(
          JSON.stringify(this.orderBusiness.otherPartyInfoList)
        );
        this.orderBusiness.otherPartyInfoList = [];
        arr.forEach(item => {
          item.otherPartyName &&
            this.orderBusiness.otherPartyInfoList.push(item);
        });
        !this.orderBusiness.otherPartyInfoList.length &&
          this.orderBusiness.otherPartyInfoList.push([]);
        let params = {
          id: this.transactionItem.id,
          sheetData: JSON.stringify(this.orderBusiness)
        };
        let res = await this.edit_bottom_sheet(params);
        if (res.code === 200) {
          this.getOrderBusiness();
        } else {
          return;
        }
      }
      this.update = !this.update;
      this.disabled = !this.disabled;
    },
    // 点添加当事人模块
    addDSR() {
      this.orderBusiness.otherPartyInfoList.push({
        otherPartyName: "",
        otherPartySexCode: "",
        otherPartyContact: "",
        otherPartyHaveIdCar: ""
      });
    },
    // 删除当事人模块
    removeDSR(index) {
      this.orderBusiness.otherPartyInfoList.splice(index, 1);
    },
    // 点击添加原告模块
    addPlaintiff() {
      this.orderBusiness.casePlaintiffList.push(
        {
          plaintiffName: "",
          plaintiffSexCode: "",
          plaintiffContact: "",
          plaintiffHaveIdCar: ""
        }
        // { name: '', sex: '1', phone: '', card: '1' }
      );
    },
    // 删除原告模块
    removePlaintiff(index) {
      this.orderBusiness.casePlaintiffList.splice(index, 1);
    },
    // 点击添加被告模块
    addAccused() {
      this.orderBusiness.caseDefendantList.push(
        {
          defendantName: "",
          defendantSexCode: "1",
          defendantContact: "",
          defendantHaveIdCar: 1
        }
        // { name: '', sex: '1', phone: '', card: '1' }
      );
    },
    // 删除原告模块
    removeaAccused(index) {
      this.orderBusiness.caseDefendantList.splice(index, 1);
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/main.less"; //引入全局less文件
.billComponent {
  position: relative;
  .el-form {
    .el-form-item {
      text-align: left !important;
    }
    .el-form-item__content{
      max-width: 700px;
      word-break: break-all;
    }
    .el-row {
      padding-left: 60px;
    }
  }
  width: 100%;
  height: 100%;
  margin: 0 0 40px;
  .form-top {
    width: 100%;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    border-bottom: 1px solid #edeff0;
    padding: 20px 30px;
    .time-left {
      span {
        font-size: 14px;
        color: #9398a1;
      }
    }
  }
  .el-button {
    width: 76px;
    height: 30px;
    font-size: 14px;
    border-radius: 4px !important;
    letter-spacing: 1px;
  }
  .form-content {
    width: 100%;
    padding: 0 30px;
    .content {
      width: 100%;
      border-top: 1px solid #edeff0;
      padding: 0 0 5px;
      h3 {
        width: 100%;
        position: relative;
        font-size: 16px;
        color: #19233c;
        line-height: 22px;
        font-weight: 500;
        position: relative;
        padding-left: 15px;
        margin: 30px 0 20px;
        letter-spacing: 1px;
        span {
          position: absolute;
          right: 0;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #10bbb8;
          line-height: 20px;
          cursor: pointer;
          .dgg-icon {
            vertical-align: -0.1em;
          }
        }
        .contern-add-btn {
          color: #f10940;
          .dgg-icon {
            display: none;
          }
        }
        &:before {
          content: "";
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1dc4c1;
          position: absolute;
          left: 0;
          top: 50%;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
        }
      }
    }
    .content:first-child {
      border-top: none;
    }
  }
  .dgg-cascade,
  .el-select {
    width: 700px;
  }
  .el-form-item__content {
    span,
    .el-input__inner,
    .el-textarea {
      font-size: 14px;
      color: #666873;
    }
    > span {
      padding-left: 10px;
    }
  }
  .el-form-item__label {
    width: 135px;
    font-size: 14px;
    color: #9398a1;
    padding-right: 20px;
  }
  .el-input__inner {
    border-color: #e3e4e6;
    height: 30px;
    line-height: 30px;
    width: 700px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-textarea,
  .el-checkbox-group {
    width: 700px;
  }
  .el-textarea {
    line-height: 24px;
  }
  .el-textarea__inner {
    text-align: left;
    padding: 5px 15px;
    line-height: 24px;
  }
  .textarea-content {
    .el-form-item__content {
      > span {
        display: block;
        width: 700px;
        padding: 10px 15px;
        line-height: 24px;
        word-break: break-all;
      }
      .el-textarea {
        width: 700px !important;
      }
    }
  }
  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #666873;
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
      width: 700px;  //880px
    }
  }
}
</style>
