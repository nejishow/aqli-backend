const mongoose = require('mongoose')
const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    idCategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    }

})




const subCategory = mongoose.model('SubCategory', subCategorySchema)

module.exports = subCategory