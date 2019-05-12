<template>
  <div class="summary-card-project">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>这是一条项目信息 ID: {{id}}</span>
        <el-button style="float: right; padding: 3px 0" type="text">详细信息</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">{{'List item ' + o }}</div>
    </el-card>
  </div>
</template>

<script>
import { requestProjectInfo, requestUserInfo } from '@/utils.js'

export default {
  props: ['id'],
  data: () => ({
    info: {
      status: '0',
      id: 1,
      name: 'project 16666',
      owner: 2,
      start_date: '2019-12-31 16:00:00+00:00',
      end_date: '2029-12-31 16:00:00+00:00',
      member_total_need: '3',
      description: 'This is a stupid project.',
      current_members: '[2]'
    },
    userInfo: {
      nick_name: 'Idiot',
      pic_url: '',
      school: 'Paradize',
      department: 'White House',
      title: 'Other',
      enrollment_date: '2000-01-01',
      labs: [],
      projects: [],
      seminars: [],
      comments: [],
      profile: '#### Profile title\nProfile content\n'
    }
  }),
  mounted: function () {
    this.requestInfo()
  },
  methods: {
    requestInfo () {
      requestProjectInfo(this.id, response => {
        console.log(response)
        switch (response.status) {
          case 0: // success
            this.info = response
            requestUserInfo(this.info.owner, response => {})
            break
          default:
            this.$message.error(
              'SummaryCardProject内部错误：Status ' +
                response.status +
                '，请联系开发人员'
            )
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
