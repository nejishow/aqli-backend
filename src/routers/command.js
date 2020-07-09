const express = require("express")
const router = new express.Router()
const Command = require("../models/commands")
const Boutique = require("../models/boutique")
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
            element.quantity + ' x ' + element.name +', '
        ) 
    });
    try {
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        command.password = password
        await command.save()
        await command.commands.forEach(async element => {
            const boutique = await Boutique.find({ _id: element.owner })
            
            client.messages
                .create({
                    body: 'Commande pour Aqli: ' + element.quantity + ' x ' + element.name ,
                    from: '+12268060224',
                    to: '+253' + parseInt(boutique[0].number)
                })
            client.messages
                .create({
                    body: 'Commande pour Aqli: ' + element.quantity + ' x ' + element.name + ' de la boutique ' + boutique.name,
                    from: '+12268060224',
                    to: '+25377484707'
                })
        });
        client.messages
            .create({
                body: 'Aqli commande: ' + sms + ' pour un total de : ' + command.total + 'fdj. Aqli à votre service. Code: '+ password,
                from: '+12268060224',
                to: '+253' + parseInt(req.user.number)
            })
        
        return res.status(200).send(command)
    } catch (error) {
        console.log(error)
        res.status(404).send(error)
    }
})


router.get('/commands', auth, async (req, res) => {  // get all enabled command for the users
    try {
        const commands = await Command.find({ idUser: req.user._id, enabled: true })
        if (!commands) {
            return res.send(404).send({ 'error': 'command vide' })
        }
        res.status(201).send(commands)
    } catch (error) {
        res.status(404).send()
    }
})
router.get('/adminCommands', auth, async (req, res) => {  // get all command for the admin
    try {
        const commands = await Command.find({})
        if (!commands) {
            return res.send(404).send({ 'error': 'command vide' })
        }
        res.status(201).send(commands)
    } catch (error) {
        res.status(404).send()
    }
})
router.get('/newCommand', auth, async (req, res) => {  // get all new command for the admin
    try {
        const commands = await Command.find({received: false, enabled: true})
        if (!commands) {
            return res.send(404).send({ 'error': 'command vide' })
        }
        res.status(201).send(commands)
    } catch (error) {
        res.status(404).send()
    }
})
router.get('/completedCommand', auth, async (req, res) => {  // get all completed command for the admin
    try {
        const commands = await Command.find({ received: true })
        if (!commands) {
            return res.send(404).send({ 'error': 'command vide' })
        }
        res.status(201).send(commands)
    } catch (error) {
        res.status(404).send()
    }
})
router.get('/cancelledCommand', auth, async (req, res) => {  // get all cancelled command for the admin
    try {
        const commands = await Command.find({ enabled: false, received: false })
        if (!commands) {
            return res.send(404).send({ 'error': 'command vide' })
        }
        res.status(201).send(commands)
    } catch (error) {
        res.status(404).send()
    }
})
router.get('/command/:id', auth, async (req, res) => {    // get a command for anyone
    try {
        const command = await Command.findById({ _id: req.params.id })
        if (!command) {
            return res.send(404).send({ 'error': 'command vide' })
        }
        res.status(201).send(command)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.patch('/command/:id', auth, async (req, res) => { // confirmer reception
    try {
        const command = await Command.findOne({ _id: req.params.id, password: req.body.params })
        if (!command) {
            return res.status(404).send({ error: 'Produit inexistant' })
        }
        command.received = true
        await command.save()
        return res.send(command)
    } catch (error) {
        res.status(404).send('erreur code!!')
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
        res.status(404).send(error)
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
        res.status(404).send(error)
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
                body: 'ID: '+req.user.name+' vient d\'annuler toute une commande',
                from: '+12268060224',
                to: '+25377484707'
            })
        res.send({ 'message': command.name + ' a bien eté supprimé de la liste des commandes' })

    } catch (error) {
        res.status(404).send(error)
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
                    body: 'ID: ' + req.user.name + ' vient d\'annuler un article d\'une commande',
                    from: '+12268060224',
                    to: '+25377484707'
                })
        } else {
            command.enabled = false
            command.total = 0
            client.messages
                .create({
                    body: 'ID: ' + req.user.name + ' vient d\'annuler toute une commande',
                    from: '+12268060224',
                    to: '+25377484707'
                })
            await command.save()
        }
        res.send(command)

    } catch (error) {
        res.status(404).send(error)
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
        res.status(404).send(error)
    }

})
router.post('/getBackAdmin/:id', auth, async (req, res) => { // recuperer un article d'une commande
    try {
        const command = await Command.findOne({ 'commands._id': req.params.id })
        if (!command) {
            return res.status(404).send('pas de produit')
        }
        await command.commands.forEach((one) => {

            if (one._id == req.params.id) {
                one.rendu = true
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
        } else {
            command.enabled = false
            command.total = 0
            command.commission = 0
            await command.save()
        }

        res.send(command)

    } catch (error) {
        res.status(404).send("operation non effectuée")
    }

})
router.post('/getBackAdminWithComm/:id', auth, async (req, res) => { // recuperer un article d'une commande
    try {
        const command = await Command.findOne({ 'commands._id': req.params.id })
        if (!command) {
            return res.status(404).send('pas de produit')
        }
        await command.commands.forEach((one) => {

            if (one._id == req.params.id) {
                one.rendu = true
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
        } else {
            command.enabled = false
            command.total = 0
            await command.save()
        }

        res.send(command)

    } catch (error) {
        res.status(404).send("operation non effectuée")
    }

})
router.post('/noGetBackAdmin/:id', auth, async (req, res) => { // recuperer un article d'une commande
    try {
        const command = await Command.findOne({ 'commands._id': req.params.id })
        if (!command) {
            return res.status(404).send('pas de produit')
        }
        await command.commands.forEach((one) => {

            if (one._id == req.params.id) {
                one.wtgb = false
            }
        });
        await command.save() //delete a command it's like save()
        res.send(command)

    } catch (error) {
        res.status(404).send("operation non effectuée")
    }

})


module.exports = router