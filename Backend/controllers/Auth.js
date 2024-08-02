const bcrypt = require("bcrypt");
const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.signup = async (req, res) => {
  try {
    //get data
    const { name, password, email, role } = req.body;

    // Check if user is already exist.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //Secure password

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error in hashing password.",
          });
    }

    // Create Entry for user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });
    return res.status(200).json({
        success: true,
        message: "User Created Successfully.",
      });
  }

  
   catch(err) {
    return res.status(500).json({
        success: false,
        message: "User can not registered please try again later.",
      });
  }
};




exports.login =async( req,res)=>{

  try{
    //data fetching
  const {email,password} = req.body;

  //validation on email and password
  if(!email || !password){
    return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
  }
  
  // Check for registered user
  let user = await User.findOne({email})

  // if not a register user
  if( !user){
    return res.status(401).json({
        success: false,
        message: "User not found.",
      });
  }



  const payload = {
    email : user.email,
    id : user._id,
    role:user.role
  }

// verify password & generate a jwt token
  if(await bcrypt.compare(password, user.password)){
    //password match
    const token = jwt.sign(payload,
                            process.env.JWT_SECRET,
                          {
                            expiresIn:"2h",
                          }) 

      user = user.toObject();
      // console.log(user)
      user.token = token;
      // console.log(user)
      user.password = undefined;
      // console.log(user)

      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

      res.cookie("Aman", token, option).status(200).json({
        success:true,
        token,
        user,
        message:"User Logged in successfully"
      })
    
  }
  else{
    //password do not match
    return res.status(403).json({
      success : false,
      message:"Password incorrect"
    })
  }
}
  catch(err){
    console.log(err)
    return res.status(500).json({
      success:false,
      message:"User can't be logged in"
    })
  }
  

}
