<template>
  <div class="summary-card-project">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>这是一条项目信息</span>
        <el-button style="float: right; padding: 3px 0" type="text">详细信息</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">{{'List item ' + o }}</div>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
</style>
