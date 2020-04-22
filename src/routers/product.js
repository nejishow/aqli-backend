const express = require("express")
const router = new express.Router()
const Product = require("../models/product")
const Favoris = require('../models/favoris')
const auth = require('../middleware/auth')

router.post('/product', auth, async (req, res) => {
    const product = new Product(req.body)
    try {
        await product.save()
        return res.status(200).send(product)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/products/:idProductType', async (req, res) => {
    try {
        const products = await Product.find({ 'idProductTypes.idProductType': req.params.idProductType })
        if (!products) {
            return res.send(400).send({ 'error': 'Pas de produits' })
        }
        res.status(201).send(products)
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/product/:id', async (req, res) => {
    try {
        const products = await Product.findById({ _id: req.params.id })
        if (!products) {
            return res.send(400).send({ 'error': 'Pas de produits' })
        }
        res.status(201).send(products)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/allProduct', async (req, res) => {
    try {
        const products = await Product.find({})
        if (!products) {
            return res.send(400).send({ 'error': 'Pas de produits' })
        }
        res.status(201).send(products)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/product', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'price', 'pics', 'colors', 'size', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ 'error': 'Modifications invalides' })
    }
    try {
        const product = await Product.findById({ _id: req.body._id })
        updates.forEach((update) => product[update] = req.body[update])
        await product.save()
        return res.send(product)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.delete('/product', auth, async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.body._id })
        await product.remove() //delete a product it's like save()
        res.send({ 'message': 'Le produit a bien eté supprimé' })

    } catch (error) {
        res.status(500).send()
    }

})


router.get('/likeProduct/:id', auth, async (req, res) => {  // check if the product was liked by the user
    try {
        const favori = await Favoris.findOne({ idUser: req.user._id, idProduct: req.params.id })
        if (favori) {
            return res.status(200).send(favori)
        }
        else {
            return res.status(200).send()
        }
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('/allLikeProduct/:id', async (req, res) => {   // how many time the product was liked
    try {
        const favori = await Favoris.find({ idProduct: req.params.id, enabled: true })
        if (!favori) {
            throw new Error ('pas de favori')
        }
            return res.status(200).send(favori)
    } catch (error) {
        return res.status(404).send(error)
    }

})
router.get('/allLikeProduct',auth, async (req, res) => {   // all the product liked by the user
    try {
        const favoris = await Favoris.find({ idUser: req.user._id, enabled: true })
        if (!favoris) {
            throw new Error('pas de favori')
        }
        return res.status(200).send(favoris)
    } catch (error) {
        return res.status(404).send(error)
    }

})
router.post('/likeProduct/:id', auth, async (req, res) => { // like the product

    try {
        const favori = await Favoris.findOne({ idUser: req.user._id, idProduct: req.params.id })
        if (favori) {
            favori.enabled = !favori.enabled
            await favori.save()
            return res.status(201).send(favori)

        } else {
            const newFavori = await Favoris({idUser:req.user._id,idProduct:req.params.id,name:req.body.params.name,src:req.body.params.pics[0].src})
            await newFavori.save()
            return res.status(200).send(newFavori)
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router