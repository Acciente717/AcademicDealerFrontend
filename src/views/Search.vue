<template>
  <div class="Search">
    <el-card shadow="never" class="search-panel">
      <el-input placeholder="输入一些关键词吧~" prefix-icon="el-icon-search" v-model="form.keyword">
        <el-button slot="append" type="primary" @click="search">搜索</el-button>
      </el-input>
      <el-divider>
        <el-button
          style="margin-left: 10px; margin-right: 10px;"
          type="text"
          :icon="advancedOptionsIcon"
          @click="showAdvanced"
        >高级搜索选项</el-button>
      </el-divider>
      <el-collapse-transition>
        <div v-if="hideAdvancedOptions">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="检索条件">
              <el-checkbox v-model="form.searchLab">检索实验室信息</el-checkbox>
              <el-checkbox v-model="form.searchProject">检索项目信息</el-checkbox>
              <el-checkbox v-model="form.searchSeminar">检索研讨会信息</el-checkbox>
              <el-checkbox v-model="form.searchDescription">检索正文</el-checkbox>
              <el-checkbox v-model="form.searchOutdated">检索过期信息</el-checkbox>
            </el-form-item>
            <el-form-item label="是否包含用户">
              <el-input v-model="form.userEmail" placeholder="请输入用户邮箱">
                <el-select v-model="form.userType" slot="prepend" placeholder="选择用户类型">
                  <el-option label="创建者" value="owner"></el-option>
                  <el-option label="参与者" value="attender"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="setToDefault">恢复默认设置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>
    <el-card shadow="never" v-if="!firstSearch">
      <search-result-list
        :keyword="searchConditions.keyword"
        :userEmail="searchConditions.userEmail"
        :userType="searchConditions.userType"
        :searchLab="searchConditions.searchLab"
        :searchProject="searchConditions.searchProject"
        :searchSeminar="searchConditions.searchSeminar"
        :searchDescription="searchConditions.searchDescription"
        :searchOutdated="searchConditions.searchOutdated"
      />
    </el-card>
  </div>
</template>

<style scoped>
.search-panel {
  margin-bottom: 20px;
}
.el-select {
  background-color: #fff;
  width: 140px;
  border-radius: 2px;
}
</style>

<script>
import SearchResultList from '@/components/SearchResultList.vue'

export default {
  components: {
    SearchResultList
  },
  data: () => ({
    firstSearch: true,
    hideAdvancedOptions: false,
    form: {
      keyword: '',
      searchLab: true,
      searchSeminar: true,
      searchOutdated: false,
      searchProject: true,
      searchDescription: false,
      userEmail: '',
      userType: 'owner'
    },
    // Its a duplicate of form, which will only be updated upon user click
    // This is to avoid automatically sending search requests
    searchConditions: {
      searchLab: true,
      searchSeminar: true,
      searchOutdated: false,
      searchProject: true,
      searchDescription: false,
      userEmail: '',
      userType: 'owner'
    }
  }),
  computed: {
    advancedOptionsIcon () {
      return this.hideAdvancedOptions
        ? 'el-icon-arrow-up'
        : 'el-icon-arrow-down'
    }
  },
  methods: {
    showAdvanced () {
      this.hideAdvancedOptions = !this.hideAdvancedOptions
    },
    search () {
      if (this.firstSearch) this.firstSearch = false
      this.searchConditions = this.form
    },
    setToDefault () {
      this.form = {
        keyword: this.form.keyword,
        searchLab: true,
        searchSeminar: true,
        searchOutdated: false,
        searchProject: true,
        searchDescription: false,
        userEmail: '',
        userType: ''
      }
    }
  }
}
</script>
