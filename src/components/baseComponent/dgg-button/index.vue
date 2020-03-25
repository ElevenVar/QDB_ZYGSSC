
<template>
     <el-button
      class="dgg-button"
      v-bind="$attrs"
      :type="type"
      :size="size"
      :icon="icon"
      :nativeType="nativeType"
      :loading="loading"
      :plain="plain"
      :autofocus="autofocus"
      :round="round"
      :dggIcon="dggIcon"
      :iconClass="iconClass"
      :circle="circle"
      @click="click"
     >
          <span v-if="$slots.default"><slot></slot></span>
      </el-button>
</template>
<script>
export default {
  name: "dgg-button",
  componentsName: "按钮",
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
    dggIcon:{
     type: String,
     default: '',
    },
    iconClass:{
     type: String,
     default: '',
    },
  },
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {

  },
  mounted() {
  },
  methods: {
    click(event){
      this.$emit('click', event)
    }
  }
};
</script>
<style lang="less">
.dgg-button {
//
}
</style>
