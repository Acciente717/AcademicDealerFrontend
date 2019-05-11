<template>
  <div id="app">
    <el-container>
      <el-header class="stick-top">
        <el-menu :default-active="activeLink" mode="horizontal" :router="true">
          <el-menu-item index="/">AcademicDealer</el-menu-item>
          <el-menu-item index="/timeline">推荐</el-menu-item>
          <el-menu-item index="/search">搜索</el-menu-item>
          <el-menu-item :index="userHomePage">
            <div v-if="loggedIn">我的账户</div>
            <div v-if="!loggedIn">
              <el-button @click="goToLoginPage">登录</el-button>
            </div>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="main-container">
        <router-view/>
      </el-main>
      <el-footer>
        <router-link to="/about">关于我们</router-link>&nbsp;|
        <router-link to="/feedback">问题反馈</router-link>&nbsp;| GitHub Page:
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Acciente717/AcademicDealerFrontend"
        >Frontend</a>&nbsp;
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Acciente717/AcademicDealerBackend"
        >Backend</a>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
#app {
  font-family: "Avenir", sans-serif, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.stick-top {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: white;
  z-index: 999;
}
.main-container {
  display: block;
  margin: 45px 1% 0 1%;
}
</style>

<script>
export default {
  data () {
    return {
      activeLink: '1'
    }
  },
  mounted () {
    this.activeLink = this.$route.path
  },
  watch: {
    $route (newVal, oldVal) {
      this.activeLink = newVal.path
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.loggedIn
    },
    userHomePage () {
      if (this.loggedIn) {
        return '/account/' + this.$store.state.emailHash
      } else {
        return '/login'
      }
    }
  },
  methods: {
    goToLoginPage () {
      this.$router.push('/login')
    }
  }
}
</script>
