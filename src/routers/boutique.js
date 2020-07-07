const express = require("express")
const router = new express.Router()
const Boutique = require("../models/boutique")
const Banner = require("../models/banner")
const auth = require('../middleware/auth')

router.post('/boutique', async (req, res) => {
    const boutique = new Boutique(req.body)
    try {
        await boutique.save()
        return res.status(200).send( boutique )
    } catch (error) {
        res.status(404).send(error)
    }
})
router.get('/boutique/:id', async (req, res) => {  
    try {
        const boutique = await Boutique.findById({ _id: req.params.id })
        if (!boutique) {
            return res.status(404).send({'error':'Pas de boutique'})
        }
        res.status(201).send(boutique)

    } catch (error) {
        res.status(404).send({})

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
        res.status(404).send({})

    }})

router.patch('/boutique/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)    
    const allowedUpdate = ['name', 'email', 'address','proprio','number'];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(404).send({ 'error': 'Modifications invalides' })
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
        res.status(404).send()
    }

})

////////////////////////////////////////////////////////////////

router.post('/banner', auth, async (req, res) => {
    const banner = new Banner(req.body.params)
    try {
        await banner.save()
        return res.status(200).send( banner )
    } catch (error) {
        res.status(404).send(error)
    }
})
router.post('/banner/:id', auth, async (req, res) => {
    const banner = await Banner.findById({_id:req.params.id})
    try {
        banner.enabled = !banner.enabled
        await banner.save()
        return res.status(200).send( banner )
    } catch (error) {
        res.status(404).send(error)
    }
})
router.get('/banners', async (req, res) => {  
    try {
        const banners = await Banner.find({enabled: true})
        res.status(201).send(banners)

    } catch (error) {
        res.status(404).send({})

    }
})
router.get('/bannersAdmin', async (req, res) => {  
    try {
        const banners = await Banner.find({})
        res.status(201).send(banners)

    } catch (error) {
        res.status(404).send({})

    }
})

module.exports = router