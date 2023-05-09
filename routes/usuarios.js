const express = require("express")


const {Router} = express
const uuid4 = require("uuid4")

const router = new Router()


let users = []

function mid1(req, res, next){
    req.data1 = "un dato x"
    next()
}


router.get("/", mid1, (req,res)=>{
    console.log(req.data1)
    res.json({data:users})
})

router.post("/", (req,res)=>{
    let user = req.body
    user.id = uuid4()
    console.log(user)
    users.push(user)
    //res.json({data:user, message:"usuario creado"})
    res.redirect("/users")
    
})
router.delete("/")

module.exports = router