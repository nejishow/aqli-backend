const express = require("express")
const router = new express.Router()
const Command = require("../models/commands")
const auth = require('../middleware/auth')
const accountSid = 'ACe70a130659cb6ac4e507aa1424b3c7b3';
const authToken = '64a35b62640421c1207f43596d0d6454';
const client = require('twilio')(accountSid, authToken);
const generator = require('generate-password');


router.post('/command', auth, async (req, res) => { // post a command    
    const command = await new Command({
        ...req.body.params,
        idUser: req.user._id
    })
    sms = []
    await command.commands.forEach(element => {
        sms.push(
            element.quantity + ' ' + element.name +', '
        ) 
    });
    try {
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        command.password = password
        await command.save()
        client.messages
            .create({
                body: 'Aqli commande: ' + sms + ' pour un total de : ' + command.total + 'fdj. Aqli à votre service. Code: '+ password,
                from: '+12268060224',
                to: '+253'+req.user.number
            })
        return res.status(200).send(command)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/commands', auth, async (req, res) => {  // get all enabled command for the users
    try {
        const commands = await Command.find({ idUser: req.user._id, enabled: true })
        if (!commands) {
            return res.send(400).send({ 'error': 'command vide' })
        }
        res.status(201).send(commands)
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/adminCommands', auth, async (req, res) => {  // get all command for the admin
    try {
        const commands = await Command.find({})
        if (!commands) {
            return res.send(400).send({ 'error': 'command vide' })
        }
        res.status(201).send(commands)
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/newCommand', auth, async (req, res) => {  // get all new command for the admin
    try {
        const commands = await Command.find({received: false})
        if (!commands) {
            return res.send(400).send({ 'error': 'command vide' })
        }
        res.status(201).send(commands)
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/completedCommand', auth, async (req, res) => {  // get all completed command for the admin
    try {
        const commands = await Command.find({ received: true })
        if (!commands) {
            return res.send(400).send({ 'error': 'command vide' })
        }
        res.status(201).send(commands)
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/cancelledCommand', auth, async (req, res) => {  // get all cancelled command for the admin
    try {
        const commands = await Command.find({ enabled: false, received: false })
        if (!commands) {
            return res.send(400).send({ 'error': 'command vide' })
        }
        res.status(201).send(commands)
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/command/:id', auth, async (req, res) => {    // get a command for anyone
    try {
        const command = await Command.findById({ _id: req.params.id })
        if (!command) {
            return res.send(400).send({ 'error': 'command vide' })
        }
        res.status(201).send(command)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/command/:id', auth, async (req, res) => { // confirmer reception
    try {
        const command = await Command.find({ _id: req.params.id, code: req.body.params.code })
        if (!command) {
            return res.status(400).send({ error: 'Produit inexistant' })
        }
        command.received = true
        await command.save()
        client.messages
            .create({
                body: 'Commande receptionnée. Aqli vous remercit :D ',
                from: '+12268060224',
                to: '+25377484707'
            })
        return res.send(command)
    } catch (error) {
        res.status(404).send(error)
    }
})
router.post('/supCommand/:id', auth, async (req, res) => { //supp une commande deja faite

    try {
        const command = await Command.findById({ _id: req.params.id })
        if (!command) {
            return res.status(404).send('pas de produit')
        }
        command.enabled = false
        await command.save() //delete a command it's like save()
        res.send({ 'message': command.name + ' a bien eté supprimé de la liste des commandes' })

    } catch (error) {
        res.status(500).send(error)
    }

})
router.post('/supItem/:id', auth, async (req, res) => { // supp un article deja acheté
    try {
        const command = await Command.findOne({ 'commands._id': req.params.id })
        if (!command) {
            return res.status(404).send('pas de produit')
        }
        await command.commands.forEach((command) => {

            if (command._id == req.params.id) {
                command.enabled = false
            }
        });
        let i = 0
        await command.commands.forEach((command) => {

            if (command.enabled == true) {
                i++
            }
        });
        if (i > 0) {
            await command.save() //delete a command it's like save()
        } else {
            command.enabled = false
            await command.save()
        }
        res.send(command)

    } catch (error) {
        res.status(500).send(error)
    }

})
router.post('/command/:id', auth, async (req, res) => { //annuler une commande entiere
    
    try {
        const command = await Command.findById({ _id: req.params.id })
        if (!command) {
            return res.status(404).send('pas de produit')
        }
        command.enabled = false
        await command.save() //delete a command it's like save()
        client.messages
            .create({
                body: 'ID: '+req.user._id+' vient d\'annuler toute une commande',
                from: '+12268060224',
                to: '+25377484707'
            })
        res.send({ 'message': command.name + ' a bien eté supprimé de la liste des commandes' })

    } catch (error) {
        res.status(500).send(error)
    }

})
router.post('/commandItem/:id', auth, async (req, res) => { // annuler un article d'une commande
    try {
        const command = await Command.findOne({ 'commands._id': req.params.id })        
        if (!command) {
            return res.status(404).send('pas de produit')
        }
        await command.commands.forEach((one) => {
            
            if (one._id == req.params.id) {
                one.enabled = false
                command.total -= (one.price * one.quantity)
                command.updatedAt = new Date()
            }
        });
        let i = 0
        await command.commands.forEach((command) => {

            if (command.enabled == true) {
                i++
            }
        });
        if (i > 0) {
            await command.save()
            client.messages
                .create({
                    body: 'ID: ' + req.user._id + ' vient d\'annuler un article d\'une commande',
                    from: '+12268060224',
                    to: '+25377484707'
                })
        } else {
            command.enabled = false
            command.total = 0
            client.messages
                .create({
                    body: 'ID: ' + req.user._id + ' vient d\'annuler toute une commande',
                    from: '+12268060224',
                    to: '+25377484707'
                })
            await command.save()
        }
        res.send(command)

    } catch (error) {
        res.status(500).send(error)
    }

})
router.post('/getBack/:id', auth, async (req, res) => { // rendre un article d'une commande
    try {
        const command = await Command.findOne({ 'commands._id': req.params.id })
        if (!command) {
            return res.status(404).send('pas de produit')
        }
        await command.commands.forEach((command) => {

            if (command._id == req.params.id) {
                command.wtgb = true
            }
        });
 
        await command.save() //delete a command it's like save()
        res.send(command)

    } catch (error) {
        res.status(500).send(error)
    }

})


module.exports = router