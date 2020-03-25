<template>
  <div class="team-info">
    <dgg-tabs
      v-model="activeName"
      class="normal-tabs dgg-team-module"
      @tab-click="handleClick"
    >
      <dgg-tab-pane label="店铺信息" name="shopInfo" v-if="1 < 0">
        <div class="dgg-shop-info">
          <div class="team-name">
            <h6>{{ storeMsg.merchantName }}</h6>
            <div class="edit-btn" @click="editShopHandler">
              <dgg-tooltip
                :value="showTips"
                :popper-options="popperOptions"
                content="编辑"
                placement="top"
                class="msg-dot"
                effect="dark"
              >
                <dgg-icon
                  icon-class="icon_editdefault"
                  svg-width="16px"
                  svg-height="16px"
                />
              </dgg-tooltip>
            </div>
            <!-- 编辑店铺 -->
            <edit-Shop ref="editShopView" />
          </div>
          <hr class="dgg-part-line" />
          <!-- 店铺信息 -->
          <dgg-form
            ref="teamShopForm"
            :model="teamShopForm"
            label-width="100px"
            class="shop-form-item"
          >
            <dgg-form-item label="店铺负责人:" prop="name" size="small">
              <div class="right-detail user-info">
                <span>{{ storeMsg.ownerName }}</span>
                <span class="click-btn">
                  <dgg-popover
                    placement="bottom"
                    title=""
                    width="330"
                    popper-class="certifi-popper"
                    trigger="click"
                    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                  >
                    <h4>您的认证信息</h4>
                    <ul class="label-info">
                      <li>
                        <label>姓名：</label>{{ authentication.realName }}
                      </li>
                      <li>
                        <label>身份证：</label>{{ authentication.idCardNo }}
                      </li>
                      <li>
                        <label>联系电话：</label
                        >{{
                          authentication.contractPhone.length > 0
                            ? authentication.contractPhone
                            : "未填写"
                        }}
                      </li>
                    </ul>
                    <dgg-button slot="reference" type="text"
                      >认证信息</dgg-button
                    >
                  </dgg-popover>
                </span>
              </div>
            </dgg-form-item>
            <dgg-form-item label="联系电话:" prop="name" size="small">
              <div class="right-detail user-info ">
                <p>{{ storeMsg.ownerPhone }}</p>
              </div>
            </dgg-form-item>
            <dgg-form-item label="业务范围:" prop="name" size="small">
              <div class="right-detail user-info business-area">
                <p>
                  {{ businessScope }}
                </p>
              </div>
            </dgg-form-item>
            <dgg-form-item label="地址:" prop="name" size="small">
              <div class="right-detail user-info ">
                <p>
                  {{
                    `${storeMsg.provinceName} ${storeMsg.cityName} ${storeMsg.countyName} ${storeMsg.merchantAddress}`
                  }}
                </p>
              </div>
            </dgg-form-item>
            <dgg-form-item label="资质证明:" prop="name" size="small">
              <div class="right-detail user-info ">
                <dgg-upload
                  :data="{
                    fileId: userId,
                    isDeleteOriginalFile: false,
                    type: 'merchant_store_business_license'
                  }"
                  :is-preview="true"
                  :list-url="listUrl"
                  :upload-url="uploadUrl"
                  :del-url="deleteUrl"
                  :download-url="downloadUrl"
                  upload-word="上传图片"
                />
              </div>
            </dgg-form-item>
          </dgg-form>
        </div>
      </dgg-tab-pane>
      <dgg-tab-pane label="员工管理" name="staffAdmin">
        <staff-admin ref="staffAdminView" />
      </dgg-tab-pane>
      <dgg-tab-pane label="业务管理" name="businessAdmin" v-if="1 < 0">
        <business-admin ref="businessAdminView" />
      </dgg-tab-pane>
      <dgg-tab-pane label="账户管理" name="accountAdmin" v-if="1 < 0">
        <account-admin ref="accountAdminView" />
      </dgg-tab-pane>
      <dgg-tab-pane label="团队评价" name="teamEvaluate" v-if="1 < 0">
        <team-evaluate ref="teamEvaluateView" />
      </dgg-tab-pane>
    </dgg-tabs>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import editShop from "./dialog/editShop";
