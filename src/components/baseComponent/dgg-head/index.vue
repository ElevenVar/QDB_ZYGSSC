
<template>
  <div class="dgg-head">
    <span class="dgg-head-title fl font16 marginT10 overflowEllipsis">
      <slot name="dgg-headLeftTitle" />
      <slot name="dgg-headTabs" />
    </span>
    <div class="fr marginR20 paddingB10 paddingT10">
      <slot name="dgg-headRightContent" />
    </div>
    <div class="cleatBoth" />
  </div>
</template>
<script>
export default {
  name: "DggHead",
  componentsName: "头部文字区域"
};
</script>
<style lang="less">
.dgg-head {
  display: flex;
  height: 50px;
  overflow: hidden;
  font-size: 0;
  border-bottom: 1px solid #dcdfe6;
  // background:rgb(242, 245, 250);
  .dgg-head-title {
    color: #303133;
    height: 30px;
    line-height: 30px;
    letter-spacing: 0.04px;
    flex: 1;
    display: flex;
    /*vertical-align: middle;*/
    // &:before {
    //   content: "";
    //   margin-top: 6px;
    //   display: inline-block;
    //   margin-right: 6px;
    //   margin-left: 20px;
    //   width: 4px;
    //   height: 18px;
    //   vertical-align: middle;
    //   background-color: rgb(83, 168, 255);
    // }
  }
}
</style>
