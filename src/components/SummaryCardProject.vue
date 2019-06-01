<template>
  <div class="summary-card-project">
    <el-card class="box-card">
      <div class="clearfix">
        <el-container>
          <el-aside style="height: 50px; width: 50px;">
            <user-icon-with-popup :user="info.owner"/>
          </el-aside>
          <el-main>
            <div class="card-title">
              <strong>{{info.name}}</strong>&nbsp;<el-tag effect="dark" size="small">项目</el-tag>
              <el-button
                class="more-info-button"
                style="float: right; padding: 3px 0; margin: auto;"
                type="text"
                @click="goToProjectInfoPage"
              >详细信息</el-button>
            </div>
            <div class="card-info">
              <span>
                <i class="el-icon-date"></i>
                {{dateRange}}
                <el-divider direction="vertical"></el-divider>
                总共{{info.member_total_need}}人
              </span>
              <span v-if="membersNeeded != 0">
                <el-divider direction="vertical"></el-divider>
                尚需{{membersNeeded}}人
              </span>
              <span>
                <el-divider direction="vertical"></el-divider>已参加成员：
              </span>
              <span v-for="member in info.current_members" :key="member">
                <user-icon-with-popup class="small-user-icon" :user="member"/>
              </span>
            </div>
          </el-main>
        </el-container>
      </div>
      <el-divider class="card-divider"></el-divider>
      <div class="project-description">
        <VueShowdown :markdown="info.description"/>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.summary-card-project {
  margin-top: 10px;
  margin-bottom: 10px;
  height: auto;
}
.box-card {
  height: auto;
}
.card-title {
  font-size: larger;
  margin: auto;
}
.el-divider {
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-main {
  padding: 0px;
  margin-left: 10px;
}
.more-info-button {
  position: relative;
  right: 0;
}
.card-info {
  font-size: small;
  display: flex;
}
.small-user-icon {
  width: 30px;
  height: 30px;
}
.project-description {
  overflow: auto;
  height: auto;
  max-height: 180px;
}
</style>

<script>
import UserIconWithPopup from '@/components/UserIconWithPopup.vue'
import { requestProjectInfo, dateToYMD } from '@/utils.js'

export default {
  props: ['id'],
  components: {
    UserIconWithPopup
  },
  data: () => ({
    info: {
      status: 0,
      id: 1,
      name: '',
      owner: '',
      start_date: '',
      end_date: '',
      member_total_need: 3,
      description: '',
      current_members: ''
    }
  }),
  computed: {
    dateRange () {
      let begin = new Date(this.info.start_date)
      let end = new Date(this.info.end_date)
      return dateToYMD(begin) + ' - ' + dateToYMD(end)
    },
    membersNeeded () {
      return this.info.member_total_need - this.info.current_members.length
    }
  },
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
            this.ownerEmail = this.info.owner
            break
          default:
            this.$message.error(
              'SummaryCardProject内部错误：Status ' +
                response.status +
                '，请联系开发人员'
            )
        }
      })
    },
    goToProjectInfoPage () {
      this.$router.push('/project/' + this.id)
    }
  }
}
</script>
