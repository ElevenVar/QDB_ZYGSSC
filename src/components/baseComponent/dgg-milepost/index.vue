<template>
  <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :icon="activity.icon"
      :type="activity.type"
      :color="activity.color"
      :size="activity.size"
      :class="{'hoverClass':isHover }"
      :placement="activity.placement"
      @click.native="milepostClick(activity, index)"
      :timestamp="activity.timestamp">
     
      <template v-if="activity.model==='card'">
        <el-card>
          <h4>{{activity.title}}</h4>
          <p>{{activity.content}}</p>
        </el-card>
      </template>
      <template v-else>{{activity.content}}</template>

    </el-timeline-item>
  </el-timeline>
</template>

<script>
  export default {
    name: 'dgg-milepost',
    props: {
      reverse: Boolean,
      activities: Array,
      isHover:Boolean
    },
    methods:{
      milepostClick(item,index){
        this.$emit('milepostClick', item,index)
      }
    }
  };
</script>
<style lang="less">
 .hoverClass:hover{
  .el-timeline-item__content{
    color: #10bbb8 !important;;
    cursor: pointer;
  }
 }
</style>