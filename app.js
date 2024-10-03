const express = require('express');

const bodyParse = require('body-parser');

const mongoose = require('mongoose');

const cors = require('cors');

const app = express();



app.use(cors());
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));


mongoose.connect('mongodb://Streckk:contrasena@localhost:27017/todo',);

const connection = mongoose.connection;
const port = 3000;

connection.once('open', () => {
    console.log('Conectado a MongoDB');
  });

connection.on('error', (err) => { console.log('Error a la conexión a la BD', err) });


const Todo = mongoose.model('Todo',{text: String, completed: Boolean});

app.listen(port, () => { console.log('Servidor levantado!') });


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


app.get('/complete/:id/:status', (req, res) =>{
   const id = req.params.id;
   const status = req.params.status == 'true'; 
    Todo.findByIdAndUpdate({_id: id},{$set: {completed: status}})
    .then((doc) => {
        res.json({response: 'success'});
     })
    .catch((err) => { 
        console.log('Ocurrio un error!', err)
        res.statusCode(400).json({response: 'failed'});
    });
});



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
