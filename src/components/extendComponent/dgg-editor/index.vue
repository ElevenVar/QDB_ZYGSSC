<template>
  <div
    :style="`width:${width}%`"
    class="dgg-editor"
  >
    <el-upload
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
    >
      <el-button
        size="mini"
        type="primary"
      >
        <i class="el-icon-upload el-icon--left" />上传附件
      </el-button>
      <span
        slot="tip"
        class="el-upload__tip"
      >(只能上传jpg/png文件，且不超过500kb)</span>
    </el-upload>
    <div
      ref="toolbar"
      class="dgg-toolbar"
    />
    <div
      ref="text"
      :style="`height:${height}px`"
      class="dgg-text"
    />
    <el-button
      type="success"
      style="margin-top:15px;"
      @click="handleSubmit"
    >提交</el-button>
    <el-button
      type="primary"
      @click="handleClear"
    >清空</el-button>
  </div>
</template>

<script type="text/babel">
import E from "wangeditor";
export default {
  name: "DggEditor",
  componentsName: "富文本",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    isClear: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      editor: null,
      info: null,
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      fileLists: []
    };
  },
  watch: {
    value(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value);
      }
      console.log(value);
    },
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info = null;
      }
    }
  },
  mounted() {
    this.setEditor();
    this.editor.txt.html(this.value);
  },
  methods: {
    // 上传附件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    handleClear() {
      //清空文本区内容
      this.editor.txt.clear();
      this.info = null;
    },
    handleSubmit() {
      //处理提交信息
      this.$message({
        message: "提交成功！",
        type: "success"
      });
    },
    setEditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.text);
      console.log(this);

      this.editor.customConfig.uploadImgShowBase64 = true; // base 64 存储图片
      this.editor.customConfig.uploadImgServer =
        "https://tibosscms.dgg188.cn/api/cms/file/find_file.do?fileId=thtest-123456"; // 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
      this.editor.customConfig.uploadFileName = "dgg_fileUpload"; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M
      this.editor.customConfig.uploadImgMaxLength = 5; // 限制一次最多上传 5 张图片
      this.editor.customConfig.uploadImgTimeout = 3000; // 设置超时时间 3s

      // 自定义菜单配置
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "video", // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ];
      // 使用监听函数在上传图片的不同阶段做相应处理
      this.editor.customConfig.uploadImgHooks = {
        before: function(xhr, editor, files) {
          console.log(files);
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function(xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          console.log(result);
        },
        fail: function(xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果

          console.log(result);
        },
        error: function(xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function(xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）

        customInsert: function(insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          //前提：如果后台返回的是data：[{url:"路径的形式"},...]

          //循环插入图片
          // for (let i = 0; i < result.data.length; i++) {
          //   var url = result.data[i].filepath
          //   insertImg(url)
          // }

          var url = result.data.push({
            fileid: "thtest-123456",
            filename: "yasuo1.jpg",
            filepath:
              "https://fastdfs.dgg188.cn/group9/M00/05/5E/CgIBv1zQ6BSEDs-2AAAAAFviL2Y432.jpg",
            filedate: new Date()
          });
          insertImg(url);
          console.log(result.data);

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };

      this.editor.customConfig.onchange = html => {
        // html 即变化之后的内容
        this.info = html;
        // console.log(html)
        // console.log(this)
        this.$emit("change", this.info); //将内容同步到父组件中
      };
      //创建富文本编辑器
      this.editor.create();
    }
  }
};
</script>
