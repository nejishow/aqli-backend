const express = require("express")
const router = new express.Router()
const User = require("../models/user")
const multer = require('multer')
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateToken()
        return res.status(200).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('/users/me',auth, async (req, res) => {    
   res.status(201).send(req.user)
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'birthDate', 'gender', 'avatar'];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ 'error': 'Modifications invalides' })
    }
    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        if (!user) {
            return res.status(404).send({'error' : 'operation non effectuée'})
        }
        return res.send(user)
    } catch (error) {
        res.status(404).send(error)
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

router.post('/users/login', async (req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateToken()        
        return res.send({user: user,token})
    } catch (error) {
        res.status(400).send({error})
    }
})
router.post('/users/logout',auth, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=> {return token.token !== req.token} )
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send({error})

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