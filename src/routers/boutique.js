const express = require("express")
const router = new express.Router()
const Boutique = require("../models/boutique")
const multer = require('multer')
const auth = require('../middleware/auth')

router.post('/boutique', async (req, res) => {
    const boutique = new Boutique(req.body)
    try {
        const token = await boutique.generateToken()
        return res.status(200).send({boutique, token})
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('/boutique/me',auth, async (req, res) => {    
   res.status(201).send(req.boutique)
})

router.patch('/boutique/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ 'error': 'Modifications invalides' })
    }
    try {
        const boutique = req.boutique
        updates.forEach((update) => boutique[update] = req.body[update])
        await boutique.save()
        return res.send(boutique)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.delete('/boutique/me',auth,async(req,res)=>{
    try {
        await req.boutique.remove() //delete a boutique it's like save()
        res.send(req.boutique)

    } catch (error) {
        res.status(500).send()
    }

})

router.post('/getboutique', async (req, res) => {
    const id = req.body.boutiqueId
    try {
        const boutique = await boutique.find({ _id: id })
        res.status(201).send(boutique)
    } catch (error) {
        res.status(404).send(error)

    }
})

router.post('/boutique/login', async (req, res)=>{
    try {
        const boutique = await boutique.findByCredentials(req.body.email,req.body.password);
        const token = await boutique.generateToken()        
        return res.send({boutique,token})
    } catch (e) {
        res.status(400).send({'error': 'Cet utilisateur n\'existe pas'})
    }
})
router.post('/boutique/logout',auth, async (req, res)=>{
    try {
        req.boutique.tokens = req.boutique.tokens.filter((token)=> {return token.token !== req.token} )
        await req.boutique.save()
        res.send()
    } catch (error) {
        res.status(500).send({error})

    }
})
router.post('/boutique/logoutAll',auth, async (req, res)=>{
    try {
        req.boutique.tokens = []
        await req.boutique.save()
        res.send()
    } catch (error) {
        res.status(500).send({error})

    }
})

module.exports = router