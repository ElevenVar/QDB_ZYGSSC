<template>
  <div class="transaction-document">
    <documentComponent/>

  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import documentComponent from '../components/documentComponent'

// import pdf from 'vue-pdf';
export default {
  name: 'ChargeBackDetailsDocument',
  components: {
    documentComponent // 右下角订单图标状态
    // pdf
  },
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {

  },
  async mounted() {
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

  }
};
</script>

<style lang="less">
@import "~@/assets/less/main.less"; //引入全局less文件
.transaction-document {
  width: 100%;
  height: 100%;
}
</style>
