<template>
  <div class="receiveDetails">
    <detailsComponent/>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import billComponent from '../components/billComponent'
export default {
  name: 'ReceiveDetails',
  components: {
    billComponent
  },
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {},
  async mounted() {

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

  }
};
</script>

<style lang="less">
.receiveDetails {
  width: 100%;
  height: 100%;
}
</style>
