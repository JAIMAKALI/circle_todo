var mongoose=require('mongoose');
var UserSchema={
    email:{
        type:String
    }
}

var User=mongoose.model('User',UserSchema);

module.export={User};