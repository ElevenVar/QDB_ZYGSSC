/**
** @author 肖婷婷
**/
<template>
  <div class="placeholder-box">
    <taskBitMap
      svgClass="icon_settled_in"
      svg-width="100px"
      svg-height="100px"
      synopsis="您还未入驻店铺，联系客服加入店铺或点击入驻自行开店"
    >
      <div
        slot="button"
        class="btn-warp"
      >
        <dgg-popover
          placement="bottom"
          width="200"
          trigger="hover"
          content="客服电话：400962540"
        >
          <dgg-button
            plain
            class="brabBill-button"
            slot="reference"
          >联系客服</dgg-button>
        </dgg-popover>
        <dgg-button
          plain
          class="brabBill-button"
          @click="clickBack"
        >入驻</dgg-button>
      </div>
    </taskBitMap>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import taskBitMap from "@/views/main/page/components/taskBitMap.vue";
export default {
  name: "storeAttestation",
  data: function() {
    return {};
  },
  components: {
    taskBitMap
  },
  computed: {},
  watch: {},
  methods: {
    ...mapActions(["ruoterJump"]),
    clickBack() {
      this.ruoterJump({ name: "settled" });
    }
  }
};
</script>

<style scoped lang="less">
.btn-warp {
  text-align: center;
  padding-top: 15px;
}
.placeholder-box {
  height: calc(100% - 120px);
  background-color: #fff;
}
</style>
