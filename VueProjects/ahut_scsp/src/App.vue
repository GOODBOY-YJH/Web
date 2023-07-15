<template>
  <div id="app" class="app">
    <transition name="slide-left" mode="out-in">
      <router-view v-if="isRouterAlive"> </router-view>
    </transition>

  </div>
</template>

<script>
import Home from './views/Home.vue'
import LoginPage from './views/LoginPage.vue';
import Main from './views/Main.vue';
// import bianmaqi from './components/bianmaqi.vue'
export default {
  name: 'App',
  components: { Home, LoginPage, Main },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }

}
</script>

<!-- <style>
*{
  cursor: default;
}
</style> -->

<style lang="less" scoped>
.app {
  background-color: rgb(240, 247, 255);
  //min-width: 1300px;

  // 路由切换动画
  .slide-left-enter {
    opacity: 0;
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
  }

  .slide-left-enter-active {
    transition: all .5s ease;
  }

  .slide-left-leave-to {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
  }

  .slide-left-leave-active {
    transition: all .5s ease;
  }
}
</style>
