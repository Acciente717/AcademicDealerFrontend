<template>
  <div class="project">{{info}}</div>
</template>

<script>
import { requestProjectInfo } from '@/utils.js'

export default {
  data: () => ({
    info: {
      status: 0,
      id: 1,
      name: '',
      owner: '',
      start_date: '',
      end_date: '',
      member_total_need: 1,
      description: '',
      current_members: '',
      date: ['', '']
    }
  }),
  computed: {
    projectId () {
      return parseInt(this.$route.params.projectId)
    },
    isOwner () {
      return this.info.owner === this.$store.state.userEmail
    }
  },
  watch: {
    $route (to, from) {
      this.handleProjectInfoChange()
    }
  },
  mounted: function () {
    this.handleProjectInfoChange()
  },
  methods: {
    handleProjectInfoChange () {
      requestProjectInfo(this.projectId, response => {
        if (response.status === 0) {
          this.info = response
        } else {
          this.$message.error(
            'Request Project Info Error: Status ' + response.status
          )
        }
      })
    }
  }
}
</script>

<style>
</style>
