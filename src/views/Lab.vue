<template>
  <div class="lab">
    <el-image class="center" style="height: 200px" fit="cover" :src="testLab.pic_url"/>

    <el-container>
      <el-main>
        <h1 id="labName" style="text-align: center"> {{info.name}} </h1>
      </el-main>
    </el-container>
    <!-- Basic information for lab -->
    <el-main v-if="isEditing">
      <el-divider>编辑实验室信息</el-divider>
      <PostFormLab :originLab="info"/>
      <el-button type="text" @click.prevent="onCancelEditing">取消编辑</el-button>
      <el-button type="danger" @click.prevent="onDeleteLab">删除实验室</el-button>
    </el-main>
    <el-main v-else>
      <el-container>
        <el-divider>基本信息</el-divider>
      </el-container>
      <el-container>
        <el-table
          :data="infoTable"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="项目"
            width="180px">
          </el-table-column>
          <el-table-column
            prop="value"
            label="内容">
          </el-table-column>
        </el-table>
      </el-container>
      <el-container>
        <el-aside>
          <el-divider>成员</el-divider>
          <el-container direction="vertical">
            <lab-supervisor-card
              v-for="(s, index)  in toCamelCase(supervisors)"
              :supervisor="s"
              :key="index"/>
          </el-container>
        </el-aside>
        <el-main style="padding: 0px">
          <el-divider>简介</el-divider>
          <el-container>
            <VueShowdown :markdown="info.description"/>
          </el-container>
        </el-main>
      </el-container>
      <el-container>
        <comment-area type="lab" :id="labId"/>
      </el-container>
      <el-container>
        <el-button
          v-if="isOwner"
          type="text"
          @click="onEditPage"
        >编辑</el-button>
      </el-container>
    </el-main>
  </div>
</template>

<style scoped>
@import "~simplemde/dist/simplemde.min.css";
#labName {
  font-size: xx-large;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>

<script>
import { requestLabInfo } from '@/utils.js'
import CommentArea from '@/components/CommentArea.vue'
import LabSupervisorCard from '@/components/LabSupervisorCard.vue'
import PostFormLab from '@/components/PostFormLab.vue'
import axios from 'axios'

export default {
  components: {
    CommentArea,
    LabSupervisorCard,
    PostFormLab
  },
  data: () => ({
    isLoading: true,
    isError: false,
    isEditing: false,
    info: {
      id: -1,
      name: '',
      school: '',
      department: '',
      owner_email: '',
      address: '',
      phone: '',
      front_page_url: '',
      pic_url: '',
      supervisors: '',
      comments: '',
      description: '',
      create_date: new Date('2019-05-26'.replace(/\s/, 'T')),
      modified_date: new Date('2019-05-26'.replace(/\s/, 'T'))
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
        pic_url: '',
        is_user: false,
        account_email: 't@t.t',
        contact_email: 't@t.t',
        address: 'yiheyuan 5',
        profile: '**very cool**'
      }, {
        name: 'other guy',
        school: 'test school',
        department: 'test department',
        title: 'prof',
        pic_url: '',
        is_user: false,
        account_email: 't@t.t',
        contact_email: 't@t.t',
        address: 'yiheyuan 5',
        profile: '**very cool**'
      }]),
      comments: JSON.stringify([{
        comment_id: 1,
        description: 'indeed cool'
      }]),
      description: 'some **testing** lab',
      create_date: new Date('2019-05-26'.replace(/\s/, 'T')),
      modified_date: new Date('2019-05-26'.replace(/\s/, 'T'))
    }
  }),

  mounted: function () {
    // this.info = this.testLab
    this.handleLabInfoChange()
    this.isEditing = false
  },
  watch: {
    $route (to, from) {
      this.handleLabInfoChange()
      this.isEditing = false
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
      return this.info.owner_email === this.$store.state.userEmail
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
      }, {
        name: '联系人邮箱', value: this.info.owner_email
      }]
    },
    supervisors () {
      if (this.info.supervisors !== undefined && this.info.supervisors !== '') {
        return JSON.parse(this.info.supervisors)
      } else {
        return []
      }
    }
  },
  methods: {
    handleLabInfoChange () {
      this.isLoading = true
      requestLabInfo(this.labId, response => {
        // console.log('info change response')
        // console.log(response)
        if (response.status === 0) {
          this.info = response
        } else {
          this.$message.error(
            'Request Lab Info Error: Status ' + response.status
          )
        }
      })
      this.isLoading = false
    },
    onEditPage () {
      this.isEditing = true
    },
    onDeleteLab () {
      this.$confirm('确定删除实验室？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmDeleteLab()
      }).catch(() => {})
    },
    confirmDeleteLab () {
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: 'lab',
        content: {
          action: 'delete',
          data: {
            id: this.labId
          }
        }
      }
      axios
        .post(this.$store.state.serverUrl + '/lab/delete/',
          request, {
            headers: {
              'Content-Type': 'text/plain'
            }
          })
        .then(response => {
          this.handleLabResponce(response)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleLabResponce (response) {
      // console.log(response)
      let statusCode = response.data.content.data.status
      if (statusCode !== 0) {
        this.$message.error('删除实验室信息错误，错误码：' + statusCode + '，请联系开发人员')
      } else {
        this.$message.info('删除实验室信息成功！')
        this.$router.go(-1)
      }
    },

    toCamelCase (underlines) {
      let cc = underlines
      cc.forEach((s, i) => {
        let cs = s
        cs.isUser = s.is_user
        cs.accountEmail = s.account_email
        cs.contactEmail = s.contact_email
        cs.picUrl = s.pic_url
        return cs
      })
      return cc
    },
    onCancelEditing () {
      this.$confirm('确定取消编辑实验室信息？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isEditing = false
      }).catch(() => {})
    }
  }
}
</script>
