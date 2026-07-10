const musicModel=require("../models/music.model");
const albumModel= require("../models/album.model")
const jwt=require("jsonwebtoken");
const {uploadFile} = require("../services/storage.service")
//here we  have to create a method 


async function createMusic(req,res){
    
    const token = req.cookies.token;

    if(!token){ //request by some one who dont have token 
        return res.status(401).json({
            message:"unautorized"
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECERT)
        if(decoded.role!=="artist"){
            return res.status(403).json({
                message:"you don't have access to create an music"
            })
        }
   

    const {title} = req.body;
    const file=req.file;

    const result=await uploadFile(file.buffer.toString('base64'))

    const music = await musicModel.create({
        uri:result.url,
        title,
        artist:decoded.id,
    })

    res.status(201).json({
        message:"Music created successfully",
        music:{
            id:music._id,
            uri:music.uri,
            title:music.title,
            artist:music.artist,
        }
    })}catch(err){
        return res.status(401).json({
            message:"unauthoried"
        })
    }
} 

async function createAlbum(req,res){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"unauthorized"
        })
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECERT)

        if(decoded.role!=="artist"){
            return res.status(403).json({
                message:"you donot have access to create album"
            })
        }
        const {title,musics}=req.body;
        const album=await albumModel.create({
            title,
            artist:decoded.id,
            musics:musics,
        })

        res.status(201).json({
            message:"album created successfully",
            album:{
                id:album._id,
                title:album.title,
                artist:album.artist,
                musics:album.musics,
            }
        })

    }catch(err){
        console.log(err);
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
}

module.exports={createMusic,createAlbum}