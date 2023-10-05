import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';
import { ___dirname } from './utils.js';

const app = express();

app.use(express.urlencoded({extended:true})); // Configuración para poder recibir tipos de datos complejos en la URL
app.use(express.json()); // Configuración para trabajar con archivos en formato JSON

app.use(express.static(`${___dirname}/public`)); // Configuración para servir archivos estáticos

// Motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', `${___dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter)

const server = app.listen(8080, () => console.log('Listening port 8080 . . .'));
//app.listen(8080, () => console.log('Listening port 8080 . . .'));

//Socket io
const socketServer = new Server(server);

const messages = [];

socketServer.on('connection', socket => {

    console.log('Nuevo cliente conectado');

    socket.on('message', data => {
        messages.push(data);
        socketServer.emit('messageLogs', messages);
    })

    socket.on('authenticated', data => {
        socket.emit('messageLogs', messages);
        socket.broadcast.emit('newUserConected', data);
    })

});


















// EL Middleware de Manejo de Errores siempre debe ir al final y siempre debe estar presente
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).send({ error: err.message });
}); 