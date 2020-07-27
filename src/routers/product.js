const express = require("express")
const router = new express.Router()
const Product = require("../models/product")
const Favoris = require('../models/favoris')
const Rating = require('../models/rating')
const auth = require('../middleware/auth')

router.post('/productAdmin', auth, async (req, res) => { //creer un nouveau produit
    const product = new Product(req.body.params)
    try {
        await product.save()
        return res.status(200).send(product)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/products/:idProductType', async (req, res) => { //retrouver un produit grace au productType
    try {
        const products = await Product.find({ idProductType: req.params.idProductType })
        if (!products) {
            return res.send(404).send({ 'error': 'Pas de produits' })
        }
        res.status(201).send(products)
    } catch (error) {
        res.status(404).send()
    }
})
router.get('/product/:id', async (req, res) => { // retrouver un produit grace à l'id
    try {
        const product = await Product.findById({ _id: req.params.id })
        if (!product) {
            return res.status(404).send({ 'error': 'Pas de produits' })
        }
        res.status(201).send(product)
    } catch (error) {
        res.status(404).send()
    }
})

router.get('/allProductAdmin', async (req, res) => { // retrouver tout les produits
    try {
        const products = await Product.find({})
        if (!products) {
            return res.send(404).send({ 'error': 'Pas de produits' })
        }
        
        res.status(201).send(products)
    } catch (error) {
        res.status(404).send()
    }
})

router.post('/productUpdate', auth, async (req, res) => { // modifier un produit
    const updates = Object.keys(req.body.params)
    try {
        const product = await Product.findById({ _id: req.body.params._id })
        updates.forEach((update) => product[update] = req.body.params[update])
        await product.save()
        return res.send(product)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.delete('/product', auth, async (req, res) => { // supprimer un produit
    try {
        const product = await Product.findById({ _id: req.body._id })
        await product.remove() //delete a product it's like save()
        res.send({ 'message': 'Le produit a bien eté supprimé' })

    } catch (error) {
        res.status(404).send()
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
        res.status(404).send(error)
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
        res.status(404).send(error)
    }
})


router.post('/rateProduct/:id', auth, async (req, res) => { // rate the product

    try {
        const product = await Product.findOne({ 'ratings.idUser': req.user._id, _id: req.params.id })
        if (product) {
            await product.ratings.forEach(rating => {
                if (rating.idUser.toString() == req.user._id.toString()) {                    
                    rating.rating = req.body.params
                }
            })

            let ratingValue = 0
            let count = 0
            await product.ratings.forEach(rating => {
                count++ 
                ratingValue += rating.rating
            })      
            product.rating = (ratingValue / count)            
            await product.save()
            return res.status(201).send(product)

        } else {
            const product = await Product.findById({_id: req.params.id })
            await product.ratings.push({ idUser: req.user._id, rating: req.body.params })
            let ratingValue = 0
            let count = 0
            
            await product.ratings.forEach(rating => {
                count++
                ratingValue += rating.rating
            })

            product.rating = (ratingValue / count)

            await product.save()
            return res.status(200).send(product)
        }
    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = router