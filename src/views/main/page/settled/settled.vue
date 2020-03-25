<template>
  <div class="content">
    <div class="step-content">
      <dgg-steps
        :active="active"
        align-center
        class="steps"
        finish-status="success"
      >
        <dgg-step title="店铺范畴"></dgg-step>
        <dgg-step title="业务信息"></dgg-step>
        <dgg-step title="平台审核"></dgg-step>
      </dgg-steps>
    </div>
    <div v-if="active === 0" class="message">
      <div class="message-form">
        <dgg-form ref="messageForm" :rules="rule" :model="messageForm">
          <dgg-form-item class="margin-bottom-25" label="营业执照：">
            <dgg-upload
              :listUrl="listUrl"
              :uploadUrl="uploadUrl"
              :delUrl="deleteUrl"
              :downloadUrl="downloadUrl"
              :before-upload="beforeAvatarUpload"
              upload-word="上传图片"
              :limit="1"
              :data="{
                fileId: storeInfoData.userId,
                isDeleteOriginalFile: false,
                type: 'merchant_store_business_license'
              }"
              :onSuccess="uploadSuccess"
            ></dgg-upload>
          </dgg-form-item>
          <dgg-form-item
            class="margin-bottom-7"
            prop="storeName"
            key="storeName"
            label="店铺名称："
          >
            <dgg-input
              placeholder="自动识别"
              v-model="messageForm.storeName"
              maxlength="50"
              @input="
                messageForm.storeName = messageForm.storeName.replace(
                  /\s*/g,
                  ''
                )
              "
              @change="storeNameCheck"
            ></dgg-input>
          </dgg-form-item>
          <dgg-form-item
            key="3"
            label="联系地址："
            class="select-cities"
            prop="merchantAddress"
          >
            <el-select
              v-model="provinceVal"
              placeholder="省"
              @change="provinceSelect"
              class="margin-right-10"
            >
              <el-option
                v-for="item in province"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="cityVal"
              placeholder="市"
              @change="citySelect"
              class="margin-right-10"
            >
              <el-option
                v-for="item in city"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
            <el-select v-model="countyVal" placeholder="区/县">
              <el-option
                v-for="item in county"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
            <div class="margin-top-8">
              <dgg-input
                v-model="messageForm.merchantAddress"
                maxlength="50"
                @input="
                  messageForm.merchantAddress = messageForm.merchantAddress.replace(
                    /\s+/g,
                    ''
                  )
                "
                placeholder="自动识别"
              ></dgg-input>
            </div>
          </dgg-form-item>
          <dgg-form-item
            class="margin-bottom-7"
            prop="storePhone"
            key="storePhone"
            label="联系电话："
          >
            <dgg-input
              placeholder="联系电话"
              v-model="messageForm.storePhone"
              maxlength="11"
              @input="
                messageForm.storePhone = messageForm.storePhone.replace(
                  /[^\d]/g,
                  ''
                )
              "
            ></dgg-input>
          </dgg-form-item>
        </dgg-form>
      </div>
      <div class="message-example">
        <div>示例</div>
        <div>
          <div class="example-img">
            <img src="../../../../assets/images/business-license.png" alt="" />
          </div>
          <ul class="example-explain">
            <li><span>请上传营业执照照片</span></li>
            <li><span>必须看清证件信息，且证件信息不能被遮挡</span></li>
            <li><span>仅支持.jpg .bmp .png .gif的图片格式</span></li>
            <li><span>图片大小不超过4M</span></li>
            <li><span>您提供的照片企大宝将予以保护，不会用于其他用途</span></li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="active === 1" class="text-align-center">
      <div class="business-area">
        <dgg-form
          ref="businessArea"
          :modal="businessArea"
          :label-position="'right'"
          label-width="100px"
        >
          <dgg-form-item key="4" label="业务办理区域：">
            <dgg-button
              v-for="item in businessArea"
              :key="item.id"
              :class="{
                businessAreaButtonActive: !item.select,
                left: true,
                businessAreaButton: true
              }"
              @click="selectBusinessArea(item)"
            >
              {{ item.name }}
            </dgg-button>
          </dgg-form-item>
          <dgg-form-item class="business" key="6" label="办理业务：">
            <span class="add-business" @click="businessPanel = !businessPanel">
              <dgg-icon :icon-class="'dgg-plus'" :class="'x2'" />
              添加
            </span>
          </dgg-form-item>
          <dgg-form-item key="7" class="select-business" label="已选：">
            <el-tag
              v-for="(item, index) in selectYtBusiness"
              :key="item.id"
              closable
              type="success"
              @close="selectYtBus(item, true)"
            >
              <span class="el-tag-slot ellipsis" :title="item.name">
                {{ item.name }}
              </span>
            </el-tag>
          </dgg-form-item>
        </dgg-form>
      </div>
    </div>
    <div v-if="active === 2" class="submit-success">
      <task-bit-map
        svg-class="icon_compimg"
        svg-width="100px"
        svg-height="100px"
        tip-title="提交成功"
        synopsis="预计1-3个工作日审核完成"
      >
        <dgg-button
          slot="button"
          class="back-index"
          @click="ruoterJump({ name: 'workbench' })"
          >返回首页</dgg-button
        >
      </task-bit-map>
    </div>
    <dgg-button v-if="active !== 2" class="next-step" @click="nextStep"
      >下一步</dgg-button
    >
    <el-dialog
      :visible.sync="businessPanel"
      width="866px"
      top="220px"
      title="添加业务"
      class="dialog-business"
    >
      <!--      <dgg-input-->
      <!--        class="search-input"-->
      <!--        prefix-icon="el-icon-search"-->
      <!--        @change="businessSearch"-->
      <!--        v-model="businessSearchVal"-->
      <!--        placeholder="业务关键词"-->
      <!--      />-->
      <div class="dialog-cascader">
        <el-card shadow="never" class="cascader-body cascader-1">
          <div slot="header" class="clearfix">业态</div>
          <el-scrollbar>
            <template v-if="ytList.length > 0">
              <div
                v-for="item in ytList"
                :key="item.id"
                @click="ytSelect(item)"
                class="cascader-item"
                :class="{ active: item.select }"
              >
                {{ item.name }}
              </div>
            </template>
            <div v-else class="cascader-item">暂无数据</div>
          </el-scrollbar>
        </el-card>
        <el-card shadow="never" class="cascader-body cascader-2">
          <div slot="header" class="clearfix">二级业态</div>
          <el-scrollbar>
            <template v-if="showYtLevel2.length > 0">
              <div
                v-for="item in showYtLevel2"
                :key="item.id"
                @click="getYtBusiness(item)"
                class="cascader-item"
                :class="{ active: item.select }"
              >
                {{ item.name }}
              </div>
            </template>
            <div v-else class="cascader-item">暂无数据</div>
          </el-scrollbar>
        </el-card>
        <el-card shadow="never" class="cascader-body cascader-3">
          <div slot="header" class="clearfix">业务</div>
          <el-scrollbar id="YtBusiness">
            <template v-if="YtBusiness.length > 0">
              <div
                v-for="item in YtBusiness"
                :key="item.id"
                @click="selectYtBus(item)"
                class="cascader-item"
                :class="{ active: selectYtBusinessId.indexOf(item.id) > -1 }"
              >
                {{ item.name }}
                <i
                  v-if="selectYtBusinessId.indexOf(item.id) > -1"
                  class="el-icon-success"
                ></i>
              </div>
            </template>
            <div v-else class="cascader-item">暂无数据</div>
          </el-scrollbar>
        </el-card>
      </div>
      <div class="notice">
        <span style="color: #F10940;font-family:PingFangSC-Regular,PingFang SC;"
          >*</span
        >在平台审核通过前，只能接收已有业务的订单~
      </div>
      <div class="selected" :style="{ height: selectedMoreHeight }">
        <span>已选：</span>
        <span v-for="item in selectYtBusiness" :key="item.id">
          <span :title="item.name">{{ item.name }}</span>
          <dgg-icon
            :icon-class="'dgg-close'"
            :class="'x2'"
            @click="selectYtBus(item)"
          />
        </span>
        <el-button type="text" class="selected-more" @click="selectedMore">{{
          selectedMoreText
        }}</el-button>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBusSelect">取 消</el-button>
        <el-button type="primary" @click="confirmBusSelect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/service/config";
