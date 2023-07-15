<template>
    <el-menu :default-active="index" class="no-border" mode="horizontal" router collapse-transition text-color="#303133"
        @select="handleSelect">
        <img src="../assets/image/logo_blue_1.png" alt="">
        <el-menu-item index="/home/main">
            <i class="el-icon-menu"></i>
            <span class="font-style">首页</span>
        </el-menu-item>
        <el-menu-item v-if="showItems.showTeamPageList" index="/home/teamPageList">
            <i class="el-icon-s-cooperation"></i>
            <span class="font-style">竞赛团队</span>
        </el-menu-item>
        <el-menu-item v-show="showItems.showForum" index="/home/forum">
            <i class="el-icon-s-comment"></i>
            <span class="font-style">论坛</span>
        </el-menu-item>
        <el-menu-item v-show="isLogin && showItems.showAddTeam" index="/home/addTeam">
            <i class="el-icon-circle-plus"></i>
            <span class="font-style">创建团队</span>
        </el-menu-item>
        <el-menu-item v-if="isAdmin == 'admin' && showItems.showAduit" index="/home/auditTeamPageList">
            <span class="font-style">审核</span>
        </el-menu-item>
        <el-menu-item v-if="isAdmin == 'admin' && showItems.showUserAdmin" index="/home/userManagement">
            <span class="font-style">用户管理</span>
        </el-menu-item>
        <el-menu-item v-show="showItems.showMore" index="">
            <span class="font-style">···</span>
        </el-menu-item>
        <el-menu-item index="/login" class="login font-style" v-if="!isLogin">
            <i class="el-icon-user-solid"></i>
            登陆
        </el-menu-item>
        <el-submenu v-show="isLogin && showItems.showMe" class="logout font-style" index="/showMe">
            <template slot="title">
                <i class="el-icon-user-solid"></i>
                我的
            </template>
            <el-menu-item @click="toUserInfo()" index="/showMe">个人信息</el-menu-item>
            <el-menu-item @click="updatePassword()" index="/showMe">修改密码</el-menu-item>
            <el-menu-item @click="toMain()" index="/showMe">退出登陆</el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            index: '/home/main',
            isLogin: false,
            isAdmin: '',
            showItems: {
                showTeamPageList: true,
                showForum: true,
                showAddTeam: true,
                showMe: true,
                showAduit: true,
                showUserAdmin: true,
                showMore: false,
            }
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        // 设置了最小窗口宽度，这里不用监听了
        
        // listeningWindow() {
        //     console.log(window.innerWidth);
        //     if (window.innerWidth < 900) {
        //         this.showItems.showTeamPageList = false;
        //         this.showItems.showForum = false;
        //         this.showItems.showAddTeam = false;
        //         this.showItems.showAduit = false;
        //         this.showItems.showUserAdmin = false;
        //         this.showItems.showMore = true;
        //     } else if (window.innerWidth < 1000) {
        //         this.showItems.showTeamPageList = true;
        //         this.showItems.showForum = false;
        //         this.showItems.showAddTeam = false;
        //         this.showItems.showAduit = false;
        //         this.showItems.showUserAdmin = false;
        //         this.showItems.showMore = true;
        //     } else if (window.innerWidth < 1150) {
        //         this.showItems.showTeamPageList = true;
        //         this.showItems.showForum = true;
        //         this.showItems.showAddTeam = false;
        //         this.showItems.showAduit = false
        //         this.showItems.showUserAdmin = false;
        //         this.showItems.showMore = true;
        //     }else if (window.innerWidth < 1230) {
        //         this.showItems.showTeamPageList = true;
        //         this.showItems.showForum = true;
        //         this.showItems.showAddTeam = true;
        //         this.showItems.showAduit = false;
        //         this.showItems.showUserAdmin = false;
        //         this.showItems.showMore = true;
        //     } else if (window.innerWidth < 1285){
        //         this.showItems.showTeamPageList = true;
        //         this.showItems.showForum = true;
        //         this.showItems.showAddTeam = true;
        //         this.showItems.showAduit = true;
        //         this.showItems.showUserAdmin = false;
        //         this.showItems.showMore = true;
        //     }else {
        //         this.showItems.showTeamPageList = true;
        //         this.showItems.showForum = true;
        //         this.showItems.showAddTeam = true;
        //         this.showItems.showAduit = true;
        //         this.showItems.showUserAdmin = true;
        //         this.showItems.showMore = false;
        //     }
        // },
        toUserInfo() {
            this.$router.push({
                path: '/home/userInfo',
                query: {
                    // id: m.id, // 要携带竞赛团队id
                    // title: m.title
                }
            })
        },
        updatePassword() {
            this.$router.push({
                path: '/home/updatePassword',
                query: {
                    // id: m.id, // 要携带竞赛团队id
                    // title: m.title
                }
            })
        },
        toUserTeamPageList() {
            this.$router.push({
                path: '/home/teamPageList',
                query: {
                    // id: m.id, // 要携带竞赛团队id
                    // title: m.title
                }
            })
        },
        toUserForum() {
            this.$router.push({
                path: '/home/forum',
                query: {
                    // id: m.id, // 要携带用户id
                    // title: m.title
                }
            })
        },
        toMain() {
            let that = this
            that.$ajax.get('/user/outLogin')
                .then(function (response) {
                    that.isLogin = false
                    // 手动移除自己放置的token
                    localStorage.removeItem('token');
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: "退出成功",
                        type: 'success'
                    })
                    that.$router.replace({
                        path: '/home/main',

                    })
                }).catch(function (error) {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: "退出失败",
                        type: 'error'
                    })
                })

        }

    },
    beforeMount() {
        let that = this
        that.$ajax.get('/user/isLogin')
            .then(function (response) {
                that.isLogin = response.login
                that.isAdmin = response.isAdmin
            }).catch(function (error) {
                that.isLogin = false
            })
        // 检查是否登陆，标志登陆
        // console.log('beforeMount')
    },
    mounted() {
        //注册监听
        // window.addEventListener('resize', this.listeningWindow)
        // this.listeningWindow()
        this.index = this.$route.path;
    },
    destroyed() {
        //移除监听
        // window.removeEventListener('resize', this.listeningWindow)
    }
}
</script>


<style scoped lang="less">
.el-menu {

    min-width: 1300px;
    background: #00000000;
    color: black;
    font-size: 14px;
    height: 100%;
    width: 90%;
    margin: 0 auto;

    img {
        height: 100%;
        float: left;
    }

    .font-style {
        font-size: 17px;
        font-weight: 700;
        font-family: Arial, Helvetica, "Microsoft Yahei", sans-serif;
    }

    img {
        margin-right: 40px;
    }

    .login,
    .logout {
        float: right;
        margin-right: 20px;
    }

    i {
        color: black;
    }
}

.el-menu .no-border {
    min-width: 1200px;
    border-bottom-style: none;
}


// // 控制台copy出来的控制鼠标悬停和选中时，菜单背景颜色
// .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
// .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
// .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
//     background-color: rgb(3, 62, 128);
// }

// .el-menu--horizontal>.el-submenu:focus,
// .el-menu--horizontal>.el-submenu:hover {
//     background-color: rgb(3, 62, 128);
// }

// .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
//     background-color: rgb(3, 62, 128);
// }
</style>

<style lang="less">
/* 我的 菜单栏悬停之后的样式 不在scoped才生效 */
.el-menu--horizontal .el-menu {
    min-width: 150px;
    border-radius: 15px;
    overflow: hidden;
    text-align: center;
    font-weight: 500;
}
</style>