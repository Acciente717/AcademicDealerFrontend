<template>
  <div class="project">
    <el-card class="box-card" shadow="never" style="margin-bottom:10px;">
      <el-container style="height:80px;">
        <el-aside width="75px" style="height:75px;" class="user-icon">
          <user-icon-with-popup style="width:75px; height: 75px;" :user="info.owner"/>
        </el-aside>
        <el-main style="padding-top:0px">
          <div style="font-size:large;">
            <b>{{this.info.name}}</b>
            <el-button
              v-if="isOwner"
              type="text"
              style="padding-top:8px; padding-bottom:8px; padding-left: 8px;"
              @click="onEditPage"
            >编辑项目信息</el-button>
          </div>
          <el-form size="mini">
            <el-form-item style="margin-bottom: 0px" label="需要人数">
              <span>{{this.info.member_total_need}}</span>
            </el-form-item>
            <el-form-item style="margin-bottom: 0px;" label="起止时间">
              <span>
                <i class="el-icon-date"></i>
                {{dateRange}}
              </span>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
      <div v-if="!isEditing">
        <el-divider>
          已参加成员
          <span v-if="isJoinable">
            <el-button type="text" @click="onJoinProject">加入项目</el-button>
          </span>
          <span v-if="isDroppable">
            <el-button type="text" @click="onDropProject">退出项目</el-button>
          </span>
        </el-divider>
        <div style="display:flex">
          <span v-for="member in info.current_members" :key="member">
            <user-icon-with-popup style="width:40px; height:40px" :user="member"/>
          </span>
        </div>
        <el-divider>项目简介</el-divider>
        <VueShowdown :markdown="info.description"/>
        <el-divider>讨论区</el-divider>
      </div>
      <div v-if="isEditing">
        <el-divider>编辑项目信息</el-divider>
        <el-form ref="projectForm" :model="info" :rules="rules" label-width="120px" status-icon>
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="info.name"></el-input>
          </el-form-item>
          <el-form-item label="需要人数" prop="member_total_need">
            <el-input-number v-model="info.member_total_need" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="info.date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateSelect"
            ></el-date-picker>
          </el-form-item>
          <el-divider content-position="center">项目描述支持Markdown格式</el-divider>
          <el-form-item label="项目描述" prop="description">
            <markdown-editor
              v-model="info.description"
              :configs="markdownConfigs"
              ref="markdownEditor"
            ></markdown-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onFinishEditPage">完成编辑</el-button>
            <el-button type="danger" @click="onDeleteProject">删除项目</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
@import "~simplemde/dist/simplemde.min.css";
</style>

<script>
import { requestProjectInfo, dateToYMD } from '@/utils.js'
import UserIconWithPopup from '@/components/UserIconWithPopup.vue'
import MarkdownEditor from 'vue-simplemde/src/markdown-editor'
import axios from 'axios'

