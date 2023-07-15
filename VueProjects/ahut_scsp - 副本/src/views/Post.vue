<template>
    <div class="page">
        <!-- 判断是自己的post才显示 -->
        <div v-if="userId == postUserd || isAdmin == 'admin'" class="update-or-delete">
            <i title="编辑" @click="updatePost" class="el-icon-edit icon-update"></i>
            <i title="删除" @click="deletePost" class="el-icon-delete icon-delete"></i>
        </div>
        <div class="post">
            <h1>{{ title }}</h1>
            <div class="content">{{ content }}</div>
            <div class="create-time">{{ createTime }}</div>
        </div>
        <el-divider></el-divider>
        <div class="likes">
            <i @click="addLikes" title="点赞" class="el-icon-thumb icon-likes"></i>
            <p>{{ commentLikes }}</p>
        </div>
        <h2>评论</h2>
        <el-form class="comment-form" :model="commentForm" :rules="commentRules" ref="commentForm">
            <el-form-item label="评论内容" prop="content">
                <el-input v-model="commentForm.content" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitComment">发表评论</el-button>
            </el-form-item>
        </el-form>
        <div class="comment-list">

            <div v-for="(comment, comment_index) in comments" :key="comment.id" class="comment-item">
                <div class="comment-header">
                    <img @click="toUserInfo(comment.userId)" class="avatar" :src="comment.avatar" alt="">
                    <span @click="toUserInfo(comment.userId)" class="name">{{ comment.name }}</span>
                    <span class="right">{{ comment.time }}</span>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
                <button class="reply-count button-reply" @click="clickReply(comment);">
                    <!-- (' + comment.replies.length + ') -->
                    <!-- <button class="button-reply"> -->
                    <i class="el-icon-chat-round"></i>
                    回复
                    <!-- </button> -->
                </button>
                <div class="reply-form" v-if="comment.showReply">
                    <el-form :model="replyForm" :rules="replyRules" ref="replyForm">
                        <el-form-item label="回复内容" prop="content">
                            <el-input v-model="replyForm.content" type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitReplyComment(comment, comment_index)">回复</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="slide-fade">
                    <div class="reply-list" v-if="comment.replies.length > 0">
                        <div v-for="(reply, reply_index) in comment.replies" :key="reply.id" class="reply-item">
                            <div class="reply-header">
                                <img @click="toUserInfo(reply.userId)" class="avatar" :src="reply.avatar" alt="">
                                <span @click="toUserInfo(reply.userId)" class="name">{{ reply.name }}</span>
                                <i v-if="reply.receiveUserName" class="el-icon-caret-right"></i>
                                <span v-if="reply.receiveUserName" class="avatar" @click="toUserInfo(reply.receiveUserId)">{{
                                    reply.receiveUserName }}</span>
                                <span class="right">{{ reply.time }}</span>
                            </div>
                            <div class="reply-content">{{ reply.content }}</div>
                            <button class="reply-count button-reply" @click="clickReply(comment, reply_index);">
                                <!-- (' + comment.replies.length + ') -->
                                <!-- <button class="button-reply"> -->
                                <i class="el-icon-chat-round"></i>
                                回复
                                <!-- </button> -->
                            </button>
                            <div class="reply-form" v-if="comment.replies[reply_index].showReply">
                                <el-form :model="replyForm" :rules="replyRules" ref="replyForm">
                                    <el-form-item label="回复内容" prop="content">
                                        <el-input v-model="replyForm.content" type="textarea"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary"
                                            @click="submitReplyCommentReplay(comment, comment_index, reply_index)">回复</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>

                        <button class="more-replies button-more-reply"
                            v-show="comment && comment.replies && comment.replies.length < comment.replyTotalCount">
                            还有{{ comment.replyTotalCount - comment.replies.length }}条回复，<p class="showMore"
                                @click="showMoreReplies(comment)">点击查看</p>
                        </button>
                    </div>
                </div>
            </div>
            <button class="button-more-comment" v-show="comments && comments.length < commentTotalCount">
                还有{{ commentTotalCount - comments.length }}条回复，<p class="showMore" @click="showMoreComment()">点击查看</p>
            </button>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'CommentPage',
    props: {
        id: {
            // 路由传参只能是字符串，这里用String
            type: String,
            default: "-1"
        }
    },
    data() {
        return {
            isLogin: false,
            isAdmin: '',
            userId: -1,
            postId: parseInt(this.id),
            postUserd: 0,
            title: '您很有想法，但是请不要随意操作啦',
            content: '谢谢啦',
            createTime: '',
            commentForm: {
                content: ''
            },
            commentRules: {
                content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }]
            },
            replyForm: {
                content: ''
            },
            replyRules: {
                content: [{ required: true, message: '请输入回复内容', trigger: 'blur' }]
            },
            // 每次点击加载更多时，上传的数据，然后继续加载一部分回复数据
            // 当前加载了多少pageSize代表每次加载几条
            commentPageSize: 3,
            // 帖子评论总数
            commentTotalCount: 0,
            // 帖子点赞数量
            commentLikes: 0,
            comments: [
                // {
                //     id: 1,
                //     userId: 1,
                //     name: '小明',
                //     avatar: '',
                //     content: '这个页面写的真好啊！',
                //     time: '2023-04-24 12:34:56',
                //     replies: [
                //         // {
                //         //     id: 1,
                //         //     userId,
                //         //     name: '小红',
                //         //     avatar: '',
                //         //     receiveUserId: 1,
                //         //     receiveUserName: '',
                //         //     content: '是啊，我也觉得写的不错！',
                //         //     time: '2023-04-24 13:00:00',
                //         //     showReply: false,
                //         // }
                //     ],
                //     showReply: false,
                //     // 每次点击加载更多时，上传的数据，然后继续加载一部分回复数据
                //     // 当前加载了多少replyPageSize代表每次加载几条
                //     replyPageSize: 3,
                //     // 每一条评论回复的信息总条数
                //     replyTotalCount: 0,
                // },
            ]
        }
    },
    methods: {
        submitComment() {
            let that = this
            if (that.isLogin) {
                this.$refs.commentForm.validate(valid => {
                    let data = {
                        postId: that.postId,
                        content: that.commentForm.content
                    }
                    if (valid) {
                        that.$ajax.post('/post/addComment', data)
                            .then(function (response) {
                                that.$message({
                                    duration: 1000,
                                    showClose: true,
                                    message: '评论成功',
                                    type: 'success'
                                })
                                // 返回刚评论的那条信息，然后放在最上面
                                // console.log(response)
                                that.comments.unshift(response.newComment)
                            }).catch(function (error) {
                                console.log(error)
                                that.$message({
                                    duration: 1000,
                                    showClose: true,
                                    message: '评论失败',
                                    type: 'error'
                                })
                            })
                        this.commentForm.content = ''
                    }
                })
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
        clickReply(comment, reply_index) {
            if (reply_index != undefined) {
                //  记录当前回复框状态
                let status = comment.replies[reply_index].showReply
                // 关闭其他回复窗
                this.comments.forEach(comment => {
                    comment.showReply = false
                    if (comment.replies.length > 0) {
                        comment.replies.forEach(reply => reply.showReply = false);
                    }
                })
                // 反转当前回复框
                comment.replies[reply_index].showReply = !status
                // console.log("我执行了",comment.replies[reply_index].showReply)
            } else {
                // 记录当前回复框状态
                let status = comment.showReply
                // 关闭其他回复窗
                this.comments.forEach(comment => {
                    comment.showReply = false
                    if (comment.replies.length > 0) {
                        comment.replies.forEach(reply => reply.showReply = false);
                    }
                })
                // 反转当前回复框
                comment.showReply = !status
            }
            this.replyForm.content = ''
            // console.log(comment, reply_index)
        },
        // 回复一级评论
        submitReplyComment(comment, comment_index, reply_index) {
            let that = this
            if (that.isLogin) {
                this.$refs.replyForm[0].validate(valid => {
                    let data = {
                        postId: that.postId,
                        primerId: comment.id,
                        content: that.replyForm.content
                    }
                    if (valid) {
                        that.$ajax.post('/post/addCommentReply', data)
                            .then(function (response) {
                                that.$message({
                                    duration: 1000,
                                    showClose: true,
                                    message: '评论成功',
                                    type: 'success'
                                })
                                // 返回刚评论的那条信息，然后放在最上面
                                comment.replies.unshift(response.newReply)
                            }).catch(function (error) {
                                that.$message({
                                    duration: 1000,
                                    showClose: true,
                                    message: '评论失败',
                                    type: 'error'
                                })
                            })
                        this.replyForm.content = ''
                        if (reply_index != undefined) {
                            this.comments[comment_index].replies[reply_index].showReply = false;
                        } else {
                            this.comments[comment_index].showReply = false;
                        }
                    }
                })
            } else {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    message: '请先登录',
                    type: 'warning'
                })
            }
        },
        // 回复二级评论
        submitReplyCommentReplay(comment, comment_index, reply_index) {
            let that = this
            if (that.isLogin) {
                this.$refs.replyForm[0].validate(valid => {
                    let data = {
                        postId: that.postId,
                        primerId: comment.id,
                        receiveUserId: comment.userId,
                        content: that.replyForm.content
                    }
                    if (valid) {
                        that.$ajax.post('/post/addCommentReply', data)
                            .then(function (response) {
                                that.$message({
                                    duration: 1000,
                                    showClose: true,
                                    message: '评论成功',
                                    type: 'success'
                                })
                                // 返回刚评论的那条信息，然后放在最上面

                                that.searchCommentInfo();
                            }).catch(function (error) {
                                that.$message({
                                    duration: 1000,
                                    showClose: true,
                                    message: '评论失败',
                                    type: 'error'
                                })
                            })
                        this.replyForm.content = ''
                        if (reply_index != undefined) {
                            this.comments[comment_index].replies[reply_index].showReply = false;
                        } else {
                            this.comments[comment_index].showReply = false;
                        }
                    }
                })
            } else {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    message: '请先登录',
                    type: 'warning'
                })
            }
        },
        showMoreComment() {
            // 查询回复,每次查询比上一次多3条
            let that = this
            let data = {
                start: that.comments.length,
                commentPageSize: this.commentPageSize,
                postId: this.postId
            }
            that.$ajax.post('/post/searchMoreComments', data)
                .then(function (response) {
                    // console.log(response)
                    that.comments.push(...response.comments)
                    that.commentPageSize = response.commentPageSize;
                }).catch(function (error) {
                    console.log(error)
                })
        },
        showMoreReplies(comment) {
            // 查询回复,每次查询比上一次多3条
            let that = this
            let data = {
                start: comment.replies.length,
                replyPage: comment.replyPage,
                replyPageSize: comment.replyPageSize,
                postId: this.postId,
                commentId: comment.id
            }
            that.$ajax.post('/post/searchMoreReplies', data)
                .then(function (response) {
                    comment.replies.push(...response.replies)
                    // console.log(response)
                    comment.replyPageSize = response.replyPageSize
                }).catch(function (error) {
                    console.log(error)
                })
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
                        // console.log("postInfoById")
                        that.postUserd = response.postInfo.postUserd
                        that.title = response.postInfo.title
                        that.content = response.postInfo.content
                        that.createTime = response.postInfo.createTime
                        // console.log(response)
                    }).catch(function (error) {
                        console.log("postInfoById出错了", error)
                    })
            }
        },

        searchCommentInfo() {
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
                that.$ajax.get(`/post/commentInfoByPostId?id=${that.postId}`)
                    .then(function (response) {
                        that.comments = response.commentInfo.comments
                        that.commentPageSize = response.commentInfo.commentPageSize
                        that.commentTotalCount = response.commentInfo.commentTotalCount
                        that.commentLikes = response.commentInfo.likes
                        // console.log(response)
                    }).catch(function (error) {
                        console.log("postInfoById出错了")
                    })
            }
        },
        async addLikes() {
            let that = this
            if (this.isLogin) {
                let isLike = false
                // 查询是否已经点赞
                // 因为axios默认是异步的，所以使用了await语法
                await that.$ajax.get(`/post/checkLikes?postId=${that.postId}`)
                    .then(function (response) {
                        isLike = response.isLike
                    }).catch(function (error) {
                        that.$message({
                            duration: 1000,
                            showClose: true,
                            message: '点赞错误',
                            type: 'error'
                        })
                        console.log(error)
                    })
                // 没有点赞则点赞，点完赞则输出
                if (!isLike) {
                    let data = {
                        postId: this.postId
                    }
                    that.$ajax.post("/post/addLike", data)
                        .then(function (response) {
                            that.commentLikes = response.likes
                        }).catch(function (error) {
                            console.log("点赞失败")
                        })
                } else {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '您已经点过赞了',
                        type: 'success'
                    })
                }
            } else {
                that.$message({
                    duration: 1000,
                    showClose: true,
                    message: '请先登陆',
                    type: 'warning'
                })
            }
        },
        updatePost() {
            let that = this
            that.$router.push({
                path: '/home/updatePost',
                query: { id: that.postId }
            })
        },
        deletePost() {
            this.$confirm('此操作将永久删除该帖子, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let that = this
                that.$ajax.delete(`/post/deletePostById?postId=${that.postId}`)
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
                                path: '/home/forum'
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
        document.documentElement.scrollTop = 0
        let that = this
        that.$ajax.get(`/post/isPostDelete?postId=${that.postId}`)
            .then(function (response) {
                if (response.isDelete == 'yes') {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '帖子已被删除',
                        type: 'warning'
                    })
                    that.$router.replace({
                        path: '/home/forum'
                    })
                } else if (response.isDelete == null) {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: '帖子不存在',
                        type: 'warning'
                    })
                    that.$router.replace({
                        path: '/home/forum'
                    })
                } else {
                    that.searchPostInfo();
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
                    path: '/home/forum'
                })
                console.log(error)
            })
        // 判断是否登陆
        that.$ajax.get('/user/isLogin')
            .then(function (response) {
                that.isLogin = response.login
                that.userId = response.userId
                that.isAdmin = response.isAdmin
            }).catch(function (error) {
                that.isLogin = false
            })
    }

}
</script>

