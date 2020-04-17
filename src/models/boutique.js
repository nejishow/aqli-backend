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
},
{timestamps: true})


const boutique = mongoose.model('Boutique', boutiqueSchema)

module.exports = boutique