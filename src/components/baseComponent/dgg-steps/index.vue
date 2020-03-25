<template>
  <div
    class="el-steps dgg-steps"
    :class="[
       !simple && 'el-steps--' + direction,
       simple && 'el-steps--simple'
     ]">
      <slot></slot>
  </div>
</template>

<script>
import Migrating from '@/componentsEl/src/mixins/migrating';

export default {
  name: 'dgg-steps',
  componentsName: "步骤条",
  mixins: [Migrating],
  props: {
    space: [Number, String],
    active: Number,
    direction: {
      type: String,
      default: 'horizontal'
    },
    alignCenter: Boolean,
    simple: Boolean,
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    },
    mountedFunc: {
      type: Function,
      default: function () {
        
      }
    }
  },

  data() {
    return {
      steps: [],
      stepOffset: 0
    };
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'center': 'center is removed.'
        }
      };
    }
  },
  mounted(){
    this.mountedFunc();

  },

  watch: {
    active(newVal, oldVal) {
      this.$emit('change', newVal, oldVal);
    },

    steps(steps) {
      steps.forEach((child, index) => {
        child.index = index;
      });
    }
  }
};
</script>
<style lang="less">
  @import (reference) "~assets/less/preset.less";
  .el-step__head {
    &.is-wait{
      color: @neutral-help;
      border-color: @neutral-border;
    }
    &.is-success {
      color: @main;
      border-color: @main;
    }
    &.is-process {
      color: #fff;
      border-color: @main;
      .el-step__icon {
        background-color: @main;
      }
    }
  }
  .el-step {
    &.is-horizontal {
      .el-step__line {
        height: 1px;
        top: 14px;
        left: 32px;
        right: 8px;
        background-color: @neutral-border;
        overflow: hidden;
      }
      .el-step__head {
        &.is-success {
          .el-step__line {
            background-color: @main;
          }
        }
      }
      &.is-center {
        .el-step__line {
          left: 50%;
          right: -50%;
        }
      }
    }
  }
  .el-step__icon {
    width: 30px;
    height: 30px;
    &.is-text {
      border-width: 1px;
    }
  }
  .el-step__icon-inner {
    font-weight: 400;
    &.el-icon-check {
      font-size: 16px;
    }
  }
  .el-step__title {
    font-size: 14px;
    &.is-success {
      color: @neutral-minor;
    }
    &.is-wait {
      color: @neutral-help;
    }
    &.is-process {
      color: @neutral;
      font-weight: bold;
    }
  }
  .el-step__description {
    &.is-success {
      color: @neutral-help;
    }
    &.is-process {
      color: @neutral-minor;
    }
  }
</style>
