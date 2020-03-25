<template>
  <transition-group
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    tag="ul"
    name="el-list"
  >
    <li
      v-for="file in filteredFiles"
      :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      :key="file.uid"
      class="pr"
      tabindex="0"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="uploadItemClick(file)"
    >
      <!-- 新增图标 -->
      <span v-if="!disabled && !file.isShow" class="ft28">
        <dgg-icon :icon-class="'dgg-'+file.fileType+''"/>
        <!--        <i class="el-icon-document"/>-->
      </span>
      <img
        v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
        :src="file.url"
        class="el-upload-list__item-thumbnail el-upload-list_image"
        alt
      >
      <label class="el-upload-list__item-status-label" style="display:block;" v-if="file.selected">
        <i
          :class="{
            'el-icon-check': true,
          }"
        />
      </label>
      <i v-if="!disabled" class="el-icon-close" @click="$emit('remove', file)"/>
      <i v-if="!disabled" class="el-icon-close-tip">{{ t('el.upload.deleteTip') }}</i>
      <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
      <el-progress
         v-if="file.status === 'uploading'"
        :type="listType === 'picture-card' ? 'circle' : 'line'"
        :stroke-width="listType === 'picture-card' ? 4 : 2"
        :width="90 "
        class="upload-progress"
        :percentage="parsePercentage(file.percentage)"
        color="#10bbb8"
      />
      <span v-if="listType === 'picture-card'" class="el-upload-list__item-actions">
        <!-- 新增文件名称 -->
        <span class="name" :title="file.name">{{ file.name }}</span>
        <span
          v-if="handlePreview && listType === 'picture-card' && file.isShow"
          class="el-upload-list__item-preview"
          @click="handlePreview(file)"
        >
          <i class="el-icon-zoom-in"/>
        </span>
        <span
          v-if="!disabled && isDownload && !isPreview"
          class="el-upload-list__item-delete"
          @click="$emit('download', file)"
        >
          <i class="el-icon-download"/>
        </span>
        <span
          v-if="!disabled && isRemove && !isPreview"
          class="el-upload-list__item-delete"
          @click="$emit('remove', file)"
        >
          <i class="el-icon-delete"/>
        </span>
      </span>
    </li>
  </transition-group>
</template>
<script>
  import Locale from '@/componentsEl/src/mixins/locale'
  import ElProgress from '@/componentsEl/progress'
  /* eslint-disable vue/require-default-prop */

  export default {
    name: 'ElUploadList',
    components: { ElProgress },
    fileType: '',
    mixins: [Locale],
    props: {
      files: {
        type: Array,
        default() {
          return []
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      handlePreview: Function,
      listType: String,
      isRemove: {
        type: Boolean,
        default: true
      },
      isDownload: {
        type: Boolean,
        default: true
      },
      addType: {
        type: Array,
        default() {
          return []
        }
      },
      fileSize: [Number, String],
      canKeyboxDel: Boolean,
      isPreview: Boolean
    },

    data() {
      return {
        fileType: [
          'bmp',
          'jpg',
          'png',
          'tiff',
          'gif',
          'pcx',
          'tga',
          'exif',
          'fpx',
          'svg',
          'psd',
          'cdr',
          'pcd',
          'dxf',
          'ufo',
          'eps',
          'ai',
          'raw',
          'WMF',
          'jpeg'
        ],
        focusing: false
      }
    },
    computed: {
      filteredFiles() {
        let temp = [...this.files]
        for (let v of temp) {
          let index = v.name.lastIndexOf('.');
          let suffix = v.name.substring(index + 1).toLowerCase();
          let _array = [...this.addType, ...this.fileType]
          if (_array.indexOf(suffix) !== -1) {
            v.isShow = true
          } else {
            v.isShow = false
            switch (suffix) {
              //文档类
              case 'xls':
                v.fileType = 'xlsx';
                break;
              case 'xlsx':
                v.fileType = 'xlsx';
                break;
              case 'doc':
                v.fileType = 'word';
                break;
              case 'docx':
                v.fileType = 'word';
                break;
              case 'txt':
                v.fileType = 'txt';
                break;
              case 'ppt':
                v.fileType = 'ppt';
                break;
              case 'pptx':
                v.fileType = 'ppt';
                break;
              case 'pdf':
                v.fileType = 'pdf';
                break;
              //音频
              case 'mp3':
                v.fileType = 'audio';
                break;
              //视频
              case 'mp4':
                v.fileType = 'video';
                break;
              case 'avi':
                v.fileType = 'video';
                break;
              case 'wmv':
                v.fileType = 'video';
                break;
              case 'flv':
                v.fileType = 'video';
                break;
              //压缩包
              case 'rar':
                v.fileType = 'zip';
                break;
              case 'zip':
                v.fileType = 'zip';
                break;
              default:
                v.fileType = 'unknown';
            }
          }
        }
        return temp
      }
    },
    methods: {
      parsePercentage(val) {
        return parseInt(val, 10)
      },
      handleClick(file) {
        this.handlePreview && this.handlePreview(file)
      },
      uploadItemClick(file){
        if(this.disabled) {
          return 
        }
        if(!this.canKeyboxDel){
          return
        }
          this.focusing = true;
          this.$nextTick(()=>{
            this.focusing = false;
            this.$set(file, 'selected', !file.selected)
            this.$forceUpdate()
          })
      }
    },
  }
</script>

<style lang="less" scoped>
  .ft28 {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;

    .dgg-icon {
      position: absolute;
      margin: auto;
      width: 50%;
      height: 50%;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      max-height: 48px;
      max-width: 48px;
    }
  }
  .el-upload-list__item-status-label{
     z-index: 1000;
  }
  .upload-progress{
    padding: 15px;
    background-color: #fff;
    box-sizing:border-box;
  }
  .el-icon-zoom-in{
    font-size: 16px;
  }
  .el-icon-download{
    font-size: 16px;
  }
  .el-icon-delete{
    font-size: 16px;
  }
  .el-upload-list_imag{
    object-fit: contain
  }
</style>
