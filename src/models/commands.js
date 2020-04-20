const mongoose = require('mongoose')

const commandSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    commands: [{
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
        quantity: {
            type: Number,
            required: true
        },
        rendu: {
            type: Boolean,
            default: false
        },
        wtgb: {
            type: Boolean,
            default: false
        },
        enabled: {
            type: Boolean,
            default: true
        },
        price: {
            type: Number,
            required: true
        },
    }],
    total: {
        type: Number,
        required: true
    },
    received: {
        type: Boolean,
        default: false
    },
    commission: {
        type: Number,
        default: 500
    },
    enabled: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true })

const Command = mongoose.model('Command', commandSchema)

module.exports = Command