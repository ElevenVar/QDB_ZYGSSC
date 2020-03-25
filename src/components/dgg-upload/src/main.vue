<template>
  <div class="dgg-upload-wrapper">
    <el-upload-remake
      :action="uploadUrl"
      list-type="picture-card"
      :file-list="fileList"
      :multiple="multiple"
      :limit="limit"
      :nonsupportType="nonsupportType"
      :drag="drag"
      :name="name"
      :data="data"
      :headers="headers"
      :with-credentials="withCredentials"
      :is-remove="isRemove"
      :isDownload="isDownload"
      :disabled="disabled"
      :download-url="downloadUrl"
      :on-preview="handlePictureCardPreview"
      :before-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :addType="addType"
      :fileSize="fileSize"
      :autoUpload="autoUpload"
      :canKeyboxDel="canKeyboxDel"
      :envoyCharacter="envoyCharacter"
      :uploadWord="uploadWord"
      :isPreview="isPreview"
      :replaceCharacter="replaceCharacter"
      :acceptType="acceptType"
    >
      <i class="el-icon-plus"></i>
    </el-upload-remake>
    <dgg-modal
      :modal="dialogVisible"
      @modalQuit="dialogVisible = false"
      :hasFooter="false"
      :title="dialogImageName || ''"
      width="750px"
      modal-class="upload-img-view"
      :appendToBody="true"
      :hasmodal="true"
    >
      <div style="max-width:700px;max-height:660px;">
        <img
          width="100%"
          style="max-width:700px;max-height:660px;object-fit: contain;"
          :src="dialogImageUrl"
          alt
        />
      </div>
    </dgg-modal>
  </div>
</template>

<script>
import method from "@/api/method";
import ElUploadRemake from "./index";
import { objToString } from "@/utils/helper";

function noop() {
  //
}

export default {
  name: "dgg-upload",
  components: {
    ElUploadRemake
  },
  props: {
    //后端返回键名
    keys: {
      type: Object,
      default: () => ({
        name: "filename",
        url: "filepath",
        fileid: "fileid"
      })
    },
    //上传文件字段名称
    name: {
      type: String,
      default: "file"
    },
    //初始化列表url
    listUrl: {
      type: String,
      default: ""
    },
    autoUpload: {
      // 是否自动上传
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: () => ({})
    },
    headers: {
      type: Object,
      default: () => ({})
    },
    uploadUrl: {
      type: String,
      default: ""
    },
    delUrl: {
      type: String,
      default: ""
    },
    downloadUrl: {
      type: String,
      default: ""
    },
    multiple: {
      type: Boolean,
      default: true
    },
    limit: {
      type: [String, Number],
      default: 120
    },
    btnText: {
      type: String,
      default: ""
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    // 是否开启获取初始化列表 默认为true
    isList: {
      type: Boolean,
      default: true
    },
    // 是否开启可删除
    isRemove: {
      type: Boolean,
      default: true
    },
    // 是否开启dowmnload
    isDownload: {
      type: Boolean,
      default: true
    },
    //是否禁用上传
    disabled: {
      type: Boolean,
      default: false
    },
    // :accept="accept"
    //文件上传类型
    // accept: {
    //   type: String,
    //   default: "jpg"
    // },
    //是否启用拖拽上传
    drag: {
      type: Boolean,
      default: true
    },
    onRemove: {
      type: Function,
      default: noop
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    addType: {
      // 新增的格式
      type: Array,
      default() {
        return [];
      }
    },
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
    canKeyboxDel: Boolean,
    envoyCharacter: {
      // 需要特殊处理的字符
      type: Array,
      default() {
        return ["&"];
      }
    },
    replaceCharacter: {
      type: String,
      default() {
        return "%";
      }
    },
    uploadWord: {
      //
      type: [String, Object],
      default() {
        return "";
      }
    },
    isPreview: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isCms: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      fileList: [],
      dialogImageUrl: "",
      dialogImageName: "",
      dialogVisible: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init: function() {
      // this.fileList = [];
      if (!this.isList) {
        return;
      }
      method
        .post(this.listUrl + objToString(this.data), this.data, {
          isrlencoded: true,
          isXReqUserName: true
        })
        .then(res => {
          if (res.data) {
            for (var i = 0, v; (v = res.data[i]); i++) {
              this.fileList.push({
                name: res.data[i][this.keys.name],
                url: res.data[i][this.keys.url],
                fileid: res.data[i][this.keys.fileid]
              });
            }
          }
          this.$emit("list", this.fileList);
        });
    },
    handleRemove(file, fileList) {
      console.log(file);
      var index = this.fileList.findIndex(function(v) {
        if (file.name == v.name) {
          return true;
        } else {
          return false;
        }
      });
      const _data = {
        ...this.data,
        fileName: file.name,
        fileId: file.fileid ? file.fileid : file.response.data.fileid,
        form: 1
      };
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.isCms) {
            // 如果要走 cms
            const formData = new FormData();
            formData.append("fileName", file.name);
            formData.append("fileId", file.fileid);
            method
              .post(this.delUrl + objToString(_data), formData, {
                isrmultipart: true,
                isXReqUserName: true
              })
              .then(() => {
                this.fileList.splice(index, 1);
                this.onRemove(file, fileList);
              });
          } else {
            method
              .post(
                this.delUrl + objToString(_data),
                { ..._data },
                {
                  isrlencoded: true,
                  isXReqUserName: true
                }
              )
              .then(() => {
                this.fileList.splice(index, 1);
                this.onRemove(file, fileList);
              });
          }
        })
        .catch(() => {
          debugger;
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      return false;
    },
    handleRemoveAll(file, fileList) {
      var index = this.fileList.findIndex(function(v) {
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
      method
        .post(
          this.delUrl + objToString(_data),
          { ..._data },
          { isXReqUserName: true }
        )
        .then(() => {
          //
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "删除失败"
          });
        });
      return false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImageName = file.name;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      this.fileList = fileList;
      this.onSuccess(response, file, fileList);
    },
    handleError(err, file, fileList) {
      this.onError(err, file, fileList);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-upload.el-upload--picture-card {
  .el-upload-dragger {
    width: auto;
    height: 100%;
  }

  .upload-btn-text {
    margin-top: 50%;
    transform: translateY(-50%);
    color: #10bbb8;
    line-height: normal;

    .el-icon-plus {
      color: #10bbb8;
    }
  }
}
</style>
<style lang="less">
.upload-img-view {
  .el-dialog__title {
    max-width: calc(100% - 80px);
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    height: auto;
  }
}
</style>
