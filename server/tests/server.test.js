var expect=require('expect');
var request=require('supertest');
var {app}=require('../server');
var {Todo}=require('../models/todo');
var {ObjectID}=require('mongodb');
var todo=[{
    text:"manish kumar",
    _id:new ObjectID()
},
{
    text:'somrthing',
    _id:new ObjectID()
}
];

console.log('hey',todo[0]._id);
beforeEach((done)=>{
    Todo.remove().then(()=>{
       return Todo.insertMany(todo).then(()=>{
            done();
       })
    })
})

describe('POST /todos',()=>{
     it('should create a new todo',(done)=>{
         var text='something';
         request(app)
         .post('/todos')
         .send({text})
         .expect(200)
         .expect((res)=>{
             //console.log(res);
             expect(res.body.text).toBe(text);
         })
         .end((err,res)=>{
             if(err) return done(err);
             Todo.find({text}).then((docs)=>{
                 expect(docs.length).toBe(1);
                 expect(docs[0].text).toBe(text);
                 done()
             }).catch((e)=>done(e))
         })
     })

     it('should return 400',(done)=>{
          request(app)
          .post('/todos')
          .send({})
          .expect(400)
          .end((err,res)=>{
              if(err) return done(err);
              Todo.find({}).then((doc)=>{
                  expect(doc.length).toBe(2);
                  done()
              }).catch((e)=>done(e))
          })
     })
})


describe('GET /todos',()=>{
    it('should return text',(done)=>{
        request(app)
        .get('/todos')
        .expect(400)
        .end((err,res)=>{
            if(err) return done(err);
              Todo.find().then((docs)=>{
                  expect(docs.length).toBe(2)
                  done();
              }).catch((e)=>done(e));
              
        })
    })
})


describe('GET /todos/:id',()=>{
     it('should return text of id',(done)=>{
         var hexId=todo[0]._id.toHexString();
         request(app)
         .get(`/todos/${hexId}`)
         .expect(200)
         .end((err,res)=>{
             if(err) return done(err);

             Todo.find({_id:hexId}).then((docs)=>{
                 expect(docs[0].text).toBe(todo[0].text);
                 done();
             }).catch((e)=>done(e));
         })
     })

     it('should return bad request 404',(done)=>{
         var hexId=new ObjectID('5967989ee978311656e93adf');
         request(app)
         .get(`/todos/${hexId}`)
         .expect(404)
         .end((err,res)=>{
             if(err) return done(err);

               Todo.find({_id:hexId}).then((docs)=>{
                   expect(docs.length).toBe(0);
                   done();
               }).catch((e)=>done(e))
         })
     })


     it('should return 400 for non-object ids', (done) => {
        let hexId = '5967989ee978311656e93a5312'
        request(app)
          .get(`/todos/${hexId}`)
          .expect(404)
          .end(done)
      })

})


describe('DELETE /todos/:id',()=>{
    it('should delete  data of id',(done)=>{
        var hexId=todo[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res)=>{
            //console.log('hey',res.body);
             expect(res.body._id).toBe(hexId);
        })
        .end(done)
    })
    
    it('should return 404 for id not found',(done)=>{
        var hexId=new ObjectID();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end((err,res)=>{
            if(err) return done(err);
            Todo.findById(hexId).then((docs)=>{
                expect(docs).toNotExist();
                done();
            })
        })

    })

    it('should return 404 for not valid Id',(done)=>{
        var id='nhhssjnag'
        request(app)
        .delete(`/todo/${id}`)
        .expect(404)
        .end(done)
    })

})