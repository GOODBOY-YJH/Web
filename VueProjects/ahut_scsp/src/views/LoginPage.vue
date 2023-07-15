<template>
  <div class="login-wrapper">
    <el-card class="login-card">
      <h2 class="login-title">用户登录</h2>
      <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model.trim="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model.trim="loginForm.password" @keyup.enter.native="handleLogin" type="password"
            placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model.trim="loginForm.code" placeholder="验证码"></el-input>
        </el-form-item>
        <div class="verification-code">
          <img class="codeImg" @click="changeImg" :src="imgSrc"> <a @click="changeImg" class="imgDesc">
            看不清换一张</a>
        </div>
        <el-form-item style="text-align: center;">
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button type="primary" @click="register">注册</el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>
  
<script>
import serverConfig from "../http/config/index";
export default {
  name: 'LoginPage',
  data() {
    return {
      imgSrc: serverConfig.baseURL + '/user/createCode?createTime='+ new Date().getTime(),
      bannerHeight: 0,
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      codeResult: false,
      loginFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    changeImg() {
      this.imgSrc = serverConfig.baseURL + '/user/createCode?createTime=' + new Date().getTime();
    },
    async handleLogin() {
      let that = this
      // 验证码验证结果
      await that.$ajax.post('/user/checkCode', {
        code: that.loginForm.code
      }).then(function (response) {
        that.codeResult = response.result
      }).catch(function (error) {
        console.log(error)
      })
      if (!that.codeResult) {
        that.$message({
          duration: 1000,
          showClose: true,
          message: '验证码输入错误',
          type: 'warning'
        })
        that.changeImg();
        return;
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // TODO: 发送登录请求
          that.$ajax.post('/user/login', {
            userName: that.loginForm.username,
            password: that.loginForm.password
          }).then(function (response) {
            if (response.code == 200) {
              that.$message({
                duration: 1000,
                showClose: true,
                message: '登陆成功',
                type: 'success'
              })
              that.$router.push({
                path: '/home/main'
              })
            } else {
              that.$message({
                duration: 1000,
                showClose: true,
                message: '登陆失败,' + response.message,
                type: 'error'
              })
            }
          }).catch(function (error) {
            that.$message({
              duration: 1000,
              showClose: true,
              message: '登陆失败' + error,
              type: 'error'
            })
          })
        } else {
          that.$message({
            duration: 1000,
            showClose: true,
            message: '请输入用户名和密码',
            type: 'warning'
          })
          return false;
        }
      });
      that.changeImg();
    },
    register() {
      this.$router.push({
        path: '/register',
      })
    }
  },
};
</script>
  
<style lang="less" scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  // 背景图片以及透明度
  background-image: url(../assets/image/ahut_2.jpg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  opacity: 0.9;

  .login-card {
    position: absolute;
    width: 400px;
    padding: 30px;
    border-radius: 5px;
    border-radius: 30px;
    // 背景透明度
    background: rgba(255, 255, 255, 0.8);

    .verification-code {
      margin-bottom: 10px;
      .codeImg {
        vertical-align: middle;
        height: 50px;
        width: 100px;
      }

      .imgDesc {
        cursor: pointer;
        user-select: none;
        vertical-align: middle;
        margin-left: 10px;
        color: green;
      }
    }

    .el-input {
      opacity: 0.9
    }

    .login-title {
      font-size: 24px;
      text-align: center;
      margin-bottom: 30px;
    }

    .login-form {
      margin-bottom: 20px;

      .el-button {
        margin: 0 25px;
      }
    }
  }
}
</style>
  
