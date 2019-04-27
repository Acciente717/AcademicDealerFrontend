<template>
  <div class="summary-card-lab">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>这是一条实验室信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goToInfoPage">详细信息</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">{{'List item ' + o }}</div>
      <el-button text="text" @click="getContent">加载信息</el-button>
      <div v-if="loading">Now loading</div>
      <div class="text"> {{ description }}</div>
    </el-card>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  data () {
    return {
      loading: false,
      errored: false,
      description: 'no description'
    }
  },
  methods: {
    getContent: function () {
      this.loading = true
      axios
        .get('http://localhost:8001/lab/')
        .then(res => {
          console.log(res)
          this.description = res.data.data.description
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    goToInfoPage () {
      this.$router.push({ name: 'labinfo', params: { labId: this.labId } })
    }
  }
}
</script>

<style scoped>
</style>
