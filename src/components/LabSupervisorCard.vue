<template>
  <div class="lab-supervisor-card">
    <el-container>
      <el-aside style="width: 100px">
        <el-image :src="userPicUrl"/>
      </el-aside>
      <el-main>
        <span v-if="this.supervisorInfo.title!==''">{{this.supervisorInfo.title + ' '}}</span>
        <span>{{this.supervisorInfo.name}}</span>
        <el-button v-if="supervisorInfo.isUser" size="mini" @click="goToUserPage" type="text">个人资料</el-button>
      </el-main>
    </el-container>
    <el-form size="medium">
      <el-form-item v-if="supervisorInfo.school!==''" style="margin-bottom: 0px" label="学校">
        <span>{{supervisorInfo.school}}</span>
      </el-form-item>
      <el-form-item v-if="supervisorInfo.department!==''" style="margin-bottom: 0px" label="院系">
        <span>{{supervisorInfo.department}}</span>
      </el-form-item>
      <el-form-item v-if="supervisorInfo.address!==''" style="margin-bottom: 0px" label="地址">
        <span>{{supervisorInfo.address}}</span>
      </el-form-item>
      <el-form-item v-if="supervisorInfo.contactEmail!==''" style="margin-bottom: 0px;" label="邮箱">
        <span>{{supervisorInfo.contactEmail}}</span>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="简介">
        <VueShowdown :markdown="supervisorInfo.profile"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
@import "~simplemde/dist/simplemde.min.css";
</style>

<script>
import { requestUserInfo } from '@/utils.js'

export default {
  props: ['supervisor'],
  data: () => ({
    supervisorInfo: {
      isUser: false,
      name: '',
      school: '',
      department: '',
      title: '',
      picUrl: '',
      accountEmail: '',
      contactEmail: '',
      address: '',
      profile: ''
    }
  }),
  mounted: function () {
    if (this.supervisor.isUser) {
      this.requestInfo()
    } else {
      this.loadInfo()
    }
  },
  watch: {
    supervisor: function () {
      if (this.supervisor.isUser) {
        this.requestInfo()
      } else {
        this.loadInfo()
      }
    }
  },
  methods: {
    requestInfo () {
      // supervisor is user, need to request
      let email = this.supervisor.accountEmail
      if (email !== undefined && email !== '') {
        requestUserInfo(email, response => {
          let bio = response.bio
          this.supervisorInfo.name = bio.real_name
          this.supervisorInfo.school = bio.school
          this.supervisorInfo.department = bio.department
          this.supervisor.title = bio.title
          this.supervisor.picUrl = bio.pic_url
          this.supervisor.contactEmail = email
          this.supervisorInfo.address = bio.school
          this.supervisorInfo.profile = bio.profile
          if (this.supervisorInfo.pic_url === '') {
            this.userInfo.pic_url = require('@/assets/img/default-user-icon.png')
          }
        })
      }
    },
    goToUserPage () {
      this.$router.push('/user/' + this.supervisorInfo.accountEmail)
    },
    loadInfo () {
      // supervisor is not user
      // directly bind from property supervisor
      this.supervisorInfo = this.supervisor
    }
  },
  computed: {
    userPicUrl () {
      if (this.supervisorInfo.picUrl !== '') {
        return this.supervisorInfo.picUrl
      } else {
        return require('@/assets/img/default-user-icon.png')
      }
    }
  }
}
</script>
