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

function requestLabInfo (labId, callback) {
  let request = {
    dir: 'request',
    signature: {
      is_user: true,
      user_email: store.state.userEmail,
      password_hash: store.state.passwordHash
    },
    content_type: 'lab',
    content: {
      action: 'view',
      data: {
        id: labId
      }
    }
  }
  axios
    .post(store.state.serverUrl + '/lab/view/', request, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    .then(response => {
      // console.log(response)
      if (response.data.content.data) {
        response.data.content.data.owner_email = response.data.content.data.owner
        callback(response.data.content.data)
      } else {
        console.log('Error sending project info request: ', request)
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

/*
 * return string of time in HH:MM:SS style
 */
function timeToHMS (time) {
  var h = time.getHours()
  var m = time.getMinutes()
  var s = time.getSeconds()
  return '' + (h <= 9 ? '0' + h : h) + ':' + (m <= 9 ? '0' + m : m) + ':' + (s <= 9 ? '0' + s : s)
}
/*
 * return full time
 */
function timeToString (time) {
  return dateToYMD(time) + ' ' + timeToHMS(time)
}

/*
 * return YYYY-MM-DD HH:MM:SS style date string
 */
function dateToYMDHMS (date) {
  var d = date.getDate()
  var m = date.getMonth() + 1 // Month from 0 to 11
  var y = date.getFullYear()
  var h = date.getHours()
  var min = date.getMinutes()
  var s = date.getSeconds()
  return (
    '' +
    y +
    '-' +
    (m <= 9 ? '0' + m : m) +
    '-' +
    (d <= 9 ? '0' + d : d) +
    ' ' +
    (h <= 9 ? '0' + h : h) +
    ':' +
    (min <= 9 ? '0' + min : min) + ':' + (s <= 9 ? '0' + s : s)
  )
}

export { requestUserInfo, requestLabInfo, requestProjectInfo, requestSeminarInfo, dateToYMD, dateToYMDHMS, timeToString }
