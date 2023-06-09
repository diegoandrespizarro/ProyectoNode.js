const mongoose = require("mongoose")


class ManagerMongo {
    constructor(url{
        this.url = url
    })
    connect:()=>{
       return mongoose.connect(this.url,{})
    } 
}

module.exports = ManagerMongo