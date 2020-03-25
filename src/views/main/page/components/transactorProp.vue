<template>
  <!-- 公共占位图 -->
  <!-- height: tabNames.length> 0? '248px' : '218px', -->
  <div
    v-Clickoutside="Clickoutside"
    v-if="upAllPop"
    :style="{ top: top, left: left }"
    class="all-pop"
  >
    <!-- 搜索 start -->
    <div v-if="tabNames.length" class="tab-top">
      <span
        v-for="(item, index) in tabNames"
        :key="index"
        :class="currentTab == Number(index) ? 'this-btn' : ''"
        @click="handleClick(Number(index))"
        >{{ item }}</span
      >
    </div>
    <div class="dgg-order-search">
      <dgg-input
        v-if="currentTab == 0"
        v-model="searchStoreRealName"
        class="search-input"
        placeholder="请输入姓名搜索"
        maxlength="30"
        @input="searchStoreRealName = searchStoreRealName.replace(/\s/g, '')"
        clearable
        @keyup.enter.native="storeKeyWordsFn"
      >
        <dgg-icon slot="prefix" icon-class="dgg-search" />
      </dgg-input>
      <dgg-input
        v-if="currentTab == 1"
        v-model="searchStorePhone"
        class="search-input"
        placeholder="请输入手机号搜索"
        maxlength="11"
        @input="searchStorePhone = searchStorePhone.replace(/[^\d]/g, '')"
        type="tel"
        clearable
        @keyup.enter.native="changePhoneVal(searchStorePhone)"
      >
        <dgg-icon slot="prefix" icon-class="dgg-search" />
      </dgg-input>
    </div>
    <!-- 搜索 end -->
    <ul
      v-infinite-scroll="load"
      class="infinite-list"
      style="overflow:auto"
      v-if="count.length > 0"
    >
      <li
        v-for="(item, index) in count"
        :key="index"
        class="infinite-list-item"
        :class="{ 'active-product-list': item.userId == chooseStoreId }"
        @click="chooseStoreData(item)"
      >
        <span>{{ item.realName ? item.realName : "--" }}</span>
        <span>{{ item.phone }}</span>
      </li>
    </ul>
    <p class="no-data" v-if="count.length < 1">暂无数据！</p>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
import checking from "@/utils/checking";
export default {
  name: "transactorProp",
  components: {},
  model: {
    prop: "upAllPop",
    event: "Clickoutside"
  },
  props: {
    upAllPop: {
      type: Boolean,
      default() {
        return false;
      }
    },
    tabNames: {
      type: Array,
      default() {
        return [];
      }
    },
    count: {
      type: Array,
      default() {
        return [];
      }
    },
    top: {
      type: String,
      default() {
        return "110px";
      }
    },
    left: {
      type: String,
      default() {
        return "50%";
      }
    },
    thisStoreRealName: {
      type: String,
      default() {
        return "";
      }
    },
    thisStorePhone: {
      type: String,
      default() {
        return "";
      }
    },
    chooseStoreId: {
      //默认选中的产品id
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      currentTab: 0, // 添加办理人选项默认值
      searchStoreRealName: "",
      searchStorePhone: ""
    };
  },
  computed: {},
  watch: {
    thisStoreRealName(val) {
      this.searchStoreRealName = val;
    },
    thisStorePhone(val) {
      this.searchStorePhone = val;
    }
  },
  methods: {
    Clickoutside() {
      this.currentTab = 0;
      this.$emit("Clickoutside");
    },
    load() {
      this.$emit("load");
    },
    handleClick(val) {
      this.searchStoreRealName = ""; //清空姓名
      this.searchStorePhone = ""; //清空手机号
      this.$emit("clearNamePhone");
      if (this.currentTab == val) {
        return;
      } else {
        this.currentTab = val;
        this.$emit("changeStoreFlagUser", val);
      }
    },
    changePhoneVal(e) {
      console.log(e);
      let phoneState = checking.checkPhoneVal(e, this);
      if (phoneState) {
        this.$emit("storeKeyWordsFn", this.currentTab, e);
      }
    },
    chooseStoreData(item) {
      //选定产品名称
      this.$emit("chooseStoreDataFn", item);
    },
    //产品名称查询回车事件
    storeKeyWordsFn() {
      this.$emit("storeKeyWordsFn", this.currentTab, this.searchStoreRealName);
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/main.less"; //引入全局less文件
.all-pop {
  width: 282px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 19px 0px #dadde6;
  border-radius: 4px;
  z-index: 35;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 110px;
  .infinite-list {
    max-height: 300px;
    padding: 0 15px;
    padding-top: 20px;
    text-align: left;
    > li {
      width: 100%;
      font-size: 14px;
      color: #19233c;
      line-height: 20px;
      margin: 0 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.active-product-list {
        color: #10bbb8;
      }
      .dgg-text-ellip;
      &:hover {
        color: #10bbb8;
        cursor: pointer;
      }
      span {
        display: inline-block;
        .dgg-text-ellip;

        &:first-child {
          max-width: 130px;
          flex-shrink: 0;
        }
        &:last-child {
          flex: 1;
          text-align: right;
          padding-left: 14px;
        }
      }
    }
  }
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
  .dgg-order-search {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #edeff0;
    /deep/.el-input__inner {
      height: 30px;
      line-height: 30px;
      background: none !important;
      border: 1px solid #e3e4e6 !important;
    }
  }
}
</style>
<style lang="less" scoped>
.no-data {
  text-align: center;
  line-height: 40px;
}
</style>
