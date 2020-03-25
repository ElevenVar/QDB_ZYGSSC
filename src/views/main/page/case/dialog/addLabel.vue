<template>
  <dgg-modal
    :modal="modalLabel"
    :hasmodal="true"
    title="添加标签"
    width="430px"
    @modalAffirm="submit"
    @modalQuit="close"
  >
    <div class="ref-label-dialog">
      <dgg-input
        v-model="searchKey"
        maxlength="30"
        placeholder="输入标签名称搜索"
        @keyup.enter.native="search"
      >
        <dgg-icon
          slot="prefix"
          icon-class="dgg-search"
        />
      </dgg-input>
      <div class="infinite-list-wrapper">
        <div
          v-infinite-scroll="load"
          :infinite-scroll-immediate="false"
          :infinite-scroll-disabled="disabled"
          class="list"
        >
          <el-tree
            ref="labelTableRef"
            :data="pageCount"
            :props="defaultProps"
            class="scroll-tree"
            show-checkbox
            check-on-click-node
            node-key="lableCode"
            @check-change="checkChangeHandle"
          />
        </div>
        <p
          v-if="loading"
          class="bottom-tip"
        >加载中...</p>
        <p
          v-if="noMore && pageCount.length"
          class="bottom-tip"
        >没有更多了</p>
      </div>
    </div>
  </dgg-modal>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
import lodash from "lodash";
export default {
  name: "AddLabel",
  components: {},
  props: {
    maxLabel: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      searchKey: "",
      count: [],
      labelSelectedList: [],
      limit: 20,
      page: 1,
      modalLabel: false,
      loading: false,
      noMore: false,
      firstLoadBack: false,
      defaultProps: {
        children: "children",
        label: "lableName"
      }
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
    params() {
      return {
        typeCode: "BUS_YT_FL",
        page: this.page,
        limit: this.limit,
        name: this.searchKey
      };
    },
    pageCount() {
      return this.count.filter(item => {
        return !this.labelSelectedList.includes(item.lableCode);
      });
    }
  },
  watch: {
    /* count() {
      this.checkedLabels(this.labelSelectedList);
    } */
  },
  async mounted() {},
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
    ...mapActions("caseModule", ["add_lable"]),
    async showModel(show, labelIds) {
      this.modalLabel = show;
      this.labelSelectedList = lodash.cloneDeep(labelIds);
      this.loadFirstPage(labelIds);
    },
    loadFirstPage(labelIds) {
      this.firstLoadBack = false;
      this.loading = true;
      this.add_lable(this.params)
        .then(res => {
          if (res.code === 200) {
            this.$set(this, "count", res.data.records);
            if (res.data.records.length < this.limit) {
              this.noMore = true;
            }
            this.firstLoadBack = true;
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    load() {
      if (this.noMore || !this.firstLoadBack) return;
      this.loading = true;
      this.page++;
      this.add_lable(this.params)
        .then(res => {
          if (res.code === 200) {
            if (res.data.records.length < this.limit) {
              this.noMore = true;
            }
            this.$set(this, "count", [...this.count, ...res.data.records]);
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    checkedLabels(ids) {
      if (ids && ids.length) {
        this.$nextTick(() => {
          this.$refs.labelTableRef.setCheckedKeys(ids);
        });
      }
    },
    checkChangeHandle(data, isCheck) {
      const selectList = this.$refs.labelTableRef.getCheckedNodes();
      if (
        isCheck &&
        this.labelSelectedList.length + selectList.length > this.maxLabel
      ) {
        this.$message({
          message: "一个案例最多只能添加" + this.maxLabel + "个标签",
          type: "warning"
        });
        this.$refs.labelTableRef.setChecked(data.lableCode, false);
      }
    },
    close() {
      this.$set(this, "count", []);
      this.labelSelectedList = [];
      this.noMore = false;
      this.loading = false;
      this.modalLabel = false;
      this.firstLoadBack = false;
      this.page = 1;
    },
    search() {
      this.page = 1;
      this.noMore = false;
      this.loadFirstPage();
    },
    submit() {
      const selectList = this.$refs.labelTableRef.getCheckedNodes();
      this.$emit("add-callback", selectList);
      this.close();
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
.ref-label-dialog {
  .infinite-list-wrapper {
    height: 332px;
    margin-top: 16px;
    overflow: auto;
    .ml-12 {
      margin-left: 12px;
    }
    li {
      display: flex;
      margin-bottom: 20px;
      .right-text {
        flex: 0 0 auto;
        padding-left: 12px;
        width: calc(100% - 26px);
        h4 {
          color: @flsc-main;
          font-size: 14px;
        }
        p {
          color: #666873;
          font-size: 12px;
          line-height: 20px;
        }
      }
    }
    .bottom-tip {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  .scroll-tree {
    .el-tree-node__content {
      height: 36px;
    }
    .el-tree-node__expand-icon.is-leaf {
      width: 0;
      padding: 0;
    }
  }

  .label-table {
    .el-table__header-wrapper {
      display: none;
    }
    td {
      border: 0;
    }
    .elx-editable-column {
      height: 40px;
    }
    .el-table {
      &:before {
        height: 0;
      }
    }
  }
  .case-footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px @flsc-border-color solid;
    padding-top: 12px;
  }
}
</style>
