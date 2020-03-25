<template>
  <div
    :class="{
      'is-dragover': dragover
    }"
    :style="{height:'120px',width:'120px'}"
    class="el-upload-dragger"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <div class="upload-word" v-if="uploadWord"> {{uploadWord}}</div>
    <slot/>
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop */

  export default {
    name: 'ElUploadDrag',
    props: {
      disabled: Boolean,
      uploadWord: [String, Object],
    },
    inject: {
      uploader: {
        default: '',
      },
    },
    data() {
      return {
        dragover: false,
      }
    },
    methods: {
      onDragover() {
        if (!this.disabled) {
          this.dragover = true
        }
      },
      onDrop(e) {
        if (this.disabled || !this.uploader) return
        const accept = this.uploader.accept
        this.dragover = false
        if (!accept) {
          this.$emit('file', e.dataTransfer.files)
          return
        }
        this.$emit('file', [].slice.call(e.dataTransfer.files).filter(file => {
          const { type, name } = file
          const extension = name.indexOf('.') > -1
            ? `.${ name.split('.').pop() }`
            : ''
          const baseType = type.replace(/\/.*$/, '')
          return accept.split(',')
            .map(type => type.trim())
            .filter(type => type)
            .some(acceptedType => {
              if (/\..+$/.test(acceptedType)) {
                return extension === acceptedType
              }
              if (/\/\*$/.test(acceptedType)) {
                return baseType === acceptedType.replace(/\/\*$/, '')
              }
              if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
                return type === acceptedType
              }
              return false
            })
        }))
      },
    },
  }
</script>

<style lang="less" scoped>
.upload-word{
  position: absolute;
  top: 25px;
  color: #9398A1;
  font-size:12px;
}
.el-upload-dragger{
    align-items: center;
    justify-content: center;
    display: flex;
}
</style>