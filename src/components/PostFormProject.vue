<template>
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
      <markdown-editor v-model="info.description" :configs="markdownConfigs" ref="markdownEditor"></markdown-editor>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确认提交</el-button>
      <el-button @click="onReset">清空</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
@import "~simplemde/dist/simplemde.min.css";
</style>

<script>
import { requestProjectInfo, dateToYMD } from '@/utils.js'
import axios from 'axios'
import MarkdownEditor from 'vue-simplemde/src/markdown-editor'

export default {
  props: ['id'],
  components: {
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
      current_members: '',
      date: ['', '']
    },
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
    }
  }),
  mounted: function () {
    if (this.id !== undefined) {
      // Request project info from remote
      requestProjectInfo(this.id, response => {
        if (response.status === 0) {
          this.info = response
          this.info.date = ['', '']
          this.owner = this.$store.state.userEmail
          this.current_members = [this.owner]
        } else {
          this.$message.error(
            '请求项目信息错误：错误代码' + response.status + '，请联系开发人员'
          )
        }
      })
    }
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
    onSubmit () {
      // validate
      this.$refs['projectForm'].validate(valid => {
        if (valid) {
          this.$confirm('确定提交项目信息？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          })
            .then(() => {
              this.sendProjectRequest()
            })
            .catch(() => {
              return false
            })
        } else {
          this.$message.error('有些内容不符合要求，请重新检查您填入的内容！')
          return false
        }
      })
    },
    onReset () {
      let that = this
      this.$confirm('确定清空项目信息？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          that.info.name = ''
          that.info.member_total_need = 1
          that.info.start_date = ''
          that.info.end_date = ''
          that.info.date = ['', '']
        })
        .catch(() => {})
    },
    sendProjectRequest () {
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'project',
        content: {
          action: 'create',
          data: {
            name: this.info.name,
            start_date: this.info.start_date,
            end_date: this.info.end_date,
            member_total_need: this.info.member_total_need,
            description: this.info.description
          }
        }
      }
      axios
        .post(this.$store.state.serverUrl + '/project/create/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          let status = response.data.content.data.status
          if (status === 0) {
            let projectId = response.data.content.data.id
            this.$message('发布项目信息成功！')
            this.$router.push('/project/' + projectId)
          } else {
            this.$message.error('Project Create Response: Status ' + status)
          }
        })
    }
  }
}
</script>
