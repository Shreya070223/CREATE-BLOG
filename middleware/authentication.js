const {createToken,varifyToken}=require("../service/authentication");

function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookeiValue=req.cookies[cookieName];
        if(!tokenCookeiValue){
            console.log("Cookie is not applied");
           return next();
        }
        try {
            const userPayload=varifyToken(tokenCookeiValue);
            req.user=userPayload;
        } catch (error) { 
            console.error("Error verifying token:", error);
            return res.status(401).json({ error: "Invalid token" });
        }
        return next();
        
    }

}

module.exports={checkForAuthenticationCookie}