// const express = require("express");
// require("../src/db/conn")
// const jwt = require("jsonwebtoken")
// const MensRanking = require("../src/models/mens");
// const router = require("./routers/index") 
// //const Register = require (../src/component/Signin)
// //const static_path = path.join(_dirname, "../public")
// //const src_path = path.join(_dirname, "../src/assests")
// //const components_path = path.join(_dirname, "../src/components")
// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(router);
// //app.use(express.urlencoded({extended:false}));

// app.get("/registration",(req,resp)=>{
//     resp.render("register");
// })
// app.get("/Signin",(req,resp)=>{
//     resp.render("Signin");
// })

// // const createToken = async() =>{//pass payload here{}
// //   const token =  await jwt.sign({_id:"63a85df96dd6cf0e57929424"},"mynameishammadahsanabcdefghijklmnop",{
// //     expiresIn:"1 hour"
// //   });
// //     console.log(token);

// //     const userverify = await jwt.verify(token,"mynameishammadahsanabcdefghijklmnop");
// //     console.log(userverify);
// // }

// // createToken();

// app.listen(port,()=>{
//     console.log(`Connection is live at port no,${port}`);
// })