<template>
    <div class="form">
        <h2 class="form-title">{{ title }}</h2>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="form-body">
            <el-form-item label-width="0px" class="form-item" prop="title">
                <el-input v-model="form.title" placeholder="请输入标题" clearable></el-input>
            </el-form-item>
            <el-form-item label-width="0px" class="form-item" prop="content">
                <el-input v-model="form.content" type="textarea" :rows="10" placeholder="请输入描述" clearable></el-input>
            </el-form-item>
            <el-form-item label-width="0px" class="form-item">
                <el-button type="primary" @click="submitForm">更新</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
export default {
    name: 'UpdatePost',
    props: {
        id: {
            // 路由传参只能是字符串，这里用String
            type: String,
            default: "-1"
        }
    },
    data() {
        return {
            postId: parseInt(this.id),
            title: '更新帖子',
            form: {
                title: '',
                content: '',
            },
            rules: {
                title: [{ required: true, message: '输入标题', trigger: 'blur' }],
                content: [{ required: true, message: '输入内容', trigger: 'blur' }],
            }
        }
    },
    methods: {
        submitForm() {
            let that = this
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 提交表单的逻辑可以在这里添加
                    that.$ajax.post('/post/updatePost', {
                        postId: that.postId,
                        title: that.form.title,
                        content: that.form.content
                    }).then(function (response) {
                        if (response.rows == 1) {
                            that.$message({
                                duration: 1000,
                                showClose: true,
                                message: '更新成功',
                                type: 'success'
                            })
                            that.$router.go(-1)
                        } else {
                            that.$message({
                                duration: 1000,
                                showClose: true,
                                message: '更新失败',
                                type: 'error'
                            })
                        }

                    }).catch(function (error) {
                        that.$message({
                            duration: 1000,
                            showClose: true,
                            message: '更新失败',
                            type: 'error'
                        })
                        console.log(error)
                    })
                } else {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '请输入标题和内容',
                        type: 'warning'
                    })
                }
            })
        },
        resetForm() {
            this.$refs.form.resetFields()
        },
        searchPostInfo() {
            let that = this
            if (that.postId == -1) {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    message: 'so sorry啦,发生了一些错误~~,请重试',
                    type: 'error'
                })
                that.$router.replace({
                    path: '/home/forum'
                })
            } else {
                that.$ajax.get(`/post/postInfoById?id=${that.postId}`)
                    .then(function (response) {
                        that.form.title = response.postInfo.title
                        that.form.content = response.postInfo.content
                    }).catch(function (error) {
                        console.log("postInfoById出错了")
                    })
            }
        },
    },
    mounted() {
        this.searchPostInfo();
    }
}
</script>
  
<style lang="less" scoped>
.form {
    max-width: 800px;
    margin: 100px auto;
    padding: 50px;
    background-color: rgb(240, 247, 255);
    ;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .form-title {
        font-size: 30px;
        margin-bottom: 40px;
        text-align: center;
        color: #2c3e50;
    }

    .form-body {
        display: flex;
        flex-direction: column;
        align-items: center;

        .form-item {
            text-align: center;
            margin-bottom: 30px;
            font-size: 18px;
            color: #7f8c8d;
            width: 100%;

            .el-input__inner {
                font-size: 16px;
                color: #34495e;
                border-color: #95a5a6;
            }

            .el-input__inner:focus {
                border-color: #2c3e50;
            }
        }
    }

    .el-button {
        font-size: 18px;
        padding: 12px 20px;
        border-radius: 8px;
    }

    .el-button--primary {
        background-color: #2c3e50;
        border-color: #2c3e50;
    }

    .el-button--primary:hover {
        background-color: #34495e;
        border-color: #34495e;
    }

    .el-button--primary:focus {
        background-color: #34495e;
        border-color: #34495e;
    }

    .el-button--primary:active {
        background-color: #2c3e50;
        border-color: #2c3e50;
    }

    .el-button--primary:disabled {
        background-color: #bdc3c7;
        border-color: #bdc3c7;
    }
}
</style>
  