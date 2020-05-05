const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    address: {
        type: String
    },
    number: {
        type: Number
    },
    birthDate: {
        type: String,
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
    },
    avatar: {
        type: String,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    enabled: {
        type: Boolean,
    default: true    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
{timestamps: true})

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

userSchema.statics.isAdmin = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Connexion refusée')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Connexion refusée')
    }
    if (!user.isAdmin) {
        throw new Error('Connexion refusée')
    }
    return user
}


userSchema.methods.generateToken = async function () {
    const user = this
    try {
        const token = jwt.sign({ _id: user._id.toString() }, 'laIlaahaIlaAllah')
            while (user.tokens.length > 1) {
                user.tokens.shift()
            }

        user.tokens =  user.tokens.concat({token})
        await user.save()
        return  token
    } catch (e) {
        throw new Error('Probleme de creation d\'utilisateur')
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