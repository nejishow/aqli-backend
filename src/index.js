const express = require("express")
require('./db/mongoose')
const cors = require("cors")
const path = require("path")
const userRouter = require("./routers/user")
const app = express()
const port = process.env.PORT || 3000
app.use(cors())

const imagesPath = path.join(__dirname, '../images')

app.use((req,res,next)=>{
  console.log(req.method, req.path)
  next()  
})
app.use('/images',express.static(imagesPath))

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
  console.log('Server is up on port ' + port);

})

const myFuntion = async () => {
 
}