import accountAdmin from "./accountAdmin";
import businessAdmin from "./businessAdmin";
import staffAdmin from "./staffAdmin";
import teamEvaluate from "./teamEvaluate";
import config from "@/service/config";
export default {
  name: "TeamSetting",
  components: {
    editShop,
    teamEvaluate,
    accountAdmin,
    businessAdmin,
    staffAdmin
  },
  data() {
    return {
      showTips: false,
      popperOptions: {
        boundariesElement: "body"
      },
      activeName: "staffAdmin",
      teamShopForm: {},
      storeMsg: {
        provinceName: "",
        cityName: "",
        countyName: "",
        merchantAddress: ""
      },
      authentication: {
        realName: "",
        idCardNo: "",
        contractPhone: ""
      }
    };
  },
  computed: {
    ...mapState(["userId"]),
    ...mapState("teamSettingModule", ["storeInfoData"]),
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
    businessScope() {
      let businessScope = "";
      if (
        this.storeMsg.businessScope !== undefined &&
        this.storeMsg.businessScope.length > 0
      ) {
        const data = JSON.parse(this.storeMsg.businessScope);
        data.forEach((it, inx) => {
          businessScope += it.productName;
          if (inx !== data.length - 1) {
            businessScope += ",";
          }
        });
      }
      return businessScope;
    }
  },
  watch: {
    activeName: {
      handler(val) {
        this.setTeamSettingTab(val);
      },
      deep: true
    }
  },
  async mounted() {
    if (Object.keys(this.$route.params).length) {
      this.activeName = this.$route.params.name;
    } else {
      this.setTeamSettingTab(this.activeName);
    }
    const storeInfoData = await this.get_person_msg({ userId: this.userId });
    const storeMsg = await this.get_store_msg({
      storeId: this.storeInfoData.storeId
    });
    if (storeMsg.code === 200) {
      this.storeMsg = storeMsg.data;
    }
    const authentication = await this.get_authentication({
      userId: this.userId
    });
    if (authentication.code === 200) {
      this.authentication = authentication.data;
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
    ...mapActions(["ruoterJump"]),
    ...mapActions("teamSettingModule", [
      "get_person_msg",
      "get_store_msg",
      "get_authentication"
    ]),

    ...mapMutations(["setTeamSettingTab"]),

    handleClick() {},
    // 编辑信息
    editShopHandler() {
      this.$refs.editShopView.showModel(true);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件
.team-info {
  width: 100%;
  // height: 100%;
  min-height: 100%;
  border-radius: 6px;
  background-color: #ffffff;
  margin-bottom: 36px;
  // tab切换头部
  .dgg-team-module {
    /deep/.el-tabs__item {
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      &.is-active {
        color: #10bbb8;
      }
      &:hover {
        color: #10bbb8;
      }
    }
    /deep/.el-tabs__header {
      margin-bottom: 30px;
    }
  }
  //店铺信息板块
  .dgg-shop-info {
    margin-top: 10px;
    padding: 0 30px 150px;

    .team-name {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      h6 {
        line-height: 16px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #19233c;
        .dgg-text-ellip;
      }
      .edit-btn {
        flex-shrink: 0;
        margin-left: 28px;
        cursor: pointer;
        /deep/.dgg-icon {
          color: #666873;
        }
        &:hover {
          /deep/.dgg-icon {
            color: #10bbb8;
          }
        }
      }
    }
    .dgg-part-line {
      margin: 30px 0 30px 0;
      background-color: #edeff0;
    }

    //表单板块
    .shop-form-item {
      width: 100%;
      /deep/.el-form-item__label {
        padding-right: 24px;
        font-size: 14px;
        color: #666873;
      }
      /deep/.el-form-item {
        width: 100%;
        .el-form-item__content {
          margin-left: 0 !important;
          max-width: calc(100% - 100px);
          font-size: 14px;
          color: #19233c;
          .right-detail {
            &.user-info {
              display: flex;
              flex-wrap: nowrap;
              overflow: hidden;
              p {
                .dgg-text-ellip;
              }
              .click-btn {
                display: inline-block;
                flex-shrink: 0;
                margin-left: 194px;
                color: #10bbb8;
                cursor: pointer;
              }
            }
            &.business-area {
              flex-wrap: wrap;
              p {
                overflow: visible;
                white-space: normal;
              }
            }
          }
        }
      }
    }
  }
}
.certifi-popper {
  h4 {
    margin-top: 12px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: bold;
    color: #19233c;
  }
  .label-info {
    li {
      height: 42px;
      line-height: 42px;
      font-size: 14px;
      color: #19233c;
      .dgg-text-ellip;
    }
    label {
      display: inline-block;
      width: 90px;
      font-size: 14px;
      color: #666873;
    }
  }
}
</style>
