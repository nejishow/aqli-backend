const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    pics: [{
        src: {
            type: String,
            required: true
        }
    }],

        Tailles: [{
            size: {
                type: Number,
                validate(value) {
                    if (!validator.isNumeric) {
                        throw new Error('Ecrivez un nombre pour la taille')
                    }
                }
            }
        }
    ],
    Couleurs: [{
        color: {
            type: String
        }
    }
    ],
    description: {
        type: Array,
        required: true
    },
    idProductTypes: [{
        idProductType: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }],
    keywords: {
            type: String,
            required: true
    },
    garantit: {
        type: Number,
        default: 0
    },
    enabled: {
        type: Boolean,
        default: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    serial: {
        type: Number,
        required: true
    }
},
{timestamps: true})
// verify credentials, this a function we use on product and not on product

const product = mongoose.model('Product', productSchema)

module.exports = product