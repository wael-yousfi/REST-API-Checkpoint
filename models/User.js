const mongoose = require('mongoose')

//User model

const userSchema = new mongoose.Schema({
    name: {type:String, require: true},
    email: {type: String, require: true},
    phone: Number,
    postename: String
},
{
    timestamps: true
}
)

const User = mongoose.model('User',userSchema)

module.exports = User