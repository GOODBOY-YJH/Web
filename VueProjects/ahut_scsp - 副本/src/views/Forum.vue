<template>
    <div ref="scrollContainer" class="forum-page">
        <h2>工大小论坛</h2>
        <div class="search">
            <div class="search-bar">
                <div class="search-filters">
                    <el-select v-model="sortType" placeholder="排序" @change="search" :clearable="true">
                        <el-option v-for="(type, index) in teamTypes" :key="index" :label="type" :value="type" />
                    </el-select>
                    <div class="search-input">
                        <el-input v-model="keyword" placeholder="请输入关键词" suffix-icon="el-icon-search"
                            @keyup.enter.native="search">
                        </el-input>
                    </div>
                    <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
        </div>
        <el-row type="flex">
            <el-col :xs="23" :sm="23" :md="20" :lg="18" :xl="16" v-for="post in posts" :key="post.id" class="forum-card">
                <el-card class="box-card">
                    <div class="forum-card-header">
                        <h3 class="forum-card-title">{{ post.title }}</h3>
                    </div>
                    <div class="forum-card-content">
                        <p class="forum-card-description">{{ post.description }}</p>
                    </div>
                    <div class="forum-card-footer">
                        <el-button @click="toPost(post.id)" class="forum-card-btn" icon="el-icon-view">查看详情</el-button>
                        <el-button @click="toPost(post.id)" class="forum-card-btn" icon="el-icon-chat-dot-round">{{
                            post.comments }} 条评论</el-button>
                        <el-button @click="addLikes(post)" class="forum-card-btn" icon="el-icon-thumb">{{ post.likes
                        }}赞</el-button>
                    </div>
                    <div class="create-time">{{ post.createTime }}</div>
                </el-card>
            </el-col>
        </el-row>
        <div class="block">
            <!-- <span class="demonstration">页数较少时的效果</span> -->
            <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="totalCount"
                @current-change="currentChange" :hide-on-single-page="true">
            </el-pagination>
        </div>
        <div @click="addPost()" class="post-put">
            <i class="el-icon-edit-outline"></i>
            发布
        </div>
    </div>
</template>
  
<script>


