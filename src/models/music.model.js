const  mongoose=require('mongoose')

const musicSchema=new mongoose.Schema({
    uri:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    artist:{
        type:mongoose.Schema.Types.ObjectId,//this is the id of user created so far 
        ref:"user",//this is the reference of the user  const userModel=mongoose.model("user",userSchema) this user ref
        required:true,
    }
})


const musicModel=mongoose.model("music",musicSchema)

module.exports=musicModel;