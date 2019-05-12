<template>
  <div class="account">
    <el-card class="box-card" shadow="never" style="margin-bottom:10px;">
      <h3>个人资料</h3>
      {{userEmail}}
      <img :src="photoUrl" width="150px">
      <el-button>关注</el-button>
    </el-card>
    <el-card class="box-card" shadow="never">
      <el-tabs>
        <el-tab-pane label="个人资料" name="profile"></el-tab-pane>
        <el-tab-pane label="TA发布的" name="posts"></el-tab-pane>
        <el-tab-pane label="正在关注" name="watching"></el-tab-pane>
        <el-tab-pane label="关注TA的" name="watched"></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    photoUrl: '',
    watching: [],
    watchedBy: []
  }),
  computed: {
    userEmail () {
      return this.$route.params.email
    },
    isOwner () {
      return this.userEmail === this.$store.state.userEmail
    }
  },
  mount: () => {
    this.handleUserEmailChange()
  },
  watch: {
    userEmail () {
      this.handleUserEmailChange()
    }
  },
  methods: {
    handleUserEmailChange () {
      console.log(this.userEmail)
    }
  }
}
</script>

<style>
</style>
