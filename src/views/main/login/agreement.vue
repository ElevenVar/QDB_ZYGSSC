<template>
  <div class="announcement-details">
    <h2 class="article-title">{{ contentData.title }}</h2>
    <div
      class="text"
      v-html="contentData.content"
    />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
export default {
  name: "agreement",
  components: {},
  data() {
    return {
      contentData: {},
      noContent: false
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    let res = await this.get_agreement({ typeCode: 'TEXT_QDS_AGREEMENT' });
    if (res.code === 200 && res.data !== {}) {
      console.log(1);
      this.contentData = res.data;
    } else {
      this.noContent = true;
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
    ...mapActions('loginModule', [
      'get_agreement'
    ])
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
.announcement-details {
  width: 80%;
  margin: 0 auto;
  margin-top: 50px;
  min-height: 80%;
  padding: 50px 152px;
  background-color: #fff;
  .article-title {
    font-size: 16px;
    font-weight: bold;
    color: @flsc-main;
    margin-bottom: 10px;
  }
  .auxiliary-info {
    color: #666873;
    font-size: 14px;
    margin-bottom: 30px;
    span + span {
      margin-left: 40px;
    }
  }
}
</style>
