<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu :default-active="activeLink" class="el-menu-demo" mode="horizontal" :router="true">
          <el-menu-item index="/">AcademicDealer</el-menu-item>
          <el-menu-item index="/timeline">推荐</el-menu-item>
          <el-menu-item index="/lab">实验室</el-menu-item>
          <el-menu-item index="/seminar">研讨会</el-menu-item>
          <el-menu-item index="/project">项目</el-menu-item>
          <el-menu-item>
            <el-input placeholder="搜索">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-menu-item>
          <el-submenu index="/account">
            <template slot="title">我的账户</template>
            <el-menu-item index="/account">主页</el-menu-item>
            <el-menu-item index="/account/notifications">通知</el-menu-item>
            <el-menu-item index="/account/settings">设置</el-menu-item>
            <el-menu-item index="/account/logout">登出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-main>
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

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
el-footer {
  text-align: center;
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
  }
}
</script>
