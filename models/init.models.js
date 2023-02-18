const Repair = require("./repairs.models")
const User = require("./users.model")

// ____----> RELACIONES <----____

const initModel = () => {
  
  // USER <----> REPAIRS
  User.hasMany(Repair)
  Repair.belongsTo(User)
}

module.exports = initModel
