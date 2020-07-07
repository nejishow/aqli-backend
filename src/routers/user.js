const express = require("express")
const router = new express.Router()
const User = require("../models/user")
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
    const user = new User(req.body.params)
    try {
        const token = await user.generateToken()
        return res.status(201).send({user, token})
    } catch (error) {
        res.status(404).send(error)
    }
})
router.get('/users/me',auth, async (req, res) => {    
   res.status(201).send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    try {
        const user = req.user
        user.name = req.body.params.name
        user.birthDate = req.body.params.birthDate
        user.gender = req.body.params.gender
        user.email = req.body.params.email
        user.number = req.body.params.number
        user.address = req.body.params.address
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
        res.status(404).send()
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
        res.status(404).send(error)

    }
})
router.post('/users/logoutAll',auth, async (req, res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(404).send({error})

    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/users/:id', auth, async (req, res) => {  // get one user
    try {
        const user = await User.findById({ _id: req.params.id })
        if (!user) {
            return res.status(404).send('Utilisateur inexistant')
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(404).send('Problem de serveur')
    }
})
router.get('/allUsers', auth, async (req, res) => {  // get All user
    try {
        const users = await User.find({})
        if (!users) {
            return res.status(404).send('Pas de clients pour le moment')
        }
        res.status(200).send(users)
    } catch (error) {
        res.status(404).send('Problem de serveur')
    }
})
    
router.post('/logInAdmin', async (req, res) => {    
    try {
        const user = await User.isAdmin(req.body.params.email, req.body.params.password);
        const token = await user.generateToken()        
        return res.send({ user, token })
    } catch (e) {
        res.status(404).send('Email ou mot de passe erroné')
    }
})
module.exports = router