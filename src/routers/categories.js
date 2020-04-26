const express = require("express")
const router = new express.Router()
const Category = require("../models/category")
const SubCategory = require("../models/subCategory")
const ProductType = require("../models/productType")
const multer = require('multer')
const auth = require('../middleware/auth')

//post

router.post('/category', auth, async (req, res) => {
    const category = new Category(req.body.params)
    try {
        await category.save()
        return res.status(200).send(category)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/subCategory', auth, async (req, res) => {
    const subCategory = new SubCategory(req.body.params)
    try {
        await subCategory.save()
        return res.status(200).send(subCategory)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/productType', auth, async (req, res) => {
    console.log(req.body.params);
    
    const productType = new ProductType(req.body.params)
    try {
        await productType.save()
        return res.status(200).send(productType)
    } catch (error) {
        res.status(400).send(error)
    }
})

//patch

router.patch('/category', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name'];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ 'error': 'Modifications invalides' })
    }
    try {
        const category = await Category.findById({ _id: req.body._id })
        updates.forEach((update) => category[update] = req.body[update])
        await category.save()
        return res.send(category)
    } catch (error) {
        res.status(404).send(error)
    }
})
router.patch('/subCategory', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'idCategory'];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ 'error': 'Modifications invalides' })
    }
    try {
        const subCategory = await SubCategory.findById({ _id: req.body._id })
        updates.forEach((update) => subCategory[update] = req.body[update])
        await subCategory.save()
        return res.send(subCategory)
    } catch (error) {
        res.status(404).send(error)
    }
})
router.patch('/productType', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'idSubCategory'];
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ 'error': 'Modifications invalides' })
    }
    try {
        const productType = await ProductType.findById({ _id: req.body._id })
        updates.forEach((update) => category[update] = req.body[update])
        await productType.save()
        return res.send(productType)
    } catch (error) {
        res.status(404).send(error)
    }
})


//delete

router.delete('/category', auth, async (req, res) => {
    try {
        const category = await Category.findById({ _id: req.body._id })
        await category.remove() //delete a category it's like save()
        res.send({ 'message': 'La catégorie a bien eté supprimée' })

    } catch (error) {
        res.status(500).send()
    }

})
router.delete('/subCategory', auth, async (req, res) => {
    try {
        const subCategory = await SubCategory.findById({ _id: req.body._id })
        await subCategory.remove() //delete a category it's like save()
        res.send({ 'message': 'La sous-catégorie a bien eté supprimée' })

    } catch (error) {
        res.status(500).send()
    }

})
router.delete('/productType', auth, async (req, res) => {
    try {
        const productType = await ProductType.findById({ _id: req.body._id })
        await productType.remove() //delete a category it's like save()
        res.send({ 'message': 'Le type de produit a bien eté supprimée' })

    } catch (error) {
        res.status(500).send()
    }

})


//get


router.get('/productType/:id', async (req, res) => {    
    try {
        const productTypes = await ProductType.find({idSubCategory:req.params.id})
        if (!productTypes) {
            return res.status(400).send({ 'error': 'Type de produit inexistant' })
        }
        return res.send(productTypes)
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/allProductType', async (req, res) => {
    try {
        const productTypes = await ProductType.find({})
        if (!productTypes) {
            return res.status(400).send({ 'error': 'Type de produit inexistant' })
        }
        return res.send(productTypes)
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/allProduct', async (req, res) => {
    try {
        const products = await Product.find({})
        if (!products) {
            return res.status(400).send({ 'error': 'produits inexistant' })
        }
        return res.send(products)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/allCategory', async (req, res) => {    
    try {
        const categories = await Category.find({})
        if (!categories) {
            return res.status(400).send({ 'error': 'Catégorie inexistante' })
        }
        return res.send(categories)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/allSubCategory', async (req, res) => {
    try {
        const subCategories = await SubCategory.find({})
        if (!subCategories) {
            return res.status(400).send({ 'error': 'Sous-catégorie inexistante' })
        }
        return res.send(subCategories)
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/subCategory/:id', async (req, res) => { // retrouver des sub avec leur idCat
    try {
        const subCategories = await SubCategory.find({idCategory:req.params.id})
        if (!subCategories) {
            return res.status(404).send({ 'error': 'Sous-catégorie inexistante' })
        }
        return res.send(subCategories)
    } catch (error) {
        return res.status(500).send()
    }
})
router.get('/category/:id', async (req, res) => { //retrouver un cate avk son id
    try {
        const category = await Category.findById({ _id: req.params.id })
        if (!category) {
            return res.status(404).send('categorie inexistante')
        }
        return res.send(category)
    } catch (error) {
        return res.status(500).send()
    }
})
router.get('/subcat/:id', async (req, res) => {//retrouver un sub avk son id    
    try {
        const sub = await SubCategory.findById({ _id: req.params.id })
        if (!sub) {
            return res.status(404).send('sub inexistante')
        }
        return res.send(sub)
    } catch (error) {
        return res.status(500).send()
    }
})


module.exports = router