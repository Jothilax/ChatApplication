import User from "../models/user.model.js";
import bycrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async(req,res)=>{
   try{
 const {fullName,username,password,confirmPassword,gender} = req.body;

 // Validate input
 if (!fullName || !username || !password || !gender) {
   return res.status(400).json({ error: "All fields are required" });
 }

 if (!username) {
   return res.status(400).json({ error: "Username is required" });
 }
 
 const existingUser  = await User.findOne({username});
 if(existingUser ){
    return res.status(400).json({error:"Username already exist"});
 }
 if (password!==confirmPassword) {
    return res.status(400).json({error:"Password doesn't match"});
 } 
//hashpassword
const salt = await bycrypt.genSalt(10);
const hashedPassword = await bycrypt.hash(password,salt);

//profilePic = https://avatar-placeholder.iran.liara.run/

//https://avatar.iran.liara.run/public/15

const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});
if (newUser) {
   //genrate jwt token
await generateTokenAndSetCookie (newUser._id,res);
await newUser.save();

   res.status(201).json({
      message: 'User created successfully' ,
               _id: newUser._id,
               fullName: newUser.fullName,
               username: newUser.username,
               profilePic: newUser.profilePic,
               gender : newUser.gender,
            
            });
} else {
    res.status(400).json({error:"Invalid user data"});
}


   }catch(error){
    console.log("Error in signup controller",error);
    res.status(500).json({error:"Internal server error"});
   }
};
export const login = async(req,res)=>{
   try {
      const {username,password}= req.body;
      const existingUser = await User.findOne({username});
      console.log("user : ", username);
      console.log("password : ", password);
      console.log("user?.password : ", existingUser?.password);
      const isPasswordCorrect  = await bycrypt.compare(password,existingUser?.password  || "");
      console.log("isPasswordCorrect : ", isPasswordCorrect);
      if(!existingUser || !isPasswordCorrect){
         console.log("Invalid Username or Password");
         return res.status(400).json({error:"Invalid Username or Password"});
      }else{
         generateTokenAndSetCookie(existingUser._id,res);
         return res.status(200).json({
         _id: existingUser._id,
         fullName: existingUser.fullName,
         username: existingUser.username,
         profilePic: existingUser.profilePic,
         gender : existingUser.gender,
      });
      }
      

   } catch (error) {
      console.log("Error in login controller",error);
    res.status(500).json({error:"Internal server error"});
   }
};
export const logout = (req,res)=>{
   try {
      res.cookie("jwt","",{maxAge:0});
      res.status(200).json({message:"Logout successfully"});
   } catch (error) {
      console.log("Error in login controller",error);
    res.status(500).json({error:"Internal server error"});
   }
};
