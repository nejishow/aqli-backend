const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const avatarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    pic: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
    }
},
{timestamp: true})
// verify credentials, this a function we use on avatar and not on avatar

const avatar = mongoose.model('Avatar', avatarSchema)

module.exports = avatar