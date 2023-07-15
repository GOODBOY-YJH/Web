<template>
    <div class="display-block">
        <div class="display-image">
            <img :src="imageSrc" alt="">
        </div>
        <div class="display-info">
            <h3>{{ title }}</h3>
            <p class="description">{{ description }}</p>
            <div class="status">
                <p v-if="!isMe && teamType == '校内实验室'" class="school">校内实验室</p>
                <p v-if="!isMe && teamType == '社团'" class="team">学校社团</p>
                <p v-if="!isMe && teamType == '学生自发组队'" class="me">自主队伍</p>
                <p v-if="isMe && teamStatus == 'waiting'" class="waiting">待审核</p>
                <p v-if="isMe && teamStatus == 'active'" class="success">正常</p>
                <p v-if="isMe && teamStatus == 'error'" class="error">审核不通过</p>
                <el-button type="primary" @click="showDetail">详情</el-button>
            </div>

        </div>
    </div>
</template>


<script>
export default {
    name: 'DisplayBlock',
    data() {
        return {
            teamStatus: '',
            teamType: ''
            // props数据不许修改，如需修改，请将props数据复制一份到本地
        }
    },
    props: {
        id: {
            type: Number,
            default: -1
        },
        imageSrc: {
            type: String,
            default: require('../assets/image/ahut_1.jpg')
        },
        title: {
            type: String,
            default: '这个团队没有名字'
        },
        description: {
            type: String,
            default: '这个团队什么描述也没有'
        },
        audit: {
            type: String,
            default: -1
        },
        isMe: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        showDetail() {
            if (this.audit == "-1") {
                this.$router.push({
                    path: '/home/teamPage',
                    query: {
                        id: this.id, // 要携带竞赛团队id
                    }
                })
            } else {
                this.$router.push({
                    path: '/home/auditTeamPage',
                    query: {
                        id: this.id, // 要携带竞赛团队id
                    }
                })
            }
        }
    },
    mounted() {
        // 查看团队状态和类型并显示
        let that = this
        that.$ajax.get(`/team/getTeamStatusById?teamId=${that.id}`)
            .then(function (response) {
                that.teamStatus = response.status
                that.teamType = response.teamType
            }).catch(function (error) {
                console.log(error)
            })

    }
}
</script>
  
<style lang="less" scoped>
.display-block {
    display: flex;
    margin: 10px 10px;
    width: 300px;
    height: 400px;
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
    cursor: pointer;
    position: relative;

    &:hover {
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
    }

    .display-image {
        width: 100%;
        height: 200px;
        background-color: #f5f5f5;
        overflow: hidden;
        position: relative;

        img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .display-info {
        padding: 20px;
        background-color: #fff;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 200px;
        box-sizing: border-box;
        text-align: center;

        .status {
            position: relative;

            .school {
                position: absolute;
                top: 8px;
                left: 3px;
                padding: 3px;
                border-radius: 3px;
                background-color: rgba(255, 215, 0, 0.5);
            }

            .team {
                position: absolute;
                top: 8px;
                left: 3px;
                padding: 3px;
                border-radius: 3px;
                background-color: rgba(204, 255, 102, 0.5);
            }

            .me {
                position: absolute;
                top: 8px;
                left: 3px;
                padding: 3px;
                border-radius: 3px;
                background-color: rgba(255, 204, 153, 0.5);
            }

            .waiting {
                position: absolute;
                top: 6px;
                left: 5px;
                background-color: rgba(255, 255, 102, 0.5);
                border-radius: 8px;
                padding: 3px;
            }

            .success {
                position: absolute;
                top: 6px;
                left: 5px;
                background-color: rgba(153, 255, 153, 0.5);
                border-radius: 8px;
                padding: 3px;
            }

            .error {
                position: absolute;
                top: 6px;
                left: 5px;
                background-color: rgba(255, 0, 51, 0.5);
                border-radius: 8px;
                padding: 3px;
            }

            .el-button {
                border-radius: 10px;
            }
        }

        h3 {
            font-size: 20px;
            margin-bottom: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .description {
            font-size: 14px;
            color: #666;
            line-height: 1.55;
            height: 90px;
            overflow: hidden;
            display: -webkit-box; //作为弹性伸缩盒子模型显示。
            -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
            text-overflow: ellipsis;
            -webkit-line-clamp: 4; //显示的行
        }
    }
}
</style>
