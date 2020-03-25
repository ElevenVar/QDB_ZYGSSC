/**
 * author kram 2019年6月13日
 * 验证类
 */

class Validate {
  constructor() {
    this.DDnumber = {
      validator: DDnumber,
      required: true,
      trigger: 'blur'
    } // 只能输入.和数字且限制整数位数11位；小数2位
    this.bumLary = {
      validator: bumLary,
      required: true,
      trigger: 'blur'
    }
    //
    this.defaultvali = function(vali, trigger = 'blur') {
      return {
        validator: vali,
        required: true,
        trigger: trigger
      }
    }
    //
    this.defaultMessage = function(message, trigger = 'blur', type = '') {
      return {
        required: true,
        message: message,
        trigger: trigger,
        type: type
      }
    }
    // 非表单手机号验证
    this.phoneNumberValid = {
      validator: phoneNumberValid,
      required: true,
      trigger: 'blur'
    }
    this.emailValid = {
      validator: emailValid,
      required: true,
      trigger: 'blur'
    }
    this.idNumberValid = {
      validator: idNumberValid,
      required: true,
      trigger: 'blur'
    }
    // 手机号码只验证格式
    this.phoneNumberValidNotRequire = {
      validator: phoneNumberValidNot,
      trigger: 'blur'
    }
    // 邮箱只验证格式
    this.emailValidNotRequire = {
      validator: emailValidNot,
      trigger: 'blur'
    }
  }
}

const DDnumber = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('只能输入.和数字且限制整数位数11位；小数2位'))
  } else {
    const isnum = /^[0-9]{1,11}([.][0-9]{0,2})?$/
    if (!isnum.test(value)) {
      callback(new Error('只能输入.和数字且限制整数位数11位；小数2位'))
    }
    callback()
  }
}
const bumLary = (rule, value, callback) => {
  if (value === '') {
    callback()
  } else {
    const isNum = /^[0-9]*$/
    if (!isNum.test(value)) {
      callback(new Error('只输入数字'))
    }
    callback()
  }
}
// 手机号正则表达式
const phoneNumberValid = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号码'));
  } else {
    const phoneReg = /^0?(13|14|15|16|17|18|19)[0-9]{9}$/i; // 手机号正则表达式
    if (!phoneReg.test(value)) {
      callback(new Error('请输入有效手机号码'))
    }
    callback();
  }
}
// 邮箱验证
const emailValid = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入邮箱'));
  } else {
    const emailReg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; // 邮箱正则表达式
    if (!emailReg.test(value)) {
      callback(new Error('请输入有效邮箱'))
    }
    callback();
  }
}
const idNumberValid = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入身份证号'))
  } else {
    const idNumberReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!idNumberReg.test(value)) {
      callback(new Error('身份证号输入不合法'))
    }
    callback();
  }
}
const phoneNumberValidNot = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else {
    const phoneReg = /^0?(13|14|15|16|17|18|19)[0-9]{9}$/i; // 手机号正则表达式
    if (!phoneReg.test(value)) {
      callback(new Error('请输入有效手机号码'))
    }
    callback();
  }
}
const emailValidNot = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else {
    const emailReg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; // 邮箱正则表达式
    if (!emailReg.test(value)) {
      callback(new Error('请输入有效邮箱'))
    }
    callback();
  }
}

export default new Validate()
