<template>
  <div class="dgg-editable">
    <elx-editable
      v-on="events"
      v-loading="loading"
      :columns="columns"
      ref="table"
      v-bind="$attrs"
      :data="cloneData"
      :lazy="lazy"
      :load="load"
      :row-key="rowKey"
      :edit-config="editConfig"
      :highlight-current-row="highlightCurrentRow"
      :rowClassName="rowClassName"
      :span-method="spanMethod"
      :height="parentHeight"
      :style="{width: parentWidth + 'px'}"
      class="click-table5"
      :border="border"
      size="mini"
      :hasHoverRow="hasHoverRow"
      :show-header="showHeader"
      @blur-active="blurActive"
    >
      <elx-editable-column
        v-for="(item, index) of columns"
        :key="index"
        :prop="item.prop"
        :type="item.type"
        :expandRender="item.expandRender"
        :render="item.render"
        :label="item.label"
        :width="item.width"
        :fixed="item.fixed"
        :align="item.align"
        :selectable="item.selectable"
        :sortable="item.sortable?item.sortable:false"
        :formatter="item.formatter"
        show-overflow-tooltip
      >
        <template
          v-slot="scope"
          v-if="item.fixed"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
        >
          <Cell
            :column="item"
            :row="scope.row"
            :index="scope.$index"
            :render="item.render"
          />
        </template>
        <template v-if="!item.fixed">
          <elx-editable-column
            v-for="(child, sort) of item.children"
            v-if="item.children.length"
            :key="sort"
            :edit-render="child.editRender"
            :prop="child.prop"
            :type="child.type"
            :align="item.align"
            :render="child.render"
            :selectable="child.selectable"
            :formatter="child.formatter"
            :expandRender="item.expandRender"
            :label="child.label"
            :sortable="child.sortable?child.sortable:false"
            :min-width="child.minWidth"
            :width="child.width"
            show-overflow-tooltip
          >
            <template v-if="child.children">
              <elx-editable-column
                v-for="(ch, key) of child.children"
                :key="key"
                :edit-render="ch.editRender"
                :prop="ch.prop"
                :label="ch.label"
                :expandRender="ch.expandRender"
                :type="ch.type"
                :align="item.align"
                :render="ch.render"
                :selectable="ch.selectable"
                :sortable="ch.sortable?ch.sortable:false"
                :formatter="ch.formatter"
                :min-width="ch.minWidth"
                :width="ch.width"
                show-overflow-tooltip
              />
            </template>
          </elx-editable-column>
        </template>
      </elx-editable-column>
    </elx-editable>
    <div
      v-if="hasPagination"
      class="dgg-edit-table-pagination"
    >
      <slot name="footer-left" />
      <dgg-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="limit"
        :total="total"
        :prev-text="prevText"
        :next-text="nextText"
        class="fr"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import Cell from "../dgg-base-table/expand.js";
import elementResizeDetectorMaker from "element-resize-detector";

