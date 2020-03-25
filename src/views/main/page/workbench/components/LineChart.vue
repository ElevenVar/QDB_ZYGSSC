<template>
  <div
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize.js";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    weekTime:{
      type:Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          show: false, //不显示x轴名称
          data: this.weekTime,//显示时间表
          boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 4,
          right: 4,
          bottom: 0,
          top: 10,
          containLabel: false //区域是否包含坐标轴的刻度标签。
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        yAxis: {
          show: false, //不显示y轴名称
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ["expected", "actual"]
        },
        series: [
          {
            name: "提现",
            smooth: true,
            type: "line",
            itemStyle: {
              normal: {
                color: "#10BBB8",
                lineStyle: {
                  color: "#10BBB8",
                  width: 2
                },
                areaStyle: {
                  color: "rgba(38, 185, 170, 0.1)"
                }
              }
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: "quadraticOut"
          },
          {
            name: "收入",
            itemStyle: {
              normal: {
                color: "#FFAB2C",
                lineStyle: {
                  color: "#FFAB2C",
                  width: 2
                },
                areaStyle: {
                  color: "rgba(255, 247, 235, 0.1)"
                }
              }
            },
            smooth: true,
            type: "line",
            data: expectedData,
            animationDuration: 1000,
            animationEasing: "cubicInOut"
          }
        ]
      });
    }
  }
};
</script>

<style lang='less' >
.account-line-chart {
  padding: 20px 0 0 0;
}
</style>
