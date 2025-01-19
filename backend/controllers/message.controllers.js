import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage = async(req,res) => {
    try {
        const {message} = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants : {$all : [senderId,receiverId]}
        });

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId]
            });
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });
        if(newMessage){
        conversation.message.push(newMessage._id);
        }

        await conversation.save();
        await newMessage.save();

        //this will run in parallel 
        //await Promise.all([ conversation.save(),newMessage.save()]);

        //socket functionality code here

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in message controller",error);
    return res.status(500).json({error:"Internal server error"});
    }
   

}

export const getMessages = async(req,res)=>{

    try {
        console.log("getmessage called");
        const {id : userToChatId} =req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: {$all : [senderId , userToChatId] },
         }).populate("message");//not ref but actual message
         console.log("conversation :" , conversation);
         if(!conversation) return res.status(200).json([]);

          const msg = conversation.message;
          return res.status(200).json(msg);
    } catch (error) {
        console.log("Error in getmessage controller",error);
    return res.status(500).json({error:"Internal server error"});
    }
};

