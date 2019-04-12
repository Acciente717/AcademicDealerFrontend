<template>
  <div class="SingleLabPage">
    <h1>
      {{labName}}
      <el-button type="text" @click="editPage">编辑页面</el-button>
    </h1>

    <el-container>
      <el-aside width="200px">
        <h3>Supervisors</h3>
        <div v-for="prof in labSupervisors" :key="prof.name">
          <img :src="prof.photoUrl" width="190px">
          {{prof.name}}, {{prof.title}}
          email: {{prof.email}}
        </div>
      </el-aside>
      <el-main>
        <VueShowdown :markdown="infoString" flavor="github" :options="{ emoji: true }"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    labId: 0,
    labName: 'Unified Theory and Artifical Intelligence Lab',
    labOwner: 'admin',
    labSupervisors: [
      {
        name: 'Alan Turing',
        title: 'Professor',
        email: 'turing@404.org',
        photoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg'
      },
      {
        name: 'Albert Einstein',
        title: 'Professor',
        email: 'einstein@404.org',
        photoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg'
      }
    ],
    infoString:
      '## About this Lab\n Unified Theory and Artifical Intelligence Lab is a lab that focuses on developing a unified theory for both the universe and human intelligence. \n## For Perspective Students\nWe are looking for perspective students who have passed away and will be in heaven since 2020. Applicants should meet the following requirements:\n1. Expertise in theortical physics, computational theory and algorithm design. \n2. Solid mathematical background and programming skills. \n3. Contiguous enthusiasm in research.\n'
  }),
  mount: () => {
    this.labId = this.$route.params.labId
  },
  watch: {
    $route (to, from) {
      // react to route changes...
      this.labId = this.$route.params.labId
    }
  },
  methods: {
    editPage () {
      // TODO: authentication
      this.$router.push({ name: 'labinfoedit', params: { labId: this.labId } })
    }
  }
}
</script>

<style>
</style>
