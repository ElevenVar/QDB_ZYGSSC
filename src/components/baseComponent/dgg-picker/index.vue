<template>
  <span class="dgg-picker">
    <el-time-select
      v-if="dateType==='timeSelect'"
      v-bind="$attrs"
      v-on="events"
      :value="realyValue"
      :readonly="readonly"
      :disabled="disabled"
      :editable="editable"
      :clearable="clearable"
      :size="size"
      :placeholder="placeholder"
      :startPlaceholder="startPlaceholder"
      :endPlaceholder="endPlaceholder"
      :isRange="isRange"
      :arrowControl="arrowControl"
      :align="align"
      :popperClass="popperClass"
      :pickerOptions="pickerOptions"
      :rangeSeparator="rangeSeparator"
      :valueFormat="valueFormat"
      :default-value="defaultValue"
      :name="name"
      :prefix-icon="prefixIcon"
      :clearIcon="clearIcon"
    >
    </el-time-select>
    <el-time-picker
      v-else-if="dateType==='timePicker'"
      v-bind="$attrs"
      v-on="events"
      :value="realyValue"
      :readonly="readonly"
      :disabled="disabled"
      :editable="editable"
      :clearable="clearable"
      :size="size"
      :placeholder="placeholder"
      :startPlaceholder="startPlaceholder"
      :endPlaceholder="endPlaceholder"
      :isRange="isRange"
      :arrowControl="arrowControl"
      :align="align"
      :popperClass="popperClass"
      :pickerOptions="pickerOptions"
      :rangeSeparator="rangeSeparator"
      :valueFormat="valueFormat"
      :default-value="defaultValue"
      :name="name"
      :prefix-icon="prefixIcon"
      :clearIcon="clearIcon"
    >
    </el-time-picker>
    <el-date-picker
      v-else
      :value="realyValue"
      v-bind="$attrs"
      v-on="events"
      :type="dateType"
      :size="size"
      :format="format"
      :valueFormat="valueFormat"
      :readonly="readonly"
      :placeholder="placeholder"
      :startPlaceholder="startPlaceholder"
      :endPlaceholder="endPlaceholder"
      :prefixIcon="prefixIcon"
      :clearIcon="clearIcon"
      :name="name"
      :disabled="disabled"
      :clearable="clearable"
      :id="id"
      :popperClass="popperClass"
      :editable="editable"
      :align="align"
      :defaultValue="defaultValue"
      :defaultTime="defaultTime"
      :rangeSeparator="rangeSeparator"
      :pickerOptions="pickerOptions"
      :unlinkPanels="unlinkPanels"
      :validateEvent="validateEvent"
    >
    </el-date-picker>
  </span>

</template>

<script>
import lodash from "lodash";
const HAVE_TRIGGER_TYPES = [
  "date",
  "datetime",
  "timePicker",
  "timeSelect",
  "week",
  "month",
  "year",
  "daterange",
  "monthrange",
  "timerange",
  "datetimerange",
  "dates"
];
const validator = function(val) {
  // either: String, Array of String, null / undefined
  return (
    val === null ||
    val === undefined ||
    lodash.isString(val) ||
    (Array.isArray(val) && val.length === 2 && val.every(isString))
  );
};

export default {
  name: "dgg-picker",
  componentsName: "时间选择器",
  props: {
    value: {},
    dateType: {
      type: [String],
      default() {
        return "date";
      }
    },
    size: String,
    format: String,
    valueFormat: String,
    readonly: Boolean,
    placeholder: String,
    startPlaceholder: String,
    endPlaceholder: String,
    prefixIcon: String,
    clearIcon: {
      type: String,
      default: "el-icon-circle-close"
    },
    name: {
      default: "",
      validator
    },
    disabled: Boolean,
    isRange: Boolean,
    arrowControl: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    id: {
      default: "",
      validator
    },
    popperClass: String,
    editable: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: "left"
    },
    defaultValue: {},
    defaultTime: {},
    rangeSeparator: {
      default: "-"
    },
    pickerOptions: {},
    unlinkPanels: Boolean,
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      realyValue: this.value
    };
  },
  model: {
    prop: "value",
    event: "input"
  },
  computed: {
    events() {
      return {
        change: this._change,
        blur: this._blur,
        focus: this._focus,
        input: this._input
      };
    }
  },
  watch: {
    value: {
      handler(value) {
        this.realyValue = this.value;
      },
      deep: true
    }
  },
  methods: {
    _change(val) {
      this.$emit("change", val);
    },
    _blur(val) {
      this.$emit("blur", val);
    },
    _focus(val) {
      this.$emit("focus", val);
    },
    _input(val) {
      this.realyValue = val;
      this.$emit("input", val);
    }
  }
};
</script>
<style lang="less">
.el-picker-panel {
  position: relative;
  .el-picker-panel__body {
    .el-input {
      width: 146px;
    }
  }
  .el-time-range-picker__cell {
    width: 49%;
  }
}
</style>
