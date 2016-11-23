var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var fs = require('fs');
var asyncLoop = require('node-async-loop');
var middleware = require('./middleware.js')(db);
var ischinese = require('is-chinese');
var translate = require('./services/translate.js');
var app = express();
var PORT = process.env.PORT || 3003;
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

//POST/worddb


app.post('/worddb', function(req,res){
	
	asyncLoop(req.body, function (item, next)
	{
		var body = _.pick(item, 'spelling', 'length', 'pinyin_input', 'Wmillion', 'dominant_pos');
	
		console.log("object is " + body.spelling);


		translate(body.spelling).then(function (text) {
					console.log(text);
					text.spelling = body.spelling;
					text.length = body.length;
					text.pinyin_input = body.pinyin_input;
					text.Wmillion = body.Wmillion;
					text.dominant_pos = body.dominant_pos;
					db.worddb.create(text).then(function(wordbook){
					res.json(wordbook.toJSON());
					next();
					
				}, function(e){
					res.status(400).json(e);
				});
			
		
				}).catch(function (error) {
					console.log(error);
				});
		

		
	}, function ()
	{
		console.log('Finished!');
	});
	 

 
 
 
 
 
 
 
 
 
 
//  for(object in req.body){

// 	 console.log('number is' +object);
   
//     var body = _.pick(req.body[object], 'spelling', 'length', 'pinyin_input', 'Wmillion', 'dominant_pos');
	
// 	console.log("object is " + body.spelling);


// 	 translate(body.spelling).then(function (text) {
// 				console.log(text);
// 				text.spelling = body.spelling;
// 				text.length = body.length;
// 				text.pinyin_input = body.pinyin_input;
// 				text.Wmillion = body.Wmillion;
// 				text.dominant_pos = body.dominant_pos;
// 			    db.worddb.create(text).then(function(wordbook){
// 				res.json(wordbook.toJSON());
// 			}, function(e){
// 				res.status(400).json(e);
// 			});
		
	
// 			}).catch(function (error) {
// 				console.log(error);
// 			});
			
// 	 }
});

//POST/wordzh
//this method aloud the creation of a database starting from json file I input
app.post('/wordzh', function(req,res){
	var body = _.pick(req.body, 'hsk' ,'hanzi', 'pinyin', 'meaning');
	console.log(body);
	db.wordzh.create(body).then(function(wordzh){
		res.json(wordzh.toJSON());
	}, function(e){
		res.status(400).json(e);
	});
});

//POST/wordbook

app.post('/wordbook', function(req,res){
	var body = _.pick(req.body, 'chapter', 'hanzi');
	 
	//  console.log(body.hanzi);

	 translate(body.hanzi).then(function (text) {
				console.log(text);
				text.chapter = body.chapter;
			    db.wordbook.create(text).then(function(wordbook){
				res.json(wordbook.toJSON());
			}, function(e){
				res.status(400).json(e);
			});
		
	
			}).catch(function (error) {
				console.log(error);
			});


});

//GET/worddb
app.get('/worddb', function(req,res){
	var query = req.query;
	var where ={

	};

	
		if (query.hasOwnProperty('qu') && query.qu.length > 0) {
			if(!ischinese(query.qu)){
				

				where.pinyin_input = {
				$like: '%' + query.qu + '%'
				};
			}else{
			
				where.spelling = {
				$like: '%' + query.qu + '%'
				};
			}
			
		}

		

		if ( query.qu === '' ) {
		
			where.pinyin = {
				$like: '%kk%'
				};
		}
	
	db.word_test.findAll({
		where:where
	}).then(function(word){
		res.json(word);



	}, function(e) {
		res.status(500).send();
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
	{force:true}
	).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');

	});

//implement the hsk database

// fs.readFile('hsk_1.json', 'utf8', function (err, data) {
//   if (err) throw err;
//   obj = JSON.parse(data);
//  // console.log(obj);

// asyncLoop(obj, function (item, next) {
// 		var body = _.pick(item, 'hsk', 'hanzi', 'pinyin', 'meaning');
		
// 		//console.log("object is " + );
		

// 		db.wordbook.create(item);
		
// 			next();
		
// 	}, function ()
// 	{
// 		console.log('Finished!');
// 	});
// 	});


// //finish hsk
			
			


//implement the database

// fs.readFile('db_1.json', 'utf8', function (err, data) {
//   if (err) throw err;
//   obj = JSON.parse(data);
//   console.log(obj);

// asyncLoop(obj, function (item, next)
// 	{
// 		var hsk_test = false;
// 		var body = _.pick(item, 'spelling', 'length','pinyin', 'pinyin_input', 'Wmillion', 'dominant_pos');
	
// 		console.log("object is " + body.spelling);

// 	db.wordbook.findOne({
// 			where: {
// 				hanzi : body.spelling
// 			}
// 		}).then(function(hsko) {
			
			
			
// 				translate(body.spelling).then(function (text) {
// 							console.log(text);
// 							if(hsko){ 
// 								text.translation = hsko.meaning;
// 								text.hsk = hsko.hsk;
// 							}else{
// 								text.hsk = 0;
// 							}
// 							text.spelling = body.spelling;
// 							text.length = body.length;	
// 							//var numberPin = body.pinyin.match(/\d+/g)				
// 							text.pinyin= body.pinyin;
// 							text.pinyin_input = body.pinyin_input;
// 							text.Wmillion = body.Wmillion;
// 							text.dominant_pos = body.dominant_pos;
// 							db.worddb.create(text);
							
// 							console.log(text);
							
					
				
// 						}).catch(function (error) {
// 							console.log(error);
// 						});
// 				});
//         next();
		
// 	}, function ()
// 	{
// 		console.log('Finished!');
// 	});
// 	});





//finish database code

//test DB


// fs.readFile('./database/db_1.json', 'utf8', function (err, data) {
//   if (err) throw err;
//   obj = JSON.parse(data);
//   console.log(obj);

// asyncLoop(obj, function (item, next)
// 	{
		
// 		var body = _.pick(item, 'spelling', 'length','pinyin', 'pinyin_input', 'Wmillion', 'dominant_pos');
// 		db.word_test.create(body);
//         next();
		
// 	}, function ()
// 	{
// 		console.log('Finished!');
// 	});
// 	});

//finish test DB

	
});