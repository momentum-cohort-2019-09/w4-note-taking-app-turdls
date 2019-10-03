const uuidv4 = require('uuid/v4')

const turdLTrinkets = {

setCredentials: function (username, password) {
    this.credentials = {
        username: username,
        password: password
    }
    sessionStorage.setItem('username', username)
    sessionStorage.setItem('password', password)
},

addAuthHeader: function (headers) {
    if (!headers) { headers = {} }

    return Object.assign({}, headers, {
      'Authorization': 'Basic ' + btoa(`${app.data.credentials.username}:${app.data.credentials.password}`)
    })
  },

getTrinkets: function (),



addTrinket: function (???) {
    const uuid = uuidv4
    const newTrinket = { 'title': title, 'tags': tags, 'content': content, 'id': uuid }
}
}