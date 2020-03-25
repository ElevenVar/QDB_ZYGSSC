<template>
  <div class="dgg-verify">
    {{ text }}
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"    
      label-width="200px"
      class="demo-ruleForm"
    >

      <el-form-item
        :prop="name"
        label="大于0的正整数"
      >
        <el-input
          v-model.number="ruleForm.name"
          placeholder="验证大于0的正整数"
        />
      </el-form-item>

      <el-form-item
        :prop="name1"
        label="区间在5-10的数"
      >
        <el-input
          v-model.number="ruleForm.name1"
          placeholder="验证区间在5-10的数"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/babel">
/* eslint-disable vue/require-default-prop */

export default {
  name: "DggVerify",
  componentsName: "表单验证",
  props: {
    text: {
      type: String,
      default: ""
    },
    label: {
      type: String
    },
    name: {
      type: String,
      default: ""
    },
    name2: {
      type: String,
      default: ""
    }
  },
  data() {
    var checkNumber = (rule, value, callback) => {
      const reg = /^(0|[1-9][0-9]*)$/;
      if (!value && reg.test(value) === false) {
        return callback(new Error("输入内容不能为空"));
      } else {
        if (!Number(value) && reg.test(value) === false) {
          return callback(new Error("必须为数字值"));
        } else {
          if (value <= 0 || parseInt(value) !== value) {
            return callback(new Error("请输入大于0的正整数"));
          } else {
            callback();
          }
        }
      }
    };
    var checkNumber1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("输入内容不能为空"));
      } else {
        if (!Number(value)) {
          return callback(new Error("必须为数字值"));
        } else {
          if (value < 5 || value > 10) {
            return callback(new Error("请输入区间在5-10的数值"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      ruleForm: {
        name: "",
        name1: ""
      },
      rules: {
        name: [{ validator: checkNumber, trigger: "blur", required: true }],
        name1: [{ validator: checkNumber1, trigger: "blur", required: true }]
      }
    };
  },
  created() {
    console.log(this);
  },
  methods: {}
};
</script>
