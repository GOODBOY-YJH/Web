<template>
    <div class="container">
        <el-carousel :interval="5000" height="400px" arrow="never">
            <el-carousel-item v-for="img in teamInfo.cover" :key="img.id">
                <img :src="img.src" class="carousel-img" alt="Carousel Image">
            </el-carousel-item>
        </el-carousel>

        <div class="intro">
            <div v-if="userId == teamUserd || isAdmin == 'admin'" class="update-or-delete">
                <i title="编辑" @click="updateTeam" class="el-icon-edit icon-update"></i>
                <i title="删除" @click="deleteTeam" class="el-icon-delete icon-delete"></i>
            </div>
            <h2 class="intro-h2">{{ teamInfo.teamName }}</h2>
            <p class="intro-p">{{ teamInfo.teamIntroduction }}</p>
        </div>
        <div :class="{ flex: showFlex }">
            <div v-if="showTeacher" class="members">
                <h2>指导老师</h2>
                <div class="member-list">
                    <div class="member" v-for="teacher in teamInfo.teachers" :key="teacher.id">
                        <img class="member-img" :src="teacher.avatar" alt="Member Avatar">
                        <h3 class="member-h3">{{ teacher.name }}</h3>
                    </div>
                </div>
            </div>
            <div v-if="showAchievement" class="achievements">
                <h2>荣誉奖项</h2>
                <div class="achievement-list">
                    <div class="achievement" v-for="achievement in teamInfo.achievements" :key="achievement.id">
                        <img class="achievement-img" :src="achievement.avatar" alt="Member Avatar">
                        <p class="achievement-p">{{ achievement.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="comment-section">
            <el-form ref="form" :model="form" class="comment-form" label-width="80px">
                <el-form-item label="评论内容">
                    <el-input v-model="form.content" :rows="5" type="textarea" placeholder="请输入评论内容"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitComment">发表评论</el-button>
                </el-form-item>
            </el-form>
            <div class="comment-list">
                <div class="comment" v-for="(comment, index) in comments" :key="index">
                    <div @click="toUserInfo(comment.userId)" class="avatar">
                        <img :src="comment.avatar">
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span @click="toUserInfo(comment.userId)" class="nickname">{{ comment.nickname }}</span>
                            <span class="time">{{ comment.time }}</span>
                        </div>
                        <div class="content">{{ comment.content }}</div>
                    </div>
                </div>
                <button class="button-more-comment" v-show="comments && comments.length < commentTotalCount">
                    还有{{ commentTotalCount - comments.length }}条回复，<p class="showMore" @click="searchCommentInfo()">点击查看</p>
                </button>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'TeamPage',
    props: {
        id: {
            // 路由传参只能是字符串，这里用String
            type: String,
            default: "-1"
        }
    },
    data() {
        return {
            // 虽然弱类型语言没有绝对类型，但是为了防止后期出bug，这里强制转换为数字类型，再进行操作
            teamId: parseInt(this.id),
            // 判断登陆
            isLogin: false,
            userId: -1,
            isAdmin: '',
            teamUserd: 0,
            // 布局
            showFlex: false,
            showTeacher: false,
            showAchievement: false,
            teamInfo: {
                // cover: [
                //     { id: 1, src: require("../assets/image/ahut_1.jpg") },
                //     { id: 2, src: require("../assets/image/ahut_1.jpg") },
                //     { id: 3, src: require("../assets/image/ahut_1.jpg") },
                // ],
                // teamName: 'Vue.js and ElementUI 开发团队',
                // teamIntroduction: '我们是一个专注于 Vue.js 和 ElementUI 开发的团队，致力于开发高质量的前端产品。',
                // teachers: [
                //     { id: 1, name: '张三', avatar: 'https://picsum.photos/id/1015/100/100', description: 'Vue.js 开发工程师' },
                //     { id: 2, name: '李四', avatar: 'https://picsum.photos/id/1024/100/100', description: 'ElementUI 设计师' },
                //     { id: 3, name: '王五', avatar: 'https://picsum.photos/id/1031/100/100', description: '前端开发经理' },
                // ],
                // students: [
                //     { id: 1, name: '张三', avatar: 'https://picsum.photos/id/1015/100/100', description: 'Vue.js 开发工程师' },
                //     { id: 2, name: '李四', avatar: 'https://picsum.photos/id/1024/100/100', description: 'ElementUI 设计师' },
                //     { id: 3, name: '王五', avatar: 'https://picsum.photos/id/1031/100/100', description: '前端开发经理' },
                // ],
                // achievements: [
                //     { id: 1, description: '中国大学生程序设计竞赛二等奖', avatar: 'https://picsum.photos/id/1015/100/100'},
                //     { id: 2, description: '李四', avatar: 'https://picsum.photos/id/1024/100/100'},
                //     { id: 3, description: '王五', avatar: 'https://picsum.photos/id/1031/100/100', },
                //     { id: 4, description: '中国大学生程序设计竞赛二等奖', avatar: 'https://picsum.photos/id/1015/100/100' },
                //     { id: 5, description: '李四', avatar: 'https://picsum.photos/id/1024/100/100'},
                //     { id: 6, description: '王五', avatar: 'https://picsum.photos/id/1031/100/100' },
                //     { id: 7, description: '中国大学生程序设计竞赛二等奖', avatar: 'https://picsum.photos/id/1015/100/100'},
                //     { id: 8, description: '李四', avatar: 'https://picsum.photos/id/1024/100/100' },
                //     { id: 9, description: '王五', avatar: 'https://picsum.photos/id/1031/100/100' },
                // ]
            },

            form: {
                content: '',
            },
            // 每次加载评论长度，初始加载三条
            loadingSize: 3,
            commentTotalCount: 0,
            comments: [
                // {
                //     userId: 1,
                //     nickname: '小明',
                //     content: '这个组件好用，非常感谢！',
                //     time: '2023-04-22 10:30:00',
                //     avatar: 'https://i.pravatar.cc/50?u=1',
                // },
                // {
                //     userId: -2,
                //     nickname: '小红',
                //     content: '我也觉得很好用！',
                //     time: '2023-04-22 11:00:00',
                //     avatar: 'https://i.pravatar.cc/50?u=2',
                // },
            ],
        }
    },
    methods: {
        submitComment() {
            let that = this
            // 检查是否登陆
            if (this.isLogin) {
                if (this.form.content != '' && this.form.content != null) {
                    let data = {
                        teamId: that.teamId,
                        commentContent: this.form.content
                    }
                    that.$ajax.post('/team/addTeamComment', data)
                        .then(function (response) {
                            console.log(response)
                            that.form.content = '';
                            that.comments.unshift(response.teamComment);
                            that.$message({
                                duration: 1000,
                                showClose: true,
                                message: '评论发表成功',
                                type: 'success'
                            })
                        }).catch(function (error) {
                            that.$message({
                                duration: 1000,
                                showClose: true,
                                message: '评论发表失败',
                                type: 'error'
                            })
                        })
                } else {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '请输入内容',
                        type: 'warning'
                    })
                }
            } else {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    message: '请先登录',
                    type: 'warning'
                })
            }
        },
        toUserInfo(userId) {
            if (this.isLogin) {
                this.$router.push({
                    path: '/home/userInfo',
                    query: {
                        id: userId
                    }
                })
            } else {
                this.$message({
                    duration: 1000,
                    showClose: true,
                    message: '请先登录',
                    type: 'warning'
                })
            }

        },
        searchTeamInfo() {
            let that = this
            if (that.teamId == -1) {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    message: 'so sorry啦,发生了一些错误~~,请重试',
                    type: 'error'
                })
                that.$router.replace({
                    path: '/home/teamPageList'
                })
            } else {
                that.$ajax.get(`/team/teamInfoByTeamId?teamId=${that.teamId}`)
                    .then(function (response) {
                        that.teamInfo = response.teamInfo
                        that.teamUserd = response.teamInfo.teamUserd
                        that.showFlex = (that.teamInfo.teachers.length < 4 && that.teamInfo.achievements.length < 4)
                        that.showTeacher = response.teamInfo.teachers.length > 0;
                        that.showAchievement = response.teamInfo.achievements.length > 0;
                    }).catch(function (error) {
                        console.log("teamInfoByTeamId出错了")
                    })
            }
        },
        searchCommentInfo() {
            let that = this
            if (that.teamId == -1) {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    message: 'so sorry啦,发生了一些错误~~,请重试',
                    type: 'error'
                })
                that.$router.replace({
                    path: '/home/teamPageList'
                })
            } else {
                let data = {
                    start: that.comments.length,
                    length: that.loadingSize,
                    teamId: that.teamId
                }
                that.$ajax.post(`/team/teamCommentsById`, data)
                    .then(function (response) {
                        that.comments.push(...response.comments)
                        that.loadingSize = response.length
                        that.commentTotalCount = response.commentTotalCount
                    }).catch(function (error) {
                        console.log("teamCommentsById出错了")
                    })
            }
        },
        updateTeam() {
            let that = this
            that.$router.push({
                path: '/home/updateTeam',
                query: { id: that.teamId }
            })
        },
        deleteTeam() {
            this.$confirm('此操作将永久删除该团队, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let that = this
                that.$ajax.delete(`/team/deleteTeamById?teamId=${this.teamId}`)
                    .then(function (response) {
                        if (response.rows < 1) {
                            that.$message({
                                duration: 1000,
                                showClose: true,
                                message: '删除失败',
                                type: 'error'
                            })
                        } else {
                            that.$message({
                                duration: 1000,
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            })
                            that.$router.replace({
                                path: '/home/TeamPageList'
                            })
                        }
                    }).catch(function (error) {
                        that.$message({
                            duration: 1000,
                            showClose: true,
                            message: '删除失败',
                            type: 'error'
                        })
                        console.log(error)
                    })
            }).catch(() => {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    mounted() {
        // 回到页面顶端
        document.documentElement.scrollTop = 0
        let that = this
        that.$ajax.get(`/team/isTeamDelete?teamId=${that.teamId}`)
            .then(function (response) {
                if (response.isDelete == 'over') {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '团队已被删除',
                        type: 'warning'
                    })
                    that.$router.replace({
                        path: '/home/teamPageList'
                    })
                } else if (response.isDelete == null) {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '团队不存在',
                        type: 'warning'
                    })
                    that.$router.replace({
                        path: '/home/teamPageList'
                    })
                } else {
                    that.searchTeamInfo();
                    that.searchCommentInfo();
                }
            }).catch(function (error) {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    message: '服务器错误，请稍后重试',
                    type: 'error'
                })
                that.$router.replace({
                    path: '/home/teamPageList'
                })
                console.log(error)
            })
        that.$ajax.get('/user/isLogin')
            .then(function (response) {
                that.isLogin = response.login
                that.userId = response.userId
                that.isAdmin = response.isAdmin
            }).catch(function (error) {
                that.isLogin = false
                console.log(error)
            })
    }
}
</script>

