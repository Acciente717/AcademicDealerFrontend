<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-edit"></i> 发布实验室信息
        </span>
        <PostFormLab/>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-edit"></i> 发布研讨会信息
        </span>
        发布信息
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-edit"></i> 发布合作项目信息
        </span>
        发布信息
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
</style>

<style scoped>
@import "~simplemde/dist/simplemde.min.css";
</style>

<script>
// import axios from 'axios'
import PostFormLab from '@/components/PostFormLab.vue'

export default {
  components: {
    PostFormLab
  },
  mounted: function () {
    this.checkLoginState()
  },
  watch: {
    $route (to, from) {
      this.checkLoginState()
    }
  },
  methods: {
    checkLoginState () {
      if (!this.$store.state.loggedIn) {
        this.$confirm('发布信息需要登录，是否现在登录？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info'
        })
          .then(() => {
            this.$router.push('/login')
          })
          .catch(() => {
            this.$router.go(-1)
          })
      }
    }
  }
}
</script>
