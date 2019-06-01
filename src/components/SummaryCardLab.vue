<template>
  <div class="summary-card-lab">
    <el-card class="box-card">
      <div class="clearfix">
        <el-container>
          <el-aside style="height: 50px; width: 50px;">
            <user-icon-with-popup :user="info.owner_email"/>
          </el-aside>
          <el-main>
            <div class="card-title">
              <strong>{{info.name}}</strong>
              <el-button
                class="more-info-button"
                style="float: right; padding: 3px 0; margin: auto;"
                type="text"
                @click="goToLabInfoPage"
              >详细信息</el-button>
            </div>
            <div class="card-info">
              {{info.school}}
            </div>
            <div class="card-info">
              {{info.department}}
            </div>
            <div class="card-info">
              {{info.front_page_url}}
            </div>
          </el-main>
        </el-container>
      </div>
      <el-divider class="card-divider"></el-divider>
      <div class="lab-description">
        <VueShowdown :markdown="info.description.slice(0, 25) + '...'"/>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.summary-card-lab {
  margin-top: 10px;
  margin-bottom: 10px;
  height: 300px;
}
.box-card {
  height: 300px;
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
.seminar-description {
  overflow: scroll;
  height: 180px;
}
</style>

<script>
import UserIconWithPopup from '@/components/UserIconWithPopup.vue'
import { requestLabInfo } from '@/utils.js'

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
      owner_email: '',
      school: '',
      department: '',
      front_page_url: '',
      description: ''
    }
  }),
  mounted: function () {
    this.requestInfo()
  },
  methods: {
    requestInfo () {
      requestLabInfo(this.id, response => {
        // console.log(response)
        switch (response.status) {
          case 0: // success
            this.info = response
            break
          default:
            this.$message.error(
              'SummaryCardLab内部错误：Status ' +
                response.status +
                '，请联系开发人员'
            )
        }
      })
    },
    goToLabInfoPage () {
      this.$router.push('/lab/' + this.id)
    }
  }
}
</script>
