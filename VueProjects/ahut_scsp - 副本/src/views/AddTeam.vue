<template>
    <!-- 这是个屎山 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="form-container">
        <el-form-item label="上传封面 (第一张会做为首页展示)" prop="cover">
            <el-upload ref="upload" class="avatar-uploader" list-type="picture-card" :action="coverUploadUrl"
                :multiple="true" :before-upload="beforeCoverUpload" :on-success="handleCoverUploadSuccess"
                :on-remove="handleCoverRemove" :on-error="handleCoverUploadError" :headers="headers">
                <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>

        <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="description" class="form-item">
            <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入团队介绍 联系方式"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="college">
            <el-select v-model="form.college" placeholder="学院" @focus="searchTeamCollege" :clearable="true">
                <el-option v-for="(college, index) in colleges" :key="index" :label="college" :value="college" />
            </el-select>
        </el-form-item>
        <el-form-item label="团队类型" prop="teamType">
            <el-select v-model="form.teamType" placeholder="团队类型" @focus="searchTeamType" :clearable="true">
                <el-option v-for="(type, index) in teamTypes" :key="index" :label="type" :value="type" />
            </el-select>
        </el-form-item>
        <el-form-item label="创立时间" prop="teamCreateTime">
            <div class="block">
                <el-date-picker v-model="form.teamCreateTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
                </el-date-picker>
            </div>
        </el-form-item>


        <el-form-item label="指导老师" prop="teacherItems">
            <div v-for="(item, index) in form.teacherItems" :key="item.id" class="item">
                <el-form-item :prop="`teacherItems.${index}.url`"
                    :rules="{ required: false, message: '请上传指导教师图片', trigger: 'blur' }">
                    <div class="item-uploader">
                        <el-upload ref="upload" class="item-upload" :action="teacherImageUploadUrl" :headers="headers"
                            list-type="picture-card" :limit="1" :before-upload="beforeTeacherUpload"
                            :on-success="(response, file, fileList) => handleTeacherUploadSuccess(response, file, fileList, index)"
                            :on-error="handleTeacherUploadError" :class="{ hide: hideTeacherImgeAdd[index] }"
                            :on-change="(file, fileList) => handleTeacherItemOnChange(file, fileList, index)"
                            :on-remove="(file, fileList) => handleTeacherItemOnRemove(file, fileList, index)">
                            <i class="el-icon-plus item-uploader-icon"></i>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item :prop="`teacherItems.${index}.name`" :rules="[
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { max: 20, message: '姓名不能超过20个字符', trigger: 'blur' }
                ]" style="width: 100%;">
                    <el-input v-model="item.name" class="item-description" placeholder="姓名"></el-input>
                </el-form-item>
                <!-- <el-form-item :prop="`teacherItems.${index}.description`" :rules="[
                    { required: true, message: '请输入简介', trigger: 'blur' },
                    { max: 50, message: '简介不能超过100个字符', trigger: 'blur' }
                ]" style="width: 100%;">
                    <el-input v-model="item.description" class="item-description" placeholder="简介"></el-input>
                </el-form-item> -->
                <el-button type="danger" icon="el-icon-plus" class="delete-item-btn" @click="deleteTeacherItem(index)">
                    删除
                </el-button>
            </div>
            <el-button type="primary" icon="el-icon-plus" class="add-item-btn" @click="addTeacherItem">
                添加内容
            </el-button>
        </el-form-item>



        <el-form-item label="曾获荣誉奖项" prop="honorItems">
            <div v-for="(item, index) in form.honorItems" :key="item.id" class="item">
                <el-form-item :prop="`honorItems.${index}.url`"
                    :rules="{ required: true, message: '请上传内容图片', trigger: 'blur' }">
                    <div class="item-uploader">
                        <el-upload ref="upload" class="item-upload" list-type="picture-card" :action="honorImageUploadUrl"
                            :headers="headers" :limit="1" :before-upload="beforeHonorUpload"
                            :on-success="(response, file, fileList) => handleHonorUploadSuccess(response, file, fileList, index)"
                            :on-error="handleHonorUploadError" :class="{ hide: hideHonorImgeAdd[index] }"
                            :on-change="(file, fileList) => handleHonorItemOnChange(file, fileList, index)"
                            :on-remove="(file, fileList) => handleHonorItemOnRemove(file, fileList, index)">
                            <i class="el-icon-plus item-uploader-icon"></i>
                        </el-upload>
                    </div>
                </el-form-item>

                <el-form-item :prop="`honorItems.${index}.description`" :rules="[
                    { required: true, message: '请输入奖项名称(描述)', trigger: 'blur' },
                    { max: 50, message: '描述不能超过50个字符', trigger: 'blur' }
                ]" style="width: 100%;">
                    <el-input v-model="item.description" class="item-description" placeholder="奖项名称"></el-input>
                </el-form-item>

                <el-button type="danger" icon="el-icon-plus" class="delete-item-btn" @click="deleteHonorItem(index)">
                    删除
                </el-button>
            </div>
            <el-button type="primary" icon="el-icon-plus" class="add-item-btn" @click="addHonorItem">
                添加内容
            </el-button>
        </el-form-item>

        <el-form-item class="button_center">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</template>
  