<style lang="less" scoped>
.page {
    padding: 20px;
    font-size: 16px;
    width: 80%;
    margin: 0 auto;
    margin-top: 70px;
    position: relative;

    .update-or-delete {
        display: block;
        float: right;
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

    .likes {
        display: block;
        position: absolute;
        right: 70px;
        text-align: center;
        cursor: default;

        .icon-likes {
            font-size: 20px;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;

            &:hover {
                background-color: rgba(64, 158, 255, 0.5);
            }
        }
    }

    .post {
        h1 {
            text-align: center;
        }

        .content {
            margin: 20px 200px;
            line-height: 1.5;
            // 换行正常打印
            white-space: pre-line;
        }

        .create-time {
            float: right;
            margin-top: 10px;
            margin-right: 10px;
        }
    }

    .comment-form {
        margin-top: 20px;
    }

    .comment-list {

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

        .right {
            float: right;
        }

        img {
            width: 25px;
            height: 25px;
            vertical-align: middle;
        }


        .button-reply {
            display: block;
            margin-left: auto;
            padding: 5px;
            border: 1px solid transparent;
            outline: none;
            border-radius: 5px;
            background-color: rgb(240, 247, 255);

            &:hover {
                background-color: rgba(64, 158, 255, 0.1);
            }

        }

        .comment-item {
            margin-top: 10px;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 15px;



            .comment-header {
                // display: flex;
                justify-content: space-between;
                align-items: center;
                line-height: 25px;

                .avatar {
                    cursor: pointer;
                }

                .name {
                    cursor: pointer;
                    margin-left: 10px;
                }
            }

            .comment-content {
                margin-top: 10px;
                margin-left: 35px;
            }

            .reply-count {
                text-align: right;
                margin-right: 20px;
            }

            .reply-list {
                padding-left: 50px;

                .reply-item {
                    margin-top: 10px;
                    padding: 10px;
                    border: 1px solid #eee;
                    border-radius: 15px;

                    .reply-header {
                        line-height: 25px;

                        .avatar {
                            cursor: pointer;
                        }

                        .name {
                            cursor: pointer;
                            margin-left: 10px;
                        }
                    }

                    .reply-content {
                        margin-top: 10px;
                        margin-left: 35px;
                    }
                }

                .more-replies {
                    margin-top: 10px;
                }

                .button-more-reply {
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

            .reply-form {
                margin-top: 5px;
                margin-left: 50px;

                .el-form-item {
                    text-align: left;
                }
            }
        }
    }
}



// .slide-fade-enter-active {
//     transition: all .3s ease;
// }

// .slide-fade-leave-active {
//     transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
// }

// .slide-fade-enter,
// .slide-fade-leave-to {
//     transform: translateX(10px);
//     opacity: 0;
// }



.comment-name {
    font-weight: bold;
    margin-right: 10px;
}

.comment-time {
    color: #666;
}



.comment-reply {
    margin-top: 10px;
}



.reply-name {
    font-weight: bold;
    margin-right: 10px;
}

.reply-time {
    color: #666;
}


.show-more {
    color: #42b983;
    cursor: pointer;
    margin-top: 10px;
}
</style>
  