export default {
  components: {
    UserIconWithPopup,
    MarkdownEditor
  },
  data: () => ({
    info: {
      status: 0,
      id: 1,
      name: '',
      owner: '',
      start_date: '',
      end_date: '',
      member_total_need: 1,
      description: '',
      current_members: [],
      date: ['', '']
    },
    isEditing: false,
    rules: {
      name: [
        { required: true, message: '输入项目名称', trigger: 'change' },
        {
          min: 1,
          max: 100,
          message: '长度在 1 到 100 个字符',
          trigger: 'change'
        }
      ],
      member_total_need: [
        { required: true, message: '请选择人数', trigger: 'change' }
      ],
      date: [{ required: true, message: '请选择日期', trigger: 'change' }]
    },
    markdownConfigs: {
      spellChecker: false
    }
  }),
  computed: {
    loggedIn () {
      return this.$store.state.loggedIn
    },
    projectId () {
      return parseInt(this.$route.params.projectId)
    },
    isOwner () {
      return this.info.owner === this.$store.state.userEmail
    },
    isJoinable () {
      // Condition 1: user is logged in
      let result = this.loggedIn
      // Condition 2: project is not full
      if (this.info.member_total_need === this.info.current_members.length) { result = false }
      // Condition 3: user is not in project
      for (let i = 0; i < this.info.current_members.length; ++i) {
        if (this.info.current_members[i] === this.$store.state.userEmail) {
          result = false
        }
      }
      // Condition 4: project has not ended
      let now = new Date()
      if (now > new Date(this.info.end_date)) result = false
      return result
    },
    isDroppable () {
      if (this.info.owner === this.$store.state.userEmail) return false
      for (let i = 0; i < this.info.current_members.length; ++i) {
        if (this.info.current_members[i] === this.$store.state.userEmail) { return true }
      }
      return false
    },
    dateRange () {
      let begin = new Date(this.info.start_date)
      let end = new Date(this.info.end_date)
      return dateToYMD(begin) + ' - ' + dateToYMD(end)
    }
  },
  watch: {
    $route (to, from) {
      this.handleProjectInfoChange()
    }
  },
  mounted: function () {
    this.handleProjectInfoChange()
  },
  methods: {
    handleDateSelect () {
      if (this.info.date) {
        this.info.start_date = dateToYMD(this.info.date[0])
        this.info.end_date = dateToYMD(this.info.date[1])
      } else {
        this.info.start_date = ''
        this.info.end_date = ''
      }
    },
    handleProjectInfoChange () {
      this.isEditing = false
      requestProjectInfo(this.projectId, response => {
        if (response.status === 0) {
          this.info = response
          this.info.date = ['', '']
          this.info.date[0] = new Date(this.info.start_date)
          this.info.date[1] = new Date(this.info.end_date)
        } else {
          this.$message.error(
            'Request Project Info Error: Status ' + response.status
          )
        }
      })
    },
    onEditPage () {
      this.isEditing = true
    },
    onFinishEditPage () {
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'project',
        content: {
          action: 'edit',
          data: {
            id: this.projectId,
            name: this.info.name,
            start_date: this.info.start_date,
            end_date: this.info.end_date,
            member_total_need: this.info.member_total_need,
            description: this.info.description
          }
        }
      }

      axios
        .post(this.$store.state.serverUrl + '/project/edit/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          let status = response.data.content.data.status
          if (status === 0) {
            this.isEditing = false
            this.$message('编辑项目信息成功！')
          } else {
            this.$message.error('Error in Project Edit: Status ' + status)
            console.log(request, response)
          }
        })
    },
    onJoinProject () {
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'project',
        content: {
          action: 'join',
          data: {
            id: this.projectId
          }
        }
      }
      axios
        .post(this.$store.state.serverUrl + '/project/join/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          let status = response.data.content.data.status
          if (status === 0) {
            this.$message('加入项目成功！')
            this.handleProjectInfoChange()
          } else {
            this.$message.error('Error in Project Join: Status ' + status)
            console.log(request, response)
          }
        })
    },
    onDropProject () {
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'project',
        content: {
          action: 'drop',
          data: {
            id: this.projectId
          }
        }
      }
      axios
        .post(this.$store.state.serverUrl + '/project/drop/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          let status = response.data.content.data.status
          if (status === 0) {
            this.$message('退出项目成功！')
            this.handleProjectInfoChange()
          } else {
            this.$message.error('Error in Project Drop: Status ' + status)
            console.log(request, response)
          }
        })
    },
    onDeleteProject () {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
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
            content_type: 'project',
            content: {
              action: 'delete',
              data: {
                id: this.projectId
              }
            }
          }
          axios
            .post(this.$store.state.serverUrl + '/project/delete/', request, {
              headers: {
                'Content-Type': 'text/plain'
              }
            })
            .then(response => {
              let status = response.data.content.data.status
              if (status === 0) {
                this.$message('删除项目信息成功！')
                this.$router.go(-1)
              } else {
                this.$message.error(
                  'Error in Project Delete: Status ' + status
                )
                console.log(request, response)
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
