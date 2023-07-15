<template>
    <div class="register-wrapper">
        <el-card class="register-card">
            <h2 class="register-title">修改密码</h2>
            <el-form ref="registerForm" :model="registerForm" :rules="registerFormRules" class="register-form">
                <el-form-item prop="password">
                    <el-input v-model="registerForm.password" type="password" placeholder="请输入新密码"></el-input>
                </el-form-item><el-form-item prop="password">
                    <el-input v-model="registerForm.repeatPassword" type="password" placeholder="重复一遍密码"></el-input>
                </el-form-item>
                <el-form-item style="text-align: center;">
                    <el-button type="primary" @click="handleregister">提交</el-button>
                </el-form-item>

            </el-form>
        </el-card>
    </div>
</template>
    
<script>
export default {
    name: 'Register',
    data() {
        return {
            bannerHeight: 0,
            registerForm: {
                password: '',
                repeatPassword: ''
            },
            registerFormRules: {
                password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                repeatPassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }]
            },
        };
    },
    methods: {
        handleregister() {
            let that = this;
            this.$refs.registerForm.validate((valid) => {
                if (valid) {
                    if (that.registerForm.password === that.registerForm.repeatPassword) {
                        // 发起注册请求
                        that.$ajax.post('/user/updatePassword', {
                            password: that.registerForm.password
                        }).then(function (response) {
                            if (response.code == 200) {
                                that.$message({
                                    duration: 1000,
                                    showClose: true,
                                    message: '修改成功',
                                    type: 'success'
                                })

                                that.$router.replace({
                                    path: '/login'
                                })
                            } else {
                                that.$message({
                                    duration: 1000,
                                    showClose: true,
                                    message: '修改失败' + ' ' + response.message,
                                    type: 'error'
                                })
                            }
                        }).catch(function (error) {
                            that.$message({
                                duration: 1000,
                                showClose: true,
                                message: '修改失败' + error,
                                type: 'error'
                            })
                        });

                    } else {
                        that.$message({
                            duration: 1000,
                            showClose: true,
                            message: '两次输入密码不一致,请重新输入',
                            type: 'warning'
                        })
                    }
                } else {
                    that.$message({
                        message: '注册失败, 账号密码不能为空',
                        type: 'warning'
                    })
                }
            });
        },
    },
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
    
  