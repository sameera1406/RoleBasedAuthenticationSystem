const jwt=require("jsonwebtoken");


async function authArtist(req,res,next){

    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECERT)
        if(decoded.role!=="artist"){
            return res.status(403).json({
                message:"you are not an artist "
            })
        }
        req.user=decoded;
        next(); 
    }catch(err){
        console.log(err);
        return res.status(401).json({
            message:"unauthorised"
        })
    }
}


module.exports={authArtist}