<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:80px;">
      <el-form-item label="原密码" prop="password">
        <el-input v-model="temp.password" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="temp.newPassword" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="temp.confirmPassword" type="password" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateData()">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateUserPassword } from '@/api/users'

export default {
  name: 'Profile',
  data() {
    return {
      temp: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        password: [{ required: true, message: '请输入原密码', trigger: 'change' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'change' }],
        confirmPassword: [{ required: true, message: '请确认新密码', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid && (this.temp.newPassword === this.temp.confirmPassword)) {
          updateUserPassword(this.$store.getters.userId, this.temp).then(() => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({ name: 'Dashboard' })
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '新密码与确认密码输入的内容不一致!',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
