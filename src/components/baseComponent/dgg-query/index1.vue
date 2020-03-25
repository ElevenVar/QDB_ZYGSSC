<template>
  <div class="dgg-query">
    <div
      v-for="(item, index) of list"
      :key="index"
      style="height:30px;margin-top:10px"
      class="dgg-query-item"
    >
      <div>
        <div
          v-if="item.type==='select'"
          style="display:flex"
        >
          <div class="fl dgg-query-word">{{ item.label }}:</div>
          <div
            class="fr dgg-query-word-input"
            style="display:flex;align-items:center"
          >
            <el-select
              v-model="item.value"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </div>
        </div>
        <div
          v-else-if="item.type==='date'"
          style="display:flex"
        >
          <div class="fl dgg-query-word">{{ item.label }}:</div>
          <div class="fr dgg-query-word-input">
            <el-date-picker
              v-model="item.value"
              type="datetime"
              placeholder="选择日期时间"
            />
          </div>
        </div>
        <div
          v-else-if="item.type==='daterange'"
          style="display:flex"
        >
          <div class="fl dgg-query-word">{{ item.label }}:</div>
          <div class="fr dgg-query-word-input">
            <el-date-picker
              v-model="item.value"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </div>
        <div
          v-else
          style="display:flex"
        >
          <div class="fl dgg-query-word">{{ item.label }}:</div>
          <div class="fr dgg-query-word-input">
            <el-input
              v-model="item.value"
              placeholder="请输入内容"
            />
          </div>
        </div>

      </div>
      <!-- <div
        class="marginT10"
        style="border-right:1px solid #309EFF;height:30px;float:right"/> -->
    </div>

    <div
      class="dgg-query-item"
      style="margin-top:10px;text-align:right;"
    >
      <el-button
        type="primary"
        class="marginL10"
        @click="search"
      >查 询
      </el-button>
      <el-button
        v-if="canExport"
        type="success"
        @click="exportxlsx"
      >导 出
      </el-button>
      <el-button
        type="danger"
        @click="reset"
      >清 空
      </el-button>
      <slot name="operation"></slot>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import lodash from "lodash";
import moment from "moment";

export default {
  name: "DggQuery",
  componentsName: "筛选框",
  components: {},
  props: {
    queryList: {
      type: Array,
      default() {
        return [];
      }
    },
    canExport: {
      type: true,
      default() {
        return 60;
      }
    }
  },
  data() {
    return {
      list: []
    };
  },
  computed: {},
  watch: {
    queryList(val) {
      this.reset();
    }
  },
  mounted() {
    //
    this.reset();
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
    //
    search() {
      let data = {};
      let listCopy = lodash.cloneDeep(this.list);
      listCopy.forEach(element => {
        console.log(element);
        if (element.value) {
          if (element.type === "date") {
            this.$set(
              data,
              element.field,
              moment(element.value).format("YYYY-MM-DDTHH:mm:ss")
            );
          } else {
            this.$set(data, element.field, element.value);
          }
        }
      });
      this.$emit("search", data);
    },
    // 清空
    reset() {
      this.list = lodash.cloneDeep(this.queryList);
      this.$emit("reset");
    },
    exportxlsx() {
      this.$emit("exportxlsx");
    }
  }
};
</script>

<style lang="less">
.pull-left {
  float: left;
}

.pull-right {
  float: right;
}

.dgg-query {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  border-bottom: 1px solid #dcdfe6;
  width: 100%;
  min-height: 60px;
  padding-bottom: 10px;
  .dgg-query-item {
    min-width: 120px;
  }

  .el-button {
    margin-left: 10px;
  }

  .dgg-query-col {
    margin-top: 10px;
  }

  .addBorder {
    border-right: 3px solid #dcdfe6;
  }

  .dgg-query-word-input {
    flex: 1;
  }

  .dgg-query-word {
    width: auto;
    line-height: 30px;
    padding-left: 10px;
    margin-right: 10px;
  }

  .el-select {
    width: 100%;
  }

  .el-date-editor {
    width: 100%;
  }
}
</style>
