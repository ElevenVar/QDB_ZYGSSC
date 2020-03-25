<template>
  <div class="dgg-player">
    <div :id="elem" />
  </div>
</template>

<script>
import DggPlayer from "@/vendor/player";
export default {
  name: "DggPlayer",
  componentsName: "视频播放器",
  props: {
    elem: {
      type: String,
      default: "dggplayer"
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    forward_interval: {
      type: Number,
      default: 60000
    },
    backward_interval: {
      type: Number,
      default: 30000
    },
    disalbed: {
      type: Boolean,
      default: false
    },
    audio: {
      type: Object,
      default: function() {
        return {};
      }
    },
    pause_cb: {
      type: Function,
      default: function() {
        //
      }
    },
    play_cb: {
      type: Function,
      default: function() {
        //
      }
    },
    backward_cb: {
      type: Function,
      default: function() {
        //
      }
    },
    forward_cb: {
      type: Function,
      default: function() {
        //
      }
    },
    dragend_cb: {
      type: Function,
      default: function() {
        //
      }
    }
  },
  data() {
    return {
      player: null
    };
  },
  watch: {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.player.destroy();
  },
  methods: {
    init() {
      this.player = new DggPlayer({
        container: document.getElementById(this.elem),
        autoplay: this.autoplay,
        //快进，快退的间隔
        forward_interval: this.forward_interval,
        backward_interval: this.backward_interval,
        //禁止快进和后退
        disalbed: this.disalbed,
        audio: this.audio,
        pause_cb: this.pause_cb,
        play_cb: this.play_cb,
        forward_cb: this.forward_cb,
        backward_cb: this.backward_cb,
        dragend_cb: this.dragend_cb
      });
    }
    // switchAudio(obj){
    //   this.player.switchAudio(obj);
    // },
    // setAudio(obj){
    //   this.player.setAudio(obj);
    // }
  }
};
</script>
