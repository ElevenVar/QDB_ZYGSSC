<template>
  <div class="dgg-query">
    <div
      v-for="(item, index) of list"
      :key="index"
      class="dgg-query-item"
      style="height:30px;margin-top:20px"
    >
      <!-- 佣金 -->
      <template v-if="item.children && item.children.length">
        <div style="display:flex">
          <div class="fl dgg-query-word">
            {{ item.label
            }}{{ typeof item.colon !== "undefined" ? item.colon : ":" }}
          </div>
          <template v-for="(child, index) of item.children">
            <div v-if="child.type === 'select'">
              <div v-if="index > 0" class="fl dgg-query-connector">
                {{ item.connector || "-" }}
              </div>
              <div
                class="fr dgg-query-word-input"
                style="display:flex;align-items:center"
              >
                <dgg-select
                  v-model="child.value"
                  filterable
                  :placeholder="child.placeholder || '请选择'"
                  :style="{ width: child.width || inputWidth }"
                >
                  <dgg-option
                    v-for="child in child.options"
                    :key="child.value"
                    :label="child.label"
                    :value="child.value"
                  >
                    {{ child.label }}
                  </dgg-option>
                </dgg-select>
              </div>
            </div>
            <!-- <div v-else-if="child.type==='cascader'">
              <div
                v-if="index > 0"
                class="fl dgg-query-connector"
              >{{ item.connector || '-' }}</div>
              <div
                class="fr dgg-query-word-input"
                style="display:flex;align-items:center"
              >
                <dgg-cascader
                  v-model="child.model"
                  :props="child.prop"
                  class="provinces-select"
                  :style="{width: child.width || inputWidth}"
                  @change="provinceChange($event,child)"
                />
              </div>
            </div> -->
            <div v-else-if="child.type === 'date'">
              <div v-if="index > 0" class="fl dgg-query-connector">
                {{ item.connector || "-" }}
              </div>
              <div class="fr dgg-query-word-input">
                <dgg-picker
                  v-model="child.value"
                  :picker-options="
                    child.pickerOptions &&
                      child.pickerOptions(getItemByField(child.compareField))
                  "
                  date-type="date"
                  :style="{ width: child.width || inputWidth }"
                  :placeholder="child.placeholder || '选择日期'"
                />
              </div>
            </div>
            <div v-else-if="child.type === 'datetime'">
              <div v-if="index > 0" class="fl dgg-query-connector">
                {{ item.connector || "-" }}
              </div>
              <div class="fr dgg-query-word-input">
                <dgg-picker
                  v-model="child.value"
                  prefix-icon="iconfont iconcalendar"
                  date-type="datetime"
                  :style="{ width: child.width || inputWidth }"
                  :placeholder="child.placeholder || '选择日期时间'"
                />
              </div>
            </div>
            <div v-else-if="child.isPrice">
              <div v-if="index > 0" class="fl dgg-query-connector">
                {{ item.connector || "-" }}
              </div>
              <div class="fr dgg-query-word-input">
                <dgg-input
                  v-model="child.value"
                  :placeholder="child.placeholder || '请输入内容'"
                  maxlength="20"
                  :style="{ width: child.width || inputWidth }"
                  @input.native="clearNoNum(child.value, child)"
                />
              </div>
            </div>
            <div v-else>
              <div v-if="index > 0" class="fl dgg-query-connector">
                {{ item.connector || "-" }}
              </div>
              <div class="fr dgg-query-word-input">
                <dgg-input
                  v-model="child.value"
                  :type="child.isNumber ? 'number' : 'text'"
                  :style="{ width: child.width || inputWidth }"
                  :placeholder="child.placeholder || '请输入内容'"
                />
              </div>
            </div>
          </template>
        </div>
      </template>
      <!-- 业务，产品，地区 -->
      <template v-else>
        <div v-if="item.type === 'select'" style="display:flex">
          <div class="fl dgg-query-word">
            {{ item.label
            }}{{ typeof item.colon !== "undefined" ? item.colon : ":" }}
          </div>
          <div
            class="fr dgg-query-word-input"
            style="display:flex;align-items:center"
          >
            <dgg-select
              @change="changeEvent($event, item.field)"
              v-model="item.value"
              filterable
              :placeholder="item.placeholder || '请选择'"
              :style="{ width: item.width || inputWidth }"
            >
              <dgg-option
                v-for="item in item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </dgg-option>
            </dgg-select>
          </div>
        </div>
        <!-- <div
          v-else-if="item.type==='cascader'"
          style="display:flex"
        >
          <div class="fl dgg-query-word">{{ item.label }}{{typeof item.colon !== 'undefined' ?  item.colon : ':'}}</div>
          <div
            class="fr dgg-query-word-input"
            style="display:flex;align-items:center"
          >
            <dgg-cascader
              v-model="item.model"
              :props="item.prop"
              class="provinces-select"
              :style="{width: item.width || inputWidth}"
              @change="provinceChange($event,item)"
            />
          </div>
        </div> -->
        <div v-else-if="item.type === 'date'" style="display:flex">
          <div class="fl dgg-query-word">
            {{ item.label
            }}{{ typeof item.colon !== "undefined" ? item.colon : ":" }}
          </div>
          <div class="fr dgg-query-word-input">
            <dgg-picker
              v-model="item.value"
              :picker-options="
                item.pickerOptions &&
                  item.pickerOptions(getItemByField(item.compareField))
              "
              date-type="date"
              :style="{ width: item.width || inputWidth }"
              :placeholder="item.placeholder || '选择日期'"
              @change="changeEvent($event, item.field)"
            />
          </div>
        </div>
        <div v-else-if="item.type === 'datetime'" style="display:flex">
          <div class="fl dgg-query-word">
            {{ item.label
            }}{{ typeof item.colon !== "undefined" ? item.colon : ":" }}
          </div>
          <div class="fr dgg-query-word-input">
            <dgg-picker
              v-model="item.value"
              @change="changeEvent($event, item.field)"
              date-type="datetime"
              :style="{ width: item.width || inputWidth }"
              :placeholder="item.placeholder || '选择日期时间'"
            />
          </div>
        </div>
        <div v-else-if="item.type === 'daterange'" style="display:flex">
          <div class="fl dgg-query-word">
            {{ item.label
            }}{{ typeof item.colon !== "undefined" ? item.colon : ":" }}
          </div>
          <div class="fr dgg-query-word-input">
            <dgg-picker
              @change="changeEvent($event, item.field)"
              v-model="item.value"
              date-type="daterange"
              range-separator="至"
              :style="{ width: item.width || inputWidth }"
              class="dgg-daterange"
              :start-placeholder="item.startPlaceholder || '开始日期'"
              :end-placeholder="item.endPlaceholder || '结束日期'"
            />
          </div>
        </div>
        <div v-else-if="item.isPrice" style="display:flex">
          <div class="fl dgg-query-word">
            {{ item.label
            }}{{ typeof item.colon !== "undefined" ? item.colon : ":" }}
          </div>
          <div class="fr dgg-query-word-input">
            <dgg-input
              v-model="item.value"
              @change="changeEvent($event, item.field)"
              prefix-icon="iconfont iconcalendar"
              :placeholder="item.placeholder || '请输入内容'"
              maxlength="20"
              :style="{ width: item.width || inputWidth }"
              @input.native="clearNoNum(item.value, item)"
            />
          </div>
        </div>
        <div v-else-if="item.input" style="display:flex">
          <div class="fl dgg-query-word">
            {{ item.label
            }}{{ typeof item.colon !== "undefined" ? item.colon : ":" }}
          </div>
          <div class="fr dgg-query-word-input">
            <dgg-input
              v-model="item.value"
              @change="changeEvent($event, item.field)"
              prefix-icon="iconfont iconcalendar"
              :placeholder="item.placeholder || '请输入内容'"
              maxlength="20"
              :style="{ width: item.width || inputWidth }"
              @input.native="clearNoNum(item.value, item)"
            />
          </div>
        </div>
        <div v-else style="display:flex">
          <div class="fl dgg-query-word">
            {{ item.label
            }}{{ typeof item.colon !== "undefined" ? item.colon : ":" }}
          </div>
          <div class="fr dgg-query-word-input">
            <dgg-input
              v-model="item.value"
              :type="item.isNumber ? 'number' : 'text'"
              :style="{ width: item.width || inputWidth }"
              :placeholder="item.placeholder || '请输入内容'"
            />
          </div>
        </div>
      </template>
    </div>
    <div
      class="dgg-query-item"
      style="height:30px;margin-top:20px"
      v-if="hasBtn"
    >
      <dgg-button plain class="ml-10 receive-button" @click="search"
        >搜 索</dgg-button
      >
      <dgg-button
        v-if="canExport"
        type="success"
        class="marginL30"
        @click="exportxlsx"
        >导 出</dgg-button
      >
      <dgg-button plain class="marginL30 dgg-button-nocolor" @click="resetAll"
        >重 置</dgg-button
      >
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
    height: {
      type: [Number, String],
      default() {
        return 60;
      }
    },
    canExport: {
      type: true,
      default() {
        return 60;
      }
    },
    hasBtn: {
      type: Boolean,
      default() {
        return true;
      }
    },
    clearValue: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      list: [],
      inputWidth: "140px"
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
    changeEvent(val, field = null) {
      this.$emit("changeEvent", val, field);
    },
    // 搜索
    search() {
      let data = {};
      let listCopy = lodash.cloneDeep(this.list);
      console.log(listCopy, "listCopy");
      listCopy.forEach(element => {
        if (element.children && element.children.length) {
          element.children.forEach(child => {
            if (child.value) {
              if (child.type === "date") {
                this.$set(
                  data,
                  child.field,
                  moment(child.value).format("YYYY-MM-DDTHH:mm:ss")
                );
              } else {
                const val = child.isNumber ? Number(child.value) : child.value;
                this.$set(data, child.field, val);
              }
            }
          });
        } else if (element.value) {
          if (element.type === "date") {
            this.$set(
              data,
              element.field,
              moment(element.value).format("YYYY-MM-DDTHH:mm:ss")
            );
          } else if (element.type === "daterange") {
            this.$set(
              data,
              element.field[0],
              moment(element.value[0]).format("YYYY-MM-DDTHH:mm:ss")
            );
            this.$set(
              data,
              element.field[1],
              moment(element.value[1]).format("YYYY-MM-DDTHH:mm:ss")
            );
          } else {
            const val = element.isNumber
              ? Number(element.value)
              : element.value;
            this.$set(data, element.field, val);
          }
        }
      });
      console.log(data, 1111);
      this.$emit("search", data);
    },
    // 清空
    reset() {
      if (this.clearValue) {
        if (this.list.length) {
          this.queryList.forEach((item, index) => {
            if (item.options) {
              this.list[index].options = item.options;
            }
            if (!item.value) {
              item.value = "";
            }
          });
        } else {
          this.list = lodash.cloneDeep(this.queryList);
        }
      } else {
        this.list = lodash.cloneDeep(this.queryList);
      }
    },
    // 重置
    resetAll() {
      this.list = lodash.cloneDeep(this.queryList);
      this.$emit("resetEvent", "");
    },
    resetFieldValue(val) {
      let _obj = this.list.find(item => {
        return lodash.get(item, "field") === val;
      });
      this.$set(_obj, "value", "");
      this.$forceUpdate();
    },
    exportxlsx() {
      // 导出
      this.$emit("exportxlsx");
    },
    provinceChange(data, item) {
      item.value = data[data.length - 1];
    },
    getItemByField(field) {
      console.log(field);
      debugger;
      //获取item
      let newArr = [];
      this.list.forEach(item => {
        if (item.children && item.children.length) {
          newArr = newArr.concat(item.children);
        } else {
          newArr.push(item);
        }
      });
      const node = newArr.find(i => i.field === field);
      if (!node) return "";
      return node.value;
    },
    clearNoNum(input, item) {
      input = input.replace(/[^\d.]/g, ""); // 清除“数字”和“.”以外的字符
      input = input.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
      input = input
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      input = input.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
      if (input.indexOf(".") < 0 && input !== "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        input = parseFloat(input);
      }
      item.value = input;
    }
  }
};
</script>

<style lang="less">
.dgg-query {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-height: 60px;
  .dgg-query-item {
    padding-left: 15px;
  }
  .dgg-query-col {
    margin-top: 10px;
  }
  .dgg-col {
    min-width: 180px;
  }
  .min-width-col {
    min-width: 210px;
  }
  .addBorder {
    border-right: 3px solid #dcdfe6;
  }
  .dgg-query-word-input {
    flex: 1;
  }
  .dgg-query-word {
    width: auto;
    font-size: 12px;
    line-height: 30px;
    padding-left: 10px;
    margin-right: 10px;
  }
  .dgg-query-connector {
    width: auto;
    line-height: 30px;
    margin-right: 10px;
    margin-left: 10px;
  }
  .dgg-select {
    width: 100%;
  }
  .dgg-date-editor {
    width: 100%;
  }
  .dgg-daterange {
    width: 220px;
  }
}
</style>
