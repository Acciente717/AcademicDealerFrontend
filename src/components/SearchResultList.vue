<template>
  <div class="search-result-list">
    <div v-for="item in results" :key="item">
      <SummaryCardLab v-if="item.content_type==='lab'" :id="item.id"/>
      <SummaryCardProject v-if="item.content_type==='project'" :id="item.id"/>
      <SummaryCardSeminar v-if="item.content_type==='seminar'" :id="item.id"/>
    </div>
    <div v-if="results.length===0">这儿什么也没有~</div>
    <el-pagination
      @current-change="handlePageChange"
      :page-size="10"
      :current-page.sync="currPage"
      layout="total, prev, pager, next, jumper"
      :total="totalResults"
    ></el-pagination>
  </div>
</template>

<script>
import SummaryCardLab from '@/components/SummaryCardLab.vue'
import SummaryCardSeminar from '@/components/SummaryCardSeminar.vue'
import SummaryCardProject from '@/components/SummaryCardProject.vue'
import axios from 'axios'

export default {
  props: {
    keyword: {
      type: String,
      default: function () {
        // default value is empty, must be a function
        return ''
      }
    },
    userEmail: {
      type: String,
      default: function () {
        return ''
      }
    },
    userType: {
      type: String,
      default: function () {
        return 'owner'
      }
    },
    searchDescription: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    searchLab: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    searchSeminar: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    searchProject: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    searchOutdated: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  components: {
    SummaryCardLab,
    SummaryCardSeminar,
    SummaryCardProject
  },
  data: () => ({
    totalResults: 0,
    currPage: 1,
    lastPage: 1,
    results: []
  }),
  mounted: function () {
    this.requestSearchResults()
  },
  watch: {
    conditions: function () {
      this.requestSearchResults()
    }
  },
  methods: {
    requestSearchResults () {
      let that = this
      let request = {
        dir: 'request',
        content_type: 'search',
        content: {
          keyword: this.keyword, // 默认只检索标题是否含关键词
          user_email: this.userEmail, // 以email限定指定用户发布的结果
          user_type: this.userType, // 以email限定指定用户参与的结果
          search_description: this.searchDescription, // 是否检索正文
          search_lab: this.searchLab,
          search_seminar: this.searchSeminar,
          search_project: this.searchProject,
          search_outdated: this.searchOutdated, // 是否检索已经过期的project和seminar信息
          curr_page: this.currPage // 本次请求的页面号
        }
      }
      console.log(request)
      axios
        .post(this.$store.state.serverUrl + '/search/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          console.log(response)
          if (response.data.status === 0) {
            that.totalResults = response.data.content.total_results
            that.lastPage = response.data.content.last_page
            that.results = response.data.content.result
          } else {
            this.$message.error(
              'Search Response Error: Status ' + response.data.status
            )
          }
        })
    },
    handlePageChange (val) {
      this.requestSearchResults()
    }
  }
}
</script>

<style>
</style>
