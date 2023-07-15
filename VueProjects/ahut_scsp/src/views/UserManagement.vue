<template>
    <div class="userManager">
        <h3 class="title">用户列表</h3>
        <div class="search-filters">
            <div class="search-input">
                <el-input v-model="keyword" placeholder="请输入关键词" suffix-icon="el-icon-search" @keyup.enter.native="searchUserLisByPage" @clear="searchUserLisByPage"
                    :clearable="true">
                </el-input>
            </div>
            <el-button type="primary" @click="searchUserLisByPage" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table :data="users" style="width: 100%">
            <el-table-column label="用户名" width="auto">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除用户</el-button>
                    <el-button v-if="scope.row.userType != 'admin'" size="mini" type="primary"
                        @click="setAdmin(scope.row.id)">设置为管理员</el-button>
                    <el-button v-if="scope.row.userType == 'admin'" size="mini" type="danger"
                        @click="setUser(scope.row.id)">取消管理员</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <!-- <span class="demonstration">页数较少时的效果</span> -->
            <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="totalCount"
                @current-change="currentChange" :hide-on-single-page="true">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserManagement',
    data() {
        return {
            userId: -1,
            isLogin: false,
            userAdmin: false,
            pageIndex: 1,
            pageSize: 8,
            keyword: '',
            totalCount: 0,
            users: [
                // {
                //     id: 1,
                //     name: '王小虎',
                //     userType: ''
                // },
            ]
        }
    },
    methods: {
        currentChange(val) {
            this.pageIndex = val
            this.searchUserLisByPage();
        },
        handleEdit(id) {
            this.$router.push({
                path: '/home/userInfoUpdate',
                query: {
                    id: id
                }
            })
        },
        handleDelete(id) {
            let that = this
            that.$ajax.post('/user/deleteUserById', {
                userId: id
            }).then(function (response) {
                if (response.rows == 1) {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: "删除成功",
                        type: "success"
                    })
                    that.searchUserLisByPage()
                } else {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: "删除失败",
                        type: "error"
                    })
                }
            }).catch(function (error) {
                console.log(error)
            })

        },
        setAdmin(id) {
            let that = this
            that.$ajax.post('/user/changeUserType', {
                userId: id,
                type: 'admin'
            }).then(function (response) {
                if (response.rows == 1) {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: "修改成功",
                        type: "success"
                    })
                    that.searchUserLisByPage()
                } else {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: "修改失败",
                        type: "error"
                    })
                }
            }).catch(function (error) {
                console.log(error)
            })

        },
        setUser(id) {
            let that = this
            that.$ajax.post('/user/changeUserType', {
                userId: id,
                type: 'user'
            }).then(function (response) {
                if (response.rows == 1) {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: "修改成功",
                        type: "success"
                    })
                    that.searchUserLisByPage()
                } else {
                    that.$message({
                        duration: 1000,
                        showClose: true,
                        message: "修改失败",
                        type: "error"
                    })
                }
            }).catch(function (error) {
                console.log(error)
            })

        },
        searchUserLisByPage() {
            let that = this
            let data = {
                page: that.pageIndex,
                length: that.pageSize,
            }
            if (that.keyword !== '' && that.keyword != null) {
                data.keyword = that.keyword
            }
            that.$ajax.post('/user/searchUserListByPage', data).then(function (response) {
                that.users = response.page.list.filter(item => item.id != that.userId)
                that.totalCount = response.page.totalCount
            }).catch(function (error) {
                console.log(error)
            })
        }
    },
    async mounted() {
        let that = this
        await that.$ajax.get('/user/isLogin')
            .then(function (response) {
                that.isLogin = response.login
                that.userId = response.userId
                that.userAdmin = response.isAdmin == 'admin'
            }).catch(function (error) {
                that.isLogin = false
                console.log(error)
            })
        if (!that.isLogin) {
            that.$message({
                duration: 1000,
                showClose: true,
                message: "请先登录",
                type: "warning"
            })
            that.$router.replace({
                path: '/login',
            })
        }
        if (!that.userAdmin) {
            that.$message({
                duration: 1000,
                showClose: true,
                message: "您不是管理员",
                type: "warning"
            })
            that.$router.replace({
                path: '/home/teamPageList',
            })
        }
        this.searchUserLisByPage()
    }
}
</script>

<style lang="less" scoped>
.userManager {
    width: 80%;
    margin: 0 auto;
    margin-top: 80px;
    text-align: center;

    .search-filters {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .search-input {
            flex: 1;
            // margin-left: 50px;
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

    .title {
        margin-bottom: 10px;
    }

    .block {
        margin: 10px;

        .el-pagination {
            background-color: rgba(0, 0, 0, 0);
        }

        // opacity: 1;
    }
}
</style>