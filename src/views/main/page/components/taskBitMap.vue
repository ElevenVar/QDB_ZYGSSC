<template>
  <!-- 公共占位图 -->
  <div class="taskBitMap">
    <dgg-icon
      :icon-class="svgClass"
      :svg-width="svgWidth"
      :svg-height="svgHeight"
    />
    <slot>
      <h2
        v-if="tipTitle"
        class="tip-title"
      >{{ tipTitle }}</h2>
      <p>{{ synopsis }}</p>
    </slot>
    <slot name="button">
      <dgg-button
        v-if="showBtn"
        plain
        class="brabBill-button"
        @click="clickBack"
        :class="{'disabled-Btn':!sendClassName}"
        :disabled="!sendClassName"       
      >
    {{ btnName }}
      </dgg-button>
    </slot>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
export default {
  name: "TaskBitMap",
  components: {},
  props: {
    svgClass: {
      type: String,
      default: "icon_notask"
    },
    svgWidth: {
      type: String,
      default: "70px"
    },
    tipTitle: {
      type: String,
      default: ""
    },
    svgHeight: {
      type: String,
      default: "48px"
    },
    showBtn: {
      // 是否显示点击按钮
      type: Boolean,
      default: false
    },
    btnName: {
      // 点击按钮名称
      type: String,
      default: "指定任务模板"
    },
    synopsis: {
      type: String,
      default: "还没有指定任务模板哟，指定后进行任务办理，精准跟进"
    },
    sendClassName: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  async mounted() {},
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
    clickBack() {
      this.$emit("click-back");
    }
  }
};
</script>

<style lang="less" >
@import "~@/assets/less/main.less"; //引入全局less文件
.taskBitMap {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  p {
    max-width: 100%;
    font-size: 14px;
    font-weight: 400;
    color: #666873;
    line-height: 20px;
    margin-top: 9px;
    .dgg-text-ellip;
  }
  .brabBill-button {
    margin-top: 14px;
  }
  .tip-title {
    font-size: 16px;
    font-weight: bold;
    color: #19233c;
  }
}

.el-button.is-disabled.is-plain,.el-button.is-disabled.is-plain:focus, .el-button.is-disabled.is-plain:hover{
  &.disabled-Btn{
    border:1px solid #10bbb8;
        color: #10bbb8;
  }
}
</style>
