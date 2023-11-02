const express = require('express');
const exphbs  = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const productsRouter = require('./routers/productsrouter');
const indexRouter = require('./routers/indexrouter');
const cartsRouter = require('./routers/cartsrouter');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/statics', express.static('public'));

// Middleware para pasar el socket a las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/', indexRouter);
app.use('/api', productsRouter, cartsRouter);

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});

// Configurar Socket.io para actualizar en tiempo real
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
});