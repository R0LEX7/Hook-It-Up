import mongoose, {model, Schema} from "mongoose";


const connectionRequestSchema = new Schema({

    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    },

    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    },

    status : {
        type: String,
        enum : ["interested" , "ignored" , "accepted" , "rejected"],
        required : true,
    }
}, {timestamps : true});

export const connectionRequestModel =  model("ConnectionRequest" , connectionRequestSchema);
