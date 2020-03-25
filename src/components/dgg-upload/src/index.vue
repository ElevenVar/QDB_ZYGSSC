<script>
/* eslint-disable*/
import UploadList from "./upload-list";
import Upload from "./upload";
import ElProgress from "@/componentsEl/progress";
import Migrating from "@/componentsEl/src/mixins/migrating";
import lodash from "lodash";
function noop() {
  //
}

export default {
  name: "ElUploadRemake",
  componentsName: "上传",
  components: {
    ElProgress,
    UploadList,
    Upload
  },

  mixins: [Migrating],

  provide() {
    return {
      uploader: this
    };
  },

  inject: {
    elForm: {
      default: ""
    }
  },

  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default() {
        return {};
      }
    },
    data: Object,
    multiple: Boolean,
    name: {
      type: String,
      default: "file"
    },
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true
    },
    accept: String,
    type: {
      type: String,
      default: "select"
    },
    beforeUpload: Function,
    beforeRemove: Function,
    onRemove: {
      type: Function,
      default: noop
    },
    onChange: {
      type: Function,
      default: noop
    },
    onPreview: {
      type: Function
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: "text" // text,picture,picture-card
    },
    httpRequest: Function,
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function,
      default: noop
    },
    // 新增是否开启删除
    isRemove: {
      type: Boolean,
      default: true
    },
    isDownload: {
      type: Boolean,
      default: true
    },
    downloadUrl: String,
    addType: Array,
    replaceCharacter: String,
    envoyCharacter: Array,
    acceptType: {
      // 只支持的格式
      type: Array,
      default() {
        return [];
      }
    },
    nonsupportType: {
      // 不支持的的格式
      type: Array,
      default() {
        return [];
      }
    },
    fileSize: {
      // 默认文件上传大小为50M
      type: [Number, String],
      default() {
        return 10;
      }
    },
    canKeyboxDel: {
      // 是否支持键盘删除
      type: Boolean,
      default() {
        return true;
      }
    },
    uploadWord: {
      //  上传的底部文字
      type: [String, Object],
      default() {
        return "";
      }
    },
    isPreview: Boolean
  },

  data() {
    return {
      uploadFiles: [],
      dragOver: false,
      draging: false,
      tempIndex: 1
    };
  },

  computed: {
    uploadDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },

  watch: {
    listType(type) {
      if (type === "picture-card" || type === "picture") {
        this.uploadFiles = this.uploadFiles.map(file => {
          if (!file.url && file.raw) {
            try {
              file.url = URL.createObjectURL(file.raw);
            } catch (err) {
              console.error("[Element Error][Upload]", err);
            }
          }
          return file;
        });
      }
    },
    fileList: {
      immediate: true,
      handler(fileList) {
        this.uploadFiles = fileList.map(item => {
          item.uid = item.uid || Date.now() + this.tempIndex++;
          item.status = item.status || "success";
          item["selected"] = false; // todo  黄伟增加 是否选中
          // 如果是新上传的则传入后台返回数据
          item.url = item.response ? item.response.data.filepath : item.url;
          return item;
        });
      }
    }
  },

  beforeDestroy() {
    this.uploadFiles.forEach(file => {
      if (file.url && file.url.indexOf("blob:") === 0) {
        URL.revokeObjectURL(file.url);
      }
    });
  },

  methods: {
    handleStart(rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++;
      const file = {
        status: "ready",
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      };

      if (this.listType === "picture-card" || this.listType === "picture") {
        try {
          file.url = URL.createObjectURL(rawFile);
        } catch (err) {
          console.error("[Element Error][Upload]", err);
          return;
        }
      }

      this.uploadFiles.push(file);
      this.onChange(file, this.uploadFiles);
    },
    handleProgress(ev, rawFile) {
      const file = this.getFile(rawFile);
      this.onProgress(ev, file, this.uploadFiles);

      file.status = "uploading";
      file.percentage = ev.percent || 0;
    },
    handleSuccess(res, rawFile) {
      const file = this.getFile(rawFile);

      if (file) {
        file.status = "success";
        file.response = res;

        this.onSuccess(res, file, this.uploadFiles);
        this.onChange(file, this.uploadFiles);
      }
    },
    handleError(err, rawFile) {
      const file = this.getFile(rawFile);
      const fileList = this.uploadFiles;

      file.status = "fail";

      fileList.splice(fileList.indexOf(file), 1);

      this.onError(err, file, this.uploadFiles);
      this.onChange(file, this.uploadFiles);
    },
    handleRemoveAll() {
      if (!this.canKeyboxDel) {
        return;
      }
      let file = lodash.cloneDeep(this.uploadFiles);
      this.uploadFiles.forEach(async item => {
        if (item.selected) {
          await this.$parent.handleRemoveAll(item, this.uploadFiles);
        }
      });
      this.uploadFiles = file.filter(item => {
        return !item.selected && item;
      });
    },
    handleRemove(file, raw) {
      console.log(file, "filefilefilefilefile======>");
      if (raw) {
        file = this.getFile(raw);
      }
      const doRemove = () => {
        this.abort(file);
        const fileList = this.uploadFiles;
        fileList.splice(fileList.indexOf(file), 1);
        this.onRemove(file, fileList);
      };

      if (!this.beforeRemove) {
        doRemove();
      } else if (typeof this.beforeRemove === "function") {
        const before = this.beforeRemove(file, this.uploadFiles);
        if (before && before.then) {
          before.then(() => {
            doRemove();
          }, noop);
        } else if (before !== false) {
          doRemove();
        }
      }
    },
    handleDownload(file) {
      const fileName = encodeURI(encodeURI(file.name));
      const url =
        this.downloadUrl + "?fileUrl=" + file.url + "&fileName=" + fileName;
      window.open(url, "_blank");
    },
    getFile(rawFile) {
      const fileList = this.uploadFiles;
      let target;
      fileList.every(item => {
        target = rawFile.uid === item.uid ? item : null;
        return !target;
      });
      return target;
    },
    abort(file) {
      this.$refs["upload-inner"].abort(file);
    },
    clearFiles() {
      this.uploadFiles = [];
    },
    submit() {
      this.uploadFiles
        .filter(file => file.status === "ready")
        .forEach(file => {
          this.$refs["upload-inner"].upload(file.raw);
        });
    },
    getMigratingConfig() {
      return {
        props: {
          "default-file-list": "default-file-list is renamed to file-list.",
          "show-upload-list": "show-upload-list is renamed to show-file-list.",
          "thumbnail-mode":
            "thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan"
        }
      };
    }
  },

  render(h) {
    let uploadList;

    if (this.showFileList) {
      uploadList = (
        <UploadList
          disabled={this.uploadDisabled}
          listType={this.listType}
          files={this.uploadFiles}
          on-remove={this.handleRemove}
          v-Delect={this.handleRemoveAll}
          on-download={this.handleDownload}
          handlePreview={this.onPreview}
          is-preview={this.isPreview}
          is-remove={this.isRemove}
          is-download={this.isDownload}
        />
      );
    }

    const uploadData = {
      props: {
        type: this.type,
        drag: this.drag,
        action: this.action,
        multiple: this.multiple,
        "before-upload": this.beforeUpload,
        "with-credentials": this.withCredentials,
        headers: this.headers,
        name: this.name,
        data: this.data,
        accept: this.accept,
        fileList: this.uploadFiles,
        autoUpload: this.autoUpload,
        listType: this.listType,
        disabled: this.uploadDisabled,
        limit: this.limit,
        "on-exceed": this.onExceed,
        "on-start": this.handleStart,
        "on-progress": this.handleProgress,
        "on-success": this.handleSuccess,
        "on-error": this.handleError,
        "on-preview": this.onPreview,
        "on-remove": this.handleRemove,
        "http-request": this.httpRequest,
        addType: this.addType,
        envoyCharacter: this.envoyCharacter,
        replaceCharacter: this.replaceCharacter,
        nonsupportType: this.nonsupportType,
        acceptType: this.acceptType,
        fileSize: this.fileSize,
        canKeyboxDel: this.canKeyboxDel,
        uploadWord: this.uploadWord,
        isPreview: this.isPreview
      },
      ref: "upload-inner"
    };

    const trigger = this.$slots.trigger || this.$slots.default;
    const uploadComponent = <upload {...uploadData}>{trigger}</upload>;

    return (
      <div>
        {this.listType === "picture-card" ? uploadList : ""}
        {this.$slots.trigger
          ? [uploadComponent, this.$slots.default]
          : uploadComponent}
        {this.$slots.tip}
        {this.listType !== "picture-card" ? uploadList : ""}
      </div>
    );
  }
};
</script>
