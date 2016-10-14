var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect':'sqlite',
    'storage': __dirname  + 'basic-sqllite-database.sqlite'
});


var Todo = sequelize.define('todo',{
    description:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            len :[1,250]

        }
    },
    completed:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});


sequelize.sync({
    //force: true
}).then(function(){
    console.log('Everything is sync');
    return (Todo.findById(2));
}).then(function(todo){
    if(todo){
        console.log(todo.toJSON());

    }else{
        console.log("cannot fetch your todo");
    }
})


/*
    Todo.create({
        description: 'walking my dog',
       }).then(function(todo){
           return Todo.create({
               description: 'clean your ass'
           });
       }).then(function(){
           //return (Todo.findById(1));
           return Todo.findAll({
               where:{
                   description:{
                        $like: '%ass%'
                   }
               }
           })
       }).then(function(todos){
           if(todos){
               todos.forEach(function(todo) {
                 console.log(todo.toJSON());  
               }, this);
               
           }else{
               console.log('Any todo found!')
           }

       
    }).catch(function(e){
        console.log(e);
    })
       
});
*/