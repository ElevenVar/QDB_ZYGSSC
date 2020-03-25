<template>
  <div>
    <dgg-modal
      :modal="modalShopInfo"
      :hasmodal="true"
      class="editShop-pop"
      title="店铺基础信息"
      width="512px"
      @modalAffirm="submit"
      @modalQuit="close"
    >
      <dgg-form
        :model="editSop"
        :rules="rules"
        label-width="110px"
        class="editForm"
      >
        <dgg-form-item label="店铺名称：" prop="shopName">
          <dgg-input
            v-model="editSop.shopName"
            placeholder="请输入店铺名称"
            clearable
            @input="editSop.shopName = editSop.shopName.replace(/\s+/g, '')"
          ></dgg-input>
        </dgg-form-item>
        <dgg-form-item label="联系地址：" prop="address">
          <div class="select-cities">
            <el-select
              v-model="provinceVal"
              placeholder="省"
              @change="provinceSelect"
            >
              <el-option
                v-for="item in province"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
            <el-select v-model="cityVal" placeholder="市" @change="citySelect">
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
          </div>
          <dgg-input
            class="address-text"
            v-model="editSop.address"
            placeholder="详细地址"
            @input="editSop.address = editSop.address.replace(/\s+/g, '')"
          ></dgg-input>
        </dgg-form-item>
      </dgg-form>
      <span class="tips-text">店铺资质证明暂不支持修改</span>
    </dgg-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "editShopPop",
  components: {},
  data() {
    return {
      modalShopInfo: false,
      url: "https://tknowledge.dgg188.cn/api/kno/faq/v1/label_children.do",
      editSop: {
        shopName: "", //店铺名称
        address: "" //联系地址
      },
      placeholder: "请选择",
      rules: {
        shopName: [
          { required: true, message: "请输入店铺名称", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      selectCity: "",
      province: [],
      provinceVal: [],
      city: [],
      cityVal: [],
      county: [],
      countyVal: []
    };
  },
  computed: {
    ...mapState(["storeInfoData", "userId"]),
    ...mapState("teamSettingModule", ["storeData"])
  },
  watch: {},
  async mounted() {
    let area = await this.get_area();
    if (area.code === 200) {
      this.province = area.data;
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
    ...mapActions("teamSettingModule", ["get_area", "modify_store_msg"]),
    ...mapActions("startPageModule", [
      "get_store_yt_info" // 获取用户在店铺的业态信息（暂用于法律业态PC）
    ]),
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
    showModel(show) {
      this.modalShopInfo = show;
    },
    async submit() {
      let params = {
        storeId: this.storeInfoData.storeId,
        merchantName: this.editSop.shopName,
        merchantAddress: this.editSop.address
      };
      if (this.editSop.shopName.length === 0) {
        this.$message.error("请填写店铺名字");
        return;
      }
      if (this.editSop.address.length === 0) {
        this.$message.error("请填写店铺详细地址");
        return;
      }
      if (this.provinceVal.length > 0) {
        this.province.forEach((it, inx) => {
          if (it.code === this.provinceVal) {
            params.provinceCode = this.provinceVal;
            params.provinceName = it.name;
          }
        });
      } else {
        this.$message.error("请选择店铺省市");
        return;
      }
      if (this.cityVal.length > 0) {
        this.city.forEach((it, inx) => {
          if (it.code === this.cityVal) {
            params.cityCode = this.cityVal;
            params.cityName = it.name;
          }
        });
      }
      if (this.countyVal.length > 0) {
        this.county.forEach((it, inx) => {
          if (it.code === this.countyVal) {
            params.countyCode = this.countyVal;
            params.countyName = it.name;
          }
        });
      }
      let res = await this.modify_store_msg(params);
      if (res.code === 200) {
        this.storeData.merchantAddress = params.merchantAddress;
        this.storeData.merchantName = params.merchantName;
        this.storeData.provinceName = params.provinceName;
        this.storeData.provinceCode = params.provinceCode;
        this.storeData.cityName = params.cityName;
        this.storeData.cityCode = params.cityCode;
        this.storeData.countyName = params.countyName;
        this.storeData.countyCode = params.countyCode;
        this.modalShopInfo = false;
        this.get_store_yt_info({
          userId: this.userId
        });
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    close() {
      this.modalShopInfo = false;
    },
    // 三级联动
    changeCaseVenue(data) {
      this.texts = data.texts;
      this.ids = data.ids;
    }
  }
};
</script>

<style lang="less">
.editShop-pop {
  /deep/.el-dialog {
    border-radius: 6px;
    .el-dialog__headerbtn {
      display: none;
    }
    .el-dialog__header {
      padding: 20px;
      height: 70px;
    }
    .el-dialog__title {
      color: #19233c;
      line-height: 30px;
      font-weight: 550;
      display: block;
      width: 100%;
      text-align: left;
    }
    .el-form-item__label {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666873;
      padding-right: 25px;
      box-sizing: border-box;
    }
  }
  .el-dialog__body {
    width: 100%;
    padding: 35px 70px 45px;
    border-top: 1px solid #e3e4e6;
    border-bottom: 1px solid #e3e4e6;
    margin: 0 0 10px;
    text-align: center;
    .el-form {
      width: 100%;
      text-align: center;

      .el-form-item {
        margin: 0 0 18px;
      }
      .el-form-item__content {
        margin: 0 !important;
        width: calc(100% - 110px);
      }
      .el-select {
        width: 100%;
      }
    }
    .el-form-item__error {
      top: 109%;
    }
    .tips-text {
      font-size: 13px;
      color: #9398a1;
      line-height: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
    .address-text {
      margin-top: 10px;
    }
    .el-dialog--center .el-dialog__body {
      text-align: center !important;
    }
  }
  /deep/ .el-form-item__label,
  /deep/ .el-form-item__content {
    line-height: 30px;
  }

  .select-cities {
    &:after {
      content: "";
      display: block;
      clear: both;
    }
    .el-select {
      width: 30% !important;
      margin-right: 5%;
      float: left;
      .el-input__inner {
        /*border-radius: 1px;*/
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
}
</style>
