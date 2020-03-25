
<template>
  <!-- 任务版块 -->
  <div class="transactionTask common-right-svg-icon">
    <taskComponent/>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import taskComponent from '../components/taskComponent'

export default {
  name: 'FinishDetailsTask',
  components: {
    taskComponent
  },
  data() {
    return {
    };
  },
  computed: {

  },
  created() {
  },
  async mounted() {},

  methods: {

  }
};
</script>
<style lang="less">
@import "~@/assets/less/main.less"; //引入全局less文件
// 上传附件

</style>

