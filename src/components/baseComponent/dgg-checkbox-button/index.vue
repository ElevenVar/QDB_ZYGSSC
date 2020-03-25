<template>
  <label
    class="el-checkbox-button dgg-checkbox-button"
    :class="[
        size ? 'el-checkbox-button--' + size : '',
        { 'is-disabled': isDisabled },
        { 'is-checked': isChecked },
        { 'is-focus': focus },
      ]"
    role="checkbox"
    :style="{'margin-right': space + 'px'}"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
  >
    <input
      v-if="trueLabel || falseLabel"
      class="el-checkbox-button__original"
      type="checkbox"
      :name="name"
      :disabled="isDisabled"
      :true-value="trueLabel"
      :false-value="falseLabel"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    >
    <input
      v-else
      class="el-checkbox-button__original"
      type="checkbox"
      :name="name"
      :disabled="isDisabled"
      :value="label"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    >

    <span
      class="el-checkbox-button__inner"
      v-if="$slots.default || label"
      :style="isChecked ? activeStyle : null"
    >
      <slot>{{label}}</slot>
    </span>
    <span
      class="dgg-checkbox-button-fixed"
      :class="{ 'button-fixed-white':!isChecked && !isChecked && !focus || isDisabled }"
    >
      <dgg-icon
        icon-class="dgg-check"
        class="fixed-color"
        style="width:8px;height:10px;margin-left:-8px; margin-top: 4px;"
      />
    </span>
  </label>
</template>
<script>
import Emitter from "@/componentsEl/src/mixins/emitter";

export default {
  name: "dgg-checkbox-button",
  componentsName: "多选框按钮",
  mixins: [Emitter],
  inject: {
    elForm: {
      default: ""
    },
    elFormItem: {
      default: ""
    }
  },

  data() {
    return {
      selfModel: false,
      focus: false,
      isLimitExceeded: false
    };
  },

  props: {
    value: {},
    label: {},
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    space: {
      type: [String, Number],
      default() {
        return 10;
      }
    }
  },
  computed: {
    model: {
      get() {
        return this._checkboxGroup
          ? this.store
          : this.value !== undefined
          ? this.value
          : this.selfModel;
      },

      set(val) {
        if (this._checkboxGroup) {
          this.isLimitExceeded = false;
          this._checkboxGroup.min !== undefined &&
            val.length < this._checkboxGroup.min &&
            (this.isLimitExceeded = true);

          this._checkboxGroup.max !== undefined &&
            val.length > this._checkboxGroup.max &&
            (this.isLimitExceeded = true);

          this.isLimitExceeded === false &&
            this.dispatch("ElCheckboxGroup", "input", [val]);
        } else if (this.value !== undefined) {
          this.$emit("input", val);
        } else {
          this.selfModel = val;
        }
      }
    },

    isChecked() {
      if ({}.toString.call(this.model) === "[object Boolean]") {
        return this.model;
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1;
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel;
      }
    },

    _checkboxGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== "ElCheckboxGroup") {
          parent = parent.$parent;
        } else {
          return parent;
        }
      }
      return false;
    },

    store() {
      return this._checkboxGroup ? this._checkboxGroup.value : this.value;
    },

    activeStyle() {
      return {
        backgroundColor: this._checkboxGroup.fill || "",
        borderColor: this._checkboxGroup.fill || "",
        color: this._checkboxGroup.textColor || "",
        "box-shadow": "-1px 0 0 0 " + this._checkboxGroup.fill
      };
    },

    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },

    size() {
      return (
        this._checkboxGroup.checkboxGroupSize ||
        this._elFormItemSize ||
        (this.$ELEMENT || {}).size
      );
    },

    /* used to make the isDisabled judgment under max/min props */
    isLimitDisabled() {
      const { max, min } = this._checkboxGroup;
      return (
        (!!(max || min) && (this.model.length >= max && !this.isChecked)) ||
        (this.model.length <= min && this.isChecked)
      );
    },

    isDisabled() {
      return this._checkboxGroup
        ? this._checkboxGroup.disabled ||
            this.disabled ||
            (this.elForm || {}).disabled ||
            this.isLimitDisabled
        : this.disabled || (this.elForm || {}).disabled;
    }
  },
  methods: {
    addToStore() {
      if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
        this.model.push(this.label);
      } else {
        this.model = this.trueLabel || true;
      }
    },
    handleChange(ev) {
      if (this.isLimitExceeded) return;
      let value;
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel;
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel;
      }
      this.$emit("change", value, ev);
      this.$nextTick(() => {
        if (this._checkboxGroup) {
          this.dispatch("ElCheckboxGroup", "change", [
            this._checkboxGroup.value
          ]);
        }
      });
    }
  },

  created() {
    this.checked && this.addToStore();
  }
};
</script>
<style lang="less">
@import (reference) "~assets/less/preset.less";

.dgg-checkbox-button {
  position: relative;
  .dgg-checkbox-button-fixed {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: 0px;
    height: 0px;
    border-top: 14px solid rgba(0, 0, 0, 0);
    border-right: 0px solid rgba(0, 0, 0, 0);
    border-bottom: 14px solid @main;
    border-left: 16px solid rgba(0, 0, 0, 0);
    .fixed-color {
      color: #ffffff;
    }
  }
  &:focus {
    .el-checkbox-button__inner {
      border: 1px #ccc solid;
    }
  }

  &.is-disabled {
    .el-checkbox-button__inner {
      background: #f2f2f2;
      color: @neutral-placeholder;
    }
  }
  .button-fixed-white {
    border-bottom: 14px solid @neutral-border;
  }
}
&.el-checkbox-button:last-child .el-checkbox-button__inner {
  border-radius: 2px;
}
&.el-checkbox-button:first-child .el-checkbox-button__inner {
  border-radius: 2px;
}
</style>