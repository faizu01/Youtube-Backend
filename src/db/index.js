import mongoose from "mongoose";
import {DB_NAME} from "../utils/constants.js"
const connectToDB=async()=>{
    try{
       const connection=await mongoose.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`)
       console.log("MongoDB connected successfully ");
    }catch(error){
        console.log(`MongoDB connection Failed: ${error}`);
        process.exit(1);
    }
}

export default connectToDB;