/**
** @author wangjian
**/
<template>
  <div class="login-content" v-if="reload !== 'true'">
    <el-carousel class="img-tab" :interval="3000" indicator-position="none">
      <el-carousel-item v-for="(item, inx) in imgs" :key="inx">
        <img :src="item.imgUrl" alt="">
      </el-carousel-item>
    </el-carousel>
    <loginComp />
  </div>
</template>

<script>
import loginComp from '@/views/main/page/components/loginComp.vue'
import registerComp from '@/views/main/page/components/registerComp.vue'
import Notification from '@/componentsEl/notification/index.js'
import { mapActions } from "vuex";
export default {
  name: "login",
  components: {
    loginComp,
    registerComp
  },
  data: function() {
    return {
      imgs: []
    }
  },
  computed: {
    reload() {
      return sessionStorage.getItem('reload');
    }
  },
  created() {

  },
  async mounted() {
    if (this.reload === 'true') {
      sessionStorage.setItem('reload', 'false');
      location.reload();
    }
    let notice = this.$route.params.notice;
    if (notice) {
      Notification.error(notice)
    }
    let img = await this.get_adv();
    if (img.code === 200) {
      this.imgs = img.data;
    }
  },
  methods: {
    ...mapActions('loginModule', ['get_adv'])
  }
}
</script>

<style scoped lang="less">
.login-content{
  width: 100%;
  height: 100%;
  .img-tab{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    /deep/.el-carousel__container{
      height: 100%;
      .el-carousel__arrow{
        display: none !important;
      }
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>