var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var connection = require('./sql.js');


var bcrypt = require('bcrypt');
var fs = require('fs');
var asyncLoop = require('node-async-loop');
var middleware = require('./middleware.js')(db);
var ischinese = require('is-chinese');
var pinyin = require("chinese-to-pinyin");
var chineseConv = require('chinese-conv');

var translate = require('./services/translate.js');
var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNextId = 1;


app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
})

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});


//OLD SQL CODE
//COURSE


//POST//create courses

app.post('/course', function(req,res){

    console.log(req.body.corso);
var body = _.pick(req.body.corso, 'school' ,'text_book', 'teacher', 'course_objective');
	console.log(body.school);
     
     var schoolez = JSON.stringify(body.school);
     var text_bookez = JSON.stringify(body.text_book);
     var teacherez = JSON.stringify(body.teacher);
     var course_objectiveez = JSON.stringify(body.course_objective);
     var date = JSON.stringify(moment().format('MMMM Do YYYY, h:mm:ss a'));
     var id = 2;

     console.log(date);
     

     


      connection.query('INSERT INTO 1_course (date, user_id, school, text_book, teacher,  course_objective)VALUES ('+date+','+id+', '+schoolez+', '+text_bookez+', '+teacherez+', '+course_objectiveez+')'
			, function(err, rows, fields) {
			if (err) throw err;
      console.log(rows);
       res.json('200')
    
		});

});

//GET/ course

app.get('/courses', function(req, res){
    


    connection.query('SELECT * from 1_course WHERE user_id = 1 '
        , function(err,rows, fields){
            if(err) throw err;
            res.json(rows);
        });

});


//LESSONS

//POST lesson

app.post('/lesson', function(req,res){
   
    var body = _.pick(req.body.lezion.lezione, 'chapter_number' , 'lesson_objective', 'lesson_skill',  'topic');
    var bod = _.pick(req.body.lezion, 'ok' );
	console.log(bod);
     
     //var reviewez = JSON.stringify(body.review);
     var lesson_objectiveez = JSON.stringify(body.lesson_objective);
     var lesson_skillez = JSON.stringify(body.lesson_skill);
     var topicez= JSON.stringify(body.topic);
     var date = JSON.stringify(moment().format('MMMM Do YYYY, h:mm:ss a'));
     var user_id = 2;
     var course_id = parseInt(bod.ok);
     console.log(course_id);

      connection.query('INSERT INTO 1_lesson (date, user_id, course_id, chapter_number, lesson_objective, lesson_skill,  topic) VALUES ('+date+', '+user_id+', '+course_id+', '+body.chapter_number+', '+lesson_objectiveez+', '+lesson_skillez+',  '+topicez+')'
			, function(err, rows, fields) {
			if (err) throw err;
      console.log(rows);
       res.json('200')
    
		});

});

//GET//LESSONS

app.get('/lessons', function(req, res){

var query = parseInt(req.query.q);



    connection.query('SELECT * from 1_lesson WHERE course_id ='+query+' '
        , function(err,rows, fields){
            if(err) throw err;
            res.json(rows);
        });

});


//NOTES

//POST//NOTES

app.post('/note', function(req,res){
var body = _.pick(req.body, 'grammar_point' , 'note');
	console.log(body);
     
     //var reviewez = JSON.stringify(body.review);
     var noteez = JSON.stringify(body.note);

     var user_id = 2;
     var course_id = 6;
     var lesson_id = 4;
     
      connection.query('INSERT INTO 1_notes (lesson_id, user_id, course_id,  grammar_point, note) VALUES ('+lesson_id+', '+user_id+', '+course_id+', '+body.grammar_point+', '+noteez+')'
			, function(err, rows, fields) {
			if (err) throw err;
      console.log(rows);
       res.json('200')
    
		});

});


//GET//NOTES

app.get('/notes', function(req, res){


    connection.query('SELECT * from 1_notes WHERE user_id = 2 AND lesson_id = 4 ' 
        , function(err,rows, fields){
            if(err) throw err;
            res.json(rows);
        });

});


// //BASE

// //POST//
// // WORDS type:1
// // NOTES type:2
// // GRAMMAR POINTS type:3
// // SENTENCES  type:4
// // DIALOGUES type:5

// app.post('/base', function(req,res){
// var body = _.pick(req.body.items, 'word_id' , 'core', 'note', 'lezione_id', 'type');
	
    
//      //var reviewez = JSON.stringify(body.review);
//      var noteez = JSON.stringify(body.note);

//      var user_id = 2;
     
//      var lesson_id = parseInt(body.lezione_id);
//      var type = parseInt(body.type);

//      if (body.core === true){
//          var coreNumber = 1;
//      }
//        if (body.core === false){
//          var coreNumber = 0;
//      }

//    var put = {};

//    put.lesson_id = lesson_id;
//    put.user_id = user_id;
  
