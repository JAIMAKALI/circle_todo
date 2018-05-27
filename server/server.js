require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectId} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

// Enter your code below this line.

app.post('/todos',(req,res)=>{
    var todo=new Todo({text:req.body.text});
    todo.save().then((doc)=>{
      res.send(doc);
    }).catch((e)=>{
      res.status(400).send(e);
    })
});

app.get('/todos',(req,res)=>{
  Todo.find({}).then((doc)=>{
    res.send(docs);
  }).catch((e)=>{
    res.status(400).send(e);
  })
})

app.get('/todos/:id',(req,res)=>{
      var id=req.params.id;
      if(!ObjectId.isValid(id)){
        return res.status(404).send('Id is not valid');
      }
    Todo.findById(id).then((docs)=>{
      console.log(docs);
      if(!docs){
        res.status(404).send({});
      }
     res.send(docs);
    }).catch((e)=>{
      res.status(400).send(e);
    })
})

app.delete('/todos/:id',(req,res)=>{
  var id=req.params.id;
  if(!ObjectId.isValid(id))
  {
    return res.status(404).send('Id is not valid');
  }

  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
    return  res.status(404).send('Id not found');
    }
    res.send(todo);

  }).catch((e)=>res.send(e));
})

app.listen(port, () => {
  console.log(`Starting on port ${port}`)
})

module.exports = {app}