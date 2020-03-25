<template>
  <div class="dgg-base-table">
    <el-table
      v-loading="loading"
      ref="table"
      :data="data"
      :height="parentHeight"
      :width="parentWidth"
      class="dgg-table"
      border
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="hasChecked"
        type="selection"
        width="55"
        fixed="left"
      />
      <el-table-column
        v-for="(item, index) of realColumns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :render-header="item.renderHead"
        :fixed="item.fixed"
        :type="item.type"
      >
        <template
          v-if="item.type !=='selection'"
          slot-scope="scope"
        >

          <template v-if="!item.render">
            <div
              :title="scope.row[item.prop]"
              class="overflowEllipsis"
            >
              {{ scope.row[item.prop] }}
            </div>
          </template>
          <!-- render -->
          <template v-else>
            <Cell
              :column="item"
              :row="scope.row"
              :index="scope.$index"
              :render="item.render"
            />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="hasPagination"
      class="dgg-base-table-pagination"
    >
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="limit"
        :total="total"
        class="fr"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import lodash from "lodash";
import Cell from "./expand";
import elementResizeDetectorMaker from "element-resize-detector";

export default {
  name: "DggBaseTable",
  componentsName: "el基础表格",
  components: {
    Cell
  },

  props: {
    // 表格数据
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    // 表格列名
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否有序号列
    hasSort: {
      type: Boolean,
      default: true
    },
    // 是否有分页
    hasPagination: {
      type: Boolean,
      default: true
    },
    // 请求数据的地址
    requestDataApi: {
      type: Function,
      default: null
    },
    // 请求数据的页码
    pageInfo: {
      type: Number,
      default: 0
    },
    // 请求数据的页码
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    // 是否初始化请求数据
    isReq: {
      type: Boolean,
      default: true
    },
    // 是否有切换框
    hasChecked: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pageSizes: [20, 50, 100, 200],
      limit: 20,
      offset: 0,
      currentPage: 1,
      parentWidth: null,
      parentHeight: null,
      observer: null,
      loading: false,
      checkRowData: []
    };
  },
  computed: {
    realColumns() {
      let cloneColumns = lodash.cloneDeep(this.columns);
      if (this.hasSort) {
        cloneColumns.unshift({
          prop: "sort",
          label: "序号",
          width: "65",
          fixed: "left",
          render: (h, params) => {
            let sort = (this.currentPage - 1) * this.limit + params.index + 1;
            return h(
              "div",
              {
                style: {
                  "text-align": "center"
                }
              },
              sort
            );
          }
        });
      }

      return cloneColumns;
    },
    total() {
      return this.pageInfo;
    }
  },
  watch: {
    params: {
      // 初始化页码
      async handler() {
        await this.request(true);
      },
      deep: true
    },
    data() {
      this.checkRowData = [];
    }
  },
  beforeDestroy() {
    let el = this.$el.parentElement;
    this.observer.removeAllListeners(el);
  },
  async mounted() {
    //
    this.initparent(); // 初始化高度
    this.isReq && this.request();
  },
  created() {
    //
  },
  activated() {
    this.initTableSizi();
  },
  methods: {
    //
    initparent() {
      let el = this.$el.parentElement;
      let count = this.hasPagination ? 70 : 0; // 分页EL的高度
      if (el) {
        this.parentWidth = Math.ceil(el.clientWidth) - 1;
        this.parentHeight = Math.ceil(el.clientHeight) - count;
        this.observer = elementResizeDetectorMaker();
        this.observer.listenTo(el, () => {
          this.parentWidth = el.clientWidth - 1;
          this.parentHeight = el.clientHeight - count;
        });
      }
    },
    async handleSizeChange(val) {
      this.limit = val;
      typeof this.requestDataApi === "function" && (await this.request());
      let params = {
        // 请求当前页
        limit: this.limit,
        offset: (this.currentPage - 1) * this.limit
      };
      this.$emit("on-page-size-change", params);
      // 发送请求
    },
    async handleCurrentChange(val) {
      // 发送请求
      this.currentPage = val;
      typeof this.requestDataApi === "function" && (await this.request());
      let params = {
        // 请求当前页
        limit: this.limit,
        offset: (this.currentPage - 1) * this.limit
      };
      this.$emit("on-page-size-change", params);
    },
    async request(data = false) {
      // 请求数据
      this.loading = true;
      if (data) {
        let params = {
          // 默认请求第1页
          limit: this.limit,
          offset: 0
        };
        typeof this.requestDataApi === "function" &&
          (await this.requestDataApi({ ...params, ...this.params })
            .then()
            .catch(err => (this.loading = false)));
        this.currentPage = 1;
        this.loading = false;
      } else {
        let params = {
          // 请求当前页
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit
        };
        typeof this.requestDataApi === "function" &&
          (await this.requestDataApi({ ...params, ...this.params })
            .then()
            .catch(err => (this.loading = false)));
        this.loading = false;
      }
      this.loading = false;

      this.$emit("after-request");
    },
    initTableSizi() {
      if (!this.$refs["table"]) return;
      this.$refs["table"].resizeListener(); // 切换的时候 重新计算一下 表格高度+
      let el = this.$el.parentElement;
      let count = this.hasPagination ? 70 : 0; //
      this.parentWidth = el.clientWidth - 1;
      this.parentHeight = el.clientHeight - count;
    },
    handleSelectionChange(data) {
      this.$emit("selection-change", data);
    }
  }
};
</script>

<style lang="less">
.dgg-base-table {
  height: 100%;
  .dgg-base-table td {
    padding: 0px;
  }
  .dgg-base-table th {
    padding: 12px 0px;
  }
  .dgg-base-table-content {
    height: calc(~"100% - 50px");
  }
  .dgg-base-table-pagination {
    height: 70px;
    padding: 20px;
  }
  .dgg-table {
    height: 100%;
    .dgg-base-table__body-wrapper {
      height: calc(~"100% - 42px");
      overflow: auto;
    }
    th {
      text-align: center;
    }
    td {
      text-align: center;
    }
    .dgg-base-table__row .cell {
      height: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
      line-height: 50px;
    }
    cell > div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }
    ::-webkit-scrollbar {
      height: 10px;
      width: 10px;
    }
  }
}
</style>
