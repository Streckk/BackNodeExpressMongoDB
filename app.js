const express = require('express');

const bodyParse = require('body-parser');

const mongoose = require('mongoose');

const app = express();

/**
 * Recuerda que para utilziar este proyecto es necesario tener instalado nodejs
 * Despues inicializar tu proyecto con npm init (Esto para cargar las dependencias de Nodejs y trabajar con el)
 * La configuración deja la por default
 * Despues instalamos las dependencias de express, mongose, body-parser (npm i express mongoose body-parser)
 * Por ultimo yo en lo personal te recomiendo instalar nodemon para ver los cambios como en hot reload (npm i nodemon)
 * 
 */


app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//En este apartado si quieres conectar MongoDBJ
//Recuerda debes de especificar tu usuario y tu contraseña
//En este caso mi usuario es Streckk y mi contraseña es contrasena
//Seguido de el puerto por default de MongoDB y la base de datos a la que se va establecer conexión
mongoose.connect('mongodb://Streckk:contrasena@localhost:27017/todo',);

const connection = mongoose.connection;
const port = 3000;

connection.once('open', () => {
    console.log('Conectado a MongoDB');
  });

connection.on('error', (err) => { console.log('Error a la conexión a la BD', err) });

//Modelo para poder realizar operaciones
const Todo = mongoose.model('Todo',{text: String, completed: Boolean});

app.listen(port, () => { console.log('Servidor levantado!') });

// Este endpoint es donde vamos a postear la información de nuestro input recibido
app.post('/add',(req, res) =>{
    const todo = new Todo({text: req.body.text, completed: false});
    todo.save().then(doc => { 
        console.log('Datos insertado correctamente!!', doc) 
        res.json({response: 'success'});
    }).catch((err) => { 
        console.log('Ocurrio un error!', err) 
        res.statusCode(400).json({response: 'failed'});
    });
});

//Este endpoint es para consultar los post que hemos realziado.

app.get('/getall',(req, res) =>{
    Todo.find({},'text completed')
    .then((doc) => { 
        res.json({response: 'success',data: doc});
    })
    .catch((err) => { 
        console.log('Ocurrio un error!', err) 
        res.statusCode(400).json({response: 'failed'});
    });

});

//Este endpoint nos servira para poder actualizar los todos que ya tenemos creados.
app.get('/complete/:id/:status', (req, res) =>{
   const id = req.params.id;
   const status = req.params.status == 'true'; //Lo que realizamos aquí es ver si lo que se obteniene es igual a verdadero regresa un valor booleano
    Todo.findByIdAndUpdate({_id: id},{$set: {completed: status}})
    .then((doc) => {
        res.json({response: 'success'});
     })
    .catch((err) => { 
        console.log('Ocurrio un error!', err)
        res.statusCode(400).json({response: 'failed'});
    });
});

//Este endpoint es que se va a encargar de eliminar nuestros Todos.

app.get('/delete/:id',(req, res) =>{
    const id = req.params.id;
    Todo.findByIdAndDelete({_id: id})
    .then((doc) => { 
         res.json({response: 'success'});
     })
    .catch((err) => { 
        console.log('Ocurrio un error al eliminar!', err)
        res.statusCode(400).json({response: 'failed'});
    });
    

});