import TaskBitMap from "@/views/main/page/components/taskBitMap";
import Notification from "@/componentsEl/notification/index.js";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "index",
  components: {
    TaskBitMap
  },
  data: function() {
    return {
      businessSearchVal: "",
      merchantAddress: "",
      businessList: [],
      selectedMoreHeight: "",
      selectedMoreText: "展开更多",
      businessPanel: false,
      active: 0,
      selectBusiness: [],
      messageForm: {
        storeName: "",
        merchantAddress: "",
        storePhone: ""
      },
      businessArea: [],
      ytList: [],
      showYtLevel2: [],
      YtBusiness: [],
      selectYtBusiness: [],
      selectYtBusinessId: [],
      tempSelectYtBusiness: [],
      tempSelectYtBusinessId: [],
      rule: {
        storeName: [
          { required: true, message: "请输入店铺名称", trigger: "blur" }
        ],
        storePhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            message: "请输入正确的手机号",
            trigger: "blur",
            pattern: /^0?(13|14|15|16|17|18|19)[0-9]{9}$/i
          }
        ],
        merchantAddress: [
          { required: true, message: "请输入联系地址", trigger: "blur" }
        ]
      },
      province: [],
      city: [],
      county: [],
      provinceVal: "",
      cityVal: "",
      countyVal: "",
      storeNameRepeat: false
    };
  },
  computed: {
    ...mapState(["userId", "storeInfoData"]),
    shopMsgValid() {
      if (
        !/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(this.messageForm.storePhone)
      ) {
        return false;
      }
      if (
        !this.provinceVal.length ||
        !this.messageForm.storeName.length ||
        !this.messageForm.merchantAddress
      ) {
        return false;
      }
      return !this.storeNameRepeat;
      // return true;
    },
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
    },
    contactAddressProvinceName() {
      let name = "";
      if (this.province.length === 0 || this.provinceVal.length === 0) {
        return name;
      }
      this.province.forEach((item, index) => {
        if (item.code === this.provinceVal) {
          name = item.name;
        }
      });
      return name;
    },
    contactAddressCityName() {
      let name = "";
      if (this.city.length === 0 || this.cityVal.length === 0) {
        return name;
      }
      this.city.forEach((item, index) => {
        if (item.code === this.cityVal) {
          name = item.name;
        }
      });
      return name;
    },
    contactAddressCountyName() {
      let name = "";
      if (this.county.length === 0 || this.countyVal.length === 0) {
        return name;
      }
      this.county.forEach((item, index) => {
        if (item.code === this.countyVal) {
          name = item.name;
        }
      });
      return name;
    }
  },
  mounted: async function() {
    if (
      this.storeInfoData.storeStatus === 0 ||
      this.storeInfoData.storeStatus === 1
    ) {
      this.$alert("您已有店铺，不可重复入驻", "店铺提示", {
        confirmButtonText: "确定",
        callback: async action => {
          this.ruoterJump({ name: "teamSetting" });
        }
      });
    }
    let globalPersonMsg = JSON.parse(sessionStorage.getItem("globalPersonMsg"));
    globalPersonMsg &&
      Object.keys(globalPersonMsg).length &&
      (this.messageForm.storePhone = globalPersonMsg.phone);
    let area = await this.get_area();
    if (area.code === 200) {
      this.province = area.data;
    }
  },
  methods: {
    ...mapActions(["ruoterJump"]),
    ...mapActions("settledModule", [
      "get_area",
      "get_company_city",
      "get_yt_list",
      "apply_store",
      "img_msg",
      "get_yt_prodyct_list",
      "is_store_name_repeat"
    ]),
    ...mapActions("workbenchModule", [
      "query_user_data" //  用户名片接口
    ]),
    async storeNameCheck() {
      if (this.messageForm.storeName.length) {
        let res = await this.is_store_name_repeat({
          storeName: this.messageForm.storeName
        });
        if (res.code === 7036) {
          this.storeNameRepeat = true;
        } else {
          this.storeNameRepeat = false;
        }
      }
    },
    businessSearch(val) {
      let result = [];
      this.YtBusiness.forEach((item, index) => {
        if (item.name.indexOf(val) !== -1) {
          result.unshift(item);
        } else {
          result.push(item);
        }
      });
      this.YtBusiness = result;
      document.getElementById("YtBusiness").parentNode.scrollTop = 0;
    },
    async provinceSelect(val) {
      let area = await this.get_area({ code: val });
      if (area.code === 200) {
        this.city = area.data;
        this.cityVal = "";
        this.county = [];
        this.countyVal = "";
      }
    },
    async citySelect(val) {
      let area = await this.get_area({ code: val });
      if (area.code === 200) {
        this.county = area.data;
        this.countyVal = "";
      }
    },
    ytChangeConfirm(select) {
      this.$alert(
        "法律业态不可与其他业态同时选择，切换业态将清空已选产品，是否确认切换业态,",
        "提示",
        {
          confirmButtonText: "确定",
          callback: action => {
            this.selectYtBusiness = []; // 直接清除所有已选产品
            if (select === "fl") {
              // 清除其他
            } else {
              // 清除法律
            }
          }
        }
      );
    },
    ytSelect(item) {
      if (item.code === "BUS_YT_FL") {
        let hasOther = false;
        this.selectYtBusiness.forEach((item, index) => {
          if (item.productTypeParent !== "BUS_YT_FL") {
            hasOther = true;
          }
        });
        if (hasOther) {
          this.ytChangeConfirm("fl");
        }
      } else {
        let hasFL = false;
        this.selectYtBusiness.forEach((item, index) => {
          if (item.productTypeParent === "BUS_YT_FL") {
            hasFL = true;
          }
        });
        if (hasFL) {
          this.ytChangeConfirm("other");
        }
      }
      this.ytList.forEach((ite, index) => {
        ite.select = false;
      });
      item.select = true;
      this.showYtLevel2 = item.ytList;
      this.showYtLevel2.forEach((it, inx) => {
        this.$set(it, "select", false);
      });
    },
    confirmBusSelect() {
      this.tempSelectYtBusiness = JSON.parse(
        JSON.stringify(this.selectYtBusiness)
      );
      this.tempSelectYtBusinessId = JSON.parse(
        JSON.stringify(this.selectYtBusinessId)
      );
      this.businessPanel = false;
    },
    cancelBusSelect() {
      this.selectYtBusiness = JSON.parse(
        JSON.stringify(this.tempSelectYtBusiness)
      );
      this.selectYtBusinessId = JSON.parse(
        JSON.stringify(this.tempSelectYtBusinessId)
      );
      this.businessPanel = false;
      this.ytList.forEach((ite, index) => {
        ite.select = false;
      });
      this.showYtLevel2.forEach((it, inx) => {
        this.$set(it, "select", false);
      });
    },
    async getYtBusiness(item) {
      let areas = "";
      this.businessArea.forEach((it, inx) => {
        if (it.select) {
          areas += it.code;
          areas += ",";
          // if(inx !== this.selectBusinessArea.length -1){
          //   areas += ',';
          // }
        }
      });
      areas = areas.slice(0, areas.length - 1);
      this.showYtLevel2.forEach((ite, index) => {
        ite.select = false;
      });
      item.select = true;
      let ytBus = await this.get_yt_prodyct_list({
        proType: item.code,
        area: areas
      });
      if (ytBus.code === 200) {
        this.YtBusiness = ytBus.data;
        this.YtBusiness.forEach((it, inx) => {
          it.parent = item;
        });
      }
    },
    selectYtBus(item, changeTemp) {
      if (this.selectYtBusinessId.indexOf(item.id) === -1) {
        if (this.selectYtBusinessId.length === 20) {
          Notification.error("一次最多可选20个产品");
          return;
        }
        this.selectYtBusinessId.push(item.id);
        this.selectYtBusiness.push(item);
      } else {
        this.selectYtBusinessId.splice(
          this.selectYtBusinessId.indexOf(item.id),
          1
        );
        this.selectYtBusiness.forEach((it, inx) => {
          if (it.id === item.id) {
            this.selectYtBusiness.splice(inx, 1);
          }
        });
      }
      if (changeTemp) {
        this.tempSelectYtBusiness = JSON.parse(
          JSON.stringify(this.selectYtBusiness)
        );
        this.tempSelectYtBusinessId = JSON.parse(
          JSON.stringify(this.selectYtBusinessId)
        );
      }
    },
    beforeAvatarUpload(file) {
      const typeLimit = ["image/jpeg", "image/png", "image/bmp", "image/gif"];
      const isJPG = typeLimit.includes(file.type);
      const isLt4M = file.size / 1024 / 1024 < 50;

      if (!isJPG) {
        Notification.error("上传图片格式不正确!");
        // this.$message.error("上传图片格式不正确!");
      }
      if (!isLt4M) {
        Notification.error("上传图片大小不能超过 50MB!!");
        // this.$message.error("上传图片大小不能超过 50MB!");
      }
      return isJPG && isLt4M;
    },
    selectedMore() {
      if (this.selectedMoreHeight === "auto") {
        this.selectedMoreHeight = "";
        this.selectedMoreText = "展开更多";
      } else {
        this.selectedMoreHeight = "auto";
        this.selectedMoreText = "收起";
      }
    },
    async uploadSuccess(data) {
      if (data.code === 200) {
        let params = {
          detect_type: "DETECT_BUSINESS_LICENSE",
          url: data.data.filepath
        };
        const formData = new FormData();
        Object.keys(params).forEach(key => {
          formData.append(key, params[key]);
        });
        let res = await this.img_msg(formData);
        if (res.code === 0) {
          if (res.data.length > 0) {
            this.messageForm.storeName = res.data[0].org_name;
            this.messageForm.merchantAddress = res.data[0].address;
            if (this.messageForm.storeName.length) {
              let res = await this.is_store_name_repeat({
                storeName: this.messageForm.storeName
              });
              if (res.code === 7036) {
                this.storeNameRepeat = true;
              }
            }
          }
        }
      }
    },
    async nextStep() {
      if (this.active === 1) {
        // 提交申请
        let areaText = "";
        this.businessArea.forEach((it, inx) => {
          if (it.select) {
            areaText += it.code;
            areaText += ",";
            // if (inx < this.businessArea.length) {
            //   areaText += ',';
            // }
          }
        });
        areaText = areaText.slice(0, areaText.length - 1);
        if (areaText.length === 0) {
          Notification.error({
            message: "请选择业务办理区域"
          });
          return;
        }
        let productJson = [];
        if (this.selectYtBusiness.length === 0) {
          Notification.error({
            message: "请选择业务"
          });
          return;
        }
        this.selectYtBusiness.forEach((item, index) => {
          let product = {
            businessTypeCode: item.productTypeParent,
            businessTypeName: item.productTypeParentName,
            businessProductCode: item.parent.code,
            businessProductName: item.parent.name,
            productId: item.id,
            productName: item.name,
            areas: areaText
          };
          productJson.push(product);
        });
        let params = {
          merchantName: this.messageForm.storeName,
          provinceCode: this.provinceVal,
          provinceName: this.contactAddressProvinceName,
          cityCode: this.cityVal,
          cityName: this.contactAddressCityName,
          countyCode: this.countyVal,
          countyName: this.contactAddressCountyName,
          merchantAddress: this.messageForm.merchantAddress,
          merchantContractPhone: this.messageForm.storePhone,
          productJson: JSON.stringify(productJson)
        };
        let res = await this.apply_store(params);
        if (res.code === 200) {
          this.$message.success("已提交审核，感谢耐心等待");
          this.$nextTick(() => {
            this.query_user_data({
              userId: this.userId
            }).then(res => {
              if (res.code == 200) {
                this.$nextTick(() => {
                  this.active++;
                });
              }
            });
          });
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      } else {
        if (!this.shopMsgValid) {
          if (
            !/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(
              this.messageForm.storePhone
            )
          ) {
            Notification.error({
              message: "请填写正确手机号码"
            });
            return;
          }
          Notification.error({
            message: this.storeNameRepeat
              ? "店铺名被占用，请重新输入"
              : "如未自动识别成功，请手动填写店铺信息"
          });
          return;
        } else {
          this.active++;
        }
      }
      if (this.active === 1) {
        let companyCity = await this.get_company_city();
        if (companyCity.code === 200) {
          this.businessArea = companyCity.data;
          this.businessArea.forEach((item, index) => {
            this.$set(item, "select", false);
          });
        }
        let yts = await this.get_yt_list();
        if (yts.code === 200) {
          this.ytList = yts.data;
          this.ytList.forEach((it, inx) => {
            this.$set(it, "select", false);
          });
        }
      }
      if (this.active === 3) {
        this.active = 0;
      }
    },
    selectBusinessArea(item) {
      item.select = !item.select;
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/less/main.less"; //引入全局less文件
.content {
  text-align: center;
  background: #ffffff;
  min-height: 720px;
}
.left {
  float: left;
}
.margin-bottom-25 {
  margin-bottom: 25px;
}
.margin-bottom-7 {
  margin-bottom: 7px;
}
.margin-top-8 {
  margin-top: 8px;
}
.text-align-center {
  text-align: center;
}
.margin-right-10 {
  margin-right: 10px;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.step-content {
  .steps {
    overflow-x: auto;
    overflow-y: hidden;
  }
  /deep/ .dgg-steps {
    width: 1110px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 40px;
    .el-step__title {
      font-size: 12px;
    }
    .el-step__line {
      margin: 0 20px !important;
      height: 1px;
      top: 14px;
    }
    .is-process {
      .el-step__icon {
        border: 0;
        .el-step__icon-inner {
          color: #ffffff;
        }
      }
    }
    .is-success {
      font-weight: bold;
      color: #19233c;
      border-color: var(--main-primary-color);
      .el-step__icon {
        border: 1px solid var(--main-primary-color);
        .el-step__icon-inner {
          color: var(--main-primary-color);
          /*color: #10BBB8;*/
        }
      }
      .el-step__line {
        background: var(--main-primary-color);
      }
    }
    .el-step__icon {
      height: 28px;
      width: 28px;
      border: 1px solid;
    }
    .el-step__icon-inner {
      font-weight: bold;
      color: #666873;
    }
  }
}
.message {
  width: 100%;
  position: relative;
  padding-right: 50%;
  margin-top: 50px;
  .message-form {
    /deep/ .el-form {
      .el-form-item__label {
        font-size: 14px;
        padding: 0 30px 0 0;
      }
      .el-form-item__content {
        text-align: left;
      }
      .el-input {
        width: 250px;
      }
      .select2 {
        width: 76px !important;
        height: 30px !important;
        margin-right: 8px;
      }
      .select-cities {
        .el-select {
          width: 74px !important;
          .el-input {
            width: 100%;
            .el-input__inner {
              border-radius: 1px;
              padding-right: 20px;
            }
          }
        }
      }
    }
    padding-left: 30px;
    width: 100%;
    border-right: 1px #edeff0 solid;
  }
  .message-example {
    text-align: left;
    padding-left: 50px;
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
    height: 100%;
    > div {
      &:first-child {
        color: #666873;
        font-size: 14px;
      }
      position: relative;
      overflow: visible;
      margin-bottom: 20px;
      .example-img {
        width: 160px;
        position: absolute;
        top: 0;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .example-explain {
      margin-left: 195px;
      padding-top: 24px;
      li {
        color: #e3e4e6;
        list-style-type: disc;
        span {
          color: #9398a1;
        }
      }
    }
  }
}
.business-area {
  font-size: 14px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
  /deep/ .el-form {
    margin-left: 360px;
    .el-form-item__content {
      margin-left: 0 !important;
      max-width: 500px;
      text-align: left;
    }
    .el-form-item__label {
      padding: 0;
      font-size: 14px;
      margin-right: 30px;
    }
    .businessAreaButton {
      margin-left: 0;
      margin-right: 20px;
      width: 100px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .businessAreaButtonActive {
      background: #ffffff;
      color: #666873;
    }
  }
  /deep/ .dgg-select2 {
    margin-right: 10px;
    .select2-selection {
      border-radius: 4px;
      .select2-selection__rendered {
        text-align: left;
        padding-left: 17px;
      }
      .select2-selection__arrow {
        right: 8px;
      }
    }
  }
  /deep/ .dgg-button {
    height: 28px;
    width: 58px;
    vertical-align: middle;
    background: var(--main-primary-color);
    color: #ffffff;
    padding-top: 0;
    padding-bottom: 0;
  }
}
.business {
  margin-top: 24px;
  font-size: 14px;
  .add-business {
    position: relative;
    color: var(--main-primary-color);
    cursor: pointer;
    /*color: #10BBB8;*/
    .dgg-icon {
      width: 13px !important;
      height: 13px !important;
      color: var(--main-primary-color);
      /*color: #10BBB8;*/
    }
  }
  /deep/ .el-cascader-panel {
    position: absolute;
    background: white;
    box-shadow: 0px 2px 7px 3px rgba(158, 162, 175, 0.16);
    border: 0;
    z-index: 2;
    .el-cascader-menu {
      width: 140px;
      min-width: 140px;
      height: 180px;
      border: solid 1px #e4e7ed;
      border-left: 0;
      &:first-child {
        border-left: solid 1px #e4e7ed;
      }
      .el-cascader-menu__list {
        margin-bottom: 20px;
      }
      .el-cascader-node {
        height: 30px;
        padding-left: 5px;
        .el-cascader-node__label {
          .active {
            color: var(--main-primary-color);
          }
        }
        .el-checkbox {
          display: none;
        }
        .el-cascader-node__postfix {
          right: 15px;
        }
        .node-icon_checked {
          position: absolute;
          top: 9px;
          right: 15px;
          line-height: 1;
        }
      }
      .in-active-path {
        font-weight: normal;
      }
      .is-active {
        font-weight: normal;
      }
    }
  }
}
.select-business {
  .el-tag-slot {
    max-width: 70px;
    display: inline-block;
    vertical-align: bottom;
  }
  margin-top: 17px;
  /deep/ .el-tag {
    border-radius: 12px;
    height: 24px;
    line-height: 24px;
    padding: 0 16px;
    background: #edeff0;
    color: #9398a1;
    border: 0;
    margin-right: 10px;
    .el-tag__close {
      color: #9398a1;
      &:hover {
        background: #edeff0;
      }
    }
  }
}
.submit-success {
  .back-index {
    width: 90px;
    height: 30px;
    margin-top: 30px;
    line-height: 30px;
    padding: 0 16px;
  }
  /deep/ .taskBitMap {
    margin-top: 135px;
    .tip-title {
      margin-top: 30px;
    }
  }
}
.next-step {
  font-size: 14px;
  margin-top: 40px;
  height: 30px;
  line-height: 30px;
  padding: 0 23px;
  background: var(--main-primary-color);
  color: #ffffff;
}
.dialog-business {
  /deep/ .el-dialog__body {
    text-align: left;
  }
  /deep/.el-dialog__header {
    text-align: left;
  }
  .search-input {
    width: 270px;
    margin-bottom: 15px;
    /deep/ .el-input__prefix {
      font-size: 14px;
      .el-input__icon {
        line-height: 30px;
        margin-left: 7px;
        margin-right: 7px;
      }
    }
  }
  .notice {
    margin-top: 6px;
    font-size: 13px;
  }
  .selected {
    margin-top: 14px;
    height: 30px;
    position: relative;
    padding-right: 50px;
    overflow: hidden;
    .selected-more {
      position: absolute;
      right: 0;
      top: 0;
    }
    > span {
      > span {
        &:extend(.ellipsis);
        max-width: 100px;
        display: inline-block;
        vertical-align: text-bottom;
      }
      &:first-child {
        background: #ffffff;
        margin: 0;
        padding: 0;
        border-radius: 0;
        line-height: 30px;
      }
      font-size: 14px;
      line-height: 18px;
      padding: 6px 14px;
      background: #e7f7f7;
      color: var(--main-primary-color);
      /*color: #10BBB8;*/
      margin-left: 12px;
      margin-bottom: 10px;
      display: inline-block;
      border-radius: 15px;
      .dgg-icon {
        color: #bbcec5;
        vertical-align: baseline;
        width: 8px !important;
        height: 8px !important;
        cursor: pointer;
      }
    }
  }
  .dialog-cascader {
    /deep/ .el-dialog {
      text-align: left;
    }
    &:after {
      content: "";
      display: block;
      clear: both;
    }
    .cascader-body {
      float: left;
      border-radius: 0;
      border-color: #e3e4e6;
      /deep/ .el-card__header {
        line-height: 40px;
        padding: 0 15px;
        background: #f5f7fa;
        border-color: #e3e4e6;
      }
      /deep/ .el-card__body {
        height: 200px;
        padding: 0;
        overflow: auto;
      }

      .cascader-item {
        padding: 0 15px;
        line-height: 40px;
        border-bottom: 1px solid #e3e4e6;
        cursor: pointer;
        position: relative;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &:hover {
          background: #e7f7f7;
        }
        &.active {
          color: #10bbb8;
        }
        i {
          color: #10bbb8;
          font-size: 16px;
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .cascader-1 {
      width: 195px;
    }
    .cascader-2 {
      width: 196px;
      border-left: 0;
    }
    .cascader-3 {
      width: 414px;
      border-left: 0;
      .cascader-item {
        padding-right: 40px;
      }
    }
  }
}
</style>
