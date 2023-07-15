<template>
    <div class="register-wrapper">
        <el-card class="register-card">
            <h2 class="register-title">用户注册</h2>
            <el-form ref="registerForm" :model="registerForm" :rules="registerFormRules" class="register-form">
                <el-form-item prop="username">
                    <el-input v-model.trim="registerForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model.trim="registerForm.password" type="password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item prop="repeatPassword">
                    <el-input v-model.trim="registerForm.repeatPassword" type="password" placeholder="重复一遍密码"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model.trim="registerForm.code" placeholder="验证码"></el-input>
                </el-form-item>
                <div class="verification-code">
                    <img class="codeImg" @click="changeImg" :src="imgSrc"> <a @click="changeImg" class="imgDesc">
                        看不清换一张</a>
                </div>
                <el-form-item style="text-align: center;">
                    <el-button type="primary" @click="handleregister">注册</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
    
<script>
import serverConfig from "../http/config/index";
export default {
    name: 'Register',
    data() {
        return {
            bannerHeight: 0,
            imgSrc: serverConfig.baseURL + '/user/createCode?createTime='+ new Date().getTime(),
            registerForm: {
                username: '',
                password: '',
                repeatPassword: '',
                code: ''
            },
            codeResult: false,
            registerFormRules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                repeatPassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
            },
        };
    },
    methods: {
        changeImg() {
            this.imgSrc = serverConfig.baseURL + '/user/createCode?createTime=' + new Date().getTime();
        },
        async handleregister() {
            let that = this;
            // 验证码验证结果
            await that.$ajax.post('/user/checkCode', {
                code: that.registerForm.code
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
            // 登陆验证
            this.$refs.registerForm.validate((valid) => {
                if (valid) {
                    if (that.registerForm.password === that.registerForm.repeatPassword) {
                        // 发起注册请求
                        that.$ajax.post('/user/register', {
                            userName: that.registerForm.username,
                            password: that.registerForm.password
                        }).then(function (response) {
                            if (response.code == 200) {
                                that.$message({
                                    duration: 1000,
                                    showClose: true,
                                    message: '注册成功',
                                    type: 'success'
                                })
                                that.$router.replace({
                                    path: '/login'
                                })
                            } else {
                                that.$message({
                                    duration: 1000,
                                    showClose: true,
                                    message: '注册失败' + ' ' + response.message,
                                    type: 'error'
                                })
                            }
                        }).catch(function (error) {
                            console.log(error)
                        });
                    } else {
                        that.$message({
                            duration: 1000,
                            showClose: true,
                            message: '注册失败, 两次输入密码不一致',
                            type: 'warning'
                        })
                    }
                } else {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '请输入用户名和密码',
                        type: 'warning'
                    })
                }
            });
            that.changeImg();
        },
    }
};
</script>
    
<style lang="less" scoped>
.register-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    // 背景图片以及透明度
    background-image: url(../assets/image/ahut_3.jpg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    opacity: 0.9;

    .register-card {
        position: absolute;
        width: 400px;
        padding: 30px;
        border-radius: 5px;
        border-radius: 30px;
        // 背景透明度
        background: rgba(255, 255, 255, 0.8);

        .verification-code {
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

        .register-title {
            font-size: 24px;
            text-align: center;
            margin-bottom: 30px;
        }

        .register-form {
            margin-bottom: 20px;

            .el-button {
                margin: 0 25px;
            }
        }
    }
}
</style>
    
  