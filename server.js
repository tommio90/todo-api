var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser')


var todos = [];
var todoNextId =1;

app.use(bodyParser.json());

//GET /todos
app.get('/todos', function(req, res){
    res.json(todos);
})
//GET /todos/:id
app.get('/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;
    
    todos.forEach(function(todo) {
        if(todoId === todo.id){
           machedTodo = todo;
        }
        return matchedTodo;
    });
      
    if(matchedTodo){
       res.json(matchedTodo); 
    }else{
        res.status(484).send();
    };

});

app.get('/', function (req, res){

    res.send('Todo API root');

});
//POST /todos

app.post('/todos', function(req, res){
    var body = req.body;
    
    body.id = todoNextId ++;

    todos.push(body);
    
    res.json(body);
});




app.listen(PORT, function(){
    console.log('Express listening on port:  '+ PORT);
});


