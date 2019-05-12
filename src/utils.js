/*
 * Contains common functions for reuse
 */

import axios from 'axios'
import store from '@/store.js'

/*
 * Given user email and options, return an object containing user information
 * Example:
 *   getUserInfo('hehao@163.com', {
 *     requestLab: true,
 *     requestSeminar: true,
 *     requestProject: true,
 *     requestComment: true,
 *   }, (result)=>{
 *     // process response, see below for format
 *   })
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
function requestUserInfo (userEmail, options, callback) {
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
        project: requestProject,
        seminar: requestSeminar,
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
      callback(response.data.content.data)
    })
}

export { requestUserInfo }
