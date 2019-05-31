<template>
  <div class="lab">
    <el-image class="center" style="height: 200px" fit="cover" :src="testLab.pic_url"/>

    <el-container>
      <el-main>
        <h1 id="labName" style="text-align: center"> {{info.name}} </h1>
      </el-main>
    </el-container>
    <el-container>
      <el-divider>基本信息</el-divider>
    </el-container>
    <el-container>
      <el-button
        v-if="isOwner"
        class="center"
        type="text"
        @click="onEditPage"
      >编辑</el-button>
    </el-container>
    <!-- Basic information for lab -->
    <el-main v-if="isEditing">
      <el-divider>编辑实验室信息</el-divider>
      <PostFormLab :originLab="info"/>
      <el-form ref="seminarForm" :model="info" :rules="rules" label-width="120px" status-icon>
        <el-form-item label="实验室名称" prop="name">
          <el-input v-model="info.name"></el-input>
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
    </el-main>
    <el-main v-else>
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
      <el-divider>成员</el-divider>
      <el-container>
        <lab-supervisor-card
          v-for="(s, index)  in toCamelCase(supervisors)"
          :supervisor="s"
          :key="index"/>
      </el-container>
      <el-container>
        <comment-area type="lab" :id="labId"/>
      </el-container>
      <el-divider>简介</el-divider>
      <el-container>
        <VueShowdown :markdown="info.description"/>
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
import MarkdownEditor from 'vue-simplemde/src/markdown-editor'
import CommentArea from '@/components/CommentArea.vue'
import LabSupervisorCard from '@/components/LabSupervisorCard.vue'
import PostFormLab from '@/components/PostFormLab.vue'
// import axios from 'axios'

export default {
  components: {
    MarkdownEditor,
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
    // TODO: load the true lab with id
    this.info = this.testLab
    this.isLoading = false
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
    editPage () {
      // TODO: authentication
      this.$router.push({ name: 'labedit', params: { labId: this.labId } })
    },
    onEditPage () {
      this.isEditing = true
    },
    toCamelCase (underlines) {
      underlines.forEach((s, i) => {
        let cs = s
        cs.isUser = s.is_user
        cs.accountEmail = s.account_email
        cs.contactEmail = s.contact_email
        cs.picUrl = s.pic_url
        return cs
      })
      return underlines
    }
  }
}
</script>
