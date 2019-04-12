<template>
  <div class="summary-card-lab">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>这是一条实验室信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goToInfoPage">详细信息</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">{{'List item ' + o }}</div>
    </el-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    labId: 0
  }),
  methods: {
    goToInfoPage () {
      let labId = this.labId
      this.$router.push({ name: 'labinfo', params: { labId } })
    }
  }
}
</script>

<style scoped>
</style>