<script>
import serverConfig from "../http/config/index";
import { v4 as uuidv4 } from 'uuid';
export default {
    name: 'AddTeam',
    // 页面无抖动刷新
    inject: ['reload'],
    data() {
        return {
            // upload上传需要使用token
            headers: {
                token: window.localStorage.getItem('token')
            },
            // 上传图像使用的接口
            coverUploadUrl: serverConfig.baseURL + '/cos/uploadCosFile?type=cover',
            teacherImageUploadUrl: serverConfig.baseURL + '/cos/uploadCosFile?type=teacher',
            honorImageUploadUrl: serverConfig.baseURL + '/cos/uploadCosFile?type=honor',

            // college 和 teamType 选择框的选项
            colleges: ["计算机科学学院", "数学与统计学院", "物理与电子学院", "化学与材料学院", "其他"],
            teamTypes: ["校内实验室", "学生自发组队", "社团"],
            // form表单
            form: {
                /**
                 * 封面图片：
                 * [
                    {
                        name: 'food.jpg', url: require('../assets/image/ahut_1.jpg')
                    }
                ]
                 */
                cover: [],
                title: '',
                description: '',
                // 学院
                college: '',
                // 团队类型
                teamType: '',
                teamCreateTime: '',
                // 指导老师
                /**
                 * 例:
                 * [{
                        id: 0,
                        url: '',// require('../assets/image/ahut_1.jpg'),
                        name: '',
                        description: ''
                    }]
                 */
                // teacherItemId: 0,
                teacherItems: [],
                // 荣誉奖项
                /**
                 * 例：
                 * [{
                        id: 0,
                        url: '',// require('../assets/image/ahut_1.jpg'),
                        description: ''
                    }]
                 */
                // honorItemId: 0,
                honorItems: [],
            },
            // 表单验证规则
            rules: {
                cover: [{ required: true, message: '请上传封面', trigger: 'blur' }],
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                description: [
                    { required: true, message: '请输入描述', trigger: 'blur' },
                    { min: 10, message: '描述不能少于10个字符', trigger: 'blur' }
                ],
                college: [{ required: true, message: '请选择专业', trigger: 'blur' }],
                teamType: [{ required: true, message: '请选择团队类型', trigger: 'blur' }],
                teamCreateTime: [{ required: true, message: '请选择团队类型', trigger: 'blur' }]
            },

            // 添加荣誉图片超过上传个数之后隐藏 + 图标 
            /**
             * 例如：[false,false,true,false]
             */
            hideHonorImgeAdd: [],
            // 添加教师图片超过上传个数之后隐藏 + 图标
            hideTeacherImgeAdd: [],
            // 限制荣誉图片和学生图片的上传个数
            limitCount: 1,
        }
    },
    methods: {
        beforeCoverUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const isLt4M = file.size / 1024 / 1024 < 4

            if (!isJPG && !isPNG) {
                this.$message({
                    duration: 1000,
                    showClose: true,
                    message: '上传封面只能是 JPG/PNG 格式!',
                    type: 'error'
                })
                return false
            }
            if (!isLt4M) {
                this.$message({
                    duration: 1000,
                    showClose: true,
                    message: '上传封面大小不能超过 4MB!',
                    type: 'error'
                })
                return false
            }
            return true
        },
        // 封面图片上传成功
        handleCoverUploadSuccess(response, file, fileList) {
            this.form.cover.push({
                url: response.url
            })
            this.$message({
                duration: 1000,
                showClose: true,
                message: '上传封面成功',
                type: 'success'
            })
        },

        // 封面图片删除
        handleCoverRemove(file, fileList) {
            console.log(file)
            let that = this
            that.$ajax.post('/cos/deleteCosFile', {
                pathes: [file.response.path]
            }).then(function (response) {
                // 移除表单里的cover图片
                that.form.cover = that.form.cover.filter(item => { return item.url != file.response.url })
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
        },
        // 封面图片上传错误
        handleCoverUploadError() {
            this.$message({
                duration: 1000,
                showClose: true,
                message: '上传封面失败',
                type: 'error'
            })
        },









        // 添加一个荣誉项
        addHonorItem() {
            this.form.honorItems.push({
                // 生成唯一ID 防止vue渲染是因为id出现渲染错位
                id: uuidv4(),
                url: null,
                description: null
            })
            // 荣誉奖项的图片添加隐藏按钮
            this.hideHonorImgeAdd.push(false)
        },
        // 删除一个荣誉奖项
        deleteHonorItem(index) {
            // 删除图片
            let url = this.form.honorItems[index].url
            let that = this
            // 移除图库里的honor图片
            if (url != null && url != '') {
                that.$ajax.post('/cos/deleteCosFile', {
                    pathes: [url.split("\.com")[1]]
                }).then(function (response) {
                    // 移除表单里的honor图片
                    /** 下面直接移除了表单里的对象，不用在这移除图片了 */
                    // that.$message({
                    //     message: '删除成功',
                    //     type: 'success'
                    // })
                    console.log("图片移除成功")
                }).catch(function (error) {
                    // that.$message({
                    //     message: '图片删除失败',
                    //     type: 'error'
                    // })
                    console.log("图片删除失败")
                })
            }

            // 删除荣誉
            this.form.honorItems.splice(index, 1)
            // 删除荣誉奖项的图片添加隐藏按钮
            this.hideHonorImgeAdd.splice(index, 1)

            this.$message({
                duration: 1000,
                showClose: true,
                message: '删除成功',
                type: 'success'
            })
        },
        // 荣誉图片上传之前
        beforeHonorUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const isLt4M = file.size / 1024 / 1024 < 4

            if (!isJPG && !isPNG) {
                this.$message({
                    duration: 1000,
                    showClose: true,
                    message: '上传内容图片只能是 JPG/PNG 格式!',
                    type: 'error'
                })
                return false
            }
            if (!isLt4M) {
                this.$message({
                    duration: 1000,
                    showClose: true,
                    message: '上传内容图片大小不能超过 4MB!',
                    type: 'error'
                })
                return false
            }
            return true
        },
        // 荣誉图片上传成功
        handleHonorUploadSuccess(response, file, fileList, index) {
            let that = this
            that.form.honorItems[index].url = response.url
            return response => {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    message: '上传内容图片成功',
                    type: 'success'
                })
            }
        },
        // 荣誉图片上传错误
        handleHonorUploadError() {
            // this.hideHonorImgeAdd.splice(index, 1, fileList.length >= this.limitCount);
            this.$message({
                duration: 1000,
                showClose: true,
                message: '上传内容图片失败',
                type: 'error'
            })
        },
        // 添加图片之后隐藏 + 号
        handleHonorItemOnChange(file, fileList, index) {
            this.hideHonorImgeAdd.splice(index, 1, fileList.length >= this.limitCount);
        },
        // 荣誉图片移除
        handleHonorItemOnRemove(file, fileList, index) {
            let that = this
            // 如果图片上传成功
            if (file.response) {
                // 移除图库里的honor图片
                that.$ajax.post('/cos/deleteCosFile', {
                    pathes: [file.response.path]
                }).then(function (response) {
                    // 移除表单里的honor图片
                    that.form.honorItems[index].url = ''
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    })
                }).catch(function (error) {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '删除失败',
                        type: 'error'
                    })
                })
            }
            // 恢复 + 号
            this.hideHonorImgeAdd.splice(index, 1, fileList.length >= this.limitCount);
        },



        // 添加一个指导教师
        addTeacherItem() {
            this.form.teacherItems.push({
                id: uuidv4(),
                url: null,
                name: null,
                // description: null
            })

            // 荣誉奖项的图片添加隐藏按钮
            this.hideTeacherImgeAdd.push(false)
        },
        // 删除一个指导教师
        deleteTeacherItem(index) {
            let url = this.form.teacherItems[index].url
            let that = this
            // 移除图库里的teacher图片
            if (url != null && url != '') {
                that.$ajax.post('/cos/deleteCosFile', {
                    pathes: [url.split("\.com")[1]]
                }).then(function (response) {
                    // 移除表单里的teacher图片
                    // that.$message({
                    //     message: '删除成功',
                    //     type: 'success'
                    // })
                    console.log("图片移除成功")
                }).catch(function (error) {
                    // that.$message({
                    //     message: '图片删除失败',
                    //     type: 'error'
                    // })
                    console.log("图片删除失败")
                })
            }
            // 删除form表单指导教师
            this.form.teacherItems.splice(index, 1);
            // 删除荣誉奖项的图片添加隐藏按钮
            this.hideTeacherImgeAdd.splice(index, 1)
            this.$message({
                duration: 1000,
                showClose: true,
                message: '删除成功',
                type: 'success'
            })
        },
        // 老师图片上传之前
        beforeTeacherUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const isLt4M = file.size / 1024 / 1024 < 4

            if (!isJPG && !isPNG) {
                this.$message({
                    duration: 1000,
                    showClose: true,
                    message: '上传内容图片只能是 JPG/PNG 格式!',
                    type: 'error'
                })
                return false
            }
            if (!isLt4M) {
                this.$message({
                    duration: 1000,
                    showClose: true,
                    message: '上传内容图片大小不能超过 2MB!',
                    type: 'error'
                })
                return false
            }
            return true
        },
        // 老师图片上传成功
        handleTeacherUploadSuccess(response, file, fileList, index) {
            this.form.teacherItems[index].url = response.url
            this.$message({
                duration: 1000,
                showClose: true,
                message: '上传内容图片成功',
                type: 'success'
            })
        },
        // 老师图片上传错误
        handleTeacherUploadError() {
            this.$message({
                duration: 1000,
                showClose: true,
                message: '上传内容图片失败',
                type: 'error'
            })
        },
        // 添加图片之后隐藏 + 号
        handleTeacherItemOnChange(file, fileList, index) {
            this.hideTeacherImgeAdd.splice(index, 1, fileList.length >= this.limitCount);
        },
        handleTeacherItemOnRemove(file, fileList, index) {
            let that = this
            // 移除图库里的teacher图片
            that.$ajax.post('/cos/deleteCosFile', {
                pathes: [file.response.path]
            }).then(function (response) {
                // 移除表单里的teacher图片
                that.form.teacherItems[index].url = ''
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
            this.hideTeacherImgeAdd.splice(index, 1, fileList.length >= this.limitCount);
        },


        // 提交表单
        submitForm() {
            let that = this
            this.$refs.form.validate(valid => {
                if (valid) {
                    // TODO: submit the form

                    let data = {
                        teamName: that.form.title,
                        teamIntroduction: that.form.description,
                        teamImage: that.form.cover,
                        teamCollege: that.form.college,
                        teamType: that.form.teamType,
                        teamCreateTime: that.form.teamCreateTime,
                        teamTeachers: that.form.teacherItems,
                        teamHonors: that.form.honorItems,
                    }
                    that.$ajax.post('/team/addTeam', data)
                        .then(function (response) {
                            that.$message({
                                duration: 1000,
                                showClose: true,
                                message: '提交成功',
                                type: 'success'
                            })
                            that.$router.push({
                                path: '/home/teamPageList'
                            })
                        }).catch(function (error) {
                            that.$message({
                                duration: 1000,
                                showClose: true,
                                message: '提交失败',
                                type: 'error'
                            })
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

        // 重置表单
        resetForm() {
            let that = this
            let pathes = []
            this.form.cover.forEach(item => { if (item.url != null) { pathes.push(item.url.split("\.com")[1]) } })
            this.form.teacherItems.forEach(item => { if (item.url != null) { pathes.push(item.url.split("\.com")[1]) } })
            this.form.honorItems.forEach(item => { if (item.url != null) { pathes.push(item.url.split("\.com")[1]) } })

            if (pathes.length > 0) {
                that.$ajax.post('/cos/deleteCosFile', {
                    pathes: pathes
                }).then(function (response) {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '重置成功',
                        type: 'success'
                    })
                }).catch(function (response) {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '重置失败',
                        type: 'error'
                    })
                })
            }
            // 页面无抖动刷新
            that.reload()
            // 太乱了，这个需要调很久，算了
            // this.$refs.form.resetFields()
        },

        // 查询college 和 teamType 选择框的选项
        searchTeamCollege() {
            let that = this
            that.$ajax.get('/team/searchAllCollege').then(function (response) {
                that.colleges = response.allCollegeList
            }).catch(function (error) {
                console.log(error)
            })
        },
        searchTeamType() {
            let that = this
            that.$ajax.get('/team/searchAllType').then(function (response) {
                that.teamTypes = response.allTypeList
            }).catch(function (error) {
                console.log(error)
            })
        },
    },
    beforeMount() {
        let that = this
        that.$ajax.get('/user/isLogin')
            .then(function (response) {
                // that.isLoggedin = true
                // 检查是否登陆，标志登陆
                // console.log('beforeMount')
                if (!response.login) {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '请先登录',
                        type: 'warning'
                    })
                    that.$router.replace({
                        path: '/login'
                    });
                }
            }).catch(function (error) {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    message: '请先登录',
                    type: 'warning'
                })
                that.$router.go(-1)
            })
    },
}
</script>

<style>
/* 隐藏添加图片的 + 框框需要用 只能写在scoped外面 */
.hide .el-upload--picture-card {
    display: none;
}
</style>

<style lang="less" scoped>
.form-container {
    width: 80%;
    margin: 100px auto;

}

.cover-uploader {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    margin: 0 auto;
    border: 1px dashed #ccc;
    border-radius: 4px;
    overflow: hidden;
    float: left;
}

.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #999;
    cursor: pointer;
    transition: color 0.3s;
}

.avatar-uploader-icon:hover {
    color: #666;
}

.item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.item-uploader {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
}

.item-uploader-icon {
    font-size: 24px;
    color: #999;
    cursor: pointer;
    transition: color 0.3s;
    margin-bottom: 10px;
}

.item-uploader-icon:hover {
    color: #666;
}

.item-image {
    width: 200px;
    height: 200px;
    margin-bottom: 10px;
    border: 1px dashed #ccc;
    border-radius: 4px;
    overflow: hidden;
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.button_center {
    text-align: center;
}
</style>  