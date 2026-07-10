const musicModel=require("../models/music.model");
const albumModel= require("../models/album.model")
const jwt=require("jsonwebtoken");
const {uploadFile} = require("../services/storage.service")
//here we  have to create a method 


async function createMusic(req,res){
    
    
    const {title} = req.body;
    const file=req.file;

    const result=await uploadFile(file.buffer.toString('base64'))

    const music = await musicModel.create({
        uri:result.url,
        title,
        artist:req.user.id,
    })

    res.status(201).json({
        message:"Music created successfully",
        music:{
            id:music._id,
            uri:music.uri,
            title:music.title,
            artist:music.artist,
        }
    })
}

async function createAlbum(req,res){
    
        const {title,musics}=req.body;
        const album=await albumModel.create({
            title,
            artist:req.user.id,
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

}

module.exports={createMusic,createAlbum}