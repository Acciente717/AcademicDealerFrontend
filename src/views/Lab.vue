<template>
  <div class="lab">
    <el-container style="height:80px;">
      <el-aside width="75px" style="height:75px;" class="user-icon">
        <user-icon-with-popup style="width:75px; height: 75px;" :user="info.owner_email"/>
      </el-aside>
      <div style="font-size:large;">
        <b>{{this.info.name}}</b>
        <el-button
          v-if="isOwner"
          type="text"
          style="padding-top:8px; padding-bottom:8px; padding-left: 8px;"
          @click="onEditPage"
        >编辑实验室信息</el-button>
      </div>
    </el-container>
    <el-container>
      <el-aside>
        <el-image :src="testLab.pic_url">
        </el-image>
      </el-aside>
      <el-main>
        <h1 id="labName" style="text-align: center"> {{info.name}} </h1>
      </el-main>
    </el-container>

    <el-container style="margin-top: 50px">
      <el-header style="text-align: center; font-size: large;">基本信息</el-header>
      <!-- Basic information for lab -->
      <el-main>
        <el-container v-if="isEditing">
          <el-divider>编辑实验室信息</el-divider>
          <el-form ref="seminarForm" :model="info" :rules="rules" label-width="120px" status-icon>
            <el-form-item label="实验室名称" prop="name">
              <el-input v-model="info.name"></el-input>
            </el-form-item>
            <el-form-item label="需要人数" prop="member_number_limit">
              <el-input-number v-model="info.member_number_limit" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="日期" prop="date">
              <el-date-picker
                v-model="info.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleDateSelect"
              ></el-date-picker>
            </el-form-item>
            <el-divider content-position="center">研讨会描述支持Markdown格式</el-divider>
            <el-form-item label="研讨会描述" prop="description">
              <markdown-editor
                v-model="info.description"
                :configs="markdownConfigs"
                ref="markdownEditor"
              ></markdown-editor>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onFinishEditPage">完成编辑</el-button>
              <el-button type="danger" @click="onDeleteSeminar">删除研讨会</el-button>
            </el-form-item>
          </el-form>
        </el-container>
        <el-container v-else>
          <el-table
            :data="infoTable"
            stripe
            style="width: 100%">
            <el-table-column
              prop="name"
              label="项目"
              width="80px">
            </el-table-column>
            <el-table-column
              prop="value"
              label="内容">
            </el-table-column>
          </el-table>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
#labName {
  font-size: xx-large;
}
</style>

<script>
import UserIconWithPopup from '@/components/UserIconWithPopup.vue'

export default {
  components: {
    UserIconWithPopup
  },
  data: () => ({
    isLoading: true,
    isError: false,
    isEditing: false,
    info: {
      id: -1
    },
    testLab: {
      id: 1,
      name: 'test lab',
      school: 'test school',
      department: 'test department',
      owner_email: 't@t.t',
      address: 'yiheyuan 5',
      phone: '13456784321',
      front_page_url: 'portal.pku.edu.cn',
      pic_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Raffael_058.jpg/800px-Raffael_058.jpg',
      supervisors: JSON.stringify([{
        name: 'some guy',
        school: 'test school',
        department: 'test department',
        title: 'prof',
        pic_url: 'no such pic',
        is_user: true,
        account_email: 't@t.t',
        contact_email: 't@t.t',
        address: 'yiheyuan 5',
        profile: 'very cool'
      }]),
      comments: JSON.stringify([{
        comment_id: 1,
        description: 'indeed cool'
      }]),
      description: 'some testing lab',
      create_date: new Date('2019-05-26'.replace(/\s/, 'T')),
      modified_date: new Date('2019-05-26'.replace(/\s/, 'T'))
    }
  }),

  mounted: function () {
    // TODO: load the true lab with id
    this.info = this.testLab
    this.isLoading = false
    this.editing = true
  },
  watch: {
    $route (to, from) {
      // react to route changes...
      this.labId = this.$route.params.labId
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.loggedIn
    },
    labId () {
      return parseInt(this.$route.params.labId)
    },
    isOwner () {
      // return this.info.owner_email === this.$store.state.userEmail
      return true
    },
    infoTable () {
      return [{
        name: '学校', value: this.info.school
      }, {
        name: '院系', value: this.info.department
      }, {
        name: '地址', value: this.info.address
      }, {
        name: '联系电话', value: this.info.phone
      }, {
        name: '主页', value: this.info.front_page_url
      }]
    }
  },
  methods: {
    editPage () {
      // TODO: authentication
      this.$router.push({ name: 'labedit', params: { labId: this.labId } })
    },
    onEditPage () {
      this.isEditing = true
    }
  }
}
</script>
