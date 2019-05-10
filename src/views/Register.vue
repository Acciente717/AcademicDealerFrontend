<template>
  <div class="register">
    <h1>注册</h1>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="form.confirmPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="real_name">
        <el-input v-model="form.bio.real_name"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nick_name">
        <el-input v-model="form.bio.nick_name"></el-input>
      </el-form-item>
      <el-form-item label="照片URL" prop="pic_url">
        <el-input v-model="form.bio.pic_url"></el-input>
      </el-form-item>
      <el-form-item label="学校" prop="school">
        <el-input v-model="form.bio.school"></el-input>
      </el-form-item>
      <el-form-item label="院系" prop="department">
        <el-input v-model="form.bio.department"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.bio.type" placeholder="请选择">
          <el-option label="教师" value="Teacher"></el-option>
          <el-option label="本科生" value="Undergraduate"></el-option>
          <el-option label="硕士" value="Master"></el-option>
          <el-option label="博士" value="PhD"></el-option>
          <el-option label="其他" value="other"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入学年份" prop="year">
        <el-input v-model="form.bio.year"></el-input>
      </el-form-item>
      <el-form-item label="自我介绍" prop="profile">
        <markdown-editor v-model="form.bio.profile" :configs="markdownConfigs" ref="markdownEditor"></markdown-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import bcrypt from 'bcryptjs'
import markdownEditor from 'vue-simplemde/src/markdown-editor'

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
        name: '',
        password: '',
        confirmPassword: '',
        email: '',
        bio: {
          real_name: '',
          nick_name: '',
          pic_url: '',
          school: '',
          department: '',
          type: 'other',
          enrollment_year: 0,
          labs: [],
          projects: [],
          seminars: [],
          comments: [],
          profile: ''
        }
      },
      rules: {
        name: [
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
        bio: [
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
      }
    }
  },
  methods: {
    onSubmit () {
      // validate form first
      this.$refs['form'].validate(valid => {
        if (valid) {
          // alert("submit!");
          // calculate password hash
          let saltRounds = 10
          let hash = bcrypt.hashSync(this.form.password, saltRounds)
          this.sendRequest(hash)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sendRequest (passwordHash) {
      let request = {
        dir: 'request',
        signature: {
          is_user: true, // is true when registering
          user_email: this.form.email,
          password_hash: passwordHash
        },
        content_type: 'account',
        content: {
          action: 'register',
          data: {
            bio: this.form.bio
          }
        }
      }

      console.log(request)

      // Post request to server and parse response
      axios
        .post(this.$store.state.serverUrl + '/users/register/', request)
        .then(response => {
          print(response)
          if (this.$store.state.loggedIn) {
            this.$store.commit('logout')
          }
          this.$store.commit('login', {
            userEmail: this.form.email,
            passwordHash: passwordHash
          })
        })
    }
  }
}
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
</style>
