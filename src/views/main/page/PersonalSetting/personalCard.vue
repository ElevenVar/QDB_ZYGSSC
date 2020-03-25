<template>
  <div
    v-loading="loading"
    class="personal-card"
    @click="closeDialog"
  >
    <div
      ref="leftScrollView"
      class="left"
      @scroll="onScroll"
    >
      <dgg-form
        ref="personalInfo"
        :model="personalForm"
        :rules="personalRules"
        label-width="95px"
        class="demo-ruleForm"
      >
        <div
          id="basic"
          class="module-title personal-title"
        >
          <div class="left-text">
            <dgg-icon
              icon-class="icon_basicinfo"
              svg-width="22px"
              svg-height="22px"
            />
            <span>基本信息</span>
          </div>
        </div>
        <dgg-form-item label="头像：">
          <el-upload
            :data="{
              fileId: userId,
              isDeleteOriginalFile: true
            }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="uploadUrl + '?type=merchant_postcards_header'"
            class="avatar-uploader"
          >
            <div
              v-if="personalForm.headerUrl"
              class="avatar-box"
            >
              <div class="avatar-shadow">
                <dgg-icon
                  class="upload-icon"
                  icon-class="icon_upload_head"
                  svg-width="40px"
                  svg-height="40px"
                />
                <p class="upload-text">修改头像</p>
              </div>
              <img
                :src="personalForm.headerUrl"
                class="avatar"
              >
            </div>

            <div
              v-else
              class="avatar-uploader-icon"
            >
              <dgg-icon
                class="upload-icon"
                icon-class="icon_upload_head"
                svg-width="40px"
                svg-height="40px"
              />
              <p class="upload-text">上传头像</p>
            </div>
          </el-upload>
          <p class="upload-tip">建议上传 <span>2000x2000</span> 的清晰艺术照</p>
        </dgg-form-item>
        <dgg-row>
          <dgg-col :span="12">
            <dgg-form-item
              label="姓名："
              prop="userName"
            >
              <dgg-input
                :disabled="hasVerify"
                v-model="personalForm.userName"
                style="width:250px;"
                :maxlength="10"
                placeholder="请输入"
              />
            </dgg-form-item>
          </dgg-col>
          <dgg-col :span="12">
            <dgg-form-item
              label="职位："
              prop="position"
            >
              <dgg-input
                v-model="personalForm.position"
                style="width:250px;"
                :maxlength="20"
                placeholder="请输入"
              />
            </dgg-form-item>
          </dgg-col>
          <dgg-col :span="12">
            <dgg-form-item
              label="律所："
              prop="department"
            >
              <dgg-input
                v-model="personalForm.department"
                style="width:250px;"
                :maxlength="20"
                placeholder="请输入"
              />
            </dgg-form-item>
          </dgg-col>
          <dgg-col :span="12">
            <dgg-form-item
              label="手机："
              prop="phone"
            >
              <dgg-input
                v-model="personalForm.phone"
                style="width:250px;"
                :maxlength="11"
                placeholder="请输入"
              />
            </dgg-form-item>
          </dgg-col>
          <dgg-col :span="12">
            <dgg-form-item
              label="地区："
              prop="areaCode"
            >
              <dgg-select
                v-model="personalForm.areaCode"
                class="select-250"
                placeholder="请选择业务地区"
                @change="handleAreaChange"
              >
                <dgg-option
                  v-for="item in areaList"
                  :label="item.name"
                  :value="item.code"
                  :key="item.code"
                />
              </dgg-select>
            </dgg-form-item>
          </dgg-col>
        </dgg-row>
        <div class="line-gap" />
        <div
          id="lawyers"
          class="module-title personal-title"
        >
          <div class="left-text">
            <dgg-icon
              icon-class="icon_lawyer"
              svg-width="22px"
              svg-height="22px"
            />
            <span>律师介绍</span>
          </div>
        </div>
        <dgg-form-item
          label="简介："
          prop="presentation"
        >
          <dgg-input
            v-model="personalForm.presentation"
            :autosize="{ minRows: 4, maxRows: 4 }"
            type="textarea"
            :maxlength="500"
            resize="none"
            style="width:714px;"
            placeholder="请输入简介"
          />
        </dgg-form-item>
        <div class="line-gap" />
        <div
          id="practiceExp"
          class="module-title personal-title"
        >
          <div class="left-text">
            <dgg-icon
              icon-class="icon_experience"
              svg-width="22px"
              svg-height="22px"
            />
            <span>执业经历</span>
          </div>
        </div>
        <dgg-row class="experience">
          <dgg-col :span="12">
            <dgg-form-item
              label="执业证："
              prop="professionalCertificate"
            >
              <dgg-input
                v-model="personalForm.professionalCertificate"
                style="width:250px;"
                :maxlength="20"
                placeholder="请输入执业证号"
              />
            </dgg-form-item>
          </dgg-col>
          <dgg-col :span="12">
            <dgg-form-item
              label="执业年限："
              prop="professionalLife"
            >
              <dgg-input
                ref="professionalLifeInput"
                v-if="professionalLifeInput"
                v-model="personalForm.professionalLife"
                style="width:250px;"
                :maxlength="20"
                placeholder="请输入年限"
                :max="999"
                :min="3"
                type="number"
                @input.native="clearNoNum(personalForm.professionalLife)"
              />
            </dgg-form-item>
          </dgg-col>
          <dgg-col :span="12">
            <dgg-form-item
              label="学历："
              prop="educationBackground"
            >
              <dgg-select
                v-model="personalForm.educationBackground"
                class="select-250"
                placeholder="请选择学历"
              >
                <dgg-option
                  v-for="item in eduBackgroundList"
                  :label="item.name"
                  :value="item.code"
                  :key="item.code"
                />
              </dgg-select>
            </dgg-form-item>
          </dgg-col>
          <dgg-col :span="24">
            <dgg-form-item
              label="擅长领域："
              prop="goodAtField"
              class="good-at"
            >
              <div class="label-box">
                <div
                  v-for="item in personalForm.goodAtField"
                  :key="item.code"
                  class="label-item"
                >
                  <span class="text-one-line">{{ item.name }}</span>
                  <dgg-button
                    type="text"
                    class="gray-text-btn"
                    icon="el-icon-close"
                    @click="removeLabel(item)"
                  />
                </div>
                <dgg-tooltip
                  content="添加领域"
                  effect="dark"
                  placement="top"
                  style="position: relative"
                >
                  <dgg-button
                    type="primary"
                    class="gray-icon-btn"
                    icon="el-icon-plus"
                    @click.stop="showLabel"
                  />
                </dgg-tooltip>
                <filed-popper
                  ref="filedPopperView"
                  @add-callback="addCallback"
                  @click.stop=""
                />
              </div>
              <!-- <dgg-select
                v-model="personalForm.field"
                :multiple-limit="5"
                class="select-250"
                multiple
                placeholder="请选择"
              >
                <dgg-option
                  v-for="item in fieldOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </dgg-select> -->
            </dgg-form-item>
          </dgg-col>
        </dgg-row>
        <div class="line-gap" />
        <div
          id="socialPosition"
          class="module-title personal-title"
        >
          <div class="left-text">
            <dgg-icon
              icon-class="icon_social"
              svg-width="22px"
              svg-height="22px"
            />
            <span>社会职务</span>
          </div>
          <div class="right-btn">
            <dgg-button
              type="text"
              @click="addSocialPosition"
            >
              <dgg-icon
                icon-class="icon_plus"
                svg-width="14px"
                svg-height="14px"
              />添加</dgg-button>
          </div>
        </div>
        <dgg-row
          v-for="(it, index) in personalForm.socialPosition"
          :key="index"
          class="specail-row"
        >
          <dgg-col :span="7">
            <dgg-form-item
              label="职务："
              prop="socPosition"
            >
              <dgg-select
                v-model="it.position"
                class="select-116"
                placeholder="请选择"
                @change="changePosition($event,it)"
              >
                <dgg-option
                  v-for="item in positionList"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                />
              </dgg-select>
            </dgg-form-item>
          </dgg-col>
          <dgg-col :span="8">
            <dgg-form-item
              :prop="'socialPosition.' + index + '.organizationName'"
              :rules="{
                required: true, message: '请输入机构名称', trigger: 'blur'
              }"
              label=""
            >
              <dgg-input
                v-model="it.organizationName"
                style="width:250px;"
                :maxlength="20"
                placeholder="请输入机构名称"
              />
            </dgg-form-item>
          </dgg-col>
          <dgg-col :span="8">
            <dgg-form-item
              :prop="'socialPosition.' + index + '.positionName'"
              :rules="{
                required: true, message: '请输入职务', trigger: 'blur'
              }"
              label=""
            >
              <dgg-input
                v-model="it.positionName"
                :maxlength="20"
                style="width:250px;"
                placeholder="请输入职务"
              />
            </dgg-form-item>
          </dgg-col>
          <dgg-col
            v-if="personalForm.socialPosition.length > 1"
            :span="1"
          >
            <dgg-button
              class="main-back-color"
              @click="deleteSocialPosition(index)"
            >删除</dgg-button>
          </dgg-col>
        </dgg-row>
        <div class="line-gap" />
        <div
          id="honors"
          class="module-title personal-title"
        >
          <div class="left-text">
            <dgg-icon
              icon-class="icon_honor"
              svg-width="22px"
              svg-height="22px"
            />
            <span>荣誉奖励</span>
          </div>
          <div class="right-btn">
            <dgg-button
              type="text"
              @click="addHonorList"
            >
              <dgg-icon
                icon-class="icon_plus"
                svg-width="14px"
                svg-height="14px"
              />添加</dgg-button>
          </div>
        </div>
        <dgg-row
          v-for="(it, index) in personalForm.reward"
          :key="it.id"
          class="experience specail-row"
        >
          <dgg-col :span="12">
            <dgg-form-item
              :prop="'reward.' + index + '.rewardTime'"
              :rules="{
                required: true, message: '请选择时间', trigger: 'blur'
              }"
              label="时间："
            >
              <dgg-picker
                v-model="it.rewardTime"
                :picker-options="pickerOptions"
                value-format="timestamp"
                date-type="date"
                placeholder="请选择时间"
              />
            </dgg-form-item>
          </dgg-col>
          <dgg-col :span="11">
            <dgg-form-item
              :prop="'reward.' + index + '.rewardName'"
              :rules="{
                required: true, message: '请输入荣誉名称', trigger: 'blur'
              }"
              label="荣誉名称："
            >
              <dgg-input
                v-model="it.rewardName"
                style="width:250px;"
                :maxlength="20"
                placeholder="请输入荣誉名称"
              />
            </dgg-form-item>
          </dgg-col>
          <dgg-col
            v-if="personalForm.reward.length > 1"
            :span="1"
          >
            <dgg-button
              class="main-back-color"
              @click="deleteHonorList(index)"
            >删除</dgg-button>
          </dgg-col>
        </dgg-row>
        <div class="line-gap" />
        <div
          id="case"
          class="module-title personal-title"
        >
          <div class="left-text">
            <dgg-icon
              icon-class="icon_mycase"
              svg-width="22px"
              svg-height="22px"
            />
            <span>我的案例</span>
          </div>
        </div>
        <div class="case-box">
          <ul class="case-list">
            <li
              v-for="item in caseList"
              :key="item.id"
              @click="casePreview(item)"
            >
              <div
                class="close"
                @click.prevent="removeCase(item)"
              >
                <dgg-icon
                  svg-width="10px"
                  svg-height="10px"
                  icon-class="dgg-close"
                />
              </div>
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
                      class="person-img"
                    >
                  </dgg-tooltip>
                </div>
                <p class="time">
                  更新时间：<span>{{
                    Number(item.updateTime) | timeFilter("YYYY.MM.DD HH:mm:ss")
                  }}</span>
                </p>
              </div>
            </li>
            <li
              class="ref-case"
              @click="refCaseHandler"
            >
              <dgg-icon
                icon-class="icon_connect"
                svg-width="34px"
                svg-height="34px"
              /><br>
              关联案例
            </li>
          </ul>
        </div>
        <div class="line-gap mt-30" />
        <div
          id="photoAlbum"
          class="module-title personal-title"
        >
          <div class="left-text">
            <dgg-icon
              icon-class="icon_album"
              svg-width="22px"
              svg-height="22px"
            />
            <span>律师相册</span>
          </div>
        </div>
        <dgg-upload
          ref="postcardsAlbumRef"
          :data="{
            fileId: userId,
            isDeleteOriginalFile: false,
            type: 'merchant_postcards_album_' + XReqYT
          }"
          :limit="20"
          :accept-type="acceptType"
          :on-remove="setProcessNum"
          :on-success="setProcessNum"
          :list-url="listUrl"
          :download-url="downloadUrl"
          :upload-url="uploadUrl"
          :del-url="deleteUrl"
          upload-word="上传图片"
        />
        <div class="line-gap mt-30" />
        <div
          id="socialContr"
          class="module-title personal-title"
        >
          <div class="left-text">
            <dgg-icon
              icon-class="icon_donate"
              svg-width="22px"
              svg-height="22px"
            />
            <span>社会贡献</span>
          </div>
        </div>
        <dgg-upload
          ref="postcardsContributionRef"
          :data="{
            fileId: userId,
            isDeleteOriginalFile: false,
            type: 'merchant_postcards_contribution_' + XReqYT
          }"
          :limit="20"
          :accept-type="acceptType"
          :on-remove="setProcessNum"
          :on-success="setProcessNum"
          :list-url="listUrl"
          :download-url="downloadUrl"
          :upload-url="uploadUrl"
          :del-url="deleteUrl"
          upload-word="上传图片"
        />
      </dgg-form>
    </div>
    <div class="right">
      <div class="progress-bar">
        <p>完善度</p>
        <el-progress
          :percentage="finished"
          :stroke-width="4"
        />
      </div>
      <div class="anchor-box">
        <div
          v-for="item in anchorMenu"
          :key="item.id"
          :class="{ active: curAnchor === item.id }"
          :name="item.id"
          class="anchor-item"
          @click="changeAnchor(item.id)"
        >
          <a :href="'#' + item.id">{{ item.name }}</a>
        </div>
      </div>
      <div class="btns-group">
        <dgg-button
          type="primary"
          style="width:60px;"
          @click="submitSave('save')"
        >保存</dgg-button>
        <dgg-button
          type="primary"
          style="width:60px;"
          @click="submitSave('release')"
        >发布</dgg-button>
      </div>
    </div>
    <ref-case
      ref="refCaseView"
      :max-cases="maxCases"
      @add-callback="addCaseCallback"
    />
    <dgg-modal
      :modal="modalCasePreview"
      :hasmodal="true"
      :has-footer="false"
      :append-to-body="true"
      modal-class="case-view-modal"
      title=""
      width="1180px"
      @modalQuit="closeModal"
    >
      <case-details-preview
        v-if="propCaseId"
        ref="caseDetailView"
        :prop-case-id="propCaseId"
        @close-case="closeModal"
      />
    </dgg-modal>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
