const User=require("../models/user");

async function handleUserSignup(req,res) {
 const {fullname,email,passward}=req.body;

 if(!fullname || !email || !passward)return res.redirect("/signup");
  
 const user=await User.create({
    fullname,
    email,
    passward
 });

 return res.render("home",{user:user});

    
}

async function handleUserSignin(req,res) {
 const {email,passward}=req.body;


 try {
   const token=await User.matchPasswardAndGenerateToken(email,passward);
return res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use true only in HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 1 day
}).redirect("/");
   
 } catch (error) {
   return res.render("signin",{error:"incorrect password or email"});
 }
    
}

module.exports={handleUserSignup,handleUserSignin};