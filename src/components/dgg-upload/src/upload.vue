<script>
import ajax from "./ajax";
import UploadDragger from "./upload-dragger.vue";
import lodash from "lodash";
import method from "@/api/method";

export default {
  /* eslint-disable vue/require-default-prop */
  name: "Uploader",
  inject: ["uploader"],
  components: {
    UploadDragger
  },
  props: {
    type: String,
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: "file"
    },
    data: Object,
    headers: Object,
    withCredentials: Boolean,
    multiple: Boolean,
    accept: String,
    onStart: Function,
    onProgress: Function,
    onSuccess: Function,
    onError: Function,
    beforeUpload: Function,
    drag: Boolean,
    onPreview: {
      type: Function,
      default: function() {
        //
      }
    },
    onRemove: {
      type: Function,
      default: function() {
        //
      }
    },
    fileList: Array,
    autoUpload: Boolean,
    listType: String,
    httpRequest: {
      type: Function,
      default: method.post
    },
    disabled: Boolean,
    limit: Number,
    onExceed: Function,
    addType: Array,
    acceptType: Array,
    fileSize: [Number, String],
    canKeyboxDel: Boolean,
    nonsupportType: Array,
    envoyCharacter: Array,
    replaceCharacter: String,
    uploadWord: [String, Object],
    isPreview: Boolean
  },

  data() {
    return {
      mouseover: false,
      reqs: {},
      fileType: [
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
        "jpeg"
      ],
      fileStatus: false
    };
  },

  methods: {
    isImage(str) {
      return str.indexOf("image") !== -1;
    },
    handleChange(ev) {
      const _files = ev.target.files;
      // const extName = ev.target.value.substring(ev.target.value.lastIndexOf(".")).toLowerCase().replace('.', '')
      let typeList = [...this.addType, ...this.fileType];

      let _map = [];
      let _sizeList = [];
      let _nameList = [];
      for (let i = 0; i < _files.length; i++) {
        _map.push(
          _files[i].name
            .substring(_files[i].name.lastIndexOf("."))
            .toLowerCase()
            .replace(".", "")
        ); // 获取名字
        _sizeList.push(_files[i].size); // 获取大小
        _nameList.push(_files[i].name);
      }
      if (this.acceptType.length) {
        if (
          _map.some(item => {
            return !this.acceptType.includes(item);
          })
        ) {
          // 文件不支持的类型
          this.$message({
            message: `上传文件只支持${this.acceptType.join()}`,
            type: "warning",
            customClass: "dgg-tip-msg"
          });
          return;
        }
      } else {
        if (
          _map.some(item => {
            return this.nonsupportType.includes(item);
          })
        ) {
          // 文件不支持的类型
          this.$message({
            message: "占不支持改文件类型的上传",
            type: "warning",
            customClass: "dgg-tip-msg"
          });
          return;
        }
        if (
          _map.some(item => {
            return !typeList.includes(item);
          })
        ) {
          // 限制文件上传类型
          this.$message({
            message: "请选择正确的上传文件类型",
            type: "warning",
            customClass: "dgg-tip-msg"
          });
          return;
        }
      }
      if (
        this.envoyCharacter.some(item => {
          return _nameList.some(el => {
            return el.includes(item);
          });
        })
      ) {
        // 包含特殊字符的提示
        this.$message({
          message: `上传的文件包含特殊字符${this.envoyCharacter.join()}`,
          type: "warning",
          customClass: "dgg-tip-msg"
        });
        return;
      }

      if (
        _sizeList.some(item => {
          // 限制上传大小
          return item / 1024 > parseInt(this.fileSize) * 1024;
        })
      ) {
        this.$message({
          message: `上传文件限制为最大${this.fileSize}M`,
          type: "warning",
          customClass: "dgg-tip-msg"
        });
        return;
      }

      if (!_files) return;
      this.uploadFiles(_files);
    },
    uploadFiles(files) {
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.$message({
          message: `文件最大上传个数为${this.limit}个`,
          type: "warning",
          customClass: "dgg-tip-msg"
        });
        this.onExceed && this.onExceed(files, this.fileList);
        return;
      }

      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1);
      }

      if (postFiles.length === 0) {
        return;
      }

      postFiles.forEach(rawFile => {
        this.onStart(rawFile);
        if (this.autoUpload) this.upload(rawFile);
      });
    },
    upload(rawFile) {
      this.$refs.input.value = null;

      if (!this.beforeUpload) {
        return this.post(rawFile);
      }

      const before = this.beforeUpload(rawFile);
      if (before && before.then) {
        before.then(
          processedFile => {
            const fileType = Object.prototype.toString.call(processedFile);

            if (fileType === "[object File]" || fileType === "[object Blob]") {
              if (fileType === "[object Blob]") {
                processedFile = new File([processedFile], rawFile.name, {
                  type: rawFile.type
                });
              }
              for (const p in rawFile) {
                if (rawFile.hasOwnProperty(p)) {
                  processedFile[p] = rawFile[p];
                }
              }
              this.post(processedFile);
            } else {
              this.post(rawFile);
            }
          },
          () => {
            this.onRemove(null, rawFile);
          }
        );
      } else if (before !== false) {
        this.post(rawFile);
      } else {
        this.onRemove(null, rawFile);
      }
    },
    abort(file) {
      const { reqs } = this;
      if (file) {
        let uid = file;
        if (file.uid) uid = file.uid;
        if (reqs[uid]) {
          reqs[uid].abort();
        }
      } else {
        Object.keys(reqs).forEach(uid => {
          if (reqs[uid]) reqs[uid].abort();
          delete reqs[uid];
        });
      }
    },
    async post(rawFile) {
      const { uid } = rawFile;
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.onProgress(e, rawFile);
        },
        onSuccess: res => {
          // 判断如果上传失败，则删除文件
          if (res.code !== 0) {
            this.$message({
              message: res.msg,
              type: "warning",
              customClass: "dgg-tip-msg"
            });
            this.onError(res, rawFile);
            delete this.reqs[uid];
            return;
          }
          // 判断如果上传失败，则删除文件结束
          this.onSuccess(res, rawFile);
          delete this.reqs[uid];
        },
        onError: err => {
          this.onError(err, rawFile);
          delete this.reqs[uid];
        }
      };

      const formData = new FormData();

      if (options.data) {
        Object.keys(options.data).forEach(key => {
          formData.append(key, options.data[key]);
        });
      }

      formData.append(options.filename, options.file, options.file.name);
      const req = await this.httpRequest(options.action, formData, {
        isrmultipart: true,
        isXReqUserName: true,
        onUploadProgress: e => {
          // 阿斯顿撒多
          this.onProgress(e, rawFile);
        }
      }).catch(e=>{
        this.onError(e);
      });;
      this.reqs[uid] = req;
       
      if (req.code === 0 || req.code === 200) {
        this.onSuccess(req, rawFile);
        delete this.reqs[uid];
      } else {
        this.$message({
          message: lodash.get(req, 'message' ) || lodash.get(req, 'msg'),
          type: "warning",
          customClass: "dgg-tip-msg"
        });
        this.onError(req, rawFile);
        delete this.reqs[uid];
      }
    },
    handleClick() {
      if (!this.disabled) {
        this.$refs.input.value = null;
        this.$refs.input.click();
      }
    },
    handleKeydown(e) {
      if (e.target !== e.currentTarget) return;
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleClick();
      }
    }
  },

  render(h) {
    const {
      handleClick,
      drag,
      name,
      handleChange,
      multiple,
      accept,
      listType,
      uploadFiles,
      disabled,
      handleKeydown
    } = this;
    const data = {
      class: {
        "el-upload": true
      },
      on: {
        click: handleClick,
        keydown: handleKeydown
      }
    };
    // 如果disabled直接不显示按钮
    if (disabled) {
      data.class["none"] = true;
    } else {
      data.class[`el-upload--${listType}`] = true;
    }
    if (!this.isPreview) {
      return (
        <div {...data} tabindex="0">
          {drag ? (
            <upload-dragger
              disabled={disabled}
              on-file={uploadFiles}
              uploadWord={this.uploadWord}
            >
              {this.$slots.default}
            </upload-dragger>
          ) : (
            this.$slots.default
          )}
          <input
            class="el-upload__input"
            type="file"
            ref="input"
            name={name}
            on-change={handleChange}
            multiple={multiple}
            accept={accept}
          />
        </div>
      );
    }
    return;
  }
};
</script>
