<template>
  <el-form ref="seminarForm" :model="info" :rules="rules" label-width="120px" status-icon>
    <el-form-item label="研讨会名称" prop="name">
      <el-input v-model="info.name"></el-input>
    </el-form-item>
    <el-form-item label="人数上限" prop="member_number_limit">
      <el-input-number v-model="info.member_number_limit" :min="1" :max="10"></el-input-number>
    </el-form-item>
    <el-form-item label="日期" prop="date">
      <el-date-picker
        v-model="info.date"
        type="datetimerange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleDateSelect"
      ></el-date-picker>
    </el-form-item>
    <el-divider content-position="center">研讨会描述支持Markdown格式</el-divider>
    <el-form-item label="研讨会描述" prop="description">
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
import { requestSeminarInfo, timeToString } from '@/utils.js'
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
      member_number_limit: 1,
      description: '',
      current_members: '',
      date: ['', '']
    },
    rules: {
      name: [
        { required: true, message: '输入研讨会名称', trigger: 'change' },
        {
          min: 1,
          max: 100,
          message: '长度在 1 到 100 个字符',
          trigger: 'change'
        }
      ],
      member_number_limit: [
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
      // Request seminar info from remote
      requestSeminarInfo(this.id, response => {
        if (response.status === 0) {
          this.info = response
          this.info.date = ['', '']
          this.owner = this.$store.state.userEmail
          this.current_members = [this.owner]
        } else {
          this.$message.error(
            '请求研讨会信息错误：错误代码' + response.status + '，请联系开发人员'
          )
        }
      })
    }
  },
  methods: {
    handleDateSelect () {
      console.log(this.info.date[0])
      if (this.info.date) {
        this.info.start_date = timeToString(this.info.date[0])
        // console.log(this.info.start_date)
        this.info.end_date = timeToString(this.info.date[1])
      } else {
        this.info.start_date = ''
        this.info.end_date = ''
      }
    },
    onSubmit () {
      // validate
      this.$refs['seminarForm'].validate(valid => {
        if (valid) {
          this.$confirm('确定提交研讨会信息？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          })
            .then(() => {
              this.sendSeminarRequest()
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
      this.$confirm('确定清空研讨会信息？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          that.info.name = ''
          that.info.member_number_limit = 1
          that.info.start_date = ''
          that.info.end_date = ''
          that.info.date = ['', '']
        })
        .catch(() => {})
    },
    sendSeminarRequest () {
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'seminar',
        content: {
          action: 'create',
          data: {
            name: this.info.name,
            start_date: this.info.start_date,
            end_date: this.info.end_date,
            member_number_limit: this.info.member_number_limit,
            description: this.info.description
          }
        }
      }
      console.log(request)
      axios
        .post(this.$store.state.serverUrl + '/seminar/create/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          console.log(response)
          let status = response.data.content.data.status
          if (status === 0) {
            let seminarId = response.data.content.data.id
            this.$message('发布研讨会信息成功！')
            this.$router.push('/seminar/' + seminarId)
          } else {
            this.$message.error('Seminar Create Response: Status ' + status)
          }
        })
    }
  }
}
</script>
