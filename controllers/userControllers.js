const User = require("../models/Usermodel");
const OTP = require("../models/OTPModel");
const bcryptjs = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { generate } = require("randomstring");
const bodyParser = require("body-parser");
const CastVote = require('../models/CastVote');
const Candidate = require('../models/Candidate');

// token generate method
const create_token = async(id)=>{
    try {
      const token = await  jwt.sign({_id:id},config.secret_jwt);
      return token;
    } catch (error) {
        res.status(400).send(error.message); 
    }
}

// Secure Password generate method
const securePassword = async(password)=>{
    try {
        
       const passwordHash = await bcryptjs.hash(password,10);
       return passwordHash;
    } catch (error) {
        res.status(400).send(error.message); 
    }
}

const userProfile = async (req, res) => {
    try {
      const userId =  req.user_id; // Retrieve user ID from the decoded token
  
      // Find user information based on the user ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve user profile.", error: error.message });
    }
  };
//Register

const register_user = async(req, res) =>{
    try {
        if(req.body.password===req.body.confirmpassword){
          const spassword = await securePassword(req.body.password);
            const user = new User({
                name : req.body.name,
                cnic:req.body.cnic,
                email:req.body.email,
                dob:req.body.dob,
                phonenumber:req.body.phonenumber,
                password:spassword,
                metamaskid: req.body.metamaskid,
        });
 
        const userData = await User.findOne({email:req.body.email});
        if(userData)
        {
            res.status(200).send({success:false,msg:"This email already exists!"});
        }
        else{
            const user_data = await user.save();
            res.status(200).send({success:true,data:user_data});
        }

        }
        else{
            res.status(400).send({success:false,msg:"Password Doesnot match"});
        }
     
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//login check
const user_login = async(req,res)=>{
    try {
        const{cnic, phonenumber, password} = req.body;

        const userData = await User.findOne({cnic, phonenumber});
        if(userData != null){
            const passwordMatch = await bcryptjs.compare(password,userData.password);
            if(passwordMatch){
                const tokenData = await create_token(userData._id);
                const userResult ={
                    _id:userData._id,
                    metamaskid:userData.metamaskid,
                    email:userData.email,
                    name:userData.name,
                    password:userData.password,
                    dob:userData.dob,
                    token:tokenData
                }
                const response ={
                    success:true,
                    msg:"User Details",
                    data:userResult
                }
                res.status(200).send(response);
            }
            else{
                res.status(400).send({success:false,msg:"Login Details are incorrect"});
            }
        }
        else{
            res.status(400).send({success:false,msg:"Login Details are incorrect"});
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


// Sending OTP to email
const send_otp = async(req,res)=>{
    const {email} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        const otp_code = await OTP.findOneAndUpdate({ email }, { otp }, { upsert: true });
        const transporter =  nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailAdmin,
                pass:config.emailPassword,
            }
        });
        const mailOptions = {
            from: config.emailAdmin,
            to : email,
            subject: 'Your OTP for Email verification',
            text:`Your OTP for email verification is ${otp}.`
         }
         await transporter.sendMail(mailOptions);
         res.send('OTP sent'); 
    } catch (error) {
        console.log(error);
        res.status(500).send("Error Sending OTP");
    }
}

// verify OTP
const verify_otp = async(req,res)=>{
    const {email, otp } = req.body;
   try {
    const user_otp = await OTP.findOne({ email, otp});
    if(user_otp)
    {
        res.status(200).send("OTP Verified");
    }
    else
    {
        res.status(400).send("OTP verification failed");
    }
   } catch (error) {
    console.log(error);
    res.status(500).send("Error Verifying OTP");
   }
}
// Forget Password Method
const forget_password = async(req,res)=>{
    try {
        const email= req.body.email;
        const userData = await User.findOne({email:req.body.email});
        if(userData)
        {
        const randomString =  randomstring.generate();
        const data = await  User.updateOne({email:email},{$set:{token:randomString}});
        sendresetPasswordMail(userData.name,userData.email,randomString);
        res.status(200).send({success:true, message:"Please check your email inbox to reset your password"});
        }
        else{
            res.status(200).send({success:true, message:"This email does not exists!"});
        }
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});  
    }
}
// Send reset password mail 
const sendresetPasswordMail = async(name,email,token)=>{
    try {
     const transporter =  nodemailer.createTransport({
           host:'smtp.gmail.com',
           port:587,
           secure:false,
           requireTLS:true,
           auth:{
               user:config.emailAdmin,
               pass:config.emailPassword,
           }
       });

       const mailOptions = {
           from: config.emailAdmin,
           to : email,
           subject: 'For Password Reset',
           html:'<p> Hi'+name+'please click on the link <a href="http://127.0.0.1:3000/api/reset-password?token='+token+'">to reset your password </a>'
        }
        transporter.sendMail(mailOptions,function(error,info){
          if(error)
          {
            console.log(error);
          }
          else{
           console.log('Mail has been sent',info.response);
          }
        });
    } catch (error) {
       res.status(400).send({success:true,message:error.message});
    }
}
const reset_password = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const user = await User.findOne({ token });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid token' });
      }
      const securePassword = await bcryptjs.hash(newPassword, 10);
      user.password = securePassword;
      user.token = null;
      await user.save();
      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

// Cast Vote
const cast_vote = async (req, res) => {
    try {
      const user_id = req.user_id;
      const { candidate_id } = req.body;
  
      const voteData = await CastVote.findOne({ user_id });
      if (voteData !== null) {
        return res.status(400).send({ success: false, msg: "Vote has already been casted" });
      }
  
      // Find candidate by name
      const candidateData = await Candidate.findOne({ _id: candidate_id });

      if (candidateData === null || candidateData === undefined) {
        return res.status(400).send({ success: false, msg: "Invalid candidate name" });
      }
  
      // Save vote
      const vote = new CastVote({
        user_id,
        candidate_id,
        candidate_name: candidateData.candidate_name,
      });
      await vote.save();
  
      res.status(200).send({ success: true, msg: "Vote casted successfully" });
    } catch (error) {
      res.status(400).send({ success: false, msg: error.message });
    }
  };
  
  
  
  
  
  

module.exports ={
    create_token,
    register_user,
    user_login,
    forget_password,
    reset_password,
    cast_vote,
    send_otp,
    verify_otp,
    userProfile
   
};

