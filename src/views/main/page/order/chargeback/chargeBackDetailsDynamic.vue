<template>
  <div class="transactionDynamic">
    <dynamicComponent/>

  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import dynamicComponent from '../components/dynamicComponent'

export default {
  name: 'ChargeBackDetailsDynamic',
  components: {
    dynamicComponent
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
    console.log(this.transactionItem);
  },
  beforeDestroy() {
    //
  },
  methods: {
  }
};
</script>

<style lang="less">
.transactionDynamic {
  width: 100%;
  height: 100%;
}
</style>
