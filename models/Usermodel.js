const mongoose = require("mongoose");

const user = mongoose.Schema({
    metamaskid:{
        type: String,
        required : true,
        unique: true
      },
      name:{
        type: String,
        required: true
      },
      password:{
        type: String,
        required : true
      },
      cnic:{
           type:String,
           required:true
      },
      phonenumber:{
        type:String,
        required:true
      },
      email:{
        type: String,
        required : true,
        unique : true
      },
      dob:{
        type: Date,
        required: true
      },
      token:{
        type:String,
        default:''
      },
      isAdmin:{
        type:Boolean,
        default:false
      },

});

module.exports =  mongoose.model("User",user);