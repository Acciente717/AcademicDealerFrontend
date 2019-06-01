<template>
  <div>
    <el-divider>
      <el-button
        style="margin-left: 10px; margin-right: 10px;"
        type="text"
        :icon="advancedOptionsIcon"
        @click="showComment"
      >讨论区</el-button>
    </el-divider>
    <div v-if="!hideComments">
      <div v-if="isLoggedIn">
        <el-input :rows="3" placeholder="添加一条评论吧" v-model="text" maxlength="30">
          <el-button type="primary" slot="append" @click="postComment">发布评论</el-button>
        </el-input>
      </div>
      <div v-if="!isLoggedIn">
        要添加评论，请登录/注册~
      </div>
      <el-card
        v-for="comment in comments"
        :key="comment.id"
        shadow="none"
        style="margin-top:5px; margin-bottom:5px;"
      >
        <div>
          <el-container>
            <el-aside width="44px" style="height:44px;">
              <user-icon-with-popup style="width:44px; height:44px;" :user="comment.owner"></user-icon-with-popup>
            </el-aside>
            <el-main style="padding-top:0px; padding-left: 10px;">
              <el-link @click="goToUserPage(comment.owner)">{{comment.owner}}</el-link>
              <el-link
                type="primary"
                v-if="canEditComment(comment)"
                @click="commentUnderEdit = comment; dialogVisible = true; editedComment = comment.description"
              >
                <small>&nbsp;编辑评论&nbsp;</small>
              </el-link>
              <el-link
                type="danger"
                v-if="canDeleteComment(comment)"
                @click="deleteComment(comment)"
              >
                <small>&nbsp;删除评论&nbsp;</small>
              </el-link>
              <br>
              <small>发布于: {{displayedDate(new Date(comment.create_date))}}</small>
              <el-divider direction="vertical"></el-divider>
              <small>最后更新: {{displayedDate(new Date(comment.modified_date))}}</small>
            </el-main>
          </el-container>
        </div>
        <div>{{comment.description}}</div>
      </el-card>
    </div>
    <el-dialog title="编辑评论" :visible.sync="dialogVisible" width="80%">
      <el-input v-model="editedComment"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editComment(commentUnderEdit)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
</style>

<script>
import {
  requestProjectInfo,
  requestSeminarInfo,
  requestLabInfo,
  dateToYMDHMS
} from '@/utils.js'
import axios from 'axios'
import UserIconWithPopup from '@/components/UserIconWithPopup.vue'

export default {
  components: {
    UserIconWithPopup
  },
  props: ['type', 'id'],
  data: () => ({
    hideComments: true,
    text: '',
    commentIds: [],
    comments: [],
    dialogVisible: false,
    editedComment: '',
    commentUnderEdit: {}
  }),
  computed: {
    advancedOptionsIcon () {
      return this.hideComments ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
    isLoggedIn () {
      return this.$store.state.loggedIn
    }
  },
  methods: {
    showComment () {
      this.hideComments = !this.hideComments
      this.updateCommentInfo()
    },
    updateCommentInfo () {
      switch (this.type) {
        case 'project':
          requestProjectInfo(this.id, response => {
            if (response.status === 0) {
              this.commentIds = response.comments
              this.requestComments()
            } else {
              this.$message.error(
                'Request Project Info Error: Status ' + response.status
              )
            }
          })
          break
        case 'seminar':
          requestSeminarInfo(this.id, response => {
            if (response.status === 0) {
              this.commentIds = response.comments
              this.requestComments()
            } else {
              this.$message.error(
                'Request Seminar Info Error: Status ' + response.status
              )
            }
          })
          break
        case 'lab':
          requestLabInfo(this.id, response => {
            if (response.status === 0) {
              this.commentIds = response.comments
              this.requestComments()
            } else {
              this.$message.error(
                'Request Lab Info Error: Status ' + response.status
              )
            }
          })
          break
        default:
          this.$message.error('Wrong CommentArea Type: ' + this.type)
          break
      }
    },
    requestComments () {
      this.comments = []
      for (let i = 0; i < this.commentIds.length; ++i) {
        let id = this.commentIds[i]
        let request = {
          dir: 'request',
          signature: {
            is_user: true,
            user_email: this.$store.state.userEmail,
            password_hash: this.$store.state.passwordHash
          },
          content_type: this.type,
          content: {
            action: 'comment_view',
            data: {
              comment_id: id
            }
          }
        }

        axios
          .post(
            this.$store.state.serverUrl + '/' + this.type + '/comment/view/',
            request,
            {
              headers: {
                'Content-Type': 'text/plain'
              }
            }
          )
          .then(response => {
            let status = response.data.content.data.status
            if (status === 0) {
              this.comments.push(response.data.content.data)
            } else {
              this.$message.error('Comment View Response: Status ' + status)
            }
          })
      }
    },
    postComment () {
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: this.type,
        content: {
          action: 'comment_create',
          data: {
            id: this.id,
            description: this.text
          }
        }
      }

      axios
        .post(
          this.$store.state.serverUrl + '/' + this.type + '/comment/create/',
          request,
          {
            headers: {
              'Content-Type': 'text/plain'
            }
          }
        )
        .then(response => {
          let status = response.data.content.data.status
          if (status === 0) {
            this.updateCommentInfo()
          } else {
            this.$message.error('Comment Post Response: Status ' + status)
          }
        })
    },
    canEditComment (comment) {
      return comment.owner === this.$store.state.userEmail
    },
    canDeleteComment (comment) {
      return comment.owner === this.$store.state.userEmail
    },
    editComment (comment) {
      this.dialogVisible = false

      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: this.type,
        content: {
          action: 'comment_edit',
          data: {
            comment_id: comment.comment_id,
            description: this.editedComment
          }
        }
      }

      axios
        .post(
          this.$store.state.serverUrl + '/' + this.type + '/comment/edit/',
          request,
          {
            headers: {
              'Content-Type': 'text/plain'
            }
          }
        )
        .then(response => {
          let status = response.data.content.data.status
          if (status === 0) {
            this.updateCommentInfo()
          } else {
            this.$message.error('Comment Edit Response: Status ' + status)
          }
        })

      this.updateCommentInfo()
    },
    deleteComment (comment) {
      let request = {
        dir: 'request',
        signature: {
          is_user: true,
          user_email: this.$store.state.userEmail,
          password_hash: this.$store.state.passwordHash
        },
        content_type: this.type,
        content: {
          action: 'comment_delete',
          data: {
            comment_id: comment.comment_id
          }
        }
      }
      console.log(request)
      axios
        .post(
          this.$store.state.serverUrl + '/' + this.type + '/comment/delete/',
          request,
          {
            headers: {
              'Content-Type': 'text/plain'
            }
          }
        )
        .then(response => {
          let status = response.data.content.data.status
          if (status === 0) {
            this.updateCommentInfo()
          } else {
            this.$message.error('Comment Delete Response: Status ' + status)
          }
        })
    },
    goToUserPage (email) {
      this.$router.push('/user/' + email)
    },
    displayedDate (date) {
      return dateToYMDHMS(date)
    }
  },
  mounted () {
    this.updateCommentInfo()
  }
}
</script>
