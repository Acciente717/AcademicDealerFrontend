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
          <div v-if="bio.projects_create.length > 0">
            <summary-card-project
              v-for="projectId in bio.projects_create"
              :key="projectId"
              :id="projectId"
            />
          </div>
          <div v-if="bio.projects_create.length === 0">这位用户还没有发布过什么东西~</div>
        </el-tab-pane>
        <el-tab-pane label="TA参与的" name="joining">
          <div v-if="bio.projects_attend.length > 0">
          <summary-card-project
            v-for="projectId in bio.projects_attend"
            :key="projectId"
            :id="projectId"
          /></div>
          <div v-if="bio.projects_attend.length === 0">这位用户还没有参与过什么活动~</div>
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
import SummaryCardProject from '@/components/SummaryCardProject.vue'

export default {
  components: {
    markdownEditor,
    SummaryCardProject
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
      console.log('requesting info from' + this.userEmail)
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
    }
  }
}
</script>

<style>
</style>
