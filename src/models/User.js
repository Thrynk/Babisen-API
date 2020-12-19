const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    subscription: {
        endpoint: {
            type: String,
            default: null
        },
        keys:{
            p256dh: {
                type: String,
                default: null
            },
            auth: {
                type: String,
                default: null
            }
        }
    }
});

// avoid duplicate username
UserSchema.path('username').validate(function(value){
    const self = this;
    return new Promise(function(resolve, reject){
        self.constructor.findOne({username: value}, function(err, user){
            if(err){
                reject(err);
            }
            resolve(!user);
        });
    });
}, '{VALUE} is already taken');

let User = mongoose.model("User", UserSchema);

module.exports = User;
