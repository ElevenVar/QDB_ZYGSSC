<template>
  <div class="announcement">
    <div
      v-show="$route.name === 'announcement'"
      :class="{ 'no-anmouncement-warp': announcementList.length < 1 }"
    >
      <div
        :style="{ backgroundImage: 'url(' + backImgPage + ')' }"
        class="top-back"
      >
        <h1>平台公告</h1>
        <p>PLATFORM BULLETIN</p>
      </div>
      <div
        class="announcement-list"
        :class="{ 'no-anmouncement-data': announcementList.length < 1 }"
      >
        <el-timeline :reverse="false" v-if="announcementList.length > 0">
          <el-timeline-item
            v-for="item in announcementList"
            :key="item.id"
            :hide-timestamp="true"
            :timestamp="item.updateTime"
            color="#D8D9DB"
            placement="top"
          >
            <div class="detail-pannel">
              <h2 class="cursor-pointer title-link" @click="jumpDetail(item)">
                {{ item.noticeProfile }}
              </h2>
              <p class="detail-desc">{{ item.noticeContent }}</p>
              <div class="time-box">
                <h2>{{ item.isOnlineTime.split(" ")[0] }}</h2>
                <p>{{ item.isOnlineTime.split(" ")[1] }}</p>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
        <taskBitMap :show-btn="false" synopsis="暂无数据　" v-else />
      </div>
    </div>
    <!--    <fixedNotice />-->
    <router-view />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
import backImg from "@/assets/images/workbench/image_platform.png";
import taskBitMap from "@/views/main/page/components/taskBitMap.vue";
// import fixedNotice from '@/views/main/page/components/fixedNotice.vue'
export default {
  name: "Announcement",
  components: {
    // fixedNotice
    taskBitMap // 占位图
  },
  data() {
    return {
      backImgPage: backImg,
      announcementList: []
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    this.getList();
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
    ...mapActions(["ruoterJump"]),
    ...mapActions("workbenchModule", [
      "query_inventory" //平台公告接口列表
    ]),
    getList() {
      //请求平台公告
      this.query_inventory({
        limit: 100,
        start: 0,
        sys: "QDB_SYSTEM_BUSINESS_ZYSC"
      }).then(res => {
        if (res.code === 200) {
          this.announcementList = res.data;
        } else {
          this.announcementList = [];
        }
      });
    },
    jumpDetail(item) {
      this.ruoterJump({
        name: "announcementDetails",
        params: {
          id: item.id
        }
      });
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
.announcement {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 6px;
  position: relative;
  .no-anmouncement-warp {
    height: 100%;
  }
  .top-back {
    height: 130px;
    padding: 30px 100px;
    box-sizing: border-box;
    background-position: center;
    background-repeat: no-repeat;
    color: #ffffff;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    h1 {
      font-size: 36px;
      letter-spacing: 2px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 50px;
    }
    p {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
    }
  }
  .announcement-list {
    min-height: calc(100% - 130px);
    padding: 54px 132px 70px 216px;
    background-color: #fff;
    position: relative;
    &.no-anmouncement-data {
      height: calc(100% - 130px);
      padding-left: 132px;
    }
    .el-timeline-item {
      padding-bottom: 30px;
    }
    .title-link {
      &:hover {
        color: @main;
      }
    }
    .el-timeline-item__content {
      position: relative;
      h2 {
        color: @flsc-main;
        font-size: 16px;
        font-weight: bold;
      }
      .detail-desc {
        margin-top: 14px;
        font-size: 14px;
        color: #666873;
        line-height: 20px;
        max-height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .time-box {
        position: absolute;
        top: 0;
        right: 100%;
        width: 100px;
        margin-right: 48px;
        text-align: right;
        p {
          margin-top: 6px;
          color: #666873;
          font-size: 12px;
        }
      }
    }
    .el-timeline-item__node--normal {
      left: 0;
      top: 4px;
      width: 8px;
      height: 8px;
    }
    .el-timeline-item__tail {
      top: 4px;
      border-left: 1px solid #edeff0;
    }
  }
}
</style>
