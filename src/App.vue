<template>
  <div id="app">
    <el-container>
      <el-header class="stick-top">
        <el-menu :default-active="activeLink" mode="horizontal" @select="handleSelect">
          <el-menu-item index="/">AcademicDealer</el-menu-item>
          <el-menu-item index="/timeline">推荐</el-menu-item>
          <el-menu-item index="/search">搜索</el-menu-item>
          <el-menu-item v-if="loggedIn" index="/post">发布新信息</el-menu-item>
          <el-menu-item v-if="!loggedIn" index="login" style="float:right;">
            <el-button @click="goToLoginPage" type="text">登录</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="goToRegisterPage" type="text">注册</el-button>
          </el-menu-item>
          <el-submenu v-if="loggedIn" index="userHomePage" style="float:right;">
            <template slot="title">
              <el-image class="user-icon" :src="userPicUrl" fit="cover">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </template>
            <el-menu-item index="userHomePage">账户主页</el-menu-item>
            <el-menu-item index="logout">登出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-main class="main-container">
        <router-view/>
      </el-main>
      <el-footer>
        <router-link to="/about">关于我们</router-link>
        <el-divider direction="vertical"></el-divider>
        <router-link to="/feedback">问题反馈</router-link>
        <el-divider direction="vertical"></el-divider>GitHub Repository:
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

<style>
  body {
    background-image: url(" assets/img/background.jpg ");
  }
</style>

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
  width: 100%;
  max-width: 1000px;
  margin-top: 45px;
  margin-left: auto;
  margin-right: auto;
}
.el-footer {
  margin: auto;
}
.user-icon {
  width: 30px;
  height: 30px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>

<script>
import { requestUserInfo } from '@/utils.js'

export default {
  data () {
    return {
      activeLink: '1',
      userPicUrl: ''
    }
  },
  mounted () {
    this.activeLink = this.$route.path
  },
  computed: {
    loggedIn () {
      return this.$store.state.loggedIn
    },
    userHomePage () {
      return '/user/' + this.$store.state.userEmail
    }
  },
  watch: {
    $route (newVal, oldVal) {
      this.activeLink = newVal.path
    },
    loggedIn () {
      if (this.loggedIn) {
        requestUserInfo(this.$store.state.userEmail, response => {
          this.userPicUrl = response.bio.pic_url
          if (this.userPicUrl === '') {
            this.userPicUrl = require('@/assets/img/default-user-icon.png')
          }
        })
      }
    }
  },
  methods: {
    goToLoginPage () {
      this.$router.push('/login')
    },
    goToRegisterPage () {
      this.$router.push('/register')
    },
    handleSelect (key, keyPath) {
      if (key === 'login') {
        return
      }
      if (key === 'logout') {
        this.$store.commit('logout')
        this.$router.push('/')
        return
      }
      if (key === 'userHomePage') {
        if (this.loggedIn) {
          this.$router.push(this.userHomePage)
        }
        return
      }
      this.$router.push(key)
    }
  }
}
</script>
