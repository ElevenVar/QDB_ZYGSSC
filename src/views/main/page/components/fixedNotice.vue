/**
** @author wangjian
** @params top  position-fixed top default: 526   //526   592   658  间隔66
<!--** @params left position-fixed left default: 1541  //1560-->
** @params right position-fixed right default: 160
** @params type icon type
**/
<template>
  <div style="position: relative">
    <div :style="{top:top + 'px',right:right + 'px',backgroundImage:'url('+backgroundImage+')'}" class="fixed-notice">
      <div v-if="type == 'appDownload'" class="qrcode">
        <img src="src/assets/images/fixedNotice/qrcode.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import backgroundImage from '@/assets/images/fixedNotice/icon_appdownload.png'
export default {
  name: "fixedNotice",
  components: {},
  props: {
    top: {
      type: Number,
      default: 526
    },
    // left: {
    //   type: Number,
    //   default: 1541
    // },
    right: {
      type: Number,
      default: 160
    },
    type: {
      type: String,
      default: 'appDownload'
    }
  },
  data() {
    return {
      items: {
        appDownload: 'icon_appdownload',
        generate: 'icon_generate',
        over: 'icon_over',
        phone: 'icon_phone',
        revoke: 'icon_revoke',
        withdraw: 'icon_icon_withdraw'
      },
      backgroundImage: backgroundImage
    };
  },
  mounted() {
    this.backgroundImage = 'src/assets/images/fixedNotice/' + this.items[this.type] + '.png';
  }
}
</script>

<style scoped lang="less">
  .fixed-notice{
    display: none;
    position: fixed;
    cursor: pointer;
    width: 88px;
    height: 88px;
    border-radius: 14px;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
    &:hover{
      .qrcode{
        display: block;
      }
    }
  }
  .qrcode{
    padding: 16px;
    height: 166px;
    width: 166px;
    background:rgba(255,255,255,1);
    box-shadow:0px 7px 19px 0px rgba(218,221,230,1);
    position: absolute;
    left: -162px;
    top: -104px;
    display: none;
    border-radius: 14px;
    image{
      width: 130px;
      height: 130px;
    }
  }
</style>