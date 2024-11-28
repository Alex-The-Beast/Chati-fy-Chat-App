import jwt from "jsonwebtoken"
export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"14d"
    })
    res.cookie("jwt",token,{
        maxAge:14*24*60*60*1000,  // this is in milisecond
        httpOnly:true, //prevent xss attacks cross-site scripting attacks
        sameSite:"strict", //csrf attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !=="developement"
    })

    return token

}
