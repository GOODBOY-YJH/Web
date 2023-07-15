<template>
    <div class="team-page-body">
        <div class="search">
            <div class="search-bar">
                <div class="search-filters">
                    <el-select multiple v-model="collegeSelect" placeholder="学院" @focus="searchTeamCollege" @change="search"
                        :clearable="true">
                        <el-option v-for="(college, index) in colleges" :key="index" :label="college" :value="college" />
                    </el-select>
                    <el-select multiple v-model="teamTypeSelect" placeholder="团队类型" @focus="searchTeamType" @change="search"
                        :clearable="true">
                        <el-option v-for="(type, index) in teamTypes" :key="index" :label="type" :value="type" />
                    </el-select>
                    <div class="search-input">
                        <!--  @keyup.enter.native="search" 不用这种方式体验会更好 -->
                        <el-input v-model="keyword" placeholder="请输入关键词" suffix-icon="el-icon-search" @input="search"
                            :clearable="true">
                        </el-input>
                    </div>
                    <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
        </div>
        <div class="page-body">
            <DisplayBlock v-for="team in teamList" :key="team.id" :imageSrc="team.teamImage" :title="team.teamName"
                :description="team.teamIntroduction" :id="team.id" audit="1">
            </DisplayBlock>
            <!-- 用来美化卡片对齐 -->
            <i></i><i></i><i></i>
        </div>
        <div class="block">
            <!-- <span class="demonstration">页数较少时的效果</span> -->
            <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="totalCount"
                @current-change="currentChange" :hide-on-single-page="true">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import DisplayBlock from '../views/DisplayBlock';
export default {
    name: 'AuditTeamPageList',
    components: { DisplayBlock },
    data() {
        return {
            isLogin: false,
            userAdmin: false,
            colleges: ["计算机科学学院", "数学与统计学院", "物理与电子学院", "化学与材料学院", "其他"],
            teamTypes: ["校内实验室", "学生自发组队", "社团"],
            collegeSelect: null,
            teamTypeSelect: null,
            teamList: null, // 查询的数据列表
            keyword: null,  // 查询关键词
            // 分页数据信息
            pageIndex: 1,
            pageSize: 6,
            totalCount: 0
        }
    }, methods: {
        search() {
            // your search logic here
            this.searchTeamLisByPage();
        },
        searchTeamLisByPage() {
            let that = this;
            // 拼接请求数据
            let data = {
                page: this.pageIndex,
                length: this.pageSize,
                teamStatus: 'waiting'
            }
            if (that.keyword !== '' && that.keyword != null) {
                data.keyword = that.keyword
            }
            if (that.teamTypeSelect.length != 0 && that.teamTypeSelect != null) {
                data.teamTypes = that.teamTypeSelect
            }
            if (that.collegeSelect.length != 0 && that.collegeSelect != null) {
                data.colleges = that.collegeSelect
            }
            console.log(data)
            // 请求分页数据
            that.$ajax.post('/team/searchTeamLisByPage', data).then(function (response) {
                that.teamList = response.page.list
                that.totalCount = response.page.totalCount
                // console.log(that.teamList)
            }).catch(function (error) {
                console.log(error)
            })
        },
        currentChange(val) {
            this.pageIndex = val
            this.searchTeamLisByPage();
        },
        searchTeamCollege() {
            let that = this
            that.$ajax.get('/team/searchTeamCollege').then(function (response) {
                that.colleges = response.collegeList
            }).catch(function (error) {
                console.log(error)
            })
        },
        searchTeamType() {
            let that = this
            that.$ajax.get('/team/searchTeamType').then(function (response) {
                that.teamTypes = response.teamTypeList
            }).catch(function (error) {
                console.log(error)
            })
        }
    },
    async mounted() {
        let that = this
        await that.$ajax.get('/user/isLogin')
            .then(function (response) {
                console.log(response)
                that.isLogin = response.login
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
        this.searchTeamLisByPage();
    }
}
</script>

<style lang="less" scoped>
.team-page-body {
    // 内容宽度占整个页面的80%
    width: 80%;
    // 自己左右居中对齐
    margin: 0 auto;
    // 自己内部的元素上下居中对其
    text-align: center;

    // background-color: rgb(240, 247, 255);
    .search {
        .search-bar {
            margin-top: 100px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            // 背景色透明
            background: rgba(0, 0, 0, 0);
            padding: 16px 72px;


            .search-filters {
                width: 100%;
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


    .page-body {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;

        &>i {
            margin: 10px 10px;
            width: 300px;
        }
    }
}
</style>