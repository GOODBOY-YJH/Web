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
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
export default {
    name: 'AddPost',
    data() {
        return {
            title: '发表新帖',
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
                    that.$ajax.post('/post/addPost', {
                        title: that.form.title,
                        content: that.form.content
                    }).then(function (response) {
                        that.$message({
                            duration: 1000,
                            showClose: true,
                            message: "发布成功",
                            type: 'success'
                        })
                        that.$router.replace({
                            path: '/home/forum'
                        })
                    }).catch(function (error) {
                        that.$message({
                            duration: 1000,
                            showClose: true,
                            message: "发布失败",
                            type: 'error'
                        })
                    })
                } else {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: "请输入标题和内容",
                        type: 'warning'
                    })
                }
            })
        },
        resetForm() {
            this.$refs.form.resetFields()
        }
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
  