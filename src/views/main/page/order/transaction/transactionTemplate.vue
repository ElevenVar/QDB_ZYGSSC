<template>
  <div class="transactionTemplate">
    <templateComponent/>
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex';
import templateComponent from '../components/templateComponent'
export default {
  name: 'TransactionTemplate',
  components: {
    templateComponent
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
.transactionTemplate {
  width: 100%;
  height: 100%;
}
</style>
