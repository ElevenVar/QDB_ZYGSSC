<template>
  <div class="content">
    <inviteNotice />
  </div>
</template>

<script>
import inviteNotice from "@/views/main/page/components/inviteNotice"
export default {
  name: "index",
  components: {
    inviteNotice
  },
  data: function() {
    return {
      type: 'success'
    }
  },
  mounted() {
    const type = this.$route.params.type;
    if (type !== undefined) {
      this.type = type;
    }
  }
}
</script>

<style scoped lang="less">
  .content{
    display:flex;
    align-items:center;/*垂直居中*/
    justify-content: center;/*水平居中*/
    min-height: 720px;
    background: #ffffff;
  }
</style>