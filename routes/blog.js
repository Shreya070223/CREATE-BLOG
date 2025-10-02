const express=require("express");
const router=express.Router();
const multer=require("multer");
const Blog=require("../models/blog");
const Comment=require("../models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/upload`);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null,filename);
  }
})

const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{user:req.user});
})

router.get("/:id",async (req,res)=>{
 const blog=await Blog.findById(req.params.id).populate("createdBy");
 const comments=await Comment.find({blogId:req.params.id}).populate("createdBy");
 console.log("blog",blog);
 return res.render("blog",{
  user:req.user,blog,comments
 });
})

router.post("/",upload.single("coverImageUrl"),async (req,res)=>{
    const {body,title}=req.body;
    const blog=await Blog.create({
        title,
        body,
        coverImageUrl:`/upload/${req.file.filename}` ,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${blog._id}`);
})

router.post("/comment/:blogId",async (req,res)=>{
  const comment=await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports=router;