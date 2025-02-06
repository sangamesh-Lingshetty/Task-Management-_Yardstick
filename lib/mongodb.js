import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let chched = global.mongoose;

if (!chched) {
  chched = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
    if(chched.conn) return chched.conn;
    if(!chched.promise){
        chched.promise = mongoose.connect(MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
    }
    chched.conn = await chched.promise;
    return chched.conn;
}

export default connectDB;