const PaginationHeight = 40; //分页高度
export default {
  name: "DggEditTable",
  componentsName: "表格",
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
    hasHoverRow: {
      // todo 是否含有移入效果
      type: Boolean,
      default: true
    },
    editConfig: {
      type: Object,
      default() {
        return { trigger: "click", mode: "cell", useDefaultValidTip: true };
      }
    },
    // 表格列名
    columns: {
      type: Array,
      default() {
        return [{ children: [{ children: [] }] }];
      }
    },
    rowClassName: {
      // 行的类名
      type: [Function, String],
      default: ""
    },
    rowKey: {
      // 根据什么来产生树形结构
      type: [String],
      default: null
    },
    // 合并列的方法
    spanMethod: {
      type: Function,
      default() {
        //
      }
    },
    // 是否有分页
    hasPagination: {
      type: Boolean,
      default: true
    },
    // 行高亮
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    // 树形表格的懒加载模式
    lazy: {
      type: Boolean,
      default: false
    },
    // 请求数据的地址
    requestDataApi: {
      type: Function,
      default: null
    },
    // 懒加载的load方法
    load: {
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
    border: {
      type: Boolean,
      default: false
    },
    hasheight: {
      // 是否根据父元素来确定高度
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: "left"
    },
    prevText: String,
    nextText: String,
    pageSizes: {
      type: Array,
      default() {
        return [10, 50, 100, 200];
      }
    },
    limitNum: {
      type: Number,
      default() {
        return 10;
      }
    },
    limitKey: {
      type: String,
      default() {
        return "limit";
      }
    },
    currentKey: {
      type: String,
      default() {
        return "start";
      }
    }
  },
  data() {
    return {
      limit: 0,
      currentPage: 1,
      parentWidth: null,
      parentHeight: null,
      observer: null,
      loading: false,
      checkRowData: [],
      cloneData: []
    };
  },
  computed: {
    total() {
      return parseInt(this.pageInfo);
    },
    events() {
      return {
        select: this._select,
        "select-all": this._selectAll,
        "selection-change": this._selectionChange,
        "cell-mouse-enter": this._cellMouseEnter,
        "cell-mouse-leave": this._cellMouseLeave,
        "cell-click": this._cellClick,
        "cell-dblclick": this._cellDBLclick,
        "row-click": this._rowClick,
        "row-contextmenu": this._rowContextmenu,
        "row-dblclick": this._rowDBLclick,
        "header-click": this._headerClick,
        "header-contextmenu": this._headerContextmenu,
        "sort-change": this._sortChange,
        "filter-change": this._filterChange,
        "current-change": this._currentChange,
        "header-dragend": this._headerDragend,
        "expand-change": this._expandChange
      };
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
    data: {
      handler(val) {
        this.cloneData = val;
        this.$refs["table"]._initial(val);
      },
      deep: true
    }
  },
  beforeDestroy() {
    let el = this.$el.parentElement;
    this.observer && this.observer.removeAllListeners(el);
  },
  async mounted() {
    //
    this.limit = this.limitNum;
    this.hasheight && this.initparent(); // 初始化高度
    this.isReq && this.request();
  },
  activated() {
    this.initTableSizi();
  },
  methods: {
    refresh() {
      // 刷新表格
      this.$refs["table"].refresh();
    },
    blurActive(row, colum) {
      // 失焦的时候 改变数据
      this.$emit("blur-active", row, colum);
    },
    initparent() {
      let el = this.$el.parentElement;
      let count = this.hasPagination ? PaginationHeight : 0; // 分页EL的高度  // 目前是40 高度 可以自己调整
      if (el) {
        this.parentWidth = Math.ceil(el.clientWidth) - 2; // -2 减去border宽度 避免错位
        this.parentHeight = Math.ceil(el.clientHeight) - count;
        this.observer = elementResizeDetectorMaker();
        this.observer.listenTo(el, () => {
          this.parentWidth = el.clientWidth - 2; // -2 减去border宽度 避免错位
          this.parentHeight = el.clientHeight - count;
        });
      }
    },
    async handleSizeChange(val) {
      this.limit = val;
      typeof this.requestDataApi === "function" && (await this.request());
      // let params = {
      //   // 请求当前页
      //   limit: this.limit,
      //   offset : (this.currentPage - 1) * this.limit
      //   // page: this.currentPage
      // };
      let params = {};
      params[this.limitKey] = this.limit;
      params[this.currentKey] = this.currentPage;
      this.$emit("on-page-size-change", params);
      // 发送请求
    },
    async handleCurrentChange(val) {
      // 发送请求
      this.currentPage = val;
      typeof this.requestDataApi === "function" && (await this.request());
      // let params = {
      //   // 请求当前页
      //   limit: this.limit,
      //   offset: (this.currentPage - 1) * this.limit
      //   // page: this.currentPage
      // };
      let params = {};
      params[this.limitKey] = this.limit;
      params[this.currentKey] = this.currentPage;
      this.$emit("on-page-size-change", params);
    },
    async request(data = false) {
      // 请求数据
      this.loading = true;
      if (data) {
        // let params = {
        //   // 默认请求第1页
        //   limit: this.limit,
        //   offset: 0
        //   // page: 1
        // };
        let params = {};
        params[this.limitKey] = this.limit;
        params[this.currentKey] = 1;

        typeof this.requestDataApi === "function" &&
          (await this.requestDataApi({ ...params, ...this.params })
            .then()
            .catch(err => (this.loading = false)));
        this.currentPage = 1;
        this.loading = false;
      } else {
        // let params = {
        //   // 请求当前页
        //   limit: this.limit,
        //   offset: (this.currentPage - 1) * this.limit
        //   // page: this.currentPage
        // };
        let params = {};
        params[this.limitKey] = this.limit;
        params[this.currentKey] = this.currentPage;
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
      if (!this.hasheight) return;
      this.$refs["table"].resizeListener(); // 切换的时候 重新计算一下 表格高度+
      let el = this.$el.parentElement;
      let count = this.hasPagination ? PaginationHeight : 0; //页码的高度
      this.parentWidth = el.clientWidth - 2; // -2 减去border宽度 避免错位
      this.parentHeight = el.clientHeight - count;
    },
    handleSelectionChange(data) {
      this.$emit("selection-change", data);
    },
    getAllRecords() {
      return this.$refs["table"].getAllRecords();
    },
    getSelecteds() {
      return this.$refs["table"].getSelecteds();
    },
    _select(selection, row) {
      this.$emit(
        "select",
        selection.map(item => (item ? item.data : item)),
        row
      );
    },
    _selectAll(selection) {
      this.$emit(
        "select-all",
        selection.map(item => (item ? item.data : item))
      );
    },
    _selectionChange(selection) {
      this.$emit(
        "selection-change",
        selection.map(item => (item ? item.data : item))
      );
    },
    _cellMouseEnter(row, column, cell, event) {
      this.$emit("cell-mouse-enter", row, column, cell, event);
    },
    _cellMouseLeave(row, column, cell, event) {
      this.$emit("cell-mouse-leave", row, column, cell, event);
    },
    _cellClick(row, column, cell, event) {
      this.$emit("cell-click", row, column, cell, event);
    },
    _cellDBLclick(row, column, cell, event) {
      this.$emit("cell-db-lclick", row, column, cell, event);
    },
    _rowClick(row, column, event) {
      this.$emit("row-click", row, column, event);
    },
    _rowContextmenu(row, column, event) {
      this.$emit("row-contextmenu", row, column, event);
    },
    _rowDBLclick(row, column, event) {
      this.$emit("row-dblclick", row, column, event);
    },
    _headerClick(column, event) {
      this.$emit("header-click", column, event);
    },
    _headerContextmenu(column, event) {
      this.$emit("header-contextmenu", column, event);
    },
    _sortChange({ column, prop, order }) {
      this.$emit("sort-change", { column, prop, order });
    },
    _filterChange(filters) {
      this.$emit("filter-change", filters);
    },
    _currentChange(currentRow, oldCurrentRow) {
      if (currentRow && oldCurrentRow) {
        this.$emit("current-change", currentRow, oldCurrentRow);
      } else if (currentRow) {
        this.$emit("current-change", currentRow, null);
      } else if (oldCurrentRow) {
        this.$emit("current-change", null, oldCurrentRow);
      }
    },
    _headerDragend(newWidth, oldWidth, column, event) {
      this.$emit("header-dragend", newWidth, oldWidth, column, event);
    },
    _expandChange(row, expandedRows) {
      this.$emit("expand-change", row, expandedRows);
    }
  }
};
</script>
<style lang="less">
@import (reference) "~assets/less/preset.less";

.dgg-editable {
  height: 100%;
  width: 100%;
  .el-table .cell {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .dgg-edit-table-pagination {
    width: 100%;
    height: 70px;
    background: #fff;
    padding: 20px 10px;
    .el-pagination__sizes {
      .el-input__suffix {
        top: 0;

        .el-input__suffix-inner {
          display: block;
        }
      }
    }
  }

  .el-table {
    .el-table__header {
      tr {
        background-color: #f5f7fa;
      }

      th {
        background-color: #f5f7fa;
      }
    }
  }
  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .el-table__body tr.current-row > td,
  .el-table__body tr.hover-row.current-row > td,
  .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
  .el-table__body tr.hover-row.el-table__row--striped > td,
  .el-table__body tr.hover-row > td {
    background-color: #e1faf5;
  }

  .el-table__fixed-right-patch {
    background-color: #f2f2f2;
  }

  .el-table__expanded-cell {
    background-color: #f7f7f7 !important;
  }
  .el-table__expanded-cell:hover {
    background-color: #f7f7f7 !important;
  }
  .el-table__body-wrapper {
    font-size: 13px;
    font-weight: 400;
    font-family: PingFangSC-Regular, PingFang SC;
    color: rgba(25, 35, 60, 1);
  }
  .el-table__header-wrapper {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(102, 104, 115, 1);
  }
  .el-pagination {
    .el-input__prefix,
    .el-input__suffix {
      top: 0; // todo
    }

    text-align: right;

    .btn-prev {
      .el-input__prefix,
      .el-input__suffix {
        top: 0px;
      }
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;

      &:hover {
        border-color: @neutral-btn;
      }
    }

    .btn-next {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left-width: 0;

      &:hover {
        border-color: @neutral-btn;
      }
    }

    .el-pager {
      li:first-child {
        border-left-width: 1px !important;
      }
      li {
        margin: 0;
        border-radius: 0;
        border-left-width: 0;
        border-right-width: 0;

        &:last-child {
          border-right-width: 1px !important;
        }

        &:not(.active) {
          &:hover {
            border-color: @neutral-btn;
          }
        }

        &.active {
          background: unset;
          color: @main;
          border: 1px @main solid;
          // border-right-width: 0;

          &:hover {
            color: @main;
          }

          & + li {
            border-right-width: 0;
            border-left-color: @main !important;
          }
        }

        & + li {
          border-left-width: 1px;
        }
      }
    }
  }
}
.el-table thead tr th:first-child {
  padding-left: 20px;
}
.el-table tr td:first-child {
  padding-left: 20px;
}
</style>
