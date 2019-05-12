<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-edit"></i> 发布实验室信息
        </span>
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
    },
    projectForm: {

    }
  })
}
</script>
