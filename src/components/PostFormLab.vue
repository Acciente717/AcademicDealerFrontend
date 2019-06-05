<template>
  <el-form ref="labForm" :model="labForm" :rules="labRules" label-width="120px" status-icon
    @keyup.enter.native="onLabSubmit">
    <el-form-item label="实验室名称" prop="name">
      <el-input v-model="labForm.name"></el-input>
    </el-form-item>
    <el-form-item label="学校/研究机构" prop="school">
      <el-input v-model="labForm.school"></el-input>
    </el-form-item>
    <el-form-item label="院系" prop="department">
      <el-input v-model="labForm.department"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="labForm.address"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="labForm.phone"></el-input>
    </el-form-item>
    <el-form-item label="主页" prop="frontPageUrl">
      <el-input v-model="labForm.frontPageUrl"></el-input>
    </el-form-item>
    <el-form-item label="成员">
      <el-form-item
        v-for="(s, index, id) in labForm.supervisors"
        :label="'成员' + index"
        :label-width="'80px'"
        :key="id"
        :prop="'supervisors.' + index + '.value'">
        <el-form-item label-width="120px" label='是否为用户'>
          <el-radio v-model="s.isUser" :label="true">是</el-radio>
          <el-radio v-model="s.isUser" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item v-if="s.isUser" label-width="120px" label='账户邮箱'>
          <el-input v-model="s.accountEmail"></el-input>
        </el-form-item>
        <el-form-item v-if="!s.isUser" label-width="120px" label='姓名'>
          <el-input v-model="s.name"></el-input>
        </el-form-item>
        <el-form-item v-if="!s.isUser" label-width="120px" label='学校'>
          <el-input v-model="s.school"></el-input>
        </el-form-item>
        <el-form-item v-if="!s.isUser" label-width="120px" label='院系'>
          <el-input v-model="s.department"></el-input>
        </el-form-item>
        <el-form-item v-if="!s.isUser" label-width="120px" label='学位/职称'>
          <el-input v-model="s.title" placeholder="本科/硕士/博士/副教授/教授等"></el-input>
        </el-form-item>
        <el-form-item v-if="!s.isUser" label-width="120px" label='头像URL'>
          <el-input v-model="s.picUrl" placeholder="暂不支持修改头像"></el-input>
        </el-form-item>
        <el-form-item v-if="!s.isUser" label-width="120px" label='联系邮箱'>
          <el-input v-model="s.contactEmail"></el-input>
        </el-form-item>
        <el-form-item v-if="!s.isUser" label-width="120px" label='联系地址'>
          <el-input v-model="s.address"></el-input>
        </el-form-item>
        <el-form-item v-if="!s.isUser" label-width="120px" label="简介" prop="profile">
          <markdown-editor v-model="s.profile" :configs="markdownConfigs" ref="markdownEditor"></markdown-editor>
        </el-form-item>
        <el-form-item label-width="120px">
          <el-button type="danger" @click.prevent="deleteSupervisor(s)">删除</el-button>
        </el-form-item>
      </el-form-item>
      <el-button type="primary" @click="addSupervisor">添加</el-button>
    </el-form-item>
    <el-form-item label="图片URL" prop="picUrl" placeholder="暂不支持自定义图片">
      <el-input v-model="labForm.picUrl"></el-input>
    </el-form-item>
    <el-form-item label="logo URL" prop="logoUrl" placeholder="暂不支持自定义logo">
      <el-input v-model="labForm.logoUrl"></el-input>
    </el-form-item>
    <el-form-item label="简介" prop="description">
      <markdown-editor v-model="labForm.description"
                       :configs="markdownConfigs"
                       ref="markdownEditor"
      ></markdown-editor>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onLabSubmit">确认提交</el-button>
      <el-button @click="onLabReset">清空</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
@import "~simplemde/dist/simplemde.min.css";
</style>

<script>
import axios from 'axios'
import markdownEditor from 'vue-simplemde/src/markdown-editor'

