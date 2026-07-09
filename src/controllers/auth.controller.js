const userModel=require("../models/user.model");
const jwt=require('jsonwebtoken')
const bcrypt=require("bcryptjs")

async function registerUser(req,res){

    const {username,email,password,role="user"}=req.body

    const isUserAlreadyExists=await userModel.findOne({
        // username:username,
        // email:email
        //probelm with this it checks for the user with username and email but we want our user name and email to be unique so user $or
        //$or is like or condition if new user contains any exsisting username or email he is not allowed as a user
        $or:[
            {username},
            {email}
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({
            message:"user Already exisits"
        })
    }

    const hash = await bcrypt.hash(password,10) //10 is salt:a unique random value



    const user=await userModel.create({
        username,
        email,
        password:hash,
        role
    })

    const token = jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECERT)

    res.cookie("token",token)

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role,
        }
    })

}

//inlogin user should definetly enter username or email ,password
async function loginUser(req,res){

    const {username,email,password}=req.body;

    const user=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(!user){
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)
    //here it generates the hash of input password with the password hash stored
    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id:user._id,
        role:user.role,
    },process.env.JWT_SECERT)

    res.cookie("token",token)

    res.status(200).json({
        message:"User logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role,
        }
    })
}

module.exports={registerUser,loginUser}


