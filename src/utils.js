/*
 * Contains common functions for reuse
 */

import axios from 'axios'
import store from '@/store.js'

/*
 * Given user email and options, return an object containing user information
 * Example:
 *   getUserInfo('hehao@163.com',  (result)=>{
 *     // process response, see below for format
 *     },
 *     {
 *       requestLab: true,
 *       requestSeminar: true,
 *       requestProject: true,
 *       requestComment: true,
 *     })
 * Returns: {
 *   status_code: 0,
 *   bio: {
 *     real_name: 'Donald Trump',
 *     nick_name: 'Idiot',
 *     pic_url: '',
 *     school: 'Paradize',
 *     department: 'White House',
 *     title: 'Other',
 *     enrollment_date: '2000-01-01',
 *     labs: [],
 *     projects: [],
 *     seminars: [],
 *     comments: [],
 *     profile: '#### Profile title\nProfile content\n'
 *   }
 * }
 */
function requestUserInfo (userEmail, callback, options) {
  let requestLab = false
  let requestSeminar = false
  let requestProject = false
  let requestComment = false
  if (options !== undefined) {
    if (options.requestLab) {
      requestLab = options.requestLab
    }
    if (options.requestSeminar) {
      requestSeminar = options.requestSeminar
    }
    if (options.requestProject) {
      requestProject = options.requestProject
    }
    if (options.requestComment) {
      requestComment = options.requestComment
    }
  }

  let request = {
    dir: 'request',
    signature: {
      is_user: true,
      user_email: userEmail,
      password_hash: ''
    },
    content_type: 'account',
    content: {
      action: 'view',
      data: {
        lab: requestLab,
        project_create: requestProject,
        project_attend: requestProject,
        seminar_create: requestSeminar,
        seminar_attend: requestSeminar,
        comment: requestComment
      }
    }
  }

  axios
    .post(store.state.serverUrl + '/users/view/', request, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    .then(response => {
      if (response.data.content.data) {
        callback(response.data.content.data)
      } else {
        console.log('Error sending user info request: ', request)
      }
    })
}

function requestProjectInfo (projectId, callback) {
  let request = {
    dir: 'request',
    signature: {
      is_user: true,
      user_email: store.state.userEmail,
      password_hash: store.state.passwordHash
    },
    content_type: 'project',
    content: {
      action: 'view',
      data: {
        id: projectId
      }
    }
  }
  axios
    .post(store.state.serverUrl + '/project/view/', request, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    .then(response => {
      console.log(response)
      if (response.data.content.data) {
        callback(response.data.content.data)
      } else {
        console.log('Error sending project info request: ', request)
      }
    })
}

function requestSeminarInfo (projectId, callback) {
  let request = {
    dir: 'request',
    signature: {
      is_user: true,
      user_email: store.state.userEmail,
      password_hash: store.state.passwordHash
    },
    content_type: 'seminar',
    content: {
      action: 'view',
      data: {
        id: projectId
      }
    }
  }
  axios
    .post(store.state.serverUrl + '/seminar/view/', request, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    .then(response => {
      if (response.data.content.data) {
        callback(response.data.content.data)
      } else {
        console.log('Error sending seminar info request: ', request)
      }
    })
}

/*
 * return YYYY-MM-DD style date string
 */
function dateToYMD (date) {
  var d = date.getDate()
  var m = date.getMonth() + 1 // Month from 0 to 11
  var y = date.getFullYear()
  return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d)
}

export { requestUserInfo, requestProjectInfo, requestSeminarInfo, dateToYMD }
