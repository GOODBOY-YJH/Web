<template>
    <div>
        <el-carousel :height="bannerHeight + 'px'" arrow="never">
            <el-carousel-item v-for="(item, index) in 3" :key="index">
                <img ref="bannerHeight" :src="images[index]" @load="imgLoad">
            </el-carousel-item>
        </el-carousel>
        <div class="main">
            <div class="introduction">
                <div class="header">
                    <h1 class="title">学科竞赛平台</h1>
                    <p class="subtitle">为您打造优秀的竞赛体验</p>
                </div>
                <div class="content">
                    <p class="text">
                        学科竞赛平台是一个面向学生、教师和学校的综合性学科竞赛信息平台，涵盖各种学科竞赛，提供丰富的竞赛资源和服务。
                    </p>
                    <p class="text">我们致力于为广大竞赛爱好者提供更好的竞赛体验和支持，为学校和教师提供更便捷的竞赛管理和指导。</p>
                    <p class="text">在我们的平台上，您可以轻松查找各类竞赛信息，参与不同类型的竞赛活动。</p>
                    <p class="text">
                        获取相关资料和知识，与其他竞赛爱好者交流互动，提升自己的竞赛能力和素质。
                    </p>
                    <p class="text">我们将竭诚为您提供全面、高效、贴心的服务，让您在学科竞赛的道路上更加顺畅。</p>
                </div>
            </div>
        </div>
    </div>
</template>
  
  
<script>
export default {
    name: 'Main',
    data() {
        return {
            images: [require('../assets/image/ahut_1.jpg'), require('../assets/image/ahut_2.jpg'), require('../assets/image/ahut_3.jpg')],
            bannerHeight: ""
        }
    },
    methods: {
        // handleSelect(index) {
        //     console.log(index)
        // },
        imgLoad() {
            this.$nextTick(() => {
                // window.innerWidth 浏览器宽度
                this.bannerHeight = this.$refs.bannerHeight[0].width * 3 / 8
            })
        },
        listeningWindowWidth() {
            this.bannerHeight = this.$refs.bannerHeight[0].width * 3 / 8
        }
    },
    mounted() {
        this.imgLoad();
        // 监控屏幕大小变化
        window.addEventListener('resize', this.listeningWindowWidth)
        this.imgLoad();
    },
    destroyed() {
        // 销毁屏幕大小监控
        window.removeEventListener('resize', this.listeningWindowWidth);
    },

}
</script>

<style lang="less" scoped>
.main {
    // 内容宽度占整个页面的90%
    width: 90%;
    // 自己左右居中对齐
    margin: 0 auto;
    // 自己内部的元素上下居中对其
    text-align: center;

    .introduction {
        max-width: 90%;
        margin: 0 auto;
        // padding: 80px 40px;
        text-align: center;

        .header {
            margin-bottom: 40px;

            .title {
                font-size: 60px;
                font-weight: bold;
                // margin-bottom: 20px;
                color: #0081FF;
                text-shadow: 2px 2px #D9D9D9;
            }

            .subtitle {
                font-size: 24px;
                font-weight: bold;
                // margin-bottom: 20px;
                color: #666;
            }
        }

        .content {
            .text {
                font-size: 20px;
                line-height: 1.8;
                 margin-bottom: 40px;
                color: #333;
            }
        }
    }
}
.el-carousel__item {

    // 轮播图图片铺满背景
    img {
        height: 100%;
        width: 100%;
    }
}
</style>