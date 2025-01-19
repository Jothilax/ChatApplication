import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

senderId:{
required:true,
ref:"User",
type:mongoose.Schema.Types.ObjectId,
},
receiverId:{
required:true,
ref:"User",
type:mongoose.Schema.Types.ObjectId,
},
message:{
type:String,
required:true, 
}
},{timestamps:true});

const Message = mongoose.model("Message" , messageSchema);
export default Message;