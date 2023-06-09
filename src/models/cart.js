const mongoose = require("mongoose")

const CartShema = new mongoose.Schema({
    date:{
        type:String
        required:true
    },
    products:{
        type: [
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product"
                }
            }
        ]
    }
})

const Cart = mongoose.model("Cart",CartShema)
mongoose.exports = Cart