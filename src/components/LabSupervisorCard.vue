<template>
  <div class="lab-supervisor-card" style="margin: 20px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-container>
          <el-aside style="width: 100px">
            <el-image :src="userPicUrl"/>
          </el-aside>
          <el-main>
            <span v-if="supervisorInfo.title!==''">{{this.supervisorInfo.title + ' '}}</span>
            <span style="font-size: large">{{this.supervisorInfo.name}}</span>
            <el-container>
              <el-button v-if="supervisor.isUser" size="mini" @click="goToUserPage" type="text">个人资料</el-button>
            </el-container>
          </el-main>
        </el-container>
      </div>
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
    </el-card>
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
    // console.log('got supervisor')
    // console.log(this.supervisor)
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
          console.log('response')
          console.log(response)
          let name = bio.real_name === '' ? bio.nick_name : bio.real_name
          this.supervisorInfo.name = name
          this.supervisorInfo.school = bio.school
          this.supervisorInfo.department = bio.department
          this.supervisorInfo.title = bio.title
          this.supervisorInfo.picUrl = bio.pic_url
          this.supervisorInfo.contactEmail = email
          this.supervisorInfo.address = bio.school
          this.supervisorInfo.profile = bio.profile
          if (this.supervisorInfo.pic_url === '') {
            this.supervisorInfo.pic_url = require('@/assets/img/default-user-icon.png')
          }
        })
      }
      console.log(this.supervisorInfo)
    },
    goToUserPage () {
      this.$router.push('/user/' + this.supervisor.accountEmail)
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
