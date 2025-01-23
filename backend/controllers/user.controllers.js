import User from "../models/user.model.js";

export const getUserForSidebar = async(req,res) =>{
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id : { $ne : loggedInUser } }).select("-password");
        return res.status(200).json(filteredUsers);

    } catch (error) {
         console.log("Error in getUserForSidebar controller",error);
        return res.status(500).json({error:"Internal server error"});
    }
}

// import User from "../models/user.model.js";
// import Message from "../models/message.model.js"; // Assuming this is the messages model

// export const getUserForSidebar = async (req, res) => {
//     try {
//         const loggedInUser = req.user._id;

//         // Aggregate to find users sorted by the latest message timestamp
//         const filteredUsers = await Message.aggregate([
//             {
//                 $match: {
//                     $or: [
//                         { sender: loggedInUser },
//                         { receiver: loggedInUser }
//                     ]
//                 }
//             },
//             {
//                 $sort: { timestamp: -1 } // Sort messages by latest timestamp
//             },
//             {
//                 $group: {
//                     _id: {
//                         $cond: [
//                             { $eq: ["$sender", loggedInUser] },
//                             "$receiver", // If sender is logged-in user, group by receiver
//                             "$sender"   // Otherwise, group by sender
//                         ]
//                     },
//                     latestMessage: { $first: "$timestamp" }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "_id",
//                     foreignField: "_id",
//                     as: "user"
//                 }
//             },
//             {
//                 $unwind: "$user"
//             },
//             {
//                 $project: {
//                     "user.password": 0, // Exclude password field
//                     latestMessage: 1
//                 }
//             },
//             {
//                 $sort: { latestMessage: -1 } // Sort by the latest message timestamp
//             }
//         ]);

//         // Return the sorted users
//         return res.status(200).json(filteredUsers.map(item => ({
//             ...item.user,
//             latestMessage: item.latestMessage
//         })));
//     } catch (error) {
//         console.log("Error in getUserForSidebar controller", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };
