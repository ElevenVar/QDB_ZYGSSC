<template>
  <div class="transaction-document">
    <documentComponent/>
  </div>
</template>

<script>
// 加载页

// import pdf from 'vue-pdf';
import documentComponent from '../components/documentComponent'
export default {
  name: 'TransactionDocument',
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
.transaction-document {
  width: 100%;
  height: 100%;
}
</style>
