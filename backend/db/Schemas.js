import mongoose, { model } from "mongoose";

const certificateSchema = new mongoose.Schema({
    email: String,
    driveFileId: String 
});

export const Certificate = mongoose.model("Certificate",certificateSchema);

