// import mongoose from "mongoose";

// const connectToMongoDB = async ()=>{
//     try{
 
//  await mongoose.connect(process.env.MONGODB_URL);
//  console.log("MONGODB_URL:", process.env.MONGODB_URL);
//     }catch(error){
//         console.log("Error connecting to MongoDB :", error.message);
//     }
// }
// export default connectToMongoDB;


// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const connectToMongoDB = async () => {
//     try {
//          console.log("MONGODB_URL:", process.env.MONGODB_URL);
//         await mongoose.connect(process.env.MONGODB_URL, {
//             useNewUrlParser: true,
//             // useUnifiedTopology: true,
//         });
//         console.log("Connected to MongoDB successfully!");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     }
// };

// export default connectToMongoDB;

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToMongoDB = async () => {
  try {
    console.log("MONGODB_URL:", process.env.MONGODB_URL); // Debugging log
    await mongoose.connect(process.env.MONGODB_URL, {
     // useNewUrlParser: true,
     // useUnifiedTopology: true, // Uncomment this for improved compatibility
      // useFindAndModify: false,
      // useCreateIndex: true,
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

export default connectToMongoDB;
