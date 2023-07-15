<template>
  <div class="personal-info">
    <el-card class="info-card">
      <div slot="header" class="card-header">
        <span>个人信息</span>
      </div>
      <div class="avatar">
        <img :src="avatarUrl" alt="头像" />
      </div>
      <div class="info-list">
        <el-row class="info-row">
          <el-col :span="6" class="info-label">昵称：</el-col>
          <el-col :span="18">{{ username }}</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="6" class="info-label">性别：</el-col>
          <el-col :span="18">{{ gender }}</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="6" class="info-label">生日：</el-col>
          <el-col :span="18">{{ birthday }}</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="6" class="info-label">邮箱：</el-col>
          <el-col :span="18">{{ email }}</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="6" class="info-label">地址：</el-col>
          <el-col :span="18">{{ address }}</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="6" class="info-label">电话号码：</el-col>
          <el-col :span="18">{{ phoneNumber }}</el-col>
        </el-row>
      </div>
      <div class="update-button">
        <el-button @click="updateUserInfo" type="primary">修改信息</el-button>
      </div>
    </el-card>
  </div>
</template>
  
<script>
export default {
  name: 'userInfo',
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
      isLogin: false,
      username: '张三',
      avatarUrl: 'https://placehold.it/100x100',
      gender: '男',
      birthday: '1990-01-01',
      email: 'example@example.com',
      address: '北京市海淀区',
      phoneNumber: '13888888888',
    };
  },
  methods: {
    updateUserInfo() {
      this.$router.push({
        path: '/home/userInfoUpdate'
      })
    }
  },
  beforeMount() {
    let that = this
    that.$ajax.get('/user/isLogin')
      .then(function (response) {
        that.isLogin = response.login
        if (!that.isLogin) {
          that.$router.go(-1)
          that.$message({
            duration: 1000,
            showClose: true,
            message: '请先登录',
            type: 'warning'
          })
        }
      })
      .catch(function (error) {
        console.log(error)
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
        console.log(response)
        that.username = response.user.userName
        that.avatarUrl = response.user.avatar
        that.gender = response.user.gender
        that.birthday = response.user.birthDate
        that.email = response.user.email
        that.address = response.user.address
        that.phoneNumber = response.user.phoneNumber
      }).catch(function (error) {
        console.log("这个错误, 暂时不知道怎么提醒")
      })
  }
};
</script>
  
<style lang="less" scoped>
.personal-info {
  max-width: 600px;
  margin: 100px auto;
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

  .avatar {
    text-align: center;
    margin: 20px 0;

    img {
      height: 150px;
      width: 150px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }

  .info-list {
    margin-top: 20px;

    .info-row {
      margin-bottom: 16px;

      .info-label {
        color: #999;
        text-align: right;
        padding-right: 10px;
      }
    }

  }

  .update-button {
    text-align: center;
  }

}
</style>
  