<style lang="less" scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 60px;
    background-color: rgb(240, 247, 255);



    .carousel-img {
        display: block;
        height: 100%;
        width: 100%;
    }

    .flex {
        display: flex;
        justify-content: space-evenly;
    }

    .intro {
        margin-top: 40px;
        text-align: center;
        position: relative;

        .intro-h2 {
            margin: 20px 0;
        }

        .intro-p {
            white-space: pre-line;
        }

        .update-or-delete {
            display: block;
            position: absolute;
            right: 50px;

            .icon-update {
                font-size: 20px;
                padding: 10px;
                border-radius: 50%;

                &:hover {
                    background-color: rgba(64, 158, 255, 0.5);
                }
            }

            .icon-delete {
                font-size: 20px;
                padding: 10px;
                border-radius: 50%;

                &:hover {
                    background-color: rgba(255, 0, 0, 0.5);
                }
            }
        }
    }

    .achievements {
        margin-top: 40px;
        text-align: center;

        h2 {
            margin: 20px 0;
        }

        .achievement-list {
            display: flex;
            // flex-wrap: wrap;
            justify-content: center;
            overflow-y: hidden;

            // 滚动条样式
            &::-webkit-scrollbar {
                width: 10px;
                height: 10px;
                /**/
            }

            &::-webkit-scrollbar-track {
                background: rgb(239, 239, 239);
                border-radius: 2px;
            }

            &::-webkit-scrollbar-thumb {
                background: #bfbfbf;
                border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: #333;
            }

            &::-webkit-scrollbar-corner {
                background: #179a16;
            }


            .achievement {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 200px;
                margin: 10px 20px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                border-radius: 10px;
                overflow: hidden;
                cursor: pointer;
                flex-basis: 200px;
                flex-shrink: 0;

                // &:hover {
                //     box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
                // }

                .achievement-img {
                    display: block;
                    width: 100%;
                    height: 100px;
                }

                .achievement-p {
                    width: 100%;
                    margin: 10px;
                    word-wrap: break-word;
                    text-align: center;
                    font-size: 17px;
                    font-weight: 700;
                }

            }
        }
    }

    .members {
        margin-top: 40px;
        text-align: center;

        h2 {
            margin: 20px 0;
        }

        .member-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;

            &::-webkit-scrollbar {
                width: 10px;
                height: 10px;
                /**/
            }

            &::-webkit-scrollbar-track {
                background: rgb(239, 239, 239);
                border-radius: 2px;
            }

            &::-webkit-scrollbar-thumb {
                background: #bfbfbf;
                border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: #333;
            }

            &::-webkit-scrollbar-corner {
                background: #179a16;
            }

            .member {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 150px;
                margin: 10px;
                padding: 20px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                border-radius: 30px;
                // overflow: hidden;
                cursor: pointer;

                // &:hover {
                //     box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
                // }

                .member-img {
                    display: block;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                }

                .member-h3 {
                    width: 100%;
                    word-wrap: break-word;
                    margin: 20px 0;

                }

            }
        }
    }



    /* 评论 */
    .comment-section {
        margin: 30px auto;
        max-width: 100%;

        .comment-form {
            margin-bottom: 20px;
        }

        .comment-list {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .comment {
                display: flex;
                gap: 20px;
                padding: 20px;
                border-radius: 10px;
                background-color: #f9f9f9;
                box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
                transition: box-shadow 0.3s ease-in-out;

                .avatar {
                    cursor: pointer;
                    img {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                    }
                }

                &:hover {
                    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1s);
                }

                .comment-content {
                    flex: 1;

                    .comment-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 10px;

                        .nickname {
                            cursor: pointer;
                            font-weight: bold;
                        }

                        .time {
                            font-size: 12px;
                            color: #999;
                        }
                    }
                }

                .content {
                    font-size: 14px;
                    color: #666;
                }

            }
        }

        .button-more-comment {
            display: block;
            margin-top: 10px;
            padding: 5px;
            border: 1px solid transparent;
            outline: none;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0);

            .showMore {
                display: inline-block;
                color: rgb(45, 100, 179);

                &:hover {
                    cursor: pointer;
                }
            }
        }
    }





}
</style>