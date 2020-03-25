<template>
  <el-card
    class="dgg-card"
    v-bind="$attrs"
    :header="header"
    :bodyStyle="bodyStyle"
    :shadow="shadow"
  >
        <span v-if="$slots.header" slot="header">
          <slot name="header"></slot>
        </span>
    <slot></slot>
  </el-card>
</template>
<script>
  export default {
    name: 'dgg-card',
    componentsName: '卡片',
    props: {
      header: {},
      bodyStyle: {},
      shadow: {
        type: String
      }
    },
    data() {
      return {};
    },
    computed: {},
    watch: {},
    mounted() {
    },
    methods: {}
  };
</script>
<style lang="less">
  .dgg-card {
    //
  }
</style>
