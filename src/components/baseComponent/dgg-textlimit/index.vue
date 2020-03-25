<template>
  <div class="dgg-textarea-model">
    <textarea
      :maxlength="maxlength"
      v-model="realValue"
      @input="keyupEvent"
    />
    <p>{{ realLength }}/{{ maxlength }}</p>
  </div>

</template>

<script>
export default {
  name: "DggTextlimit",
  componentsName: "文本限制",

  props: {
    maxlength: {
      type: Number,
      default: 50
    },
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      realValue: "",
      realLength: 0,
      styleStr: false
    };
  },
  created: function() {
    if (this.value != "") {
      this.realValue = this.value;
      this.realLength = this.realValue.length;
    }
  },
  methods: {
    keyupEvent: function() {
      var yetLen = this.realValue.length;
      this.realLength = yetLen;
      if (this.realLength > this.maxlength) {
        this.styleStr = true;
      }
      console.log(this.maxlength);
    }
  }
};
</script>
