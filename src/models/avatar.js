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

})
// verify credentials, this a function we use on avatar and not on avatar
avatarSchema.statics.findByCredentials = async (email, password) => {
    const avatar = await avatar.findOne({ email })
    if (!avatar) {
        throw new Error('Connexion refusée')
    }
    const isMatch = await bcrypt.compare(password, avatar.password)
    if (!isMatch) {
        throw new Error('Connexion refusée')
    }
    return avatar
}


avatarSchema.methods.generateToken = async function () {
    const avatar = this
    try {
        const token = jwt.sign({ _id: avatar._id.toString() }, 'laIlaahaIlaAllah', { expiresIn: '2 days' })
        avatar.tokens =  avatar.tokens.concat({token})
        await avatar.save()
        return  token
    } catch (error) {
        console.log(error);
    }
}

avatarSchema.methods.toJSON =  function () {
const avatar = this
const avatarObject = avatar.toObject()
delete avatarObject.password
delete avatarObject.tokens
return avatarObject
}
// hash the plain text password
avatarSchema.pre('save', async function (next) {
    const avatar = this;
    if (avatar.isModified('password')) {
        avatar.password = await bcrypt.hash(avatar.password, 8)
    }
    next()
});
const avatar = mongoose.model('Avatar', avatarSchema)

module.exports = avatar