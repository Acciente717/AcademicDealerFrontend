<template>
  <div class="register">
    <el-card class="box-card" shadow="never">
      <h1 style="aligned: center;">用户注册</h1>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-divider content-position="center">以下为必填项</el-divider>
        <el-form-item label="用户名" prop="nickName">
          <el-input v-model="form.nickName" placeholder="2-20个字符，注册后不可更改"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            autocomplete="off"
            placeholder="8-30个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="form.confirmPassword"
            auto-complete="off"
            placeholder="8-30个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="登录用邮箱，注册后不可更改"></el-input>
        </el-form-item>
        <el-divider content-position="center">以下为选填项</el-divider>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="头像URL" prop="picUrl">
          <el-input v-model="form.picUrl" placeholder="本网站太菜了，不支持上传头像"></el-input>
        </el-form-item>
        <el-form-item label="学校" prop="school">
          <el-input v-model="form.school"></el-input>
        </el-form-item>
        <el-form-item label="院系" prop="department">
          <el-input v-model="form.department"></el-input>
        </el-form-item>
        <el-form-item label="学位/职称" prop="title">
          <el-input v-model="form.title" placeholder="本科/硕士/博士/副教授/教授等"></el-input>
        </el-form-item>
        <el-form-item label="自我介绍" prop="profile">
          <markdown-editor v-model="form.profile" :configs="markdownConfigs" ref="markdownEditor"></markdown-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import sha256 from 'js-sha256'

export default {
  components: {
    markdownEditor
  },
  data () {
    // Validate whether the two passwords are the same
    let validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.confirmPassword !== '') {
          this.$refs.form.validateField('confirmPassword')
        }
        callback()
      }
    }
    let validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        nickName: '',
        password: '',
        confirmPassword: '',
        email: '',
        realName: '',
        picUrl: '',
        school: '',
        department: '',
        type: 'other',
        enrollmentDate: new Date(),
        title: '',
        labs: [],
        projects: [],
        seminars: [],
        comments: [],
        profile: ''
      },
      rules: {
        nickName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 8,
            max: 30,
            message: '长度在 8 到 30 个字符',
            trigger: 'change'
          },
          {
            validator: validatePassword,
            trigger: 'change'
          }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'change' },
          {
            min: 8,
            max: 30,
            message: '长度在 8 到 30 个字符',
            trigger: 'change'
          },
          {
            validator: validatePassword2,
            trigger: 'change'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // Validate whether value is an valid email
              let re = /\S+@\S+\.\S+/
              let isValid = re.test(String(value).toLowerCase())
              if (!isValid) {
                callback(new Error('邮箱地址必须合法'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        profile: [
          {
            min: 0,
            max: 500,
            message: '长度在 0 到 500 个字符',
            trigger: 'blur'
          }
        ]
      },
      markdownConfigs: {
        spellChecker: false
      },
      passwordHash: ''
    }
  },
  mounted: function () {
    this.checkLoginState()
  },
  watch: {
    $route (to, from) {
      // react to route changes...
      this.checkLoginState()
    }
  },
  methods: {
    checkLoginState () {
      if (this.$store.state.loggedIn) {
        this.$confirm('您已经是登录状态，是否退出当前账户？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info'
        })
          .then(() => {
            this.$store.commit('logout')
          })
          .catch(() => {
            this.$router.go(-1)
          })
      }
    },
    dateToYMD (date) {
      var d = date.getDate()
      var m = date.getMonth() + 1 // Month from 0 to 11
      var y = date.getFullYear()
      return (
        '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d)
      )
    },
    onSubmit () {
      // validate form first
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.passwordHash = sha256.sha256(this.form.password)
          this.sendRequest()
        } else {
          this.$alert('存在不合法输入，请重新检查您填入的内容！')
          return false
        }
      })
    },
    sendRequest () {
      let request = {
        dir: 'request',
        signature: {
          is_user: true, // is true when registering
          user_email: this.form.email,
          password_hash: this.passwordHash
        },
        content_type: 'account',
        content: {
          action: 'register',
          data: {
            real_name: this.form.realName,
            nick_name: this.form.nickName,
            pic_url: this.form.picUrl,
            school: this.form.school,
            department: this.form.department,
            title: this.form.title,
            enrollment_date: this.dateToYMD(this.form.enrollmentDate),
            labs: {},
            projects: {},
            seminars: {},
            comments: {},
            profile: this.form.profile
          }
        }
      }

      console.log(request)

      // Post request to server and parse response
      axios
        .post(this.$store.state.serverUrl + '/users/register/', request, {
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

      const REGISTER_SUCCESS = 0
      const EMAIL_REGISTERED = 1
      const INVALID_FIELD = 2
      const CORRUPTED_JSON = 3
      const MISSING_JSON_FIELD = 4
      const BAD_REQ_OR_RESP = 5
      const OTHER_FAILURE = 6
      let statusCode = response.data.content.data.status

      switch (statusCode) {
        case REGISTER_SUCCESS:
          if (this.$store.state.loggedIn) {
            this.$store.commit('logout')
          }
          this.$store.commit('login', {
            userEmail: this.form.email,
            passwordHash: this.passwordHash
          })
          this.$message('注册成功！')
          this.$router.push('timeline/')
          break
        case EMAIL_REGISTERED:
          this.$message.warning('你的邮箱/昵称已经被注册，请更换邮箱/昵称！')
          break
        case INVALID_FIELD:
        case CORRUPTED_JSON:
        case MISSING_JSON_FIELD:
        case BAD_REQ_OR_RESP:
        case OTHER_FAILURE:
          this.$message.error(
            '应用内部错误：错误码：' + statusCode + '，请联系开发人员'
          )
      }
    }
  }
}
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
</style>
