<template>
  <div class="dgg-modal">
    <el-dialog
      :class="modalClass"
      :visible.sync="openModal"
      :title="title"
      :width="width"
      :loading="loading"
      :close-on-click-modal="closeOnClickModal"
      :modal="hasmodal"
      :appendToBody="appendToBody"
      center
      @close="modalCloseQuit"
    >
      <div :style="{'min-height': !hasFooter? '125px' : '63px'}">
        <slot />
      </div>
      <span
        v-if="hasFooter"
        slot="footer"
        class="dialog-footer"
      >

        <span v-if="hasFooter">
          <el-button
            type="primary"
            class="fr confirm-btn"
            :loading="loading"
            @click="handleClick"
          >{{affirmText}}</el-button>
          <el-button
            v-if="hasQuit"
            class="fr cancel-btn marginR12 dgg-button-nocolor"
            @click="modalQuit"
          >{{quitText}}</el-button>
        </span>

      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import lodash from "lodash";

export default {
  name: "dgg-modal",
  componentsName: "模态框",
  components: {},
  props: {
    modal: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasmodal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "提示"
    },
    width: {
      type: String,
      default: "360px"
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    hasFooter: {
      type: Boolean,
      default: true
    },
    useBefore: {
      type: Boolean,
      default: false
    },
    hasQuit: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    modalClass: {
      type: String,
      default: ""
    },
    affirmText: {
      type: String,
      default() {
        return "确 定";
      }
    },
    quitText: {
      type: String,
      default() {
        return "取 消";
      }
    }
  },
  data() {
    return {
      openModal: false
    };
  },
  computed: {},
  watch: {
    modal(val) {
      this.openModal = lodash.cloneDeep(val);
    }
  },
  mounted() {
    //
    // this.initRegister() // RXJS 注册事件
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
    modalQuit() {
      this.$emit("modalQuit");
    },
    handleClick() {
      this.$emit("modalAffirm");
    },
    modalCloseQuit() {
      this.$emit("closeQuit");
      this.modalQuit();
    }
  }
};
</script>

<style lang="less">
.dgg-modal {
  .marginR12 {
    margin-right: 12px;
  }
  .el-dialog__title {
    float: left;
  }
  .el-dialog__footer {
    height: 62px;
    padding: 10px 25px 25px 25px;
  }
  .el-dialog__body {
    padding-bottom: 0px;
  }
}
</style>
