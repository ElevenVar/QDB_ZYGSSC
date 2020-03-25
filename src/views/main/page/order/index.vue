<template>
  <div class="order">
    <div v-if="!excptArr.includes($route.name)">
      <el-menu
        :default-active="activeIndex"
        class="dgg-menu-main dgg-menu-orders"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="(item, index) of orderList"
          :index="index + 1 + ''"
          :key="index"
          @click="jump(item, index)"
          >{{ item.meta.title }}
        </el-menu-item>
      </el-menu>
    </div>
    <router-view />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "Order",
  components: {},
  data() {
    return {
      excptArr: [
        "processPlan",
        "transactionTask",
        "transactionDocument",
        "transactionBill",
        "transactionDynamic",
        "transactionTemplate",
        "finishDetailsTemplate",
        "finishDetailsBill",
        "finishDetailsDocument",
        "finishDetailsDynamic",
        "finishDetailsTask",
        "brabBillDetails",
        "receiveDetails",
        "chargeBackDetailsTask",
        "chargeBackDetailsDocument",
        "chargeBackDetailsBill",
        "chargeBackDetailsDynamic"
      ]
    };
  },
  computed: {
    ...mapState(["activeRoute", "realRoutes", "recordRoute", "storeInfoData"]),
    orderList() {
      return (
        this.activeRoute.children.filter(item => {
          return this.showOrderNav(
            item,
            this.hasOrderReceive(this.storeInfoData)
          );
        }) || []
      );
    },
    activeIndex() {
      let _index = "1";
      this.orderList.forEach((element, index) => {
        const _map = this.recordRoute.map(item => {
          return item.name;
        });
        if (_map.includes(element.name)) {
          _index = index + 1 + "";
        }
      });
      return _index;
    }
  },
  watch: {},
  async mounted() {},
  activated() {
    //
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      const _data = vm.realRoutes.find(item => {
        return to.name === item.name;
      });
      if (_data && vm.orderList.length) {
        vm.ruoterJump({
          name: vm.orderList[0].name
        });
      }
    });
  },
  created() {
    //
    this.area_tree_book_list({
      code: "WORK_AREA",
      type: 1,
      level: 1
    }); // 获取区域数据
    this.product_tree_book_list({
      code: "BUS_YT_CYFZYJY",
      type: 1,
      level: 1
    }); // 获取区域数据
    this.get_current_user_handle_order_team(); // 获取团队
    // 查询 产品数据
    this.zysc_find_product({
      proType: "BUS_YT_CYFZYJY",
      type: 1,
      level: 1
    });
    //  获取订单状态数据
    this.zysc_get_order_status({
      type: 1,
      level: 1
    });
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapMutations(["filterRecordRoute"]),
    ...mapActions(["ruoterJump"]),
    ...mapActions("orderModule", [
      "area_tree_book_list",
      "product_tree_book_list",
      "get_current_user_handle_order_team",
      "zysc_find_product", // 查询产品信息
      "zysc_get_order_status" // 获取订单状态数据
    ]),
    jump(item, index) {
      /* this.ruoterJump({
        name: "transactionTask",
        params: {
          title: `默认调试任务详情`
        }
      });
      return; */
      // 二级菜单跳转
      if (item.component) {
        this.ruoterJump({ name: item.name });
      }
    },
    handleSelect() {
      //
    },
    // 判断是否显示待抢订单
    hasOrderReceive(data) {
      if (data.storeId && (data.storeStatus == 0 || data.storeStatus == 1)) {
        return true;
      } else {
        return false;
      }
    },
    showOrderNav(item, flag) {
      if (item.name == "brabBill") {
        if (flag) {
          return true;
        } else {
          return false;
        }
      }
      if (item.name == "receive") {
        if (this.storeInfoData.storeId) {
          return true;
        } else {
          if (flag) {
            return true;
          } else {
            return false;
          }
        }
      }
      return true;
    }
  }
};
</script>

// 不加局部属性scoped
<style lang="less"></style>
// 添加局部属性scoped
<style lang="less" scoped>
.order {
  width: 100%;
  height: 100%;
  background-color: #fff;
  margin-bottom: 36px;
  position: absolute;
  border-radius: 6px;
}
.dgg-menu-orders {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent !important;
  background: #fff !important;
  border-bottom-color: #e3e4e6;
  border-radius: 6px 6px 0 0;
  & > li {
    flex-shrink: 0;
    margin-left: 10px;
    height: 46px;
    line-height: 46px;
    padding: 0 15px;
    color: #666873 !important;
    font-size: 14px;
    &.el-menu-item {
      margin-bottom: -1px;
      border-bottom: 0 !important;
    }
    &.el-menu-item.is-active,
    &.el-menu-item.is-active:hover {
      background-color: transparent !important;
      border-bottom: 1px solid #10bbb8 !important;
      color: #10bbb8 !important;
    }
    &.el-menu-item:not(.is-active):hover {
      &.el-menu-item:not(.is-disabled):hover {
        color: transparent !important;
        background-color: transparent !important;
        border-bottom: 0 !important;
        color: #18ccc9 !important;
      }
    }
    &:first-child {
      margin-left: 0;
    }
    & > .dgg-menu-orders {
    }
  }
}
</style>
