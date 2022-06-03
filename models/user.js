const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema= new mongoose.Schema({
    //passport-local straegy will automatically include username and password so we dont haveb to include explicitly
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    }
});

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model('User',userSchema);

module.exports=User;