const express = require("express")
const router = new express.Router()
const Panier = require("../models/panier")
const auth = require('../middleware/auth')

router.post('/panier', auth, async (req, res) => {
    const panier = await new Panier({
        ...req.body.params,
        idUser: req.user._id
    })
    try {
        await panier.save()
        return res.status(200).send(panier)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/panier', auth, async (req, res) => {
    try {
        const paniers = await Panier.find({ idUser: req.user._id })
        if (!paniers) {
            return res.send(400).send({ 'error': 'Panier vide' })
        }
        res.status(201).send(paniers)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/panier/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body.params)
    const allowedUpdate = ['quantity'];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ 'error': 'Modifications invalides' })
    }
    try {        
        const panier = await Panier.findById({ _id: req.params.id})
        if (!panier) {
            return res.status(400).send({error:'Produit inexistant'})
        }
        panier.quantity = req.body.params.quantity
        await panier.save()
        return res.send(panier)
    } catch (error) {
        res.status(404).send(error)
    }
})
router.delete('/panier/:id', auth, async (req, res) => {
    try {
        const panier = await Panier.findById({ _id: req.params.id })
        if (!panier) {
            return res.status(404).send('pas de produit')
        }
        await panier.remove() //delete a Panier it's like save()
        res.send({ 'message': panier.name + ' a bien eté supprimé du panier' })

    } catch (error) {
        res.status(500).send(error)
    }

})
router.delete('/panier', auth, async (req, res) => {
    try {
        const paniers = await Panier.find({ idUser: req.user._id })
        if (!paniers) {
            return res.status(404).send('pas de produit')
        }
        await paniers.forEach(panier => {
            panier.remove() //delete a Panier it's like save()
        });
        res.send({ 'message': 'Le panier est vide maintenant' })

    } catch (error) {
        res.status(500).send(error)
    }

})

module.exports = router