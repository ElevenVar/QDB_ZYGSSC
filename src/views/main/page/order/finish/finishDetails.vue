<template>
  <div class="receiveDetails">
    <detailsComponent/>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import detailsComponent from '../components/detailsComponent'
export default {
  name: 'FinishDetails',
  components: {
    detailsComponent
  },
  data() {
    return {
    };
  },
  computed: {},
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
