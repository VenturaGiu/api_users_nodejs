const mongoose = require('mongoose')
const crypto = require('crypto')
const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true  
    }, 
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true 
    }, 
    password:{
        type: String,
        required: true,
        set: value =>  crypto.createHash('md5').update(value).digest('hex')
    },
    admin:{
        type: Boolean,
        required: true,
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)
