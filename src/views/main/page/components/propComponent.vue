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
    <div
      v-if="tabNames.length"
      class="tab-top"
    >
      <span
        v-for="(item, index) in tabNames"
        :key="index"
        :class="currentTab == index ? 'this-btn' : ''"
        @click="handleClick(index)"
      >{{ item }}</span>

    </div>
    <div class="dgg-order-search">
      <!-- @change="$emit('change', searchKey)" -->
      <dgg-input
        v-model="searchKey"
        class="search-input"
        placeholder="请输入产品名称"
        maxlength="30"
        @input="searchKey=searchKey.replace(/\s/g,'')"
        clearable
        @clear="productKewordsVal"
        @keyup.enter.native="$event.target.blur"
        @blur="productKewordsVal"
      >
        <dgg-icon
          slot="prefix"
          icon-class="dgg-search"
        />
      </dgg-input>
    </div>
    <!-- 搜索 end -->
    <ul
      v-infinite-scroll="load"
      class="infinite-list"
      style="overflow:auto"
    >
      <li
        v-for="(item,index) in count"
        :key="index"
        class="infinite-list-item"
        :class="{'active-product-list':item.id == checkedProductId}"
        @click="chooseProductName(item)"
      >
        {{item.productName}}
      </li>
    </ul>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
export default {
  name: "Bitmap",
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
    checkedProductId: {
      //默认选中的产品id
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      searchKey: "",
      currentTab: 0 // 添加办理人选项默认值
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    // console.log(this.$el.previousElementSibling)
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
    Clickoutside() {
      this.searchKey = "";
      //产品名称查询回车事件
      this.productKewordsVal();
      this.$emit("Clickoutside");
    },
    load() {
      this.$emit("load");
    },
    handleClick(val) {
      this.currentTab = val;
      this.$emit("handleClick", val);
    },
    chooseProductName(item) {
      //选定产品名称
      this.$emit("chooseProductNameFn", item);
    },
    //产品名称查询回车事件
    productKewordsVal() {
      // console.log(this.searchKey);
      this.$emit("productKewordsVal", this.searchKey);
    }
  }
};
</script>

<style lang="less" >
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
    width: 100%;
    > li {
      width: 100%;
      font-size: 14px;
      color: #19233c;
      line-height: 20px;
      margin: 0 0 20px;
      .dgg-text-ellip;
      &.active-product-list {
        color: #10bbb8;
      }
      .dgg-text-ellip;
      &:hover {
        color: #10bbb8;
        cursor: pointer;
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
