<template>
  <div>
    <h1>编辑实验室信息</h1>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="实验室名称">
        <el-input v-model="form.labName"></el-input>
      </el-form-item>
      <div v-for="supervisor in form.labSupervisors" :key="supervisor.name">
        <h3>导师信息 <el-button type="text">添加导师</el-button><el-button type="text">删除当前导师</el-button></h3>
        <el-form-item label="导师姓名">
          <el-input v-model="form.labName"></el-input>
        </el-form-item>
        <el-form-item label="导师职称">
          <el-input v-model="form.labName"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="form.labName"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="实验室介绍">
        <div class="container">
          <markdown-editor v-model="form.infoString" :configs="markdownConfigs" ref="markdownEditor"></markdown-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor'

export default {
  components: {
    markdownEditor
  },
  data: () => ({
    form: {
      labId: 0,
      labName: '',
      labOwner: 'admin',
      labSupervisors: [
        {
          name: '',
          title: '',
          email: '',
          photoUrl: ''
        }
      ],
      infoString: ''
    },
    markdownConfigs: {
      spellChecker: false
    }
  }),
  mount: () => {
    this.labId = this.$route.params.labId
  },
  watch: {
    $route (to, from) {
      // react to route changes...
      this.labId = this.$route.params.labId
    }
  },
  methods: {
    onSubmit () {}
  }
}
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
</style>
