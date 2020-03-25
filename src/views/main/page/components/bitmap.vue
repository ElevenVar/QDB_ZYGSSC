<template>
  <!-- 公共占位图 -->
  <div class="bitmap">
    <dgg-icon
      icon-class="icon_nodata"
      svgWidth='60px'
      svgHeight='60px'
    />
    <p>暂无数据</p>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
export default {
  name: "bitmap",
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  async mounted() {},
  activated() {
    //
  },
  created() {
    //
  },
  beforeDestroy() {
    //
  },
  methods: {}
};
</script>

<style lang="less" >
@import "~@/assets/less/main.less"; //引入全局less文件
.bitmap {
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  p {
      max-width: 100%;
    font-size: 13px;
    font-weight: 400;
    color: rgba(147, 152, 161, 1);
    line-height: 18px;
    margin-top: 9px;
    .dgg-text-ellip
  }
}
</style>
