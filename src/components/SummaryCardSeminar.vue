<template>
  <div class="summary-card-seminar">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>这是一条研讨会信息</span>
        <el-button
        style="float: right; padding: 3px 0" type="text"
        @click="goToSeminarInfoPage">详细信息</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">{{'List item ' + o }}</div>
      <el-button text="text" @click="getContent">加载信息</el-button>
      <div v-if="loading">Now loading</div>
      <div class="text"> {{ description }}</div>
    </el-card>
  </div>
</template>

<script>
import { requestSeminarInfo } from '@/utils.js'

export default {
  props: ['id'],
  data: () => ({
    info: {
      status: 0,
      id: 1,
      name: '',
      owner: '',
      date: '',
      duration: 0,
      member_number_limit: 100,
      current_members: '',
      description: ''
    }
  }),
  copmuted: {
    seatAvailable () {
      return this.info.member_number_limit - this.info.current_members.length
    }
  },
  mounted: function () {
    this.requestInfo()
  },
  methods: {
    requestInfo () {
      requestSeminarInfo(this.id, response => {
        console.log(response)
        switch (response.status) {
          case 0: // success
            this.info = response
            this.ownerEmail = this.info.owner
            break
          default:
            this.$message.error(
              'SummaryCardSeminar内部错误：Status ' +
                response.status +
                '，请联系开发人员'
            )
        }
      })
    },
    goToSeminarInfoPage () {
      this.$router.push('/seminar/' + this.id)
    }
  }
}
</script>

<style scoped>
</style>
