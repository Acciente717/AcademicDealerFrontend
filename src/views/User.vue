<template>
  <div class="account">
    <el-card class="box-card" shadow="never" style="margin-bottom:10px;">
      <el-container style="height:140px;">
        <el-aside width="133px" style="height:133px;" class="user-icon">
          <el-image style="width:130px; height: 130px;" :src="bio.pic_url" fit="cover"></el-image>
        </el-aside>
        <el-main style="padding-top:0px">
          <div style="font-size:large;">
            <b>{{this.bio.nick_name}}的个人资料</b>
            <el-button
              v-if="isOwner"
              type="text"
              @click="goToEditTab"
              style="padding-top:8px; padding-bottom:8px; padding-left: 8px;"
            >编辑个人资料</el-button>
            <el-button
              v-if="canFollow"
              type="text"
              @click="followUser"
              style="padding-top:8px; padding-bottom:8px; padding-left: 8px;"
            >关注</el-button>
            <el-button
              v-if="canUnfollow"
              type="text"
              @click="unfollowUser"
              style="padding-top:8px; padding-bottom:8px; padding-left: 8px;"
            >取消关注</el-button>
          </div>
          <el-form size="mini">
            <el-form-item v-if="this.bio.real_name!==''" style="margin-bottom: 0px" label="姓名">
              <span>{{this.bio.real_name}}</span>
            </el-form-item>
            <el-form-item style="margin-bottom: 0px;" label="邮箱">
              <span>{{this.userEmail}}</span>
            </el-form-item>
            <el-form-item v-if="this.bio.school!==''" style="margin-bottom: 0px;" label="学校">
              <span>{{this.bio.school}}</span>
            </el-form-item>
            <el-form-item v-if="this.bio.department!==''" style="margin-bottom: 0px;" label="院系">
              <span>{{this.bio.department}}</span>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-card>
    <el-card class="box-card" shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="个人简介" name="profile">
          <VueShowdown :markdown="bio.profile" flavor="github" :options="{ emoji: true }"/>
        </el-tab-pane>
        <el-tab-pane label="TA发布的" name="posts">
          <search-result-list
            :userEmail="userEmail"
            userType="owner"
            :searchLab="true"
            :searchProject="true"
            :searchSeminar="true"
            :searchOutdated="true"
          />
        </el-tab-pane>
        <el-tab-pane label="TA参与的" name="joining">
          <search-result-list
            :userEmail="userEmail"
            userType="attender"
            :searchLab="true"
            :searchProject="true"
            :searchSeminar="true"
            :searchOutdated="true"
          />
        </el-tab-pane>
        <el-tab-pane label="TA关注的" name="following">
          <div v-for="email in bio.follows" :key="email">
            <user-icon-with-popup :user="email" style="width:75px; height: 75px;"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关注TA的" name="followed">
          <div v-for="email in bio.follow_by" :key="email">
            <user-icon-with-popup :user="email" style="width:75px; height: 75px;"/>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="isOwner" label="编辑个人资料" name="edit">
          <el-form ref="form" :model="bio" label-width="80px" status-icon>
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="bio.real_name"></el-input>
            </el-form-item>
            <el-form-item label="头像URL" prop="picUrl">
              <el-input v-model="bio.pic_url" placeholder="本网站太菜了，不支持上传头像"></el-input>
            </el-form-item>
            <el-form-item label="学校" prop="school">
              <el-input v-model="bio.school"></el-input>
            </el-form-item>
            <el-form-item label="院系" prop="department">
              <el-input v-model="bio.department"></el-input>
            </el-form-item>
            <el-form-item label="学位/职称" prop="title">
              <el-input v-model="bio.title" placeholder="本科/硕士/博士/副教授/教授等"></el-input>
            </el-form-item>
            <el-form-item label="个人简介" prop="profile">
              <markdown-editor
                v-model="bio.profile"
                :configs="markdownConfigs"
                ref="markdownEditor"
              ></markdown-editor>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleUserEdit">确认修改</el-button>
              <el-button type="danger" @click="handleUserDelete">删除用户</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
