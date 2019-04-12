<template>
  <div class="account">
    <h1>This is an account profile page</h1>
    <el-container>
      <el-aside width="200px">
        <h3>个人资料</h3>
        {{accountName}}
        <img :src="photoUrl" width="150px">
        <el-button>关注</el-button>
      </el-aside>
      <el-main>
        <el-tabs>
          <el-tab-pane label="TA发布的" name="posts"></el-tab-pane>
          <el-tab-pane label="正在关注" name="watching"></el-tab-pane>
          <el-tab-pane label="关注TA的" name="watched"></el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    accountId: 0,
    accountName: 'admin',
    photoUrl: '',
    watching: [],
    watchedBy: []
  }),
  mount: () => {
    this.accountId = this.$route.params.labId
  },
  watch: {
    $route (to, from) {
      // react to route changes...
      this.accountId = this.$route.params.labId
    }
  }
}
</script>

<style>
</style>
