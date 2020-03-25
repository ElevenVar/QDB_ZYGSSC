<template>
  <div
    tag="ul"
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="el-list"
  >
    <li
      v-for="file in filteredFiles"
      :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      :key="file.uid"
      tabindex="0"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <img
          class="el-upload-list__item-thumbnail"
          v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
          :src="file.url"
          alt=""
        >
        <a
          class="el-upload-list__item-name"
          @click="handleClick(file)"
        >
          <!-- <i class="el-icon-document"></i>{{file.name}} -->
          <dgg-icon
            style="margin-right:10px"
            :icon-class="file.fileType + ''"
          />{{file.name}}
        </a>
        <label class="el-upload-list__item-status-label" v-if="file.status !== 'uploading'">

          <i :class="{
            'el-icon-upload-success': true,
            'el-icon-circle-check': listType === 'text',
            'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
          }"></i>
        </label>
        <i
          class="el-icon-close el-icon-circle-close"
          v-if="!disabled  && file.status !== 'uploading'"
          @click="$emit('remove', file)"
        ></i>
        <i
          class="el-icon-close-tip"
          v-if="!disabled && file.status !== 'uploading'"
        >{{ t('el.upload.deleteTip') }}</i>
        <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
        <el-progress
          v-if="file.status === 'uploading'"
          :type="listType === 'picture-card' ? 'circle' : 'line'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percentage="parsePercentage(file.percentage)"
        >
        </el-progress>
        <span
          class="el-upload-list__item-actions"
          v-if="listType === 'picture-card'"
        >
          <span
            class="el-upload-list__item-preview"
            v-if="handlePreview && listType === 'picture-card'"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="$emit('remove', file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </slot>
    </li>
  </div>
</template>
<script>
import Locale from "@/componentsEl/src/mixins/locale";
import ElProgress from "@/componentsEl/progress";

export default {
  name: "ElUploadList",

  mixins: [Locale],

  data() {
    return {
      focusing: false,
      docIconList: {
        ".doc.docx": "icon_word",
        ".xls.xlsx": "icon_excel",
        ".ppt.pptx": "icon_ppt",
        ".txt": "icon_txt",
        ".mp3.wma.wav": "icon_music",
        ".mp4.wmv.avi.3gp.mkv": "icon_video",
        ".jpg.jpeg.gif.png.bmp": "icon_pic",
        ".rar.zip.gz": "icon_package",
        ".pdf": "icon_pdf"
      }
    };
  },
  components: { ElProgress },

  props: {
    files: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    listType: String,
    acceptType: Array
  },
  computed: {
    filteredFiles() {
      let temp = this.files;
      for (let v of temp) {
        let index = v.name.lastIndexOf(".");
        let suffix = v.name.substring(index + 1).toLowerCase();
        if (this.acceptType.indexOf(suffix) !== -1) {
          v.isShow = true;
        } else {
          v.isShow = false;
        }
        const typeItem = Object.keys(this.docIconList).find(
          ty => ty.indexOf(suffix) > -1
        );
        /*  switch (suffix) {
          //文档类
          case "xls":
            v.fileType = "xlsx";
            break;
          case "xlsx":
            v.fileType = "xlsx";
            break;
          case "doc":
            v.fileType = "word";
            break;
          case "docx":
            v.fileType = "word";
            break;
          case "txt":
            v.fileType = "txt";
            break;
          case "ppt":
            v.fileType = "ppt";
            break;
          case "pptx":
            v.fileType = "ppt";
            break;
          case "pdf":
            v.fileType = "pdf";
            break;
          //音频
          case "mp3":
            v.fileType = "audio";
            break;
          //视频
          case "mp4":
            v.fileType = "video";
            break;
          case "avi":
            v.fileType = "video";
            break;
          case "wmv":
            v.fileType = "video";
            break;
          case "flv":
            v.fileType = "video";
            break;
          //压缩包
          case "rar":
            v.fileType = "zip";
            break;
          case "zip":
            v.fileType = "zip";
            break;
          default:
            v.fileType = "unknown";
        } */

        v.fileType = this.docIconList[typeItem] || "icon_others";
      }

      return temp;
    }
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val, 10);
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file);
    }
  }
};
</script>
<style>
.el-upload-list__item .el-icon-circle-close {
  top: 2px;
  color: #f10940;
}
.el-upload-list__item .el-upload-list__item-status-label {
  display: inline-block;
}
.el-upload-list__item:hover .el-upload-list__item-status-label {
  display: none;
}

.el-upload-list__item-actions {
  font-size: 12px;
}
</style>