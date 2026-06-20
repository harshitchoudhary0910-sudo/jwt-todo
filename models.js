const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    username:String,
    password:String

});
const todoSchema=new mongoose.Schema({
    title:String,
    description:String,   
    completed: {
        type: Boolean,
        default: false
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
});

const userModel=mongoose.model("users",userSchema);
const todoModel=mongoose.model("todo",todoSchema);

module.exports={
    userModel:userModel,
    todoModel:todoModel

}