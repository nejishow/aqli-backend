const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    enabled: {
        type: Boolean,
        required: true
    }
},
{timestamp: true})


const category = mongoose.model('Category', categorySchema)

module.exports = category