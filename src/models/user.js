const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    birthDate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowerCase: true,
        unique: true, // le faire au tout debut sinn il faudra supprimer toute la base pour que cela fonctionne
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('L\'email est invalide')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password' || 'mdp')) {
                throw new Error('Choisir un meilleur mot de passe')
            }
        }
    },
    gender: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})
// verify credentials, this a function we use on User and not on user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Connexion refusée')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Connexion refusée')
    }
    return user
}


userSchema.methods.generateToken = async function () {
    const user = this
    try {
        const token = jwt.sign({ _id: user._id.toString() }, 'laIlaahaIlaAllah', { expiresIn: '2 days' })
        user.tokens =  user.tokens.concat({token})
        await user.save()
        return  token
    } catch (error) {
        console.log(error);
    }
}

userSchema.methods.toJSON =  function () {
const user = this
const userObject = user.toObject()
delete userObject.password
delete userObject.tokens
return userObject
}
// hash the plain text password
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
});
const User = mongoose.model('User', userSchema)

module.exports = User