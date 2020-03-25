<template>
  <dgg-modal
    :modal="modalCase"
    :hasmodal="true"
    title="关联案例"
    width="430px"
    @modalAffirm="submit"
    @modalQuit="close"
  >
    <div class="ref-case-dialog">
      <dgg-input
        v-model="searchKey"
        maxlength="30"
        placeholder="案例名称"
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
          :infinite-scroll-distance="6"
          class="list"
        >
          <el-tree
            ref="caseTableRef"
            :data="pageCount"
            :props="defaultProps"
            class="scroll-tree"
            show-checkbox
            check-on-click-node
            node-key="id"
            @check-change="checkChangeHandle"
          >
            <span
              slot-scope="{ node, data }"
              class="custom-tree-node"
            >
              <h2>{{ node.label }}</h2>
              <p v-if='node.proId'>{{ node.proId }}</p>
            </span>
          </el-tree>
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
  name: "RefCase",
  components: {},
  props: {
    maxCases: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      searchKey: "",
      count: [],
      caseSelectedList: [],
      firstLoadBack: false,
      limit: 20,
      page: 1,
      modalCase: false,
      loading: false,
      noMore: false,
      defaultProps: {
        children: "children",
        label: "caseName"
      }
    };
  },
  computed: {
    ...mapState(["userId"]),
    disabled() {
      return this.loading || this.noMore;
    },
    params() {
      return {
        page: this.page,
        limit: this.limit,
        params: {
          typeCode: "BUS_YT_FL",
          caseName: this.searchKey,
          leaderId: this.userId
        }
      };
    },
    pageCount() {
      return this.count.filter(item => {
        return !this.caseSelectedList.includes(item.caseCenterId);
      });
    }
  },
  watch: {
    /* count() {
      this.checkedCases(this.caseSelectedList);
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
    ...mapActions("personalSettingModule", ["ref_case_list"]),
    showModel(show, caseIds) {
      this.modalCase = show;
      this.caseSelectedList = lodash.cloneDeep(caseIds);
      this.loadFirstPage(caseIds);
    },
    loadFirstPage(caseIds) {
      console.log("firstload");
      this.firstLoadBack = false;
      this.loading = true;
      this.ref_case_list(this.params)
        .then(res => {
          if (res.code === 200) {
            this.$set(this, "count", res.data.records);
            if (res.data.records.length < this.limit) {
              this.noMore = true;
            }
            this.firstLoadBack = true;
            console.log("firstload-back");
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
    load() {
      console.log("scrollload");
      if (this.noMore || !this.firstLoadBack) return;
      this.loading = true;
      this.page++;
      this.ref_case_list(this.params)
        .then(res => {
          if (res.code === 200) {
            if (res.data.records.length < this.limit) {
              this.noMore = true;
            }
            this.$set(this, "count", [...this.count, ...res.data.records]);
            console.log("scrollload-back");
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
    checkedCases(ids) {
      if (ids && ids.length) {
        this.$nextTick(() => {
          this.$refs.caseTableRef.setCheckedKeys(ids);
        });
      }
    },
    checkChangeHandle(data, isCheck) {
      const selectList = this.$refs.caseTableRef.getCheckedNodes();
      if (
        isCheck &&
        this.caseSelectedList.length + selectList.length > this.maxCases
      ) {
        this.$message({
          message: "一个案例最多只能关联" + this.maxLabel + "个案例",
          type: "warning"
        });
        this.$refs.caseTableRef.setChecked(data.id, false);
      }
    },
    close() {
      this.searchKey = "";
      this.$set(this, "count", []);
      this.labelSelectedList = [];
      this.noMore = false;
      this.loading = false;
      this.modalCase = false;
      this.firstLoadBack = false;
      this.page = 1;
    },
    search() {
      this.page = 1;
      this.noMore = false;
      this.loadFirstPage();
    },
    submit() {
      this.searchKey = "";
      const selectList = this.$refs.caseTableRef.getCheckedNodes();
      this.$emit("add-callback", selectList);
      this.close();
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
.ref-case-dialog {
  .infinite-list-wrapper {
    height: 332px;
    overflow: auto;
    .ml-12 {
      margin-left: 12px;
    }
    .list {
      margin-top: 24px;
    }
    li {
      display: flex;
      margin-bottom: 20px;
      .right-text {
        flex: 0 0 auto;
        padding-left: 12px;
        width: calc(100% - 26px);
        cursor: pointer;
        &:hover {
          h4,
          p {
            color: var(--main-primary-color) !important;
          }
        }
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
    .scroll-tree {
      .el-tree-node__content {
        height: auto;
      }
      .el-tree-node {
        margin-bottom: 20px;
      }
      .custom-tree-node {
        display: inline-block;
        max-width: calc(100% - 32px);
        h2 {
          color: @flsc-main;
          font-size: 14px;
          max-width: 100%;
          line-height: 18px;
          white-space: normal;
        }
        p {
          color: #666873;
          font-size: 12px;
          margin-top: 6px;
          line-height: 16px;
          white-space: normal;
        }
      }
      .el-tree-node__expand-icon.is-leaf {
        width: 0;
        padding: 0;
      }
    }
    .bottom-tip {
      text-align: center;
      margin-bottom: 10px;
    }
  }
}
</style>
