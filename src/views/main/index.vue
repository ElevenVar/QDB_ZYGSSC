<template>
  <div
    v-loading="loading"
    class="home"
    element-loading-text="拼命加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="#ffffff"
  />

  <!-- <div id="regionZTree" class="ztree"/> -->
</template>

<script>
// 加 载 页
// eslint-disable-next-line no-unused-vars
import zTree from "ztree";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      loading: true
    };
  },
  computed: {
    ...mapState(["token"])
  },
  watch: {},
  async mounted() {
    await this.initRouters(); // 初始化路由
    const _loginData = JSON.parse(localStorage.getItem("loginData"));
    const _activeRoute = JSON.parse(localStorage.getItem("activeRoute"));
    const _storeInfoData =
      localStorage.getItem("storeInfoData") &&
      JSON.parse(localStorage.getItem("storeInfoData"));
    const _transactionItem = JSON.parse(
      localStorage.getItem("transactionItem")
    );
    if (
      _loginData &&
      Object.keys(_loginData).length &&
      _activeRoute &&
      Object.keys(_activeRoute).length
    ) {
      this.setTransactionItem(_transactionItem);
      this.ruoterJump({ name: "startPage" });
    } else {
      await this.initreq(); // 初始化请求
    }
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
    zTreeBeforeExpand() {
      //
    },
    ...mapActions(["ruoterJump", "initRouters"]),
    ...mapActions("configModule", ["initConfig"]),
    ...mapMutations([
      "setTransactionItem" // 缓存办理中的数据
    ]),

    async initreq() {
      // 做一些异步操作
      this.ruoterJump({ name: "startPage" });
    }
  }
};
</script>

<style lang="less">
.home {
  width: 100%;
  height: 100%;
}
</style>
