<template>
  <dgg-modal
    :hasmodal="true"
    :modal="modalPassword"
    :loading="loading"
    class="password-pop"
    title="修改密码"
    width="512px"
    @modalAffirm="submitPsw"
    @modalQuit="close"
  >
    <dgg-form
      ref="resetPasswordFormRef"
      :model="resetPasswordForm"
      :rules="resetPasswordRules"
      label-width="135px"
    >
      <dgg-form-item
        label="旧密码："
        prop="oldPassword"
      >
        <dgg-input
          v-model="resetPasswordForm.oldPassword"
          type="password"
          maxlength="15"
          @input="resetPasswordForm.oldPassword = resetPasswordForm.oldPassword.replace(/\s+/g,'');"
          placeholder="请输入旧密码"
        />
      </dgg-form-item>
      <dgg-form-item
        label="新密码："
        prop="newPassword"
      >
        <dgg-input
          v-model="resetPasswordForm.newPassword"
          type="password"
          maxlength="15"
          @input="resetPasswordForm.newPassword = resetPasswordForm.newPassword.replace(/\s+/g,'');"
          placeholder="请输入新密码"
        />
      </dgg-form-item>
      <dgg-form-item
        label="请确认新密码："
        prop="newPasswordAgain"
      >
        <dgg-input
          v-model="resetPasswordForm.newPasswordAgain"
          type="password"
          maxlength="15"
          @input="resetPasswordForm.newPasswordAgain = resetPasswordForm.newPasswordAgain.replace(/\s+/g,'');"
          placeholder="请确认新密码"
        />
      </dgg-form-item>
    </dgg-form>
  </dgg-modal>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import TaskBitMap from '../../components/taskBitMap';
export default {
  name: 'ChangePsw',
  components: {
    TaskBitMap
  },
  data() {
    return {
      modalPassword: false, // 修改密码
      loading: false,
      // 修改密码
      resetPasswordForm: {
        newPassword: '', // 新密码
        oldPassword: '', // 旧密码
        newPasswordAgain: ''
      },
      // 修改密码验证
      resetPasswordRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          },
          {
            message: '密码必须为包含数字字母的6到15位字符串',
            trigger: 'blur',
            pattern: /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,15}$/
          }
        ],
        newPasswordAgain: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请确认新密码'));
              } else if (value !== this.resetPasswordForm.newPassword) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapState(['userId'])
  },
  methods: {
    ...mapActions('personalSettingModule', ['change_pwd']),
    ...mapActions(['ruoterJump', 'logout']),
    showModal() {
      this.modalPassword = true;
    },
    reset() {
      this.loading = false;
      this.$refs.resetPasswordFormRef.resetFields();
    },
    submitPsw() {
      this.$refs.resetPasswordFormRef.validate(async valid => {
        if (valid) {
          const params = {
            userId: this.userId,
            oldPwd: this.resetPasswordForm.oldPassword,
            newPwd: this.resetPasswordForm.newPassword
          };
          this.loading = true;
          this.change_pwd(params)
            .then(async res => {
              if (res.code === 200) {
                this.$message({
                  message: '修改成功,请登录',
                  type: 'success'
                });
                const logout = await this.logout();
                if (logout.code === 200) {
                  this.ruoterJump({ name: 'login' });
                }
                this.close();
              } else {
                if (res.code === 7113) {
                  this.close();
                  this.ruoterJump({ name: 'resetPassword' });
                } else {
                  this.$notify({
                    message: res.message,
                    type: "error",
                    customClass: "dgg-tip-msg"
                  });
                }
                // this.$message({
                //   message: res.message,
                //   type: 'error'
                // });
              }
              this.loading = false;
            })
            .catch(e => {
              this.loading = false;
            });
        }
      });
    },
    close() {
      this.reset();
      this.modalPassword = false;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
