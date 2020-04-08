const express = require("express")
require('./db/mongoose')
const cors = require("cors")
const path = require("path")
const userRouter = require("./routers/user")
const categoriesRouter = require("./routers/categories")
const boutiqueRouter = require("./routers/boutique")
const productRouter = require("./routers/product")

const app = express()
const port = process.env.PORT || 3000
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization,  Content-Type, Accept");
  next();
});
const imagesPath = path.join(__dirname, '../images')


app.use('/images',express.static(imagesPath))
app.use(express.json())
app.use(userRouter)
app.use(categoriesRouter)
app.use(productRouter)
app.use(boutiqueRouter)

app.listen(port, () => {
  console.log('Server is up on port ' + port);

})
