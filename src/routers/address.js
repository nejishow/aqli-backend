const express = require("express")
const router = new express.Router()
const Address = require("../models/address")
const auth = require('../middleware/auth')

router.post('/address', auth, async (req, res) => {
    const address = new Address(req.body.params.address)
    try {
        await address.save()
        return res.status(200).send(address)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/address/:id', async (req, res) => {    
    try {
        const address = await Address.findById({ _id: req.params.id })        
    if (!address) {
        return res.status(400).send('Pas d\'addresse trouvée')
    }
        await address.addPoint(req.body.params.points)
        return res.status(200).send(address)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('/alladdress', auth, async (req, res) => {
    try {
        const addresss = await Address.find({ enabled: true })
        if (!addresss) {
            return res.status(404).send({ 'error': 'Pas d\'addresses' })
        }
        res.status(201).send(addresss)

    } catch (error) {
        res.status(400).send({})

    }
})

router.get('/alladdressAdmin', auth, async (req, res) => {
    try {
        const addresss = await Address.find({})
        if (!addresss) {
            return res.status(404).send({ 'error': 'Pas d\'addresses' })
        }
        res.status(201).send(addresss)

    } catch (error) {
        res.status(400).send({})

    }
})


router.delete('/pointAddress/:id', auth, async (req, res) => {
    try {
        const address = await Address.findOne({ 'points._id': req.params.id })
        if (!address) {
            return res.status(404).send({ 'error': 'Pas de address à supprimer' })
        }
        address.points = await address.points.filter((point) => { return point._id !== req.params.id })
        await address.save() //delete a point in an address
        res.send(address)

    } catch (error) {
        res.status(500).send()
    }

})
router.delete('/address/:id', auth, async (req, res) => {
    try {
        const address = await Address.findById({ _id: req.params.id })
        if (!address) {
            return res.status(404).send({ 'error': 'Pas d\'addresse à supprimer' })
        }
        address.enabled = false
        await address.save() //delete a point in an address
        res.send(address)

    } catch (error) {
        res.status(500).send()
    }

})
router.post('/enableAddress/:id', auth, async (req, res) => {
    try {
        const address = await Address.findById({ _id: req.params.id })
        if (!address) {
            return res.status(404).send({ 'error': 'Pas d\'addresse à supprimer' })
        }
        address.enabled = true
        await address.save() //delete a point in an address
        res.send(address)

    } catch (error) {
        res.status(500).send()
    }

})



module.exports = router