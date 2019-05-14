<template>
  <div class="user-icon-with-popup">
    <el-popover placement="top">
      <div>
        <span class="user-profile-title">{{userInfo.nick_name}}</span>
        <el-button size="mini" @click="goToUserPage" type="text">个人资料</el-button>
      </div>
      <el-form size="mini">
        <el-form-item v-if="this.userInfo.real_name!==''" style="margin-bottom: 0px" label="姓名">
          <span>{{this.userInfo.real_name}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;" label="邮箱">
          <span>{{this.user}}</span>
        </el-form-item>
        <el-form-item v-if="this.userInfo.school!==''" style="margin-bottom: 0px;" label="学校">
          <span>{{this.userInfo.school}}</span>
        </el-form-item>
        <el-form-item v-if="this.userInfo.department!==''" style="margin-bottom: 0px;" label="院系">
          <span>{{this.userInfo.department}}</span>
        </el-form-item>
      </el-form>
      <el-image slot="reference" class="user-icon" :src="userInfo.pic_url"></el-image>
    </el-popover>
  </div>
</template>

<style scoped>
.user-icon {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-right: 2px;
  margin-left: 2px;
  border: 1px;
  border-radius: 0px;
}
.user-profile-title {
  font-family: "Avenir", sans-serif, Helvetica, Arial;
  font-size: medium;
  font-weight: bold;
  margin-right: 5px;
}
.el-form-item--mini .el-form-item__label {
  line-height: 1.4;
  font-size: small;
}
.el-form-item--mini .el-form-item__content {
  line-height: 1.4;
  font-size: small;
}
.el-form-item {
  font-family: "Avenir", sans-serif, Helvetica, Arial;
  font-size: small;
}
</style>

<script>
import { requestUserInfo } from '@/utils.js'

export default {
  props: ['user'],
  data: () => ({
    userInfo: {
      nick_name: '',
      pic_url: '',
      school: '',
      department: '',
      title: '',
      enrollment_date: '2000-01-01',
      labs: [],
      projects: [],
      seminars: [],
      comments: [],
      profile: ''
    }
  }),
  mounted: function () {
    this.requestInfo()
  },
  watch: {
    user: function () {
      this.requestInfo()
    }
  },
  methods: {
    requestInfo () {
      if (this.user !== undefined && this.user !== '') {
        requestUserInfo(this.user, response => {
          this.userInfo = response.bio
          if (this.userInfo.pic_url === '') {
            this.userInfo.pic_url = require('@/assets/img/default-user-icon.png')
          }
        })
      }
    },
    goToUserPage () {
      this.$router.push('/user/' + this.user)
    }
  }
}
</script>
