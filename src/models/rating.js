const mongoose = require('mongoose')
const ratingSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    enabled: {
        type: Boolean,
        default: true
    },
    idProduct: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
})

ratingSchema.static.checkRating = async (idUser, idProduct) => {
    const rating = await rating.findOne({ idUser, idProduct })
    if (rating) {
        return rating
    } else {
        return false
    }
}
const rating = mongoose.model('rating', ratingSchema)

module.exports = rating