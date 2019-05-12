<template>
  <div class="account">
    <el-card class="box-card" shadow="never" style="margin-bottom:10px;">
      <el-container>
        <el-aside width="133px" class="user-icon">
          <el-image style="width:130px; height: 130px;" :src="bio.pic_url" fit="cover"></el-image>
        </el-aside>
        <el-main>
          <el-row v-if="bio.real_name != ''">姓名：{{bio.real_name}}</el-row>
          <el-row>
            昵称：{{bio.nick_name}}
            <el-divider direction="vertical"></el-divider>
            邮箱：{{userEmail}}
          </el-row>
          <el-row v-if="bio.school != ''">
            {{bio.school}}
            <el-divider direction="vertical"></el-divider>
            {{bio.department}}
            <el-divider direction="vertical"></el-divider>
            {{bio.title}}
          </el-row>
        </el-main>
      </el-container>
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

<style scoped>
.user-icon {
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>

<script>
import axios from 'axios'

export default {
  data: () => ({
    bio: {
      real_name: '',
      nick_name: '',
      pic_url: '',
      school: '',
      department: '',
      title: '',
      enrollment_date: '',
      labs: [],
      projects: [],
      seminars: [],
      comments: [],
      profile: ''
    },
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
  mounted: function () {
    this.handleUserEmailChange()
  },
  watch: {
    $route (to, from) {
      this.handleUserEmailChange()
    }
  },
  methods: {
    handleUserEmailChange () {
      console.log(this.userEmail)

      // Send request to get the latest user information
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'account',
        content: {
          action: 'view',
          data: {
            lab: true,
            project: true,
            seminar: true,
            comment: true
          }
        }
      }

      axios
        .post(this.$store.state.serverUrl + '/users/view/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          this.handleResponse(response)
        })
    },
    handleResponse (response) {
      console.log(response)
      let statusCode = response.data.content.data.status
      if (statusCode !== 0) {
        this.$message.error(
          '应用内部错误：错误码：' + statusCode + '，请联系开发人员'
        )
      } else {
        this.bio = response.data.content.data.bio

        if (this.bio.pic_url === '') {
          this.bio.pic_url = require('@/assets/img/default-user-icon.png')
        }
      }
    }
  }
}
</script>

<style>
</style>