export default {
    name: "Forum",
    data() {
        return {
            isLogin: false,
            keyword: '',
            sortType: '',
            teamTypes: ["按时间排序", "按热度排序"],
            page: 1,
            pageSize: 5,
            totalCount: 0,
            posts: [
                // {
                //     id: 1,
                //     title: '  第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息第一篇论坛消息',
                //     description: '      这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。这是第一篇论坛消息的描述。',
                //     comments: 5,
                //     likes: 10,
                // },
                // {
                //     id: 2,
                //     title: '第二篇论坛消息',
                //     description: '这是第二篇论坛消息的描述。',
                //     comments: 2,
                //     likes: 8,
                // },
                // {
                //     id: 3,
                //     title: '第三篇论坛消息',
                //     description: '这是第三篇论坛消息的描述。',
                //     comments: 0,
                //     likes: 3,
                // }
            ],
        };
    },
    methods: {
        search() {
            this.searchPostByPage();
        },
        searchPostByPage() {
            let that = this

            let type = ''
            if (this.sortType == "按时间排序") {
                type = 'time'
            } else if (this.sortType == "按热度排序") {
                type = 'likes'
            } else {
                // 默认按时间排序
                type = 'time'
            }
            let data = {
                page: this.page,
                length: this.pageSize,
                keyword: this.keyword,
                sortType: type,
            }

            that.$ajax.post('/post/searchPostByPage', data)
                .then(function (response) {
                    that.posts = response.page.list
                    that.totalCount = response.page.totalCount
                }).catch(function (error) {
                    console.log("出错了")
                })

        },
        toPost(id) {
            this.$router.push({
                path: '/home/post',
                query: {
                    id: id, // 要携带竞赛团队id
                }
            })
        },
        async addLikes(post) {
            let that = this
            if (this.isLogin) {
                let isLike = false
                // 查询是否已经点赞
                // 因为axios默认是异步的，所以使用了await语法
                await that.$ajax.get(`/post/checkLikes?postId=${post.id}`)
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
                        postId: post.id
                    }
                    that.$ajax.post("/post/addLike", data)
                        .then(function (response) {
                            post.likes = response.likes
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
        addPost() {
            this.$router.push({
                path: '/home/addPost'
            })
        },
        currentChange(val) {
            this.page = val
            this.searchPostByPage()
        }
    },
    beforeMount() {
        let that = this
        that.$ajax.get('/user/isLogin')
            .then(function (response) {
                that.isLogin = response.login
            }).catch(function (error) {
                that.isLogin = false
            })
        // 检查是否登陆，标志登陆
        // console.log('beforeMount')
    },
    mounted() {
        this.searchPostByPage();

    }
};
</script>
  
<style lang="less" scoped>
.app {
    position: relative;
}

.forum-page {
    width: 80%;
    margin: 0 auto;
    padding-top: 100px;
    background-color: rgb(240, 247, 255);
    text-align: center;

    h2 {
        text-align: center;
    }

    .post-put {
        position: fixed;
        display: flex;
        height: 50px;
        width: 50px;
        top: 200px;
        right: 10%;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        background-color: rgb(64, 158, 255);
        border-radius: 5px;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);

        &:hover {
            cursor: pointer;
        }
    }

    .search {
        margin: 20px;

        .search-bar {
            display: flex;
            align-items: center;
            justify-content: space-around;
            // 背景色透明
            background: rgba(0, 0, 0, 0);
            padding: 16px 72px;


            .search-filters {
                width: 90%;
                display: flex;
                align-items: center;

                .search-input {
                    flex: 1;
                    margin-left: 50px;
                }

                .el-select {
                    width: 120px;
                    margin-right: 16px;
                }

                .el-input__inner {
                    border: none;
                    border-radius: 4px;
                    background-color: #f9f9f9;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                }

                .el-input__suffix {
                    font-size: 20px;
                }

                .el-button {
                    border: none;
                    border-radius: 4px;
                    background-color: #409eff;
                    color: #fff;
                    font-size: 14px;
                    height: 38px;
                    padding: 0 16px;
                }

                .block {
                    .el-pagination {
                        background-color: rgb(0, 0, 0, 0);
                    }

                    // opacity: 1;
                }
            }
        }

    }


    .el-row {
        justify-content: space-around;
        flex-wrap: wrap;

        .forum-card {
            margin-top: 10px;
            margin-bottom: 5px;

            .box-card {
                background-color: #fff;
                box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s;
                border-radius: 10px;

                .create-time{
                    float: right;
                    margin-bottom: 10px;
                    margin-right: 10px;
                }
                .forum-card-header {
                    padding: 20px;
                    background-color: #4A4A4A;
                    border-top-right-radius: 10px;
                    border-top-left-radius: 10px;
                    max-height: 60px;



                    .forum-card-title {
                        font-size: 24px;
                        color: #fff;
                        margin: 0;
                        // 设置div为弹性伸缩盒子模型。
                        display: -webkit-box;
                        // 超出部分隐藏
                        overflow: hidden;
                        // 设置水平布局还是垂直布局
                        -webkit-box-orient: vertical;
                        // 可以把块容器中的内容限制为指定的行数。
                        -webkit-line-clamp: 1;
                    }

                }

                .forum-card-content {
                    padding: 20px;
                    border-bottom: 1px solid #ebebeb;

                    .forum-card-description {
                        font-size: 16px;
                        color: #666;
                        margin: 0;
                        // 设置div为弹性伸缩盒子模型。
                        display: -webkit-box;
                        // 超出部分隐藏
                        overflow: hidden;
                        // 设置水平布局还是垂直布局
                        -webkit-box-orient: vertical;
                        // 可以把块容器中的内容限制为指定的行数。
                        -webkit-line-clamp: 3;
                        white-space: pre-wrap;
                    }
                }

                .forum-card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom-right-radius: 10px;
                    border-bottom-left-radius: 10px;

                    .forum-card-btn {
                        color: #666;
                        font-size: 16px;
                        padding: 0;
                        border: none;
                    }

                    .forum-card-btn:hover {
                        color: #4A4A4A;
                    }

                    .forum-card-btn .el-icon {
                        font-size: 16px;
                        margin-right: 5px;
                    }
                }
            }

            .box-card:hover {
                transform: translateY(-5px);
            }
        }
    }

}
</style>