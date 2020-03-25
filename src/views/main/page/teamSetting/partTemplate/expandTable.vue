<template>
  <div class="expand-table">
    <el-row v-if="!data.length">
      <p class="none-data">暂无数据</p>
    </el-row>
    <ul v-else class="expand-staff-data">
      <li>
        <label for="">订单</label>
        <div>
          <p>
            订单量:<span>{{ data[0].dealingNum + data[0].finishNum }}</span>
          </p>
          <p>
            办理中:<span>{{ data[0].dealingNum }}</span>
          </p>
          <p>
            已完成:<span>{{ data[0].finishNum }}</span>
          </p>
          <p>
            完成率：<span class="no-color">
              {{ Number(data[0].completion).toFixed(0) }}%</span
            >
          </p>
          <!--          {{ (data[0].dealingNum + data[0].finishNum) ? (data[0].finishNum / (data[0].dealingNum + data[0].finishNum) * 100).toFixed(2) + '%' : '0%' }}-->
        </div>
      </li>
      <li>
        <label for="">任务</label>
        <div>
          <p>
            办理中:<span>{{ data[0].countTask }}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ExpandTable",
  components: {},
  props: {
    data: {
      type: Array,
      statusVal: [],
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
    //
  },
  async mounted() {
    //
  },
  destroyed() {
    //
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件

.expand-table {
  background-color: #f5f7fa;
}
.none-data {
  padding: 16px 0;
  color: #8c8c8c;
  text-align: center;
}
.expand-staff-data {
  box-sizing: border-box;
  padding: 0 50px;
  font-size: 13px;
  color: #9398a1;
  li {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    line-height: 16px;
    .dgg-text-ellip;
    &:first-child {
      margin-bottom: 20px;
    }
    label {
      display: inline-block;
      width: 56px;
      text-align: left;
      .dgg-text-ellip;
    }
    > div {
      display: flex;
      align-items: center;
      line-height: 20px;
      overflow: hidden;
      p {
        width: 105px;
        .dgg-text-ellip;
        span {
          color: #10bbb8;
          flex: 1;
          margin-left: 4px;
          &.no-color {
            color: #9398a1;
          }
        }
      }
    }
  }
}
</style>
