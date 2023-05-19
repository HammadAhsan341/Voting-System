const mongoose = require("mongoose");
const candidateSchema = new mongoose.Schema({
    partyname:{
        type: String,
        required : true,
        
      },
      candidate_name:{
        type: String,
        required: true
      },
      qualification:{
        type: String,
        required : true
      },
      cnic:{
           type:String,
           required:true,
           unique:true
      },
      phonenumber:{
        type:String,
        required:true,
        unique:true
      },

      dob:{
        type: Date,
        required: true
      },

});
module.exports = mongoose.model("Candidate",candidateSchema)
