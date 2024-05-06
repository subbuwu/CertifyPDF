import mongoose from "mongoose"

export const initDB = async() => {
    try{
        const res = await mongoose.connect(process.env.MONGO_DB_URL);
        if(res){
            console.log("Connected to DB")
        }
    } catch(err){
        console.log(`Error connecting to DB : ${err}`);
    }
}