const express = require("express")
require('./db/mongoose')
const cors = require("cors")
const path = require("path")
const userRouter = require("./routers/user")
const categoriesRouter = require("./routers/categories")
const boutiqueRouter = require("./routers/boutique")
const productRouter = require("./routers/product")
const panierRouter = require("./routers/panier")
const commandRouter = require("./routers/command")

const app = express()
const port = process.env.PORT || 3000
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization,  Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PATCH, DELETE, POST");
  next();
});
const imagesPath = path.join(__dirname, '../images')


app.use('/images',express.static(imagesPath))
app.use(express.json())
app.use(userRouter)
app.use(categoriesRouter)
app.use(productRouter)
app.use(boutiqueRouter)
app.use(panierRouter)
app.use(commandRouter)

app.listen(port, () => {
  console.log('Server is up on port ' + port);

})
