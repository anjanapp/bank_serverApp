//db connection

//import mongoose -- to connect server and db
const mongoose = require('mongoose')

//connection string  //server and mongodb connection
                                             //db name
mongoose.connect('mongodb://localhost:27017/bankApp',{
    useNewUrlParser:true   //telling that we are connecting server n mongodb using useNewUrlParser,if not give no problem,bt there will be a warning
      
})

//model(mongodb collection) definition--- creating collection
const User = mongoose.model('User',{      //collection singular name and corresponding collection name plural will be created in db,first letter caps
    acno:Number,                                     //key and value stored in db
    username:String,
    password:String,
    balance:Number,
    transaction:[] 
}) 

module.exports={
    User
}