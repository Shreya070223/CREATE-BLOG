const JWT=require("jsonwebtoken");

const secret="shreya@1234";

function createToken(user){
    const payload={
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profilePhotoUrl:user.profilePhotoUrl,
        role:user.role,
    }
    const token=JWT.sign(payload,secret);
    return token;
}

function varifyToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports={createToken,varifyToken}