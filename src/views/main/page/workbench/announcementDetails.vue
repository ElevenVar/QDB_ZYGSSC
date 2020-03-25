<template>
  <div class="announcement-details">
    <h2 class="article-title">{{annDetails.noticeProfile}}</h2>
    <div class="auxiliary-info">
      <span v-if="annDetails.isOnlineTime && annDetails.isOnlineTime.length">发布时间：{{ annDetails.isOnlineTime}}</span>
      <span v-if="annDetails.noticeSource && annDetails.noticeSource.length">来源：{{ annDetails.noticeSource }}</span>
    </div>
    <div
      class="text"
      v-html="annDetails.noticeContent"
    />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
import articleImg from "./article.png";
export default {
  name: "AnnouncementDetails",
  components: {},
  data() {
    return {
      annDetails: {}, //公告详情数据
      articleImgPage: articleImg
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    if (this.$route.params.id) {
      this.getInfo(this.$route.params.id);
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
    ...mapActions("announcementDetailsModule", [
      "query_inventory_id" //平台公告详情接口
    ]),
    getInfo() {
      //请求平台公告
      this.query_inventory_id({
        id: this.$route.params.id
      }).then(res => {
        console.log(res, "平台公告详情-----");
        if (res.code === 200) {
          this.$nextTick(() => {
            this.annDetails = { ...res.data };
          });
        }
      });
      return;
      this.annDetails = {
        title: "",
        time: "",
        from: "顶律联盟",
        htmlText: '<img style="width:100%" src="' + this.articleImgPage + '">'
      };
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
.announcement-details {
  width: 100%;
  min-height: 100%;
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
