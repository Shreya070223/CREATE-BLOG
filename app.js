require("dotenv").config();

const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const port=process.env.PORT;


const Blog=require("./models/blog");

const UserRout=require("./routes/user");
const BlogRout=require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middleware/authentication");

mongoose.connect(process.env.MONGO_URL)
.then((e)=>console.log("mongodb connected"));

app.set("view engine",'ejs');
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/",async(req,res)=>{
   const allBlogs=await Blog.find({});
   return res.render("home",{user:req.user,blog:allBlogs});
})

app.use("/user",UserRout);
app.use("/blog",BlogRout);

app.listen(port,()=>console.log(`server started at port-${port}`));