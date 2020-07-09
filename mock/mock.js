const db = require('./db.json');


module.exports = function () {
  return {
    list: db,
    getuser: db.profile
  }
}