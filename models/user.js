const mongoose=require("mongoose");
const {createHmac,randomBytes}=require("crypto");
const {createToken,verifyToken}=require("../service/authentication");

const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true, 
    },
    salt:{
        type:String,
    },
    passward:{
        type:String,
        require:true, 
    },
    profilePhotoUrl:{
        type:String, 
        default:"/images/default.avif",
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }

},{timestamps:true});

userSchema.pre("save",function(next){
    const user=this;
    if(!user.isModified("passward"))return;

    const salt=randomBytes(16).toString();
    const hashedPassward=createHmac("sha256",salt).update(user.passward)
    .digest("hex"); //sha256 is an algotirhm
    this.salt=salt;
    this.passward=hashedPassward;
    next();
})

userSchema.static("matchPasswardAndGenerateToken",async function(email,passward){
    const user=await this.findOne({email});
    if(!user) throw new Error("user not found");
    const salt=user.salt;
    const hashedPassward=user.passward;
    const userprovpass=createHmac("sha256",salt).update(passward)
    .digest("hex");

    if(hashedPassward!==userprovpass) throw new Error("wrong passward!");

    const token=createToken(user);
    return token;
})

const User=mongoose.model("user",userSchema);

module.exports=User;