<template>
  <div class="settled">
    <settled></settled>
  </div>
</template>

<script>
import settled from "./settled";
export default {
  components: {
    settled
  },
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
<style>
.breadcrumb-style {
  margin: 0 !important;
  height: 45px;
  background: #ffffff;
  padding-left: 30px;
  line-height: 45px;
  border-bottom: 1px solid #e3e4e6;
  display: flex;
  align-items: center;
}
</style>
// 添加局部属性scoped
<style lang="less" scoped>
.settled {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: absolute;
}
</style>
