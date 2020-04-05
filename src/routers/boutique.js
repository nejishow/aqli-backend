const express = require("express")
const router = new express.Router()
const Boutique = require("../models/boutique")
const multer = require('multer')
const auth = require('../middleware/auth')

router.post('/boutique', async (req, res) => {
    const boutique = new Boutique(req.body)
    try {
        await boutique.save()
        return res.status(200).send( boutique )
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('/boutique/:id', auth, async (req, res) => {  
    try {
        const boutique = await Boutique.findById({ _id: req.params.id })
        if (!boutique) {
            return res.status(404).send({'error':'Pas de boutique'})
        }
        res.status(201).send(boutique)

    } catch (error) {
        res.status(400).send({})

    }
})
router.get('/allBoutique', auth, async (req, res) => {
    try {
        const boutiques = await Boutique.find({})
        if (!boutiques) {
            return res.status(404).send({ 'error': 'Pas de boutiques' })
        }
        res.status(201).send(boutiques)

    } catch (error) {
        res.status(400).send({})

    }})

router.patch('/boutique/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(updates);
    
    const allowedUpdate = ['name', 'email', 'address','proprio','number'];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ 'error': 'Modifications invalides' })
    }
    try {
        const boutique = await Boutique.findById({ _id: req.params.id })
        if (!boutique) {
            return res.status(404).send({ 'error': 'Pas de boutique' })
        }
        updates.forEach((update) => boutique[update] = req.body[update])
        await boutique.save()
        return res.send(boutique)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.delete('/boutique/:id',auth,async(req,res)=>{
    try {        
        const boutique = await Boutique.findById({ _id: req.params.id })
        if (!boutique) {
            return res.status(404).send({ 'error': 'Pas de boutique à supprimer' })
        }
        await boutique.remove() //delete a boutique it's like save()
        res.send(boutique)

    } catch (error) {
        res.status(500).send()
    }

})



module.exports = router