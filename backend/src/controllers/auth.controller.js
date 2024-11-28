import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// signup function
const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    //condition checking for all field
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // condition checking of password length

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 character." });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists." });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating a user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user Data." });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// login function
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //checking user exist or not

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    // checking for password

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid Credentials" });
    } 

      // if password matched then generate a token and return reposnse
      const token = generateToken(user._id, res);
      res.status(200).json({
       
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic:user.profilePic ,
      });
   
  } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// logout function 
const logout = (req, res) => {
 try{
  // cookie expire in 0 sescond and put the value of jwt is empty
  res.cookie("jwt","",{maxAge:0})
  res.status(200).json({message:"Logged out successfully"})

 }catch(error){
  console.log("Error in logout controller",error.message)
  res.status(500).json({message:"Internal server error"})

 }
};


// update profile photo function
const updateProfile =async (req,res)=>{
  try{
    const {profilePic} =req.body
    const userId=req.user._id
    if(!profilePic){
      return res.status(400).json({message:"Profile pic is require."})
    }

    //these are claudinary inbuilt function 
    const uploadResponse= await cloudinary.uploader.upload(profilePic)
    const updateUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
    res.status(200).json({updateUser})

  }catch(error){
    console.log("Error in uploadProfile controller",error.message)
    res.status(500).json({message:"Internal server error"})


  }

}

const checkAuth=(req,res)=>{
  try{
    res.status(200).json(req.user)

  }catch(error){
    console.log("Error in checkAuth controller",error.message)
    res.status(500).json({message:"Internal server error"})

  }

}

export { signup, login, logout , updateProfile ,checkAuth};
 