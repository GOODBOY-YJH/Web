<template>
  <el-container class="bgc">
    <el-header v-show="headerShow">
      <Header></Header>
    </el-header>
    <el-main>
      <transition name="slide-left" mode="out-in">
        <router-view />
      </transition>
    </el-main>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>

import Header from './Header.vue'
// import Main from './Main.vue'
import Footer from './Footer.vue'


export default {
  name: 'Home',
  components: { Header, Footer/*, Main */ },
  data() {
    return {
      headerShow: true
    }
  },
  methods: {
    // 设置了最小窗口宽度，这里不用监听了
    
    // 监听窗口大小，小于一定值的时候，导航栏消失
    listeningWindow() {
      // console.log(window.innerWidth);
      if (window.innerWidth < 800) {
        this.headerShow = false;
      } else {
        this.headerShow = true;
      }
    }
  },
  mounted() {
    //注册监听
    window.addEventListener('resize', this.listeningWindow)
    this.listeningWindow()
  },
  destroyed() {
    //移除监听
    window.removeEventListener('resize', this.listeningWindow)
  }

}
</script>

<style lang="less">
.bgc {
  background-color: rgb(240, 247, 255);
}


.el-container {
  .el-header {
    //min-width: 1300px;
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.3);
    z-index: 3;
  }

  .el-main {
    //min-width: 1300px;
    padding: 0;
    z-index: 2;
    min-height: 650px;
    // 路由切换动画
    .slide-left-enter {
      opacity: 0;
      // -webkit-transform: translate(30px, 0);
      // transform: translate(30px, 0);
    }

    .slide-left-enter-active {
      transition: all .5s ease;
    }

    .slide-left-leave-to {
      opacity: 0;
      // -webkit-transform: translate(-30px, 0);
      // transform: translate(-30px, 0);
    }

    .slide-left-leave-active {
      transition: all .5s ease;
    }
  }
  .el-footer{
    //min-width: 1300px;
    padding: 0;
  }
}
</style>