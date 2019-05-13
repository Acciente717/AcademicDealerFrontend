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
        <el-form-item label-width="80px" label='姓名'>
          <el-input v-model="s.name"></el-input>
        </el-form-item>
        <el-form-item label-width="80px" label='学校'>
          <el-input v-model="s.school"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click.prevent="deleteSupervisor(s)">删除</el-button>
        </el-form-item>
      </el-form-item>
      <el-button @click="addSupervisor">添加</el-button>
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
// import axios from 'axios'
import markdownEditor from 'vue-simplemde/src/markdown-editor'

export default {
  components: {
    markdownEditor
  },
  data: () => ({
    labForm: {
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
      spellChecker: false
    }
  }),
  methods: {
    addSupervisor () {
      this.labForm.supervisors.push({
        name: '',
        school: ''
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
    }
  }
}
</script>
