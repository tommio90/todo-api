var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description: 'Meet mum for lunch',
    completed: false

},{
    id: 2,
    description: 'go to market',
    completed: false
},{
    id: 3,
    description: 'study node.js',
    completed: true
}];

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

})

app.get('/', function (req, res){

    res.send('Todo API root');

});

app.listen(PORT, function(){
    console.log('Express listening on port:  '+ PORT);
});