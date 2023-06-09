const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const handlebars = require('express-handlebars');
const products = require('./DB/products.json');
const path = require ("path");

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set("views",path.join(__dirname+"/views"))

// Configurar la carpeta de archivos estáticos
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para la vista home
app.get('/', (req, res) => {
  res.render('home', { products });
});

//mongoose
const mongoose = require("mongoose")
const Product = require("./product")
const Cart = require("./cart")

const connect = ()=>{
  const URL = ""
  return mongoose.connect(URL,{useUnifiedTopology:true,useNewUrlParser: true})
  .then(async(connection)=>{
    console.log("conexion a DB exitosa")

    // Product.create({
    //   name:"plancha",
    //   price: 1500,
    //   stock : 150
    // })

    // Cart.create({
    //   date:"08/06/2023"
    // })
    Cart.find().populate("products.product")
    .then(c => console.log(JSON.stringify(c, null, "/t")))
    .catch(err => console.log(err))

    //agregar productos al carrito
    // let cart1 = await Cart.findOne({_id:""})
    // console.log(cart1)
    // cart1.products.push({product : ""})
    // console.log(cart1)
    // await Cart.updateOne({_id:""},cart1)
  })
  .catch(Err => console.log(err))
}

connect()



// Iniciar el servidor WebSocket
io.on('connection', (socket) => {
  socket.emit('Nuevo cliente conectado');
});

// Configurar el router de productos
const routesProducts = require("./routes/product.routes")(io);
app.use('/api/products', routesProducts);

// Configurar otros routers
const routesPets = require("./routes/carts.routes");
const viewsRouter = require('./routes/views.router');
const ManagerMongo = require('../dao/mongoDao/db');
app.use("/api/carts", routesPets);
app.use('/', viewsRouter(products));


// Configurar el router de vistas para realtimeproducts
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

const dataBaseConnect = new ManagerMongo("")


// Iniciar el servidor HTTP
const port = 8080;
http.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

