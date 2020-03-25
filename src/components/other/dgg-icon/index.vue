<template>
  <svg
    :class="svgClass"
    aria-hidden="true"
    :svgWidth='svgWidth'
    :svgHeight='svgHeight'
    :style="{'width':svgWidth,'height':svgHeight}"
    v-on="$listeners"
  >
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
  export default {
    name: 'dgg-icon',
    componentsName: '图标',
    props: {
      iconClass: {
        type: String,
        required: true
      },
      className: {
        type: String,
        default: ''
      },
      svgWidth: {//??svg??
        type: String,
        default: '1em'
      },
       svgHeight: {//??svg??
        type: String,
        default: '1em'
      },
    },
    computed: {
      iconName() {
        return `#icon-${this.iconClass}`;
      },
      svgClass() {
        if (this.className) {
          return 'dgg-icon ' + this.className;
        } else {
          return 'dgg-icon';
        }
      }
    }
  };
</script>

<style scoped>
  .dgg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .dgg-icon.x2 {
    width: 2em;
    height: 2em;
  }
</style>
