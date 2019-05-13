<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-edit"></i> 发布实验室信息
        </span>
        <el-form ref="labForm" :model="labForm" :rules="labRules" status-icon>
          <el-form-item label="实验室名称" prop="name">
            <el-input v-model="labForm.name"></el-input>
          </el-form-item>
          <el-form-item label="学校/研究机构" prop="school">
            <el-input v-model="labForm.school"></el-input>
          </el-form-item>
          <el-form-item label="院系" prop="department">
            <el-input v-model="labForm.department"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-edit"></i> 发布研讨会信息
        </span>
        发布信息
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-edit"></i> 发布合作项目信息
        </span>
        发布信息
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
</style>

<script>
export default {
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
      ]
    },
    projectForm: {

    }
  }),
  methods: {
    handleClick (e) {
      console.log('tab clicked at ' + e.index)
    }
  }
}
</script>
