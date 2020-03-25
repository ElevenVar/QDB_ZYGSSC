<template>
  <div class="processPlan">
    <div class="plan-item-header padding">
      提交流程方案
    </div>
    <div class="plan-item-header padding">
      <div class="fl">
        订单办理周期
        <dgg-input
          v-model="subData.orderCycle"
          maxlength="4"
          @input="subData.orderCycle = subData.orderCycle.replace(/[^\d]/g, '')"
          class="search"
          style="width:150px;"
          placeholder="请输入所需工作日"
        >
        </dgg-input>
      </div>
      <div class="fr">
        <span
          style="font-size:12px; color:#1DC4C1;margin-right:20px;cursor:pointer"
          @click="get_info"
          >查看订单信息</span
        >
        <dgg-button
          type="primary"
          style="width:100px"
          class="receive-button"
          @click="subProgramme"
        >
          提交方案
        </dgg-button>
      </div>
    </div>
    <div class="plan-item-content">
      <div class="plan-item-content-left">
        <ul class="ul-item">
          <li
            v-for="(item, index) in subData.atypiaVoList"
            :key="index"
            @click="liClick(item, index)"
            :class="{ active: currentSort == index }"
            class="dgg-text-ellip"
          >
            <el-tooltip
              effect="dark"
              :content="item.stageName"
              placement="top-start"
            >
              <span
                class="dgg-text-ellip"
                style="display:inline-block; width:190px;vertical-align: top;"
              >
                {{ item.stageName }}
              </span>
            </el-tooltip>

            <i
              class="el-icon-delete"
              style="position:absolute;right:6px;top:12px;z-index:10"
              @click.stop="delet_programme(item, index)"
            ></i>
          </li>
        </ul>
        <dgg-button
          dgg-icon="detail_icon_plus"
          class="brabBill-button"
          style="width:calc(100% - 10px);position:absolute;bottom:0;"
          @click="addPhaseName"
          >添加阶段</dgg-button
        >
      </div>
      <div class="plan-item-content-right">
        <div class="plan-item-right-header">
          <dgg-input
            v-model="taskData.stageName"
            maxlength="30"
            oninput="this.value=this.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
            class="search"
            style="width:150px;"
            placeholder="请输入阶段名称"
          >
          </dgg-input>
          <dgg-button
            type="primary"
            style="float:right;margin-right:10px;"
            class="receive-button"
            @click="subTask"
          >
            确认
          </dgg-button>
        </div>
        <div class="plan-item-right-content">
          <el-table :data="tableData" style="width: 100%" :show-header="false">
            <el-table-column prop="taskName" label="任务名称" width="180">
              <template slot-scope="scope">
                <div style="padding:0 5px;">
                  <el-input
                    class="mini-input"
                    placeholder="任务名称"
                    maxlength="50"
                    v-model="scope.row.taskName"
                    oninput="this.value=this.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="processingCycle"
              label="所需工作日"
              width="180"
            >
              <template slot-scope="scope">
                <div style="padding:0 5px;">
                  <el-input
                    class="mini-input"
                    placeholder="请输入所需工作日"
                    maxlength="4"
                    v-model="scope.row.processingCycle"
                    @input="
                      scope.row.processingCycle = scope.row.processingCycle.replace(
                        /[^\d]/g,
                        ''
                      )
                    "
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="taskDescription"
              label="任务说明"
              width="310"
            >
              <template slot-scope="scope">
                <div style="padding:0 5px;">
                  <el-input
                    class="mini-input long-input"
                    type="textarea"
                    maxlength="200"
                    placeholder="请输入任务说明"
                    v-model="scope.row.taskDescription"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" text-align="center">
              <template slot-scope="scope">
                <i
                  class="el-icon-s-fold"
                  style="font-size:20px;transform:rotate(90deg);"
                  @click="moveUp(scope.$index, scope.row)"
                ></i>
                <i
                  class="el-icon-s-fold"
                  style="font-size:20px;transform:rotate(-90deg);"
                  @click="moveDown(scope.$index, scope.row)"
                ></i>
                <i
                  class="el-icon-delete"
                  style="font-size:18px;"
                  @click="deletes(scope.$index, scope.row)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
          <dgg-button
            dgg-icon="detail_icon_plus"
            class="brabBill-button"
            style="width:calc(100% - 10px);margin-top:10px;"
            @click="addTasks"
            >添加任务
          </dgg-button>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="infoModal"
      title="订单信息"
      width="400px"
      :model="infoModalData"
    >
      <el-form class="info_form">
        <el-form-item label="订单编号">
          <el-input readonly v-model="infoModalData.scOrderNo"></el-input>
        </el-form-item>
        <el-form-item label="客户信息">
          <el-input readonly v-model="infoModalData.customerName"></el-input>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-input readonly v-model="infoModalData.proScAttr"></el-input>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-input readonly v-model="infoModalData.productName"></el-input>
        </el-form-item>
        <el-form-item label="业务地区">
          <el-input readonly v-model="infoModalData.region"></el-input>
        </el-form-item>
        <el-form-item label="订单下单时间">
          <el-input readonly v-model="infoModalData.signDate"></el-input>
        </el-form-item>
        <el-form-item label="订单接收时间">
          <el-input
            readonly
            v-model="infoModalData.orderReceiveStart"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "processPlans",
  data() {
    return {
      infoModal: false, //订单信息弹窗
      infoModalData: {
        scOrderNo: "", //订单编号
        customerName: "", // 客户信息/ 客户名称
        proScAttr: "", // 产品类型
        productName: "", // 服务类型
        region: "", // 地区
        signDate: "", // 签单时间
        orderReceiveStart: "" //订单开始时间
      },
      searchData: "",
      phaseName: "",
      activeIndex: "1",
      currentSort: 0, // 默认选中的阶段
      goRouter: "", // 记录从哪个页面过来的
      tableData: [
        {
          id: "",
          processingCycle: "", //办理周期
          sort: "1", // 排序
          taskName: "", //任务名称
          taskDescription: "" // 任务说明
        }
      ],
      taskData: {
        id: "", // 阶段ID
        stageName: "", //阶段名称
        sort: "", // 阶段排序
        taskVos: [] //任务信息
      },
      subData: {
        id: "", //生产订单ID
        orderCycle: "", // 订单周期
        atypiaVoList: []
      }
    };
  },
  computed: {
    IDS() {
      return sessionStorage.proccessPlanID;
    }
  },
  methods: {
    ...mapActions(["ruoterJump"]),
    ...mapActions("receiveModule", [
      "sub_programme", // 提交方案流程
      "get_programme", // 查询流程方案
      "get_info_details" // 查询订单信息
    ]),
    // 查看订单信息
    async get_info() {
      let res = await this.get_info_details({ id: this.IDS });
      if (res.code == 200) {
        console.log(res.data);
        this.infoModalData = res.data;
        this.infoModal = true;
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    // 查询 流程方案
    async getProgramme() {
      if (this.IDS) {
        let res = await this.get_programme({ id: this.IDS });
        if (res.code == 200) {
          if (res.data)
            if (res.data.atypiaVoList && res.data.atypiaVoList.length) {
              this.subData = res.data;
            }
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      }
    },
    // 提交方案 点击
    async subProgramme() {
      let rout = sessionStorage.processPlanRoute
        ? sessionStorage.processPlanRoute.substring(
            sessionStorage.processPlanRoute.indexOf("/", 2) + 1
          )
        : "transaction";
      if (this.subData.orderCycle == "") {
        this.$notify({
          message: "请输入订单办理周期",
          type: "warning",
          customClass: "dgg-tip-msg"
        });
        return;
      }
      if (this.subData.atypiaVoList.length == 0) {
        this.$notify({
          message: "请输入至少一个阶段信息",
          type: "warning",
          customClass: "dgg-tip-msg"
        });
        return;
      }
      for (let i = 0, j = this.subData.atypiaVoList; i < j.length; i++) {
        // 给阶段排序
        for (let a in j[i]) {
          if (a == "sort") {
            this.$set(j[i], a, i + 1);
          }
        }
      }
      let res = await this.sub_programme(JSON.stringify(this.subData));
      if (res.code === 200) {
        this.$message.success("操作成功");
        this.ruoterJump({
          name: rout
        });
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    // li 点击
    liClick(item, index) {
      this.currentSort = index;
      this.taskData = JSON.parse(JSON.stringify(item));
      this.tableData = JSON.parse(JSON.stringify(item.taskVos));
    },
    // 删除阶段
    delet_programme(item, index) {
      this.$confirm("确定删除这条阶段信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.subData.atypiaVoList.splice(index, 1);
          this.addPhaseName();
        })
        .catch(() => {});
    },
    //添加阶段
    addPhaseName() {
      this.taskData = {};
      this.taskData = {
        id: "", // 阶段ID
        sort: "", // 排序
        stageName: "", //阶段名称
        taskVos: [] //任务信息
      };
      this.tableData = [];
      this.tableData.push({
        id: "",
        processingCycle: "", //办理周期
        sort: "1", // 排序
        taskName: "", //任务名称
        taskDescription: "" // 任务说明
      });
    },
    // 确认按钮点击-- 确认阶段
    subTask() {
      if (this.taskData.stageName == "") {
        this.$message.warning("请输入阶段名称");
        return;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].processingCycle == "") {
          // 所需工作日
          this.$message.warning(
            "第" + (i + 1) + "行的所需工作日不能为空，请输入!"
          );
          return;
        }
        if (this.tableData[i].taskName == "") {
          // 任务名称
          this.$message.warning(
            "第" + (i + 1) + "行的任务名称不能为空，请输入!"
          );
          return;
        }
        if (this.tableData[i].taskDescription == "") {
          // 任务说明
          this.$message.warning(
            "第" + (i + 1) + "行的任务说明不能为空，请输入!"
          );
          return;
        }
        this.tableData[i].sort = i + 1;
      }
      this.taskData.taskVos = this.tableData;
      if (this.taskData.id == "") {
        this.taskData.id = this.subData.atypiaVoList.length + 1;
        this.subData.atypiaVoList.push(this.taskData);
      } else {
        for (let i = 0; i < this.subData.atypiaVoList.length; i++) {
          if (this.subData.atypiaVoList[i].id == this.taskData.id) {
            this.$set(this.subData.atypiaVoList, i, this.taskData);
          }
        }
      }
      this.addPhaseName();
    },
    // 添加任务
    addTasks() {
      let sort = this.tableData.length + 1;
      this.tableData.push({
        id: "",
        processingCycle: "", //办理周期
        sort: sort, // 排序
        taskName: "", //任务名称
        taskDescription: "" // 任务说明
      });
    },
    // 上移
    moveUp(index, row) {
      if (index == 0) {
        this.$message.warning("第一条数据，不能上移!");
        return;
      }
      this.setTableData(index, "up");
    },
    // 下移
    moveDown(index, row) {
      if (index == this.tableData.length - 1) {
        this.$message.warning("最后一条数据，不能下移!");
        return;
      }
      this.setTableData(index, "down");
    },
    // 设置表格移动后的数据
    setTableData(index, direction) {
      let insertData;
      for (var i = 0, j = this.tableData; i < j.length; i++) {
        if (index == i) {
          insertData = j[i];
        }
      }
      this.tableData.splice(index, 1); // 删除数组的元素
      if (direction == "down") {
        this.tableData.splice(index + 1, 0, insertData);
      } else {
        this.tableData.splice(index - 1, 0, insertData);
      }
    },
    // 删除
    deletes(index, row) {
      // 只有一条任务记录 且 没有输入任何数据的时候，可以删除任务记录
      let table = this.tableData;
      if (
        table.length == 1 &&
        (table[0].processingCycle == "" ||
          table[0].taskName == "" ||
          table[0].taskDescription == "")
      ) {
        this.tableData.splice(index, 1);
      } else {
        if (index == 0 && this.subData.atypiaVoList.length != 0) {
          this.$notify({
            message: "必须保留一条任务!",
            type: "warning",
            customClass: "dgg-tip-msg"
          });
          return;
        }
        this.$confirm("确定删除这条任务信息？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.tableData.splice(index, 1);
          })
          .catch(() => {});
      }
    }
  },
  mounted() {
    this.subData.id = sessionStorage.proccessPlanID; //获取传递过来的ID
    this.getProgramme(); // 查询 流程方案
  },
  created() {
    // this.getProgramme(); // 查询 流程方案
  }
};
</script>
<style lang="less">
.processPlan {
  .el-form {
    .el-form-item {
      .el-form-item__label {
        width: 84px;
        text-align: left;
        display: inline-block;
      }
      .el-form-item__content {
        .el-input__inner {
          border: none;
        }
      }
    }
  }
  overflow: hidden;
  .padding {
    padding: 15px 25px;
  }
  .fr {
    float: right;
  }
  .fl {
    float: left;
  }
  .plan-item-header {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 35, 60, 1);
    line-height: 20px;
    border-bottom: 1px solid #e3e4e6;
    overflow: hidden;
  }
  .plan-item-content {
    min-height: 730px;
    display: flex;
    .plan-item-content-left {
      width: 240px;
      padding: 5px;
      border-right: 1px solid #edeff0;
      position: relative;

      .ul-item {
        padding: 0;
        li.active {
          background: rgba(240, 242, 245, 1);
        }
        li {
          max-width: 240px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          font-weight: 500;
          text-indent: 15px;
          cursor: pointer;
          position: relative;
          &:hover {
            background: rgba(240, 242, 245, 1);
          }
        }
      }
    }
    .plan-item-content-right {
      flex: 1;
      padding: 5px;
      .plan-item-right-header {
        padding: 8px 0;
        line-height: 25px;
        background-color: rgba(240, 242, 245, 1);
        .search input {
          background-color: #fff;
          height: 26px;
          line-height: 26px;
        }
      }
      .plan-item-right-content {
        .el-table tr td:first-child {
          padding-left: 5px;
        }
        .mini-input input {
          height: 30px;
          line-height: 30px;
          width: 150px;
        }
        .mini-input textarea {
          height: 30px;
        }
        .long-input input {
          width: 300px !important;
        }
        [class^="el-icon-"] {
          font-size: 18px;
        }
      }
    }
  }
}
</style>