import lodash from "lodash";
import config from "@/service/config";
import refCase from "./dialog/refCase";
import FiledPopper from "./dialog/filedPopper";
import CaseDetailsPreview from "../case/caseDetailsPreview";
import validate from "@/utils/validate";
import Notification from "@/componentsEl/notification/index.js";
export default {
  name: "PersonalCard",
  components: {
    refCase,
    FiledPopper,
    CaseDetailsPreview
  },
  data() {
    const validateYear = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入执业年限"));
      } else {
        if (isNaN(value)) {
          callback(new Error("请输入数值"));
        }
        callback();
      }
    };
    return {
      modalCasePreview: false,
      loading: false,
      hasVerify: false,
      scrollTop: 0,
      finished: 0,
      maxCases: 20,
      curAnchor: "basic",
      propCaseId: "",
      acceptType: ["jpg", "png", "jpeg"],
      pickerOptions: {
        disabledDate(time) {
          const today = new Date();
          return time.getTime() > today.getTime();
        }
      },
      cardId: "",
      userDetail: {
        areaCode: "",
        career: "",
        caseIds: "",
        createTime: "",
        dataCompleted: "",
        department: "",
        goodAtField: "",
        headerUrl: "",
        isOnline: "",
        phone: "",
        photoAlbum: [],
        position: "",
        presentation: "",
        reward: "",
        socialContribution: [],
        socialPosition: "",
        updateTime: "",
        userId: "",
        userCenterId: "",
        userName: ""
      },
      professionalLifeInput: true,
      personalForm: {
        headerUrl: "",
        userName: "",
        position: "",
        department: "",
        phone: "",
        areaCode: "",
        area: null,
        presentation: "",
        professionalCertificate: "",
        professionalLife: "",
        educationBackground: "",
        goodAtField: [],
        socialPosition: [
          {
            position: "",
            positionLabel: "",
            organizationName: "",
            positionName: ""
          }
        ],
        reward: [
          {
            rewardTime: "",
            rewardName: ""
          }
        ]
      },
      personalRules: {
        headerUrl: { required: true, message: "请上传头像" },
        userName: { required: true, message: "请输入名称", trigger: "blur" },
        /* organizationName: {
          required: true,
          message: '请输入职位',
          trigger: 'blur'
        },
        socPosition: {
          required: true,
          message: '请输入职位',
          trigger: 'blur'
        }, */
        position: {
          required: true,
          message: "请输入职位",
          trigger: "blur"
        },
        department: { required: true, message: "请输入律所", trigger: "blur" },
        phone: validate.phoneNumberValid,
        professionalCertificate: {
          required: true,
          message: "请输入执业证",
          trigger: "blur"
        },
        areaCode: {
          required: true,
          message: "请输入业务地区",
          trigger: "blur"
        },
        professionalLife: {
          required: true,
          validator: validateYear,
          trigger: "blur"
        }
      },
      anchorMenu: [
        {
          id: "basic",
          name: "基本信息"
        },
        {
          id: "lawyers",
          name: "律师介绍"
        },
        {
          id: "practiceExp",
          name: "执业经历"
        },
        {
          id: "socialPosition",
          name: "社会职务"
        },
        {
          id: "honors",
          name: "荣誉奖励"
        },
        {
          id: "case",
          name: "我的案例"
        },
        {
          id: "photoAlbum",
          name: "律师相册"
        },
        {
          id: "socialContr",
          name: "社会贡献"
        }
      ],
      eduBackgroundList: [],
      areaList: [],
      positionList: [
        {
          value: "2",
          label: "现任"
        },
        {
          value: "1",
          label: "曾任"
        }
      ],
      statusText: {
        overrule: "已驳回",
        edite: "草稿",
        checked: "审核通过",
        checking: "待审核"
      },
      caseList: []
    };
  },
  computed: {
    ...mapState(["userId", "XReqYT"]),
    uploadUrl() {
      return config.uploadUrl;
    },
    downloadUrl() {
      return config.downloadUrl;
    },
    listUrl() {
      return config.listUrl;
    },
    deleteUrl() {
      return config.deleteUrl;
    }
  },
  watch: {
    personalForm: {
      deep: true,
      handler(val) {
        this.setProcessNum();
      }
    },
    caseList() {
      this.setProcessNum();
    }
  },
  async mounted() {
    this.getDataDic();
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
    ...mapActions("personalSettingModule", [
      "query_usercard_detail",
      "add_or_editor",
      "get_normal_book_list",
      "get_company_city",
      "ref_caseids_list"
    ]),
    // 关联案例
    refCaseHandler() {
      if (this.caseList.length >= this.maxCases) {
        this.$message({
          message: "一个案例最多只能关联" + this.maxCases + "个案例",
          type: "warning"
        });
        return;
      }
      const caseIds = this.caseList.map(it => it.caseCenterId);
      this.$refs.refCaseView.showModel(true, caseIds);
    },
    // 输入数字限制
    clearNoNum(input) {
      if (input.length > 20) {
        input = input.slice(0, 20);
      }
      if (input > 999) {
        console.log(1);
        input = 999;
      }
      input = input.toString();
      input = input.replace(/[^\d.]/g, ""); // 清除“数字”和“.”以外的字符
      input = input.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
      input = input
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      input = input.replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3"); // 只能输入两个小数
      if (input.indexOf(".") < 0 && input !== "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        input = parseFloat(input);
      }
      this.personalForm.professionalLife = input;
      this.professionalLifeInput = false;
      this.$nextTick(() => {
        this.professionalLifeInput = true;
        this.$nextTick(() => this.$refs.professionalLifeInput.focus());
      });
    },
    // 删除案例
    removeCase(item) {
      const event = window.event;
      event.stopPropagation();
      this.$confirm("确定取消关联案例？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const caseIndex = this.caseList.findIndex(
          it => it.caseCenterId === item.caseCenterId
        );
        this.caseList.splice(caseIndex, 1);
      });
    },
    caseTypeRef(val) {
      switch (val) {
        case "民诉":
          return "icon_civil";
        case "刑诉":
          return "icon_criminal";
        case "法律":
          return "icon_law";
        case "行诉":
          return "icon_litigation";
        case "非诉":
          return "icon_nonlitigation";
        default:
          return "icon_others";
      }
    },
    // 职务现任曾任切换回调
    changePosition(val, it) {
      const labelItem = this.positionList.find(i => i.value === val);
      this.$set(it, "positionLabel", labelItem.label || "");
    },
    // 计算完善度
    setProcessNum() {
      const itemKeys = Object.keys(this.personalForm);
      const hasValKeys = itemKeys.filter(it => {
        if (it === "socialPosition") {
          return this.personalForm[it].filter(or => or.organizationName).length;
        } else if (it === "reward") {
          return this.personalForm[it].filter(re => re.rewardName).length;
        } else {
          return (
            this.personalForm[it] &&
            (this.personalForm[it].length ||
              Object.keys(this.personalForm[it]).length)
          );
        }
      });
      const conLen = this.$refs.postcardsContributionRef.fileList.length
        ? 1
        : 0;
      const albumLen = this.$refs.postcardsAlbumRef.fileList.length ? 1 : 0;
      const hasValKeysLen =
        hasValKeys.length + (this.caseList.length ? 1 : 0) + conLen + albumLen;
      const percentVal = hasValKeysLen / (itemKeys.length + 2);
      this.finished = Math.ceil(percentVal * 100);
    },
    getPartList(list) {
      if (list && list.length > 5) {
        return list.slice(0, 4);
      }
      return list;
    },
    getDataDic() {
      this.get_normal_book_list({ code: "QDS_MERCHANT_EDU" }).then(res => {
        if (res.code === 200) {
          this.eduBackgroundList = res.data;
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
      this.get_company_city().then(res => {
        if (res.code === 200) {
          this.areaList = res.data;
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      });
    },
    getDetail() {
      this.loading = true;
      this.query_usercard_detail()
        .then(res => {
          if (res.code === 200) {
            this.$set(this, "userDetail", res.data);
            this.getCaseListByIds(res.data.caseIds);
            const globalPersonMsg = JSON.parse(
              sessionStorage.getItem("globalPersonMsg")
            );
            res.data.userName = res.data.userName
              ? res.data.userName
              : globalPersonMsg.userName;
            res.data.phone = res.data.phone
              ? res.data.phone
              : globalPersonMsg.phone;
            this.hasVerify = true;
            this.personalForm = {
              headerUrl: res.data.headerUrl,
              userName: res.data.userName,
              position: res.data.position,
              department: res.data.department,
              phone: res.data.phone,
              areaCode: res.data.area.code || "",
              area: res.data.area,
              presentation: res.data.presentation,
              professionalCertificate: res.data.career.professionalCertificate,
              professionalLife: res.data.career.professionalLife,
              educationBackground: res.data.career.educationBackground,
              goodAtField: res.data.goodAtField || [],
              socialPosition: res.data.socialPosition || [
                {
                  position: "",
                  positionLabel: "",
                  organizationName: "",
                  positionName: ""
                }
              ],
              reward: res.data.reward || [
                {
                  rewardTime: "",
                  rewardName: ""
                }
              ]
            };
            this.cardId = res.data.id || "";
          } else {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    // 通过ids获取案例列表
    getCaseListByIds(ids) {
      if (!ids || !ids.length) return;
      this.ref_caseids_list({
        caseIds: ids
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
    changeAnchor(id) {
      this.curAnchor = id;
    },
    handleAvatarSuccess(res, file) {
      this.personalForm.headerUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addSocialPosition() {
      if (
        this.personalForm.socialPosition &&
        this.personalForm.socialPosition.length === 20
      ) {
        this.$message.warning("最多可以添加20个社会职务!");
        return;
      }
      this.personalForm.socialPosition.push({
        position: "",
        positionLabel: "",
        organizationName: "",
        positionName: ""
      });
    },
    deleteSocialPosition(index) {
      this.personalForm.socialPosition.splice(index, 1);
    },
    addHonorList() {
      if (this.personalForm.reward && this.personalForm.reward.length === 20) {
        this.$message.warning("最多可以添加20个荣誉奖励!");
        return;
      }
      this.personalForm.reward.push({
        rewardTime: "",
        rewardName: ""
      });
    },
    deleteHonorList(index) {
      this.personalForm.reward.splice(index, 1);
    },
    handleAreaChange(val) {
      const item = this.areaList.find(it => it.code === val);
      this.$set(this.personalForm, "area", item);
    },
    submitSave(type) {
      this.$refs.personalInfo.validate(async valid => {
        if (valid) {
          this.loading = true;
          const caseIds = this.caseList.map(it => it.caseCenterId);
          const params = {
            ...this.personalForm,
            caseIds,
            career: {
              professionalCertificate: this.personalForm
                .professionalCertificate,
              professionalLife: this.personalForm.professionalLife,
              educationBackground: this.personalForm.educationBackground
            },
            dataCompleted: this.finished,
            submitType: type === "save" ? 0 : 1
          };
          if (this.cardId) {
            params.id = this.cardId;
          }
          console.log(params, "paramsparams");
          this.add_or_editor(params)
            .then(res => {
              if (res.code === 200) {
                Notification.success({
                  message: type === "save" ? "保存成功" : "发布成功",
                  type: "success"
                });
                this.submitPreview();
              } else {
                this.$notify({
                  message: res.message,
                  type: "error",
                  customClass: "dgg-tip-msg"
                });
              }
              this.loading = false;
            })
            .catch(e => {
              this.loading = false;
            });
        }
      });
    },
    submitPreview() {
      this.$emit("preview-card");
    },
    removeLabel(data) {
      const itemIndex = this.personalForm.goodAtField.findIndex(
        item => item.code === data.code
      );
      if (itemIndex > -1) {
        this.personalForm.goodAtField.splice(itemIndex, 1);
      }
    },
    showLabel() {
      const fileds = this.personalForm.goodAtField.map(item => item.code);
      this.$refs.filedPopperView.showModel(true, fileds);
    },
    // 关闭添加擅长领域弹窗，绑定在body上面
    closeDialog() {
      if (this.$refs.filedPopperView.modalFiled) {
        this.$refs.filedPopperView.modalFiled = !this.$refs.filedPopperView
          .modalFiled;
      }
    },
    // 擅长领域回调
    addCallback(list) {
      console.log(list, "选定擅长标签的集合---+++++++---------");
      this.$set(this.personalForm, "goodAtField", lodash.cloneDeep(list));
    },
    // 关联案例
    addCaseCallback(list) {
      this.$set(this, "caseList", [
        ...lodash.cloneDeep(this.caseList),
        ...lodash.cloneDeep(list)
      ]);
    },
    closeModal() {
      this.modalCasePreview = false;
      this.propCaseId = "";
    },
    casePreview(item) {
      this.propCaseId = item.caseCenterId;
      this.modalCasePreview = true;
    },
    onScroll() {
      const _article = document.querySelectorAll(".personal-title");
      this.scrollTop = this.$refs.leftScrollView.scrollTop;
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
.personal-card {
  display: flex;
  width: 100%;
  height: 790px;
  .el-dialog--center {
    .el-dialog__body {
      padding-bottom: 12px;
    }
  }
  .experience {
    /deep/ .el-form-item__label {
      width: 95px !important;
    }
  }
  .good-at {
    /deep/ .el-form-item__label {
      margin-top: 5px;
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
      position: relative;
      display: inline-block;
      width: 256px;
      height: 256px;
      margin-right: 25px;
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
      .close {
        position: absolute;
        right: -8px;
        top: -8px;
        z-index: 99;
        display: none;
        width: 18px;
        height: 18px;
        line-height: 14px;
        text-align: center;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.3);
        color: #ffffff;
        &:hover {
          opacity: 0.8;
        }
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
      &:hover {
        box-shadow: 0px 14px 18px 0px rgba(181, 181, 181, 0.4);
        .close {
          display: block;
        }
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
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 60%;
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
  .specail-row {
    .el-col-7 {
      width: 27.5%;
    }
    .el-col-7 {
      width: 27.5%;
    }
    .el-col-8 {
      width: 32.8%;
    }
    .el-col-1 {
      width: 6.5%;
    }
    .el-col-11 {
      width: 43.3%;
    }
    .main-back-color {
      margin-top: 6px;
      border: 0;
      background: #ffffff;
      color: #f10940;
    }
  }
  .el-form {
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item__label {
      font-size: 14px;
      color: #666873;
    }
    .dgg-upload-wrapper {
      margin-top: 6px;
      margin-bottom: 30px;
    }
  }
  .mt-30 {
    margin-top: 30px;
  }
  .ref-case {
    display: inline-block;
    width: 256px;
    height: 256px;
    background: #f0f2f5 !important;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    color: #9398a1;
    .dgg-icon {
      margin-top: 96px;
      margin-bottom: 10px;
    }
  }
  .line-gap {
    height: 1px;
    margin-top: 16px;
    background-color: #e3e4e6;
  }
  .select-116 {
    .el-input {
      width: 116px;
    }
  }
  .select-250 {
    .el-input {
      width: 250px;
    }
  }
  .el-date-editor {
    width: 250px;
  }
  .avatar-uploader {
    display: inline-block;
    .upload-icon {
      margin-top: 36px;
    }
    .upload-text {
      line-height: normal;
    }
    .el-upload {
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-box {
      position: relative;
      &:hover {
        .avatar-shadow {
          display: block;
        }
      }
      .avatar-shadow {
        position: absolute;
        display: none;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        p {
          color: #ffffff;
        }
      }
    }
  }
  .upload-tip {
    display: inline-block;
    color: #9398a1;
    font-size: 14px;
    margin-left: 24px;
    span {
      color: #19233c;
    }
  }
  .avatar-uploader-icon {
    font-size: 14px;
    color: #9398a1;
    width: 150px;
    height: 150px;
    border-radius: 4px;
    text-align: center;
    background-color: #f0f2f5;
  }
  .avatar {
    width: 150px;
    height: 150px;
    object-fit: cover;
    display: block;
  }
  .left {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 26px 30px;
    .module-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 30px 0 24px;
      .left-text {
        display: flex;
        span {
          margin-left: 8px;
          font-size: 16px;
          font-weight: bold;
          color: @flsc-main;
        }
      }
      .right-btn {
        .dgg-icon {
          vertical-align: middle;
          margin-right: 4px;
        }
      }
    }
  }
  .right {
    flex: 0 0 auto;
    width: 300px;
    padding-top: 30px;
    border-left: 1px @flsc-border-color solid;
    .progress-bar {
      padding: 0 30px 14px 20px;
      border-bottom: 1px @flsc-border-color solid;
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
  .btns-group {
    padding: 20px;
    font-size: 0;
    .el-button + .el-button {
      margin-left: 18px;
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
      &:not(.active) {
        &:hover {
          a {
            color: @main;
          }
        }
      }
      a {
        display: block;
        color: @flsc-main;
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
    /deep/ .filed-popper {
      position: absolute;
      .el-dialog__wrapper {
        position: absolute !important;
        top: -5px !important;
        left: 215px !important;
        overflow: inherit;
        .el-dialog {
          min-width: 220px !important;
          width: 220px !important;
          height: 220px;
          margin-top: 0 !important;
          .el-dialog__header {
            display: none;
          }
          .el-dialog__body {
            padding: 15px;
            .infinite-list-wrapper {
              height: 155px;
              overflow: scroll;
            }
          }
          .el-dialog__footer {
            display: none;
          }
        }
      }
    }
  }
}
.case-view-modal {
  overflow: hidden;
  > .el-dialog {
    height: calc(100% - 102px);
    margin-top: 80px !important;
    > .el-dialog__header {
      display: none;
    }
    > .el-dialog__body {
      height: 100%;
      overflow: auto;
      padding: 0 !important;
    }
  }
}
</style>
