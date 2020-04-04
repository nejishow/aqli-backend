const jwt = require('jsonwebtoken')
const Boutique = require('../models/boutique')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'laIlaahaIlaAllah')
        const boutique = await Boutique.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!boutique) {
            throw new Error()
        }
        req.boutique = boutique
        req.token = token
        next()

    } catch (error) {
        res.status(401).send({ error: 'Veuillez vous connecter' })
    }


}

module.exports = auth