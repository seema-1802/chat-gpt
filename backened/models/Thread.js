
import mongoose from "mongoose";
const { Schema } = mongoose;

const Messageschema =new mongoose.Schema({
    role: {
        type :String,
       enum: ["user", "assistant"],
     required: true
    },
    content:{
        type:String,
        required:true
    },
    timestamp: {
  type: Date,
  default: Date.now
}

    
})

const ThreadSchema=new mongoose.Schema({
    threadId:{
        type:String,
        required:true,
        unique:true,
    },
      user: {
    type: Schema.Types.ObjectId, // Reference to the User model
    ref: "User",
    required: true,
  },
    title:{
        type:String,
        default:"New Chat"
        
    },
    messages:[Messageschema],
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },

}
, { timestamps: false }
);

ThreadSchema.pre("save", function(next) {
  this.updatedAt =  new Date();
  next();
});

export default mongoose.model("Thread",ThreadSchema);

