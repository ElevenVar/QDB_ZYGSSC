<template>
  <div class="transactionBill">
    <billComponent/>

  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import billComponent from '../components/billComponent'

export default {
  name: 'FinishDetailsBill',
  components: {
    billComponent // 右下角订单图标状态
  },
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {},
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
.transactionBill {
  position: relative;
}
</style>