//    put.uok_id = body.word_id;
//    put.core = coreNumber;
//    put.note = noteez;
//    put.type = type;
  
//    var where;
//    var here;
//    if(type = 1){
//        where = 'uok_id';
//        here = put.uok_id;
//    }
   

//    db.base.create(put).then(function(put) {
		
// 			res.json(200);
// 		});
// 	}, function(e) {
// 		res.status(400).json(e);


//     //  connection.query('SELECT time_creation FROM base WHERE uok_id ='+here+' AND lesson_id = '+put.lesson_id+' '  
//     //     , function(err,response, fields){
//     //         if(err) throw err;
//     //      console.log(response);
//     //      console.log(response.length);
  
//     //       if (response.length >0){
//     //           res.json('present')
              

              
//     //         }else{
              
//     //     connection.query('INSERT INTO base (lesson_id, user_id, uok_id, core, note, type) VALUES ('+put.lesson_id+', '+put.user_id+',  '+put.uok_id+', '+put.core+', '+put.note+', '+put.type+')'
// 	// 		, function(err, rows, fields) {
// 	// 		if (err) throw err;
//     //         console.log(rows);
//     //         res.json('200')
    
// 	// 	});
        
        
//     //         }


//     //     });

        
     
     


// });
//BASE

//POST//
// WORDS type:1
// NOTES type:2
// GRAMMAR POINTS type:3
// SENTENCES  type:4
// DIALOGUES type:5

app.post('/base', function(req,res){
var body = _.pick(req.body.items, 'word_id' , 'core', 'note', 'lezione_id', 'type');
	
    
     //var reviewez = JSON.stringify(body.review);
     var noteez = JSON.stringify(body.note);

     var user_id = 2;
     
     var lesson_id = parseInt(body.lezione_id);
     var type = parseInt(body.type);

     if (body.core === true){
         var coreNumber = 1;
     }
       if (body.core === false){
         var coreNumber = 0;
     }

   var put = {};

   put.lesson_id = lesson_id;
   put.user_id = user_id;
  
   put.uok_id = body.word_id;
   put.core = coreNumber;
   put.note = noteez;
   put.type = type;
   var where;
   var here;
  
   


     connection.query('SELECT time_creation FROM base WHERE uok_id = '+put.uok_id+' AND lesson_id = '+put.lesson_id+' '  
        , function(err,response, fields){
            if(err) throw err;
         console.log(response);
         console.log(response.length);
  
          if (response.length >0){
              res.json('present')
              

              
            }else{
              
        connection.query('INSERT INTO base (lesson_id, user_id, uok_id, core, note, type) VALUES ('+put.lesson_id+', '+put.user_id+',  '+put.uok_id+', '+put.core+', '+put.note+', '+put.type+')'
			, function(err, rows, fields) {
			if (err) throw err;
            console.log(rows);
            res.json('200')
    
		});
        
        
            }


        });

        
     
     


});

//GET//BASE-ITEMS // 

app.get('/items', function(req, res){
var query = JSON.stringify(''+req.query.qu+'');


	// db.base.findAll({
	// 	lesson_id: query,
	// 	include: 
	// 		[{model: units, required: true}]
		
	// }).then(function(todo) {
	// 	res.json(todo)

		
	// }, function(e) {
	// 	res.status(500).send();
	// });

    connection.query('SELECT * from units INNER join base on units.id = base.uok_id where base.lesson_id ='+query+' ' 
        , function(err,rows, fields){
            if(err) throw err;
            res.json(rows);
        });

});






//END SQL

//GET/uoks
app.get('/uok', function(req,res){
	var query = req.query;
	var where ={

	};

	
		if (query.hasOwnProperty('qu') && query.qu.length > 0) {
			if(!ischinese(query.qu)){
				
				
				where.pinyin_input = {
				$like: '%' + query.qu + '%'
				};

				console.log('if  :'+where);
			}else{
			
				where.simplified = {
				$like: '%' + query.qu + '%'
				};

				console.log('if  :'+where);
			}
			
		}

	

		if (query.qu === '' ) {
			where.simplified={
				$like: 'frociodimerdaaaaaaaaa'
			}

		}
			
			db.units.findAll({
				where:where,
				limit : 10

			}).then(function(word){
				res.json(word);
			});

		

		
	
});
//GET/sentence
app.get('/sentence', function(req,res){
	var query = req.query;
	var where ={

	};

	
		if (query.hasOwnProperty('qu') && query.qu.length > 0) {
				if(!ischinese(query.qu)){
				
				
				where.english_sent = {
				$like: '%'+ query.qu+'%'
				};

				
			}else{
			
				where.chinese_sent = {
				$like: '%' + query.qu + '%'
				};
			}
			}
			
		if (query.qu === '' ) {
			where.chinese_sent={
				$like: 'frociodimerdaaaaaaaaa'
			}

		}
			
			db.sentence.findAll({
				where:where,
				limit: 10
			}).then(function(word){
				res.json(word);
			});

		

		
	
});
//GET/relationship

