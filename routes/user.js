const express=require("express");
const route=express.Router();
const {handleUserSignup,handleUserSignin}=require("../controllers/user");

route.get("/signin",(req,res)=>{
    return res.render("signin");
});

route.post("/signin",handleUserSignin);

route.get("/signup",(req,res)=>{
    return res.render("signup");
});

route.post("/signup",handleUserSignup);

route.get("/logout",(req,res)=>{
    return res.clearCookie("token").redirect("/");
});


module.exports=route;
