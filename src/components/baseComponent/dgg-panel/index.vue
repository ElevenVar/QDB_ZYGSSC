<template slot-scope="scope">
  <div class="dggui-collapse">
    <div class="dggui-colla-item" v-for="item,index in clonecolumns">
      <div class="dggui-colla-title" @click="OpenFn(item)">
        <span>{{item.title}}</span>
        <i class="dggui-icon dggui-icon-down dggui-colla-icon" v-if="item.opened===true"></i>
        <i class="dggui-icon dggui-icon-right dggui-colla-icon" v-else></i>
      </div>
      <div class="dggui-colla-content" :class="item.opened===true?'dggui-show':''">
        <template v-if="item.render">
          <Cell :column="item" :row="item" :index="index" :render="item.render"/>
        </template>
        <template v-else>
          {{item.content}}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import Cell from '../dgg-base-table/expand.js';

  export default {
    name: 'dgg-panel',
    componentsName: '折叠面板',
    props: {
      columns: Array,
      unique: Boolean,
      defaultActive: String,
      title: {
        type: String,
        default: ``
      }
    },
    components: {
      Cell
    },
    data() {
      return {};
    },
    computed: {
      clonecolumns() {
        return this.columns.map(item => {
          if (!item.opened) {
            item.opened = false;
          }
          return item
        }) || []
      }
    },
    mounted() {
      // this.columns.forEach((item) => {
      //   if (!item.opened) {
      //     item.opened = false;
      //   }
      // })
    },
    methods: {
      OpenFn(item) {
        if (this.unique === true) {
          this.columns.forEach(item => {
            item.opened = false;
          })
        }
        item.opened = !item.opened;
        this.$forceUpdate()
      }
    }
  }
</script>

<style lang="less">
  @import (reference) "~assets/less/preset.less";
  .dggui-collapse {
    background-color: #fff;
    padding: 5px 20px;
  }
  .dggui-colla-item {
    font-size: 12px;
  }
  .dggui-colla-title {
    height: 38px;
    line-height: 38px;
    background-color: #fff;
    color: @neutral;
    padding-left: 0;
  }
  .dggui-colla-icon {
    left: auto;
    right: 8px;
    font-size: 12px;
  }
  .dggui-colla-content {
    padding: 0 0 15px 0;
    border: 0;
    line-height: 20px;
    color: @neutral-minor;
  }
</style>
