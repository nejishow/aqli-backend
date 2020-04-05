const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    pics: [{
        src: {
            type: String,
            required: true
        }
    }],
    attributes: [{
        Couleurs: [{
            color: {
                type: String,
            }
        }]
    }, {
            Tailles: [{
                size: {
                    type: String,
                }
            }]
        }, {
            Stockages: [{
                stockage: {
                    type: String,
                }
            }]
        },
    
   ],
    description: {
        type: String,
        required: true
    },
    idProductTypes: [{
        idProductType: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }],
    keywords: [{
        keyword: {
            type: String,
            required: true
        }
    }],
    enabled: {
        type: Boolean,
        required: true
    }

})
// verify credentials, this a function we use on product and not on product
productSchema.statics.findByCredentials = async (email, password) => {
    const product = await product.findOne({ email })
    if (!product) {
        throw new Error('Connexion refusée')
    }
    const isMatch = await bcrypt.compare(password, product.password)
    if (!isMatch) {
        throw new Error('Connexion refusée')
    }
    return product
}


productSchema.methods.generateToken = async function () {
    const product = this
    try {
        const token = jwt.sign({ _id: product._id.toString() }, 'laIlaahaIlaAllah', { expiresIn: '2 days' })
        product.tokens = product.tokens.concat({ token })
        await product.save()
        return token
    } catch (error) {
        console.log(error);
    }
}

productSchema.methods.toJSON = function () {
    const product = this
    const productObject = product.toObject()
    delete productObject.password
    delete productObject.tokens
    return productObject
}
// hash the plain text password
productSchema.pre('save', async function (next) {
    const product = this;
    if (product.isModified('password')) {
        product.password = await bcrypt.hash(product.password, 8)
    }
    next()
});
const product = mongoose.model('Product', productSchema)

module.exports = product