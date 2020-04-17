const mongoose = require('mongoose')
const favorisSchema = new mongoose.Schema({
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
    name: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },

},{
    timestamps: true
})

favorisSchema.static.checkLike = async (idUser, idProduct) => {
    const favori = await Favoris.findOne({ idUser, idProduct })
    if (favori) {
        return true
    } else {
        return false
    }
}
const Favoris = mongoose.model('Favoris', favorisSchema)

module.exports = Favoris