app.get('/relationship', function(req,res){



db.user.addUok_relationship(db.many_to_manies, { notes: 'started' });

});


//GET/ conversion to sequelize
app.get('/convert', function(req,res){

		connection.query('SELECT * FROM `units` WHERE `id` BETWEEN 20001 AND 20870'
		// connection.query('SELECT * FROM `cedict1` WHERE `simplified`='+query+''
		, function(err, rows, fields) {
		if (err) throw err;
	
		console.log('The solution is: '+ rows);
		var stringa = JSON.stringify(rows);
		var testj = JSON.parse(stringa);

		// res.json(rows);
		console.log('the first obj: '+ testj[0].simplified);


		testj.forEach(function(item){
				db.units.create(item);
			});

		// asyncLoop(testj, function (item, next){
		// 	console.log('the first obj: '+ item.simplified);
		// 	db.units.create(item);
		// 					// db.cedict1.findOrCreate(item);
		// 			//  		 .spread(function(cedict, created) {
		// 			//   			  console.log(cedict.get({
		// 			//      	 plain: true
		// 			//     }))
		// 			//     console.log(created)

						
		// 			//  })
		// 	next();
		// },function(){

		// });
		});
});

//GET/ conversion sentence  to sequelize
app.get('/convertsentence', function(req,res){
//37779
		connection.query('SELECT * FROM `Done` WHERE `chinese_id` BETWEEN 1 AND 1898544'
		// connection.query('SELECT * FROM `cedict1` WHERE `simplified`='+query+''
		, function(err, rows, fields) {
		if (err) throw err;
	
		console.log('The solution is: '+ rows);
		var stringa = JSON.stringify(rows);
		var testj = JSON.parse(stringa);
		var item = testj;
		// res.json(rows);
		
		console.log('the first obj: '+ testj[0].simplified);
		testj.forEach(function(item){
					var carica = {};
			carica.chinese_id = item.chinese_id;
			carica.chinese_sent = chineseConv.sify(item.chinese_sent);
			carica.english_id = item.england_id;
			carica.english_sent = item.sentence_eng;
			console.log(carica);
		
			db.sentence.create(carica);
			});

		// asyncLoop(testj, function (item, next){
		// 	//console.log('the first obj: '+ item.chinese_sent);
		// 	var carica = {};
		// 	carica.chinese_id = item.chinese_id;
		// 	carica.chinese_sent = item.chinese_sent;
		// 	carica.english_id = item.england_id;
		// 	carica.english_sent = item.sentence_eng;
		// 	console.log(carica);
		// 	db.sentence.create(carica);
		// 					// db.cedict1.findOrCreate(item);
		// 			//  		 .spread(function(cedict, created) {
		// 			//   			  console.log(cedict.get({
		// 			//      	 plain: true
		// 			//     }))
		// 			//     console.log(created)

						
		// 			//  })
		// 	next();
		// },function(){

		// });
		});
});








//GET/ WORDS
//this query will give access to the whole DB, turning the app in a dictionary such as pleco.
// use the DB downloaded, ( dunno if is the best way, probaby at this stage we should include just the most common words)
// implemet a system to search not only the words but also full sentences.


// GET /todos?completed=false&q=work
// This API request will search the SPECIFIC USER WORDS ACCORDING TO SOME QUERIES from the database and return to the user.
//Connection to Angular JS 2 and database implemented with Mongodb;
// This GET request require the middleware, therefore the user must be authenticated;
app.get('/todos', middleware.requireAuthentication, function(req, res) {
	var query = req.query;
	var where = {
		userId: req.user.get('id')
	};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});
});

// GET /todos/:id
// this API call will return all the users WORDS 
// It will be the filler for the user profile and the clustering will be done front end on Angular
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findOne({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
});



// POST /todos
// to convert the json file in a sqlite db and upload all the datas 
app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		req.user.addTodo(todo).then(function () {
			return todo.reload();
		}).then(function (todo) {
			res.json(todo.toJSON());
		});
	}, function(e) {
		res.status(400).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});
		} else {
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	});
});

// PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findOne({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});
});



//POST/ users 
//users sign up
app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

// POST /users/login
app.post('/users/login', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token: token
		});
	}).then(function (tokenInstance) {
		res.header('frocio', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function () {
		res.status(401).send();
	});
});

// DELETE /users/login
app.delete('/users/login', middleware.requireAuthentication, function (req, res) {
	req.token.destroy().then(function () {
		res.status(204).send();
	}).catch(function () {
		res.status(500).send();
	});
});



db.sequelize.sync(
	//{force:true}
	).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');

	});
	});
	


