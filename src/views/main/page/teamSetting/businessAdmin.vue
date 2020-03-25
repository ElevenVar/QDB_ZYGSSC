`<template>
  <!-- 业务管理 -->
  <div class="businessAdmin">
    <div class="title">
      <span class="title-left">
        <dgg-icon :icon-class="'icon_warning'" :class="'x2'" />
        <span>全部业务</span>
        <span class="margin-left-16"
          >当前拥有 <a>{{ totalProduct }}项</a> 业务，其中
          <a>{{ auditTotal }}项</a> 审核中</span
        >
      </span>
      <span class="title-right">
        <span v-if="storeData.storeStatus !== 1"
          >店铺正在审核中，暂不可变更业务</span
        >
        <dgg-button
          :disabled="storeData.storeStatus !== 1"
          type="primary"
          @click="handleEditShowDialog('edit')"
        >
          变更业务
        </dgg-button>
        <dgg-button type="primary" @click="handleEditShowDialog('add')">
          添加业务
        </dgg-button>
      </span>
    </div>
    <div class="no-data" v-if="!business || business.length === 0">
      <bitmap></bitmap>
    </div>
    <div v-else class="content">
      <div v-for="item in business" class="col" :key="item.id">
        <div class="col-left">
          <div>
            <!--            <img :src="item.src" alt="">-->
            <!--            {{ item }}-->
            <!--            <div>-->
            <dgg-icon
              :icon-class="icon[item.id]"
              svg-width="15px"
              svg-height="25px"
            />
            {{ item.title }}
            <!--            </div>-->
          </div>
        </div>
        <div class="col-right">
          <div v-for="it in item.children" :key="it.id">
            <div>
              <span>{{ it.title }}</span>
              <el-tooltip
                effect="dark"
                popper-class="grab-tooltip"
                content="审核中，不可删除，修改"
                placement="top"
              >
                <dgg-icon
                  icon-class="icon_info"
                  svg-width="15px"
                  svg-height="25px"
                  v-if="!it.productStatus"
                />
              </el-tooltip>
            </div>
            <!--{{ it.productStatus? '':'待审核' }}-->
            <div class="city-content">{{ getTextStrand(it.children) }}</div>
            <div class="handle">
              <span
                v-if="it.productStatus"
                @click="
                  deleteBusinessNotice = true;
                  deleteBusinessItem = it;
                "
                >删除</span
              >
              <!--it-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="addDialog"
      :before-close="addDialogClose"
      width="866px"
      top="220px"
      title="添加业务"
    >
      <div class="step-content">
        <dgg-steps
          :active="step"
          align-center
          class="steps"
          finish-status="success"
        >
          <dgg-step title=""></dgg-step>
          <dgg-step title=""></dgg-step>
        </dgg-steps>
      </div>
      <div v-if="step === 1" class="dialog-first-step">
        <!--        <dgg-input-->
        <!--          class="search-input"-->
        <!--          prefix-icon="el-icon-search"-->
        <!--          @change="businessSearch"-->
        <!--          v-model="businessSearchVal"-->
        <!--          placeholder="业务关键词"-->
        <!--        />-->
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
          <span
            style="color: #F10940;font-family:PingFangSC-Regular,PingFang SC;"
            >*</span
          >在平台审核通过前，只能接收已有业务的订单~
        </div>
        <div class="selected" :style="{ height: selectedMoreHeight }">
          <span>已选：</span>
          <span v-for="item in selectYtBusiness" :key="item.id">
            <span>{{ item.name }}</span>
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
      </div>
      <div v-if="step === 0" class="add">
        <div class="display-inline-block absolute left-150 font-size-14">
          业务办理地区：
        </div>
        <div class="business-area display-inline-block">
          <template v-if="!selectBusinessArea || selectBusinessArea.length == 0"
            >暂无数据</template
          >
          <template v-else>
            <span
              v-for="item in selectBusinessArea"
              class="business-area-item ellipsis"
              :title="item.name"
              :class="{ active: item.select }"
              :key="item.id"
              @click="item.select = !item.select"
            >
              {{ item.name }}
            </span>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBusSelect">取消</el-button>
        <el-button
          type="primary"
          :disabled="!selectedBusinessArea"
          @click="addDialogConfirm"
          >下一步</el-button
        >
      </span>
    </el-dialog>
    <!--    编辑业务-->
    <el-dialog
      :visible.sync="editDialog"
      :before-close="editDialogClose"
      width="866px"
      top="220px"
      title="编辑业务"
    >
      <div class="dialog-body-left">
        <div class="triangle"></div>
        <div style="color: #9398A1; cursor: default">业务</div>
        <template v-for="item in business">
          <div
            v-for="it in item.children"
            v-if="it.productStatus"
            :title="it.title"
            :class="{ active: it.id === editSelectBusiness, business: true }"
            @click="editSelectBusinessClick(it)"
          >
            {{ it.title }}
          </div>
        </template>
      </div>
      <div class="dialog-body-right">
        <div class="display-inline-block absolute left-40 font-size-14">
          业务办理地区：
        </div>
        <div class="business-area display-inline-block">
          <template v-if="!selectBusinessArea || selectBusinessArea.length == 0"
            >暂无数据</template
          >
          <template v-else>
            <span
              v-for="item in selectBusinessArea"
              class="business-area-item ellipsis"
              :title="item.name"
              :class="{ active: item.select }"
              :key="item.id"
              @click="updateBusAreaClick(item)"
            >
              {{ item.name }}
            </span>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogCancel">取消</el-button>
        <el-button
          type="primary"
          :disabled="!selectedBusinessArea"
          @click="editDialogConfirm"
          >下一步</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="deleteBusinessNotice"
      width="420px"
      class="deleteBusinessDialog"
      title="提示"
    >
      <span>
        删除业务后，将不再收到此类订单，确认删除？
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDelete">取 消</el-button>
        <el-button type="primary" @click="deleteBusiness">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import DggInput from "../../../../components/baseComponent/dgg-input/index";
import Notification from "@/componentsEl/notification/index.js";
import bitmap from "@/views/main/page/components/bitmap.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "businessAdmin",
  components: {
    DggInput,
    bitmap
  },
  data() {
    return {
      selectedMoreText: "展开更多",
      selectedMoreHeight: "",
      auditTotal: 0,
      totalProduct: 0,
      addDialog: false,
      editDialog: false,
      deleteBusinessNotice: false,
      step: 0,
      editSelectBusiness: "",
      business: [],
      deleteBusinessItem: null,
      selectBusinessArea: [],
      businessSelectedIds: [],
      businessSelected: [],
      ytList: [],
      showYtLevel2: [],
      YtBusiness: [],
      selectYtBusiness: [],
      selectYtBusinessId: [],
      businessSearchVal: "",
      icon: {
        BUS_YT_FL_FS: "icon_nonlitigation",
        BUS_YT_FL_MSSS: "icon_civil",
        BUS_YT_FL_XZSS: "icon_litigation",
        BUS_YT_FL_XSSS: "icon_criminal",
        BUS_YT_FL_FLGW: "icon_law"
      }
    };
  },
  created() {},
  async mounted() {
    this.getStoreProduct();
  },
  computed: {
    ...mapState(["storeInfoData"]),
    ...mapState("teamSettingModule", ["storeData"]),
    selectedBusinessArea() {
      let has = false;
      if (this.step === 0) {
        this.selectBusinessArea.forEach(item => {
          if (item.select) {
            has = true;
            return false;
          }
        });
      } else {
        return this.selectYtBusiness.length > 0;
      }
      return has;
    }
  },
  methods: {
    ...mapActions("businessManageModule", [
      "get_store_product",
      "get_company_city",
      "add_product",
      "delete_product",
      "update_product_area"
    ]),
    ...mapActions("settledModule", [
      "get_area",
      "get_yt_list",
      "get_yt_prodyct_list"
    ]),
    async getStoreProduct() {
      if (this.storeInfoData.storeId) {
        //gs2016-2019-12-30修改
        let res = await this.get_store_product({
          storeId: this.storeInfoData.storeId
        });
        if (res.code === 200) {
          let total = 0;
          let auditTotal = 0;
          let business = [];
          if (res.data.length > 0) {
            res.data.forEach((it, inx) => {
              total += it.productVos.length;
              let bus = {
                src: "src/assets/images/icon_lows.png",
                id: it.businessProductCode,
                title: it.businessProductName,
                parentTitle: it.businessTypeName,
                code: it.businessProductCode,
                parentCode: it.businessTypeCode,
                children: []
              };
              it.productVos.forEach((ite, index) => {
                let child = {
                  title: ite.productName,
                  id: ite.id,
                  productId: ite.productId,
                  select: false,
                  children: ite.areasArr,
                  productStatus: ite.productStatus
                };
                if (ite.productStatus === 0) {
                  auditTotal++;
                }
                bus.children.push(child);
              });
              business.push(bus);
            });
          }
          this.totalProduct = total;
          this.auditTotal = auditTotal;
          this.business = business;
        }
      }
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
    ytChangeConfirm(select) {
      this.$alert(
        "法律业态不可与其他业态同时选择，切换业态将清空已选产品，是否确认切换业态,",
        "提示",
        {
          confirmButtonText: "确定",
          callback: action => {
            this.selectYtBusiness = [];
            if (select === "fl") {
              //清除其他
            } else {
              //清除法律
            }
          }
        }
      );
    },
    // 业态选择事件
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
    // 二级业态选择事件
    async getYtBusiness(item) {
      let areas = "";
      this.selectBusinessArea.forEach((it, inx) => {
        if (it.select) {
          areas += it.code;
          areas += ",";
          // if(inx !== this.selectBusinessArea.length -1){
          //   areas += ',';
          // }
        }
      });
      console.log(areas);
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
      } else {
        this.$notify({
          message: ytBus.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    businessSearch(val) {
      let result = [];
      this.YtBusiness.forEach((item, index) => {
        if (item.name.indexOf(val) !== -1) {
          console.log(111);
          result.unshift(item);
        } else {
          console.log(222);
          result.push(item);
        }
      });
      this.YtBusiness = result;
      document.getElementById("YtBusiness").parentNode.scrollTop = 0;
    },
    //业务选择事件
    selectYtBus(item) {
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
    },
    // 业务选择取消按钮事件
    cancelBusSelect() {
      this.resetAddDialog();
      this.selectYtBusiness = [];
      this.selectYtBusinessId = [];
      this.addDialog = false;
      this.ytList.forEach((ite, index) => {
        ite.select = false;
      });
      this.showYtLevel2.forEach((it, inx) => {
        this.$set(it, "select", false);
      });
    },
    addDialogClose(done) {
      this.resetAddDialog();
      done();
    },
    editDialogClose(done) {
      this.resetEditDialog();
      done();
    },
    resetEditDialog() {
      this.editSelectBusiness = "";
      this.selectBusinessArea.forEach((item, index) => {
        item.select = false;
      });
      this.businessSelected = [];
    },
    selectBusiness(item) {
      let id = item.id;
      if (this.businessSelectedIds.includes(id)) {
        this.businessSelected.forEach((it, index) => {
          if (it.id === id) {
            this.businessSelected.splice(index, 1);
          }
        });
        this.businessSelectedIds.splice(
          this.businessSelectedIds.findIndex(item => item === id),
          1
        );
      } else {
        this.businessSelectedIds.push(id);
        this.businessSelected.push(item);
      }
    },
    async handleEditShowDialog(type) {
      // 获取地区列表
      let res = await this.get_company_city();
      if (res.code === 200) {
        res.data.forEach((item, inx) => {
          item.select = false;
        });
        this.selectBusinessArea = res.data;
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
      // 获取业态列表
      let yts = await this.get_yt_list();
      if (yts.code === 200) {
        this.ytList = yts.data;
        this.ytList.forEach((it, inx) => {
          this.$set(it, "select", false);
        });
      } else {
        this.$notify({
          message: yts.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
      if (type === "edit") {
        this.editDialog = true;
      } else {
        this.addDialog = true;
      }
    },
    async editSelectBusinessClick(item) {
      this.editSelectBusiness = item.id;
      // 编辑时重置选择区域
      this.selectBusinessArea.forEach((item, index) => {
        item.select = false;
      });
      // 设置编辑时选择业态区域被选中状态
      item.children.forEach((it, inx) => {
        this.selectBusinessArea.forEach((item, index) => {
          if (it.companyCode === item.code) {
            item.select = true;
          }
        });
      });
    },
    async addDialogConfirm() {
      if (this.step === 0) {
        this.step = 1;
      } else {
        // 提交
        let areas = "";
        this.selectBusinessArea.forEach((it, inx) => {
          if (it.select) {
            areas += it.code;
            areas += ",";
            // if(inx !== this.selectBusinessArea.length -1){
            //   areas += ',';
            // }
          }
        });
        areas = areas.slice(0, areas.length - 1);
        let productJson = [];
        this.selectYtBusiness.forEach((ite, inx) => {
          let obj = {
            businessTypeCode: ite.productTypeParent,
            businessTypeName: ite.productTypeParentName,
            businessProductCode: ite.parent.code,
            businessProductName: ite.parent.name,
            productId: ite.id,
            productName: ite.name,
            areas: areas
          };
          productJson.push(obj);
        });
        let params = {
          storeId: this.storeInfoData.storeId,
          userId: this.storeInfoData.userId,
          productJson: JSON.stringify(productJson)
        };
        let res = await this.add_product(params);
        if (res.code === 200) {
          this.getStoreProduct();
          // this.$message.success('操作成功');
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
        this.resetAddDialog();
        this.addDialog = false;
      }
    },
    updateBusAreaClick(item) {
      item.select = !item.select;
    },
    async editDialogConfirm() {
      //修改提交
      let areaCode = "";
      this.selectBusinessArea.forEach((it, inx) => {
        if (it.select) {
          areaCode += it.code;
          if (this.selectBusinessArea.length - 1 !== inx) {
            areaCode += ",";
          }
        }
      });
      let params = {
        storeId: this.storeInfoData.storeId,
        productId: "",
        areas: areaCode,
        id: ""
      };
      this.business.forEach((it, inx) => {
        it.children.forEach((ite, inde) => {
          if (ite.id === this.editSelectBusiness) {
            params.productId = ite.productId;
            params.id = ite.id;
          }
        });
      });
      if (!params.id || !params.productId) {
        Notification.error("请选择修改业务");
        return;
      }
      let res = await this.update_product_area(params);
      if (res.code === 200) {
        this.getStoreProduct();
        // 重新请求产品
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
      this.editDialog = false;
      this.resetEditDialog();
    },
    editDialogCancel() {
      this.resetEditDialog();
      this.editDialog = false;
    },
    resetAddDialog() {
      this.step = 0;
      this.selectBusinessArea.forEach((item, index) => {
        item.select = false;
      });
      this.businessSelected = [];
    },
    getTextStrand(obj) {
      let text = ``;
      obj.forEach((item, index) => {
        text += item.companyName;
        text += ` | `;
      });
      return text.substr(0, text.length - 3);
    },
    cancelDelete() {
      this.deleteBusinessNotice = false;
    },
    async deleteBusiness() {
      if (this.deleteBusinessItem !== null) {
        let params = {
          storeId: this.storeInfoData.storeId,
          userId: this.storeInfoData.userId,
          ids: this.deleteBusinessItem.id
        };
        let res = await this.delete_product(params);
        if (res.code === 200) {
          this.getStoreProduct();
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      }
      this.deleteBusinessNotice = false;
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件
.no-data {
  text-align: center;
  font-size: 14px;
  padding-top: 100px;
  min-height: 650px;
}
.margin-left-16 {
  margin-left: 16px;
}
.display-inline-block {
  display: inline-block;
}
.absolute {
  position: absolute;
}
.left-40 {
  left: 40px;
}
.left-150 {
  left: 150px;
}
.font-size-14 {
  font-size: 14px;
}
.businessAdmin {
  min-height: 720px;
  .ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  padding: 0 30px;
  .title {
    height: 70px;
    line-height: 70px;
    margin: 0;
    padding: 0;
    .title-left {
      /deep/ .dgg-icon {
        font-size: 22px;
        vertical-align: sub;
        color: #10bbb8;
      }
      span {
        font-size: 14px;
        color: #9398a1;
        &:first-of-type {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #19233c;
        }
        a {
          color: var(--main-primary-color);
          /*color: #10BBB8;*/
        }
      }
    }
    .title-right {
      float: right;
      &:after {
        clear: both;
      }
      /deep/ .dgg-button {
        color: #ffffff;
        border: 0;
      }
      > span {
        &:first-child {
          font-size: 12px;
          color: #9398a1;
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
    /deep/ .dgg-button {
      width: 80px;
      height: 30px;
      font-size: 13px;
    }
  }
  .content {
    border: 1px solid #edeff0;
    border-bottom: 0;
    margin-bottom: 20px;
    .col {
      position: relative;
      border-bottom: 1px solid #edeff0;
      min-height: 150px;
      > div {
        display: inline-block;
      }
      .col-left {
        position: absolute;
        height: 100%;
        width: 150px;
        border-right: 1px solid #edeff0;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        > div {
          font-size: 12px;
          color: #ffffff;
          background: linear-gradient(
            139deg,
            rgba(193, 199, 208, 1) 0%,
            rgba(138, 144, 155, 1) 100%
          );
          border-radius: 10px;
          padding: 0 10px;
          max-width: 140px;
          /deep/ .dgg-icon {
            height: 15px !important;
            vertical-align: sub;
          }
        }
      }
      .col-right {
        width: calc(100% - 150px);
        margin-left: 150px;
        /deep/ .dgg-icon {
          vertical-align: bottom;
          margin-left: 5px;
        }
        > div {
          padding: 14px 0;
          position: relative;
          border-bottom: 1px solid #edeff0;
          overflow: auto;
          &:last-child {
            border-bottom: 0;
          }
          .city-content {
            /*margin-left: 160px;*/
            width: 650px;
            > span {
              display: block;
            }
          }
          &:hover {
            .handle {
              visibility: visible;
            }
          }
          .handle {
            visibility: hidden;
            float: right;
            padding-right: 24px;
            font-size: 12px;
            color: var(--main-primary-color);
            /*color: #10BBB8;*/
            > span {
              display: inline-block;
              margin-right: 20px;
              cursor: pointer;
              &:last-child {
                margin: 0;
              }
            }
            &:after {
              clear: both;
            }
          }
          > div {
            display: inline-block;
            color: #9398a1;
            font-size: 14px;
            .reviewed {
              color: #fd8e26;
              width: 36px;
              height: 18px;
              border: 1px solid #fd8e26;
              border-radius: 9px;
              display: inline-block;
              font-size: 12px;
              line-height: 17px;
              text-align: center;
              cursor: pointer;
            }
            &:first-child {
              color: #19233c;
              width: 160px;
              padding-right: 26px;
              float: left;
              padding-left: 36px;
            }
          }
        }
      }
    }
  }
  /deep/.el-dialog {
    /*height: 610px;*/
    .step-content {
      margin-top: 30px;
      .steps {
        overflow-x: auto;
        overflow-y: hidden;
      }
      .dgg-steps {
        width: 880px;
        margin-right: auto;
        margin-left: auto;
        margin-bottom: 10px;
        /*margin-top: 40px;*/
        .el-step__title {
          font-size: 12px;
        }
        .el-step__head {
          margin-bottom: 20px;
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
    .el-dialog__header {
      padding: 20px 10px 20px 30px;
      border-bottom: 1px solid #edeff0;
    }
    .el-dialog__title {
      color: #19233c;
      font-size: 16px;
      font-weight: bold;
    }
    .el-dialog__body {
      padding: 0;
      padding-bottom: 20px;
      position: relative;
      .dialog-first-step {
        padding: 0 30px;
        .search-input {
          width: 270px;
          margin-bottom: 15px;
          .el-input__prefix {
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
              &:extend(.businessAdmin .ellipsis);
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
          &:after {
            content: "";
            display: block;
            clear: both;
          }
          .cascader-body {
            float: left;
            border-radius: 0;
            border-color: #e3e4e6;
            .el-card__header {
              line-height: 40px;
              padding: 0 15px;
              background: #f5f7fa;
              border-color: #e3e4e6;
            }
            .el-card__body {
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
      .dialog-body-left {
        padding-top: 3px;
        position: absolute;
        width: 155px;
        height: 100%;
        background: #f5f7fa;
        padding-left: 34px;
        overflow-y: auto;
        overflow-x: hidden;
        > div {
          &.business {
            width: 50px;
            height: 24px;
            &:extend(.businessAdmin .ellipsis);
          }
          margin-top: 13px;
          color: #19233c;
          cursor: pointer;
        }
        .active {
          color: var(--main-primary-color);
          /*color: #10BBB8;*/
        }
        .triangle {
          position: absolute;
          height: 10px;
          width: 10px;
          background: #f5f7fa;
          transform: rotate(45deg);
          -ms-transform: rotate(45deg); /* Internet Explorer */
          -moz-transform: rotate(45deg); /* Firefox */
          -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
          -o-transform: rotate(45deg); /* Opera */
          left: 150px;
          top: 11px;
        }
      }
      .dialog-body-right {
        padding-top: 16px;
        padding-left: 165px;
        margin-left: 155px;
        width: calc(100% - 155px);
        height: 100%;
        position: relative;
        .business-area {
          max-width: 400px;
          .business-area-item {
            display: inline-block;
            width: 80px;
            height: 32px;
            line-height: 32px;
            font-size: 13px;
            padding: 0 23px;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid rgba(227, 228, 230, 1);
            margin-bottom: 18px;
            margin-right: 20px;
          }
          .active {
            background: #10bbb8;
            color: #ffffff;
          }
        }
      }
      .add {
        padding-left: 275px;
        width: calc(100% - 155px);
        position: relative;
        .business-area {
          max-width: 400px;
          .business-area-item {
            display: inline-block;
            width: 80px;
            height: 32px;
            line-height: 32px;
            font-size: 13px;
            padding: 0 23px;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid rgba(227, 228, 230, 1);
            margin-bottom: 18px;
            margin-right: 20px;
          }
          .active {
            background: #10bbb8;
            color: #ffffff;
          }
        }
      }
    }
    .el-dialog__footer {
      border-top: 1px solid #edeff0;
      height: 70px;
      padding: 20px 30px;
      .el-button {
        font-size: 14px;
        height: 30px;
        padding: 5px 15px;
        margin-left: 12px;
      }
      .el-button--default {
        color: #19233c;
        border: 1px solid #e3e4e5;
      }
    }
  }
  .deleteBusinessDialog {
    /deep/ .el-dialog__header {
      border: 0;
      .el-dialog__title {
        font-size: 20px;
        font-weight: normal;
      }
    }
    /deep/ .el-dialog__body {
      font-size: 14px;
      padding: 0 0 0 30px;
    }
    /deep/ .el-dialog__footer {
      border: 0;
    }
  }
}
</style>
