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
  name: 'ChargeBackDetailsBill',
  components: {
    billComponent
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

  width: 100%;
  height: 100%;

}
</style>
