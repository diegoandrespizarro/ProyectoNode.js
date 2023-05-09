const express = require("express")
const app = express()
const routesProducts = require("./routes/products")
const routesUsers = require("./routes/usuarios")
const routesPets = require("./routes/carts")


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use( function(req, res, next){
    console.log("time: ", Date.now())
    next()
})

app.use("/static", express.static(__dirname + "/public"))

app.use("/api/products", routesProducts)
app.use("/api/users", routesUsers)
app.use("/api/carts", routesPets)



app.listen(8080,()=>{
    console.log("server is running on port 8080")
})