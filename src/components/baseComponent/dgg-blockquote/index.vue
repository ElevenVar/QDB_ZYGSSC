<template>
  <div
    :style="{borderColor:borderColor,backgroundColor:backgroundColor}"
    class="dgg-blockquote"
  >
    {{ text }}
  </div>
</template>

<script type="text/babel">
export default {
  name: "DggBlockquote",
  componentsName: "引用块",
  props: {
    text: {
      type: String,
      default: ""
    },
    borderColor: {
      type: String,
      default: ""
    },
    backgroundColor: {
      type: String,
      default: ""
    }
  },

  data() {
    return {};
  },
  methods: {}
};
</script>
