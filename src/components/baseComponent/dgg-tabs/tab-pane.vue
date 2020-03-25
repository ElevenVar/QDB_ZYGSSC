<template>
  <div
    class="el-tab-pane"
    v-if="(!lazy || loaded) || active"
    v-show="active"
    role="tabpanel"
    :aria-hidden="!active"
    :id="`pane-${paneName}`"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "dgg-tab-pane",

  componentName: "ElTabPane",

  props: {
    label: String,
    labelContent: Function,
    name: String,
    closable: Boolean,
    disabled: Boolean,
    lazy: Boolean
  },

  data() {
    return {
      index: null,
      loaded: false
    };
  },

  computed: {
    isClosable() {
      return this.closable || this.$parent.closable;
    },
    active() {
      const active = this.$parent.currentName === (this.name || this.index);
      if (active) {
        this.loaded = true;
      }
      return active;
    },
    paneName() {
      return this.name || this.index;
    }
  },

  updated() {
    this.$parent.$emit("tab-nav-update");
  }
};
</script>
<style lang="less">
@import (reference) "~assets/less/preset.less";
.startPage {
  .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 0 15px;
  }
  .el-tabs__nav-wrap {
    overflow: hidden;
    margin-bottom: -1px;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: #e5e5e5;
      z-index: 1;
    }
  }
  .el-tabs__nav-scroll {
    overflow: hidden;
    &:after {
      content: "";
      display: block;
      height: 0;
      clear: both;
    }
  }
  .el-tabs__nav {
    white-space: nowrap;
    position: relative;
    transition: transform 0.3s;
    float: left;
    z-index: 2;
  }
  .el-tabs__item {
    padding: 0 20px;
    height: 36px;
    box-sizing: border-box;
    line-height: 36px;
    display: inline-block;
    list-style: none;
    font-size: 12px;
    font-weight: 500;
    color: #303133;
    position: relative;
  }
  .el-tabs__content {
    overflow: hidden;
    position: relative;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border-radius: 2px 2px 0 0;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background-color: #fff;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    z-index: 3;
    background-color: #fff;
    top: 1px;
    &:hover {
      color: @main;
    }
  }
}
</style>
