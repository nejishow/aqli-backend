const express = require("express")
const router = new express.Router()
const User = require("../models/user")
const multer = require('multer')
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateToken()
        return res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('/users/me',auth, async (req, res) => {    
   res.status(201).send(req.user)
})

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'birthDate', 'gender', 'avatar'];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ 'error': 'Modifications invalides' })
    }
    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        return res.send(user)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try {
        await req.user.remove() //delete a user it's like save()
        res.send(req.user)

    } catch (error) {
        res.status(500).send()
    }

})

router.post('/getuser', async (req, res) => {
    const id = req.body.userId
    try {
        const user = await user.find({ _id: id })
        res.status(201).send(user)
    } catch (error) {
        res.status(404).send(error)

    }
})

router.post('/users/login', async (req, res) => {    
    try {
        const user = await User.findByCredentials(req.body.params.email,req.body.params.password);
        const token = await user.generateToken()        
        return res.send({user,token})
    } catch (e) {
        res.status(404).send('Email ou mot de passe erroné')
    }
})
router.post('/users/logout', auth, async (req, res) => {    
    try {
        req.user.tokens = req.user.tokens.filter((token)=> {return token.token !== req.token} )
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)

    }
})
router.post('/users/logoutAll',auth, async (req, res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send({error})

    }
})

module.exports = router