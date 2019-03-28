<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu default-active="1" class="el-menu-demo" mode="horizontal" :router="true">
          <el-menu-item index="/">AcademicDealer</el-menu-item>
          <el-menu-item index="/timeline">推荐</el-menu-item>
          <el-menu-item index="/lab">实验室</el-menu-item>
          <el-menu-item index="/seminar">研讨会</el-menu-item>
          <el-menu-item index="/project">项目</el-menu-item>
          <el-menu-item index="/about">关于</el-menu-item>
          <el-menu-item>
            <el-input placeholder="搜索">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-menu-item>
          <el-menu-item index="/account">我的账户</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
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
</style>