export default {
  props: ['originLab'],
  components: {
    markdownEditor
  },
  data: () => ({
    isEditing: false,
    labForm: {
      id: -1,
      name: '',
      school: '',
      department: '',
      // owner_email is the current user
      address: '',
      phone: '',
      frontPageUrl: '',
      picUrl: '',
      logoUrl: '',
      supervisors: [],
      comments: [],
      description: ''
    },
    labRules: {
      name: [
        { required: true, message: '实验室名称', trigger: 'blur' },
        { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
      ],
      school: [
        { required: true, message: '学校/研究机构', trigger: 'blur' },
        { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
      ],
      department: [
        { required: true, message: '院系', trigger: 'blur' },
        { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
      ],
      address: [
        { required: true, message: '地址', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      phone: [
        { message: '电话', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            let re = /^(\+?\(?\+?[0-9]*\)?)?([-\s]?[0-9]+)*$/i
            let isValid = re.test(String(value))
            if (!isValid) {
              callback(new Error('请输入正确的电话格式'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      description: [
        { min: 0, max: 500, message: '长度在 0 到 500 个字符', trigger: 'blue' }
      ]
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
  methods: {
    addSupervisor () {
      this.labForm.supervisors.push({
        isUser: true,
        name: '',
        school: '',
        department: '',
        title: '',
        picUrl: '',
        accountEmail: '',
        contactEmail: '',
        address: '',
        profile: ''
      })
    },
    deleteSupervisor (s) {
      let index = this.labForm.supervisors.indexOf(s)
      if (index !== -1) {
        this.labForm.supervisors.splice(index, 1)
      }
    },
    onLabSubmit () {
      // validate
      this.$refs['labForm'].validate(valid => {
        if (valid) {
          this.$confirm('确定提交实验室信息？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => { this.sendLabRequest() }).catch(() => { return false })
        } else {
          this.$message.error('有些内容不符合要求，请重新检查您填入的内容！')
          return false
        }
      })
    },
    onLabReset () {
      this.$confirm('确定清空实验室信息？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['labForm'].resetFields()
      }).catch(() => {})
    },
    sendLabRequest () {
      if (!this.$store.state.loggedIn) {
        this.$message.error('没有登录却尝试修改信息？！')
        return
      }
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'lab',
        content: {
          action: this.isEditing ? 'edit' : 'create',
          data: {
            id: this.labForm.id,
            name: this.labForm.name,
            school: this.labForm.school,
            department: this.labForm.department,
            owner_email: this.isEditing ? this.$store.state.userEmail : '',
            owner: this.isEditing ? this.$store.state.userEmail : '',
            address: this.labForm.address,
            phone: this.labForm.phone,
            front_page_url: this.labForm.frontPageUrl,
            pic_url: this.labForm.picUrl,
            logo_url: this.labForm.logoUrl,
            supervisors: JSON.stringify(this.labForm.supervisors.map((s) => ({
              name: s.name,
              school: s.school,
              department: s.department,
              title: s.title,
              pic_url: s.picUrl,
              is_user: s.isUser,
              account_email: s.accountEmail,
              contact_email: s.contactEmail,
              address: s.address,
              profile: s.profile
            }))),
            comments: this.labForm.comments,
            description: this.labForm.description
          }
        }
      }
      // console.log(this.labForm.supervisors)
      // console.log(request)
      let url = this.isEditing ? 'edit' : 'create'
      axios
        .post(this.$store.state.serverUrl + '/lab/' + url + '/',
          request, {
            headers: {
              'Content-Type': 'text/plain'
            }
          })
        .then(response => {
          this.handleLabResponce(response)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消创建'
          })
        })
    },
    handleLabResponce (response) {
      let currentAction = ''
      if (this.isEditing) {
        currentAction = '编辑'
      } else {
        currentAction = '创建'
      }
      let statusCode = response.data.content.data.status
      if (statusCode !== 0) {
        this.$message.error(currentAction + '实验室信息错误，错误码：' + statusCode + '，请联系开发人员')
      } else {
        let labId = response.data.content.data.id
        this.$message.info(currentAction + '实验室信息成功！')
        this.$router.push('/lab/' + labId)
      }
    },
    bindOrigin (l) {
      this.labForm.id = l.id
      this.labForm.name = l.name
      this.labForm.school = l.school
      this.labForm.department = l.department
      this.labForm.address = l.address
      this.labForm.frontPageUrl = l.front_page_url
      this.labForm.picUrl = l.pic_url
      this.labForm.logoUrl = ''
      if (l.supervisors !== undefined && l.supervisors !== '') {
        this.labForm.supervisors = this.toCamelCase(JSON.parse(l.supervisors))
      } else {
        this.labForm.supervisors = []
      }
      this.labForm.comments = []
      this.labForm.description = l.description
    },
    toCamelCase (underlines) {
      underlines.forEach((s, i) => {
        let cs = s
        cs.isUser = s.is_user
        cs.accountEmail = s.account_email
        cs.contactEmail = s.contact_email
        cs.picUrl = s.pic_url
        return cs
      })
      return underlines
    }
  },
  mounted: function () {
    if (this.originLab !== undefined) {
      this.isEditing = true
      console.log('originlab')
      console.log(this.originLab)
      this.bindOrigin(this.originLab)
    }
  }
}
</script>
