const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const boutiqueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    number: {
        type: Number,
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
    proprio: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    enabled: {
        type: Boolean,
        required: true
    }

})
// verify credentials, this a function we use on boutique and not on boutique
boutiqueSchema.statics.findByCredentials = async (email, password) => {
    const boutique = await boutique.findOne({ email })
    if (!boutique) {
        throw new Error('Connexion refusée')
    }
    const isMatch = await bcrypt.compare(password, boutique.password)
    if (!isMatch) {
        throw new Error('Connexion refusée')
    }
    return boutique
}


boutiqueSchema.methods.generateToken = async function () {
    const boutique = this
    try {
        const token = jwt.sign({ _id: boutique._id.toString() }, 'laIlaahaIlaAllah', { expiresIn: '2 days' })
        boutique.tokens =  boutique.tokens.concat({token})
        await boutique.save()
        return  token
    } catch (error) {
        console.log(error);
    }
}

boutiqueSchema.methods.toJSON =  function () {
const boutique = this
const boutiqueObject = boutique.toObject()
delete boutiqueObject.password
delete boutiqueObject.tokens
return boutiqueObject
}
// hash the plain text password
boutiqueSchema.pre('save', async function (next) {
    const boutique = this;
    if (boutique.isModified('password')) {
        boutique.password = await bcrypt.hash(boutique.password, 8)
    }
    next()
});
const boutique = mongoose.model('Boutique', boutiqueSchema)

module.exports = boutique