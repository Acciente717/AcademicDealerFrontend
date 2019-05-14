<template>
  <div class="home">
    <h1 style="margin-bottom:0px; text-align:center; font-size: 300%; vspace:100px">Academic Dealer</h1>
    <el-container style="height:150px; max-width:400px; margin:auto; margin-top:40px; vspace:20px">
    <img src="../assets/img/FootPrint.png" height="120" />
    <p style="font-size: 150%; font-family: Times, serif">
      <i> Your Single Step Progresses Mankind </i>
    </p>
    </el-container>
    <el-row style="margin-top: 20px;">
      <el-col :span="8">
        <el-card class="info-card" shadow="hover">
          <span style="font-size: 150%; margin-top: 10px; margin-bottom: 10px; font-family: Times, serif">
            <strong> Labs </strong>
          </span>
          <span style="font-size: 100%; margin-top: 10px; margin-bottom: 10px; font-family: Times, serif">
            <br> Reach your <br> <strong> Labs </strong>&<strong> Groups </strong>&<strong>Professors</strong>.
          </span>
          <el-image :src="require('../assets/img/ENIAC.jpg')"></el-image>
        <p style="font-family: Times, serif; text-align: justify">
          <i>
          AcademicDealer collects and presents up-to-data information on laborotaries, research groups and professors.
          You can wander, comment and contribute freely.
          </i>
        </p>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="info-card" shadow="hover">
          <span style="font-size: 150%; margin-top: 10px; margin-bottom: 10px; font-family: Times, serif">
            <strong> Seminars </strong>
          </span>
          <span style="font-size: 100%; margin-top: 10px; margin-bottom: 10px; font-family: Times, serif">
            <br> Start or Join <br> <strong>Seminars</strong> or <strong>  Discussions </strong>.
          </span>
          <el-image :src="require('../assets/img/Solver.jpg')"></el-image>
          <p style="font-family: Times, serif; text-align: justify">
            <i>
              AcademicDealer provides a platform for researchers to start their seminars.
              Both joining and initiating a discussion are supported and highly encouraged.
            </i>
          </p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="info-card" shadow="hover">
          <span style="font-size: 150%; margin-top: 10px; margin-bottom: 10px; font-family: Times, serif">
            <strong> Projects </strong>
          </span>
          <span style="font-size: 100%; margin-top: 10px; margin-bottom: 10px; font-family: Times, serif">
            <br> Look for <br> <strong>Partners</strong> of <strong>  Projects </strong>.
          </span>
          <el-image :src="require('../assets/img/DNA.jpg')"></el-image>
          <p style="font-family: Times, serif; text-align: justify">
            <i>
              AcademicDealer offers exploring space to encounter your project collaborators.
              Either proposing or finding a project leads to thriving cooperation.
            </i>
          </p>
        </el-card>
      </el-col>
    </el-row>
    <el-button class="large-button" type="primary" @click="goToRegisterPage">立即注册</el-button>
    <el-button class="large-button" @click="goToLoginPage">登录</el-button>
    <el-button class="large-button" @click="goToTimelinePage">随便看看</el-button>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}
.info-card {
  margin-left: 10px;
  margin-bottom: 10px;
  height:450px;
  overflow: scroll;
}
.large-button {
  height: 50px;
  width: 160px;
  margin: 20px 10px 20px 10px;
  font-size:medium;
}
</style>

<script>

export default {
  name: 'home',
  components: {},
  methods: {
    goToLoginPage () {
      this.$router.push('/login')
    },
    goToRegisterPage () {
      this.$router.push('/register')
    },
    goToTimelinePage () {
      this.$router.push('/timeline')
    }
  }
}
</script>
