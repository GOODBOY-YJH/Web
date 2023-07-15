<template>
  <div class="personal-info">
    <div slot="header" class="card-header">
      <span>个人信息</span>
    </div>
    <el-form :model="form" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="上传头像" prop="avatar">
        <el-upload ref="upload" list-type="picture-card" :action="avatarUrl" :show-file-list="true"
          :class="{ hide: haveImage }" :file-list="form.avatar" :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarUploadSuccess" :on-remove="handleAvatarRemove" :on-error="handleAvatarUploadError"
          :headers="headers">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.gender" placeholder="性别">
          <el-option v-for="(gender, index) in genders" :key="index" :label="gender" :value="gender" />
        </el-select>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker v-model="form.birthday" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="phoneNumber">
        <el-input v-model="form.phoneNumber"></el-input>
      </el-form-item>
      <el-form-item class="button_center">
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
import serverConfig from "../http/config/index";
export default {
  name: 'userInfoUpdate',
  props: {
    id: {
      // 路由传参只能是字符串，这里用String
      type: String,
      default: "-1"
    }
  },
  data() {
    return {
      userId: parseInt(this.id),
      // upload上传需要使用token
      avatarUrl: serverConfig.baseURL + '/cos/uploadCosFile?type=avatar',
      headers: {
        token: window.localStorage.getItem('token')
      },
      isLogin: false,
      haveImage: false,
      genders: ['男', '女', '其他'],
      // 表单
      form: {
        name: '',
        avatar: [],
        gender: '男',
        birthday: '',
        email: '',
        address: '',
        phoneNumber: ''
      },
      // 表单验证规则
      rules: {
        avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        gender: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        email:[{pattern:'^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$', message: '邮箱格式不对', trigger:'blur'}],
        phoneNumber:[{pattern: '1[3-9]\\d{9}', message: '手机号码格式不对', trigger:'blur'}]
      },
    };
  },
  methods: {
    submitForm() {
      let that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = {
            userId: this.userId,
            name: that.form.name,
            avatar: that.form.avatar[0].url,
            gender: that.form.gender,
            birthday: that.form.birthday,
            email: that.form.email,
            address: that.form.address,
            phoneNumber: that.form.phoneNumber
          }
          // console.log(data)
          that.$ajax.post('/user/updateUserInfo', data)
            .then(function (response) {
              if (response.code == 200 && response.rows > 0) {
                that.$message({
                  duration: 1000,
                  showClose: true,
                  message: '更新成功',
                  type: 'success'
                })
                that.$router.go(-1);
              } else {
                that.$message({
                  duration: 1000,
                  showClose: true,
                  message: '更新失败,' + response.message,
                  type: 'error'
                })
              }
            }).catch(function (error) {
              console.log(error)
            })
        } else {
          that.$message({
            duration: 1000,
            showClose: true,
            message: '表单验证失败',
            type: 'error'
          })
          return false
        }
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt4M = file.size / 1024 / 1024 < 4

      if (!isJPG && !isPNG) {
        this.$message({
          duration: 1000,
          showClose: true,
          message: '上传头像只能是 JPG/PNG 格式!',
          type: 'error'
        })
        return false
      }
      if (!isLt4M) {
        this.$message({
          duration: 1000,
          showClose: true,
          message: '上传头像大小不能超过 4MB!',
          type: 'error'
        })
        return false
      }
      return true
    },
    // 头像图片上传成功
    handleAvatarUploadSuccess(response, file, fileList) {
      this.form.avatar.push({ url: response.url })
      this.$message({
        duration: 1000,
        showClose: true,
        message: '上传头像成功',
        type: 'success'
      })
      this.haveImage = true
    },

    // 头像图片删除
    handleAvatarRemove(file, fileList) {
      let that = this
      let url = file.response ? file.response.url : file.url
      console.log(url)
      that.$ajax.post('/cos/deleteCosFile', {
        pathes: [url.split("\.com")[1]]
      }).then(function (response) {
        // 移除表单里的avatar图片
        that.form.avatar = that.form.avatar = []
        that.$message({
          duration: 1000,
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      }).catch(function (response) {
        that.$message({
          duration: 1000,
          showClose: true,
          message: '删除失败',
          type: 'error'
        })
      })
      that.haveImage = false
    },
    // 头像图片上传错误
    handleAvatarUploadError() {
      this.$message({
        duration: 1000,
        showClose: true,
        message: '上传头像失败',
        type: 'error'
      })
    },
  },
  beforeMount() {
    let that = this
    that.$ajax.get('/user/isLogin')
      .then(function (response) {
        that.isLogin = response.login
        if (!that.isLogin) {
          that.$router.replace({
            path: '/home'
          })
        }
      })
      .catch(function (error) {
        that.$message({
          duration: 1000,
          showClose: true,
          message: '请先登录',
          type: 'warning'
        })
        that.$router.replace({
          path: '/home/main'
        })
      })
  },
  mounted() {
    let that = this
    that.$ajax.get(`/user/info?userId=${this.userId}`)
      .then(function (response) {
        // console.log(response)
        that.form.name = response.user.userName
        if (response.user.avatar) {
          that.form.avatar = [{ url: response.user.avatar }]
          that.haveImage = true
        }
        that.form.gender = response.user.gender == 'other' ? '男' : response.user.gender
        that.form.birthday = response.user.birthDate
        that.form.email = response.user.email
        that.form.address = response.user.address
        that.form.phoneNumber = response.user.phoneNumber
      }).catch(function (error) {
        console.log(error)
        // console.log("这个错误, 暂时不知道怎么提醒")
      })
  }
};
</script>

<style>
/* 隐藏添加图片的 + 框框需要用 只能写在scoped外面 */
.hide .el-upload--picture-card {
  display: none;
}
</style>
  
<style lang="less" scoped>
.personal-info {
  width: 60%;
  margin: 100px auto;

  .button_center {
    text-align: center;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #999;
    cursor: pointer;
    transition: color 0.3s;
  }

  .el-form.item {
    display: flex;
  }
}

.info-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 30px;

  .card-header {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 8px 8px 0 0;
  }

}
</style>
  