@import "~simplemde/dist/simplemde.min.css";
.user-icon {
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.el-form-item--mini .el-form-item__label {
  line-height: 1.4;
  font-size: medium;
}
.el-form-item--mini .el-form-item__content {
  line-height: 1.4;
  font-size: medium;
}
.el-form-item {
  font-family: "Avenir", sans-serif, Helvetica, Arial;
  font-size: medium;
}
</style>

<script>
import axios from 'axios'
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import { requestUserInfo } from '@/utils.js'
import SearchResultList from '@/components/SearchResultList.vue'
import UserIconWithPopup from '@/components/UserIconWithPopup.vue'

export default {
  components: {
    markdownEditor,
    SearchResultList,
    UserIconWithPopup
  },
  data: () => ({
    bio: {
      real_name: '',
      nick_name: '',
      pic_url: '',
      school: '',
      department: '',
      title: '',
      enrollment_date: '2000-01-01',
      follow_by: [],
      follows: [],
      labs: [],
      projects_create: [],
      projects_attend: [],
      seminars_create: [],
      seminars_attend: [],
      comments: [],
      profile: ''
    },
    markdownConfigs: {
      spellChecker: false,
      toolbar: [
        'bold',
        'italic',
        'strikethrough',
        'horizontal-rule',
        'heading-1',
        'heading-2',
        'heading-3',
        'code',
        'quote',
        'unordered-list',
        'ordered-list',
        'clean-block',
        'link',
        'image',
        'table'
      ]
    },
    activeTab: 'profile'
  }),
  computed: {
    userEmail () {
      return this.$route.params.email
    },
    isOwner () {
      return this.userEmail === this.$store.state.userEmail
    },
    canFollow () {
      return (
        this.$store.state.loggedIn &&
        this.userEmail !== this.$store.state.userEmail &&
        this.bio.follow_by.indexOf(this.$store.state.userEmail) === -1
      )
    },
    canUnfollow () {
      return (
        this.$store.state.loggedIn &&
        this.userEmail !== this.$store.state.userEmail &&
        this.bio.follow_by.indexOf(this.$store.state.userEmail) !== -1
      )
    }
  },
  mounted: function () {
    this.handleUserInfoChange()
  },
  watch: {
    $route (to, from) {
      this.handleUserInfoChange()
    }
  },
  methods: {
    handleUserInfoChange () {
      // console.log('requesting info from' + this.userEmail)
      requestUserInfo(this.userEmail, this.handleUserInfoResponse, {
        requestLab: true,
        requestSeminar: true,
        requestProject: true,
        requestComment: true
      })
    },
    handleUserInfoResponse (response) {
      console.log(response)
      let statusCode = response.status
      if (statusCode !== 0) {
        this.$message.error(
          '应用内部错误：错误码：' + statusCode + '，请联系开发人员'
        )
      } else {
        this.bio = response.bio

        if (this.bio.pic_url === '') {
          this.bio.pic_url = require('@/assets/img/default-user-icon.png')
        }
        if (this.bio.profile === '') {
          this.bio.profile = '这位用户非常懒，目前还什么都没有写~'
        }
      }
    },
    goToEditTab () {
      this.activeTab = 'edit'
    },
    handleUserEdit () {
      if (!this.$store.state.loggedIn) {
        this.$message.error('没有登录却尝试编辑用户信息？！')
        return
      }
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'account',
        content: {
          action: 'edit',
          data: this.bio
        }
      }
      axios
        .post(this.$store.state.serverUrl + '/users/edit/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          let statusCode = response.data.content.data.status
          if (statusCode !== 0) {
            this.$message.error(
              '应用内部错误，错误码：' + statusCode + '，请联系开发人员'
            )
          } else {
            this.handleUserInfoChange()
            this.$message.info('个人资料修改成功！')
          }
        })
    },
    handleUserDelete () {
      this.$confirm('此操作将永久删除此账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let request = {
            dir: 'request',
            signature: {
              is_user: true,
              user_email: this.$store.state.userEmail,
              password_hash: this.$store.state.passwordHash
            },
            content_type: 'account',
            content: {
              action: 'delete',
              data: {}
            }
          }
          axios
            .post(this.$store.state.serverUrl + '/users/delete/', request, {
              headers: {
                'Content-Type': 'text/plain'
              }
            })
            .then(response => {
              let statusCode = response.data.content.data.status
              if (statusCode !== 0) {
                this.$message.error(
                  '应用内部错误，错误码：' + statusCode + '，请联系开发人员'
                )
              } else {
                this.$message.info('删除账户成功')
                this.$store.commit('logout')
                this.$router.push('/')
              }
            })
        })
        .catch(() => {})
    },
    followUser () {
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'account',
        content: {
          action: 'follow',
          data: {
            person: this.userEmail
          }
        }
      }
      console.log(request)
      axios
        .post(this.$store.state.serverUrl + '/users/follow/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          let statusCode = response.data.content.data.status
          if (statusCode !== 0) {
            this.$message.error(
              '应用内部错误，错误码：' + statusCode + '，请联系开发人员'
            )
          } else {
            this.$message.info('关注账户成功')
            this.handleUserInfoChange()
          }
        })
    },
    unfollowUser () {
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'account',
        content: {
          action: 'unfollow',
          data: {
            person: this.userEmail
          }
        }
      }
      axios
        .post(this.$store.state.serverUrl + '/users/unfollow/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          let statusCode = response.data.content.data.status
          if (statusCode !== 0) {
            this.$message.error(
              '应用内部错误，错误码：' + statusCode + '，请联系开发人员'
            )
          } else {
            this.$message.info('取消关注账户成功')
            this.handleUserInfoChange()
          }
        })
    }
  }
}
</script>

<style>
</style>
