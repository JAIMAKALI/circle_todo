const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI,()=>{
  console.log('database is connected');
})

module.exports = {
  mongoose
}