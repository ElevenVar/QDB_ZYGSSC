<script>
import UploadList from "./upload-list";
import Upload from "./upload";
import ElProgress from "@/componentsEl/progress";
import Migrating from "@/componentsEl/src/mixins/migrating";
import method from "@/api/method";
import ajax from "./ajax";
import { objToString } from "@/utils/helper";

// 不支持键盘del事件
function noop() {}

export default {
  name: "dgg-upload-doc",

  mixins: [Migrating],

  components: {
    ElProgress,
    UploadList,
    Upload
  },

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
    //后端返回键名
    keys: {
      type: Object,
      default: () => ({
        name: "filename",
        url: "filepath",
        fileid: "fileid"
      })
    },
    //初始化列表url
    listUrl: {
      type: String,
      default: ""
    },
    // 是否开启获取初始化列表 默认为true
    isList: {
      type: Boolean,
      default: true
    },
    delUrl: {
      type: String,
      default: ""
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
    acceptType: {
      type: Array,
      default() {
        return [
          "bmp",
          "jpg",
          "png",
          "tiff",
          "gif",
          "pcx",
          "tga",
          "exif",
          "fpx",
          "svg",
          "psd",
          "cdr",
          "pcd",
          "dxf",
          "ufo",
          "eps",
          "ai",
          "raw",
          "WMF",
          "pptx",
          "pdf",
          "zip"
        ];
      }
    },
    envoyCharacter: {
      // 需要特殊处理的字符
      type: Array,
      default() {
        return ["&"];
      }
    },
    fileSize: {
      // 默认文件上传大小为50M
      type: [Number, String],
      default() {
        return 10;
      }
    }
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
          return item;
        });
      },
      deep: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.uploadFiles = [];
      if (!this.isList) {
        return;
      }
      // method
      //   .post(this.listUrl + objToString(this.data), this.data, {
      //     isrlencoded: true,
      //     isXReqUserName: true
      //   })
      //   .then(res => {
      //     if (res.code == 200) {
      //       for (var i = 0, v; (v = res.data[i]); i++) {
      //         this.uploadFiles.push({
      //           name: res.data[i][this.keys.name],
      //           url: res.data[i][this.keys.url],
      //           fileid: res.data[i][this.keys.fileid]
      //         });
      //       }
      //     } else {
      //       this.$message({
      //         message: data.message,
      //         type: "warning",
      //         customClass: "dgg-tip-msg"
      //       });
      //     }
      //   });
    },
    handleStart(rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++;
      let file = {
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
      this.uploadFiles.forEach(item => {
        if (item.name === res.data[this.keys.name]) {
          this.$set(item, "fileid", res.data[this.keys.fileid]);
          this.$set(item, "url", res.data[this.keys.fileid]);
        }
      });
      const file = this.getFile(rawFile);

      if (file) {
        file.status = "success";
        file.response = res;

        this.onSuccess(res, file, this.uploadFiles);
        this.onChange(file, this.uploadFiles);
      }
    },
    handleError(err, rawFile) {
      if (!rawFile) {
        this.onError(err);
      } else {
        const file = this.getFile(rawFile);
        const fileList = this.uploadFiles;

        file.status = "fail";

        fileList.splice(fileList.indexOf(file), 1);

        this.onError(err, file, this.uploadFiles);
        this.onChange(file, this.uploadFiles);
      }
    },
    handleRemove(file, fileList) {
      var index = this.uploadFiles.findIndex(function(v) {
        if (file.name == v.name) {
          return true;
        } else {
          return false;
        }
      });
      const _data = {
        ...this.data,
        fileName: file.name,
        fileId: file.fileid,
        form: 1
      };
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let fileList = this.uploadFiles;
          fileList.splice(index, 1);
          this.onRemove(file, fileList);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      return false;
    },
    getFile(rawFile) {
      let fileList = this.uploadFiles;
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

  beforeDestroy() {
    this.uploadFiles.forEach(file => {
      if (file.url && file.url.indexOf("blob:") === 0) {
        URL.revokeObjectURL(file.url);
      }
    });
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
          acceptType={this.acceptType}
          handlePreview={this.onPreview}
        >
          {props => {
            if (this.$scopedSlots.file) {
              return this.$scopedSlots.file({
                file: props.file
              });
            }
          }}
        </UploadList>
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
        "accept-type": this.acceptType,
        "envoy-character": this.envoyCharacter,
        "file-size": this.fileSize
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
