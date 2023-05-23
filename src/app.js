const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const handlebars = require('express-handlebars');
const products = require('./DB/products.json');

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set("views",__dirname+"/views")

// Configurar la carpeta de archivos estáticos
app.use("/static", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para la vista home
app.get('/', (req, res) => {
  res.render('home', { products });
});

// Iniciar el servidor WebSocket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
});

// Configurar el router de productos
const routesProducts = require("./routes/product.routes")(io);
app.use('/api/products', routesProducts);

// Configurar otros routers
const routesPets = require("./routes/carts.routes");
const viewsRouter = require('./routes/views.router');
app.use("/api/carts", routesPets);
app.use('/', viewsRouter(products));


// Configurar el router de vistas para realtimeproducts
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

// Iniciar el servidor HTTP
const port = 8080;
http.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

