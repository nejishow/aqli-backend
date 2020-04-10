const mongoose = require('mongoose')
const validator = require('validator')

const panierSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    idProduct: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },
    serial: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    size: {
        type: Number,
    },
    stockage: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    }
},
    { timestamp: true })

const Panier = mongoose.model('Panier', panierSchema)

module.exports = Panier