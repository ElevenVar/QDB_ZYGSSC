<template>
    <div>
      <ul class="ztree" :id="id" v-bind="$attrs"></ul>
    </div>
</template>

<script>
    export default {
        name: "dgg-tree",
        props: {
          id: String,
          data:[Object,Array],
          async:[Object,Array],
          zNodes:[Object,Array],
          callback:[Object,Array],
          check:[Object,Array],
          edit:[Object,Array],
          // view:[Object,Array]
          view:{
            default(){
              return {
                showIcon: false,
                showLine: false
              }
            },
            type:[Object,Array]
          }
        },
        mounted() {
          console.log(this.view)
          var zNodes =this.zNodes;
          var setting = {};
          setting.data = this.data;
          setting.async = this.async;
          setting.callback = this.callback;
          setting.view = this.view;
          setting.check = this.check;
          setting.edit = this.edit;
          (zNodes!=undefined)&&($.fn.zTree.init($('#'+this.id), setting, zNodes));
          (zNodes==undefined)&&($.fn.zTree.init($('#'+this.id), setting));
        }
    }
</script>

<style lang="less">
  @import (reference) "~assets/less/preset.less";
  .ztree {
    max-height: 240px;
    overflow: auto;
  li {
    font-size: 12px;
  a {
    height: auto;
    width:calc(100% - 18px);
    width:-webkit-calc(100% - 18px);
    width:-moz-calc(100% - 18px);
    word-break: break-all;
    white-space: normal;
    padding: 4px 3px;
    box-sizing: border-box;
    color: @neutral-minor;
  &.curSelectedNode {
     background-color: @main-bg;
     border: 0;
     opacity: 1;
     margin-bottom: 2px;
     padding: 4px 3px;
    height: auto;
   }
  }
  span {
    line-height: 20px;
  }
  span.button {
    margin-top: 4px;
    background-image: url("../../../assets/images/zTreeStandard.png");
  &.noline_docu {
     background: none;
   }
  &.chk {
     overflow: hidden;
     width: 14px;
     height: 14px;
     border-radius: 3px;
     margin-top: 4px;
  &+a {
     width:calc(100% - 35px);
     width:-webkit-calc(100% - 35px);
     width:-moz-calc(100% - 35px);
   }
  }
  }
  }

  }
</style>
