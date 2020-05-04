const mongoose = require('mongoose')
const bannerSchema = new mongoose.Schema({
    enabled: {
        type: Boolean,
        default: true
    },
    src: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

bannerSchema.static.checkLike = async (idUser, idProduct) => {
    const favori = await banner.findOne({ idUser, idProduct })
    if (favori) {
        return true
    } else {
        return false
    }
}
const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner