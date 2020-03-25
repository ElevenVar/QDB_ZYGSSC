`<template>
  <div
    v-loading="loadingState"
    id="app"
    :style="{ overflow: loadingState ? 'hidden' : 'auto' }"
  >
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import * as types from "@/store/types";

/* eslint-disable */
export default {
  name: "App",
  data() {
    return {
      route: this.$route,
      isPc: null,
      num: 0,
      src: null
    };
  },
  created() {},
  mounted() {
    // this.ruoterJump({ name: "loading" });
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
    let path = window.location.href.split("keyCode="); //分割url
    let _loginData = JSON.parse(localStorage.getItem("loginData"));
    let loginKeyCode = sessionStorage.getItem("loginKeyCode");
    if (path.length < 2) {
      if (
        _loginData &&
        Object.keys(_loginData).length &&
        _loginData.tokenId &&
        _loginData.userId
      ) {
        this.setStoreInfoData(_loginData);
        this.ruoterJump({ name: "loading" });
      } else {
        if (loginKeyCode) {
          this.get_user_data_by_key({ keyCode: loginKeyCode }).then(res => {
            if (res.code == 200) {
              if (Object.keys(res.data).length > 0) {
                this.setStoreInfoData(res.data);
                this.ruoterJump({ name: "loading" });
              }
            } else {
              this.$notify({
                message: res.message,
                type: "error",
                customClass: "dgg-tip-msg"
              });
            }
          });
        } else {
          this.$notify({
            message: "请登录",
            type: "warning",
            customClass: "dgg-tip-msg"
          });

          this.logout();
          window.open(`${process.env.loginOutUrlL}`, "_self");
        }
      }
    } else {
      sessionStorage.setItem("loginKeyCode", path[1]);
      this.get_user_data_by_key({ keyCode: path[1] }).then(res => {
        if (res.code == 200) {
          if (Object.keys(res.data).length > 0) {
            this.setStoreInfoData(res.data);
            this.ruoterJump({ name: "loading" });
          }
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      });
    }

    return false;
    //以前法律的
    if (window.location.hash !== "#/agreement") {
      if (_loginData && Object.keys(_loginData).length) {
        this.ruoterJump({ name: "loading" });
      } else {
        this.ruoterJump({ name: "login" });
      }
    }
  },
  computed: {
    ...mapState(["lang", "token", "loadingState"])
  },

  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods: {
    ...mapMutations({
      setLanguage: types.SET_LANGUAGE // 设置语言包
    }),
    ...mapMutations(["setStoreInfoData"]),
    ...mapActions("startPageModule", ["get_user_data_by_key"]),
    setLanguageLayout() {
      // 此功能 保留， 不维护。
      this.num++;
      if (this.num % 2 === 0) {
        this.setLanguage("en"); // 设置语言格式（英语）
      } else {
        this.setLanguage("zh"); // 设置语言格式 (中文)
      }
    },
    goBack() {
      if (this.$route.name) {
        this.ruoterJump({ name: this.$route.name });
      }
    },
    ...mapActions(["ruoterJump", "logout"]),
    routerGo() {}
  }
};
</script>
<style lang="less">
#app {
  height: 100%;
}
</style>

<style></style>
