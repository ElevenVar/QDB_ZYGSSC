<template>
  <transition name="el-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="el-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="el-loading-spinner">
        <div  class="el-loding-bg"></div>
        <!-- <svg v-if="!spinner" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg> -->
            <i class="el-icon-loading" style="font-size:26px;"></i>
        <!-- <span v-else style="width:700px;height:394px;background-color:#333;position: absolute;left:0;right:0;top:0;bottom:0;margin:auto" id="bodymovin"></span> -->
        <!-- <i v-else :class="spinner"></i>  -->
        <!-- <span class="el-loading-gif"></span> -->
        <p v-if="text" class="el-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>


<script>
  export default {
    data() {
      return {
        text: null,
        spinner: null,
        background: null,
        fullscreen: true,
        visible: false,
        customClass: ''
      };
    },

    methods: {
      handleAfterLeave() {
        this.$emit('after-leave');
      },
      setText(text) {
        this.text = text;
      }
    },
    mounted(){
        // lottie.loadAnimation({
        //   container: document.getElementById('bodymovin'), // the dom element that will contain the animation
        //   renderer: 'svg',
        //   loop: true,
        //   autoplay: true,
        //   path: 'loading.json' // the path to the animation json
        // });
    }
  };
</script>
<style lang="less"> 
 .el-loading-gif{
    display: inline-block;
    width: 35px;
    height:35px;
    background: url("~assets/images/loading.gif") no-repeat;
    background-size:100% 100%;
 }
</style>
