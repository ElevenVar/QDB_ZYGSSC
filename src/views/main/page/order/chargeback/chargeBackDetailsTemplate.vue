<template>
  <div class="finishDetailsTemplate">
    <templateComponent/>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import templateComponent from '../components/templateComponent'
export default {
  name: 'FinishDetailsTemplate',
  components: {
    templateComponent
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
  methods: {}
};
</script>

<style lang="less">
.finishDetailsTemplate {
  width: 100%;
  height: 100%;
}
</style>
