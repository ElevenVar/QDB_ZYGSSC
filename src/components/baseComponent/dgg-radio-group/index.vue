
<template>
  <div class="dgg-radio-group">
    <el-radio-group
      v-model="radioValue"
      @change="change"
    >
    <span v-if="isButton">
      <el-radio-button
        v-for="(item, index) of radioArray"
        :key="index"
        :label="item.value?item.value: item.label"
        :class="{'dgg-radio-group-space': space}"
        :disabled="item.disabled"
        :style="radioStyle"
      >
        {{ item.label }}
      </el-radio-button>
    </span>
    <span v-if="!isButton">
      <el-radio
        v-for="(item, index) of radioArray"
        :key="index"
        :label="item.value?item.value: item.label"
        :class="{'dgg-radio-group-space': space}"
        :disabled="item.disabled"
        :border="item.border"
        :style="radioStyle"
      >
        {{ item.label }}
      </el-radio>
    </span>

    </el-radio-group>
  </div>
</template>
<script>
export default {
  name: "dgg-radio-group",
  componentsName: "单选框组",
  props: {
    activeData: {
      type: [String, Number, Array],
      default() {
        return "";
      }
    },
    radioArray: {
      type: [Array],
      default() {
        return [];
      }
    },
    space: {
      type: [Number],
      default() {
        return 20;
      }
    },
    isButton: {
      type: [Boolean, Number],
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      radioValue: ""
    };
  },
  computed: {
    radioStyle() {
      let style = {};
      if (this.space) style["margin-right"] = this.space + "px";
      return style;
    }
  },
  watch: {
    activeData(value) {
      this.radioValue = value;
    }
  },
  mounted() {
    this.radioValue = this.activeData;
  },
  methods: {
    change(value) {
      this.$emit("change", value);
    }
  }
};
</script>
<style lang="less">
.dgg-radio-group {
  .dgg-radio-group-space {
    .el-radio-button__inner {
       // border: 1px solid #dcdfe6;
      border-radius: 2px;
   }
    // .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    //   background-color: #409eff;
    //   border-color: #409eff;
    // }
  }
}
</style>
