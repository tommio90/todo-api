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


//GET/mywords

app.get('/mywords', function(req, res){
	var where ={};
	

	 	// where.user_id = {
		// 		$like:  1
		// 		};
	
		db.mywords.findAll({
				where:where
			}).then(function(word){
				var cart = [];
				var count =1;
				
				var numbe = parseInt(word.length);
				
				asyncLoop(word, function (item, next){
				//word[].uok_id
				//console.log(item.uok_id);
				 	where.uok_id = {
				$like:  item.uok_id
				};
				
				db.uok.findOne({
				where:where
				}).then(function(text){
					// var uokks = JSON.stringify(uokk);
					// uword.push(uokks);
					text.notes = item.notes;
					var element = {};
					element.notes= text.notes;
					element.simplified = text.simplified;
					element.pinyin_visual = text.pinyin_visual;
					element.Wmillion = text.Wmillion;
					element.dominant_pos = text.dominant_pos;
					

					cart.push(element);
					console.log(count);
					console.log(numbe);
					if(count === numbe){
						console.log('we are inside the count function');
						//res.json(cart);
						console.log(cart);
						//var obj = JSON.parse(cart);
						res.json(cart);
					}

					count ++;
				
				});
			
				console.log(count);
			
				
				next();
				
				
	             });

				 
				
			});
});

//POST/mywords

app.post('/mywords', function (req, res) {
	var body = _.pick(req.body, 'uok_id', 'notes');
	body.user_id = 1;
	body.lesson_number = 1;
	console.log(body)

	db.mywords.create(body).then(function (myword) {
		res.json(myword);
	}, function (e) {
		res.status(400).json(e);
	});
});

// app.post('/mywords', function(req, res) {
// 	var body = _.pick(req.body, 'uok_id');

// 	db.todo.create(body).then(function(todo) {
// 		req.user.addTodo(todo).then(function () {
// 			return todo.reload();
// 		}).then(function (todo) {
// 			res.json(todo.toJSON());
// 		});
// 	}, function(e) {
// 		res.status(400).json(e);
// 	});
// });

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


//GET/uoks
app.get('/uok', function(req,res){
	var query = req.query;
	var where ={

	};

	
		if (query.hasOwnProperty('qu') && query.qu.length > 0) {
			if(!ischinese(query.qu)){
				
				
				where.pinyin_visual = {
				$like:  query.qu 
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
				where:where
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
				where:where
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

		connection.query('SELECT * FROM `ced` WHERE `word_id` BETWEEN 15000 AND 17747'
		// connection.query('SELECT * FROM `cedict1` WHERE `simplified`='+query+''
		, function(err, rows, fields) {
		if (err) throw err;
	
		console.log('The solution is: '+ rows);
		var stringa = JSON.stringify(rows);
		var testj = JSON.parse(stringa);

		// res.json(rows);
		console.log('the first obj: '+ testj[0].simplified);

		asyncLoop(testj, function (item, next){
			console.log('the first obj: '+ item.simplified);
			db.cedict.create(item);
							// db.cedict1.findOrCreate(item);
					//  		 .spread(function(cedict, created) {
					//   			  console.log(cedict.get({
					//      	 plain: true
					//     }))
					//     console.log(created)

						
					//  })
			next();
		},function(){

		});
		});
});

//GET/ conversion sentence  to sequelize
app.get('/convertsentence', function(req,res){

		connection.query('SELECT * FROM `Done` WHERE `id` BETWEEN 35001 AND 37779'
		// connection.query('SELECT * FROM `cedict1` WHERE `simplified`='+query+''
		, function(err, rows, fields) {
		if (err) throw err;
	
		console.log('The solution is: '+ rows);
		var stringa = JSON.stringify(rows);
		var testj = JSON.parse(stringa);

		// res.json(rows);
		console.log('the first obj: '+ testj[0].simplified);

		asyncLoop(testj, function (item, next){
			//console.log('the first obj: '+ item.chinese_sent);
			var carica = {};
			carica.chinese_id = item.chinese_id;
			carica.chinese_sent = item.chinese_sent;
			carica.english_id = item.england_id;
			carica.english_sent = item.sentence_eng;
			console.log(carica);
			db.sentence.create(carica);
							// db.cedict1.findOrCreate(item);
					//  		 .spread(function(cedict, created) {
					//   			  console.log(cedict.get({
					//      	 plain: true
					//     }))
					//     console.log(created)

						
					//  })
			next();
		},function(){

		});
		});
});

// //GET/convert hsk to sequelize and give the uoks_id

app.get('/hsk', function(req, res){
	connection.query('SELECT * FROM `HSK` WHERE `hsk_id` BETWEEN 1 and 20',
	function(err, rows) {
		if (err) throw err;
		var stringa = JSON.stringify(rows);
			
		var jsona = JSON.parse(stringa);
		asyncLoop(jsona, function (item, next){
			var it = item.hanzi;
			db.uok.findOne({attributes :['uok_id']},{where:{simplified:it}}).then(function(result){
				var stri = JSON.stringify(result);
			
		var js = JSON.parse(stri);
				console.log(js);
			});;
			next();
		});
	});
})

//GET/test
app.get('/test', function(req,res){
		connection.query('SELECT * FROM `freq`WHERE `word_id` BETWEEN 18000 and 21000',
		function(err, rows) {
			if(err) throw err;
			var stringa = JSON.stringify(rows);
			
			var jsona = JSON.parse(stringa);
		//console.log(jsona);
		

				asyncLoop(jsona, function (item, next){
					
					//console.log('Item is: '+item.spelling);
					var query = JSON.stringify(item.spelling);
					connection.query('SELECT id, simplified, pinyin, pinyin1, pinyin2, pinyin3, translation_1 FROM `units` WHERE `simplified`='+query+''
					, function(err, test, fields) {
						if (err) throw err;
						var testa = JSON.stringify(test);
						var testj = JSON.parse(testa);
						if(testj.length){
							console.log('exists'+testj[0].simplified + ''+ item.spelling+'   '+ item.uok_id);
						}else{
							//console.log("create"+ item.dominant_pos+ item.spelling);
							var queryc = item.spelling;
						    connection.query('SELECT * FROM `cedict1` WHERE `simplified`='+query+''
					         , function(err, test, fields) {
					            	if (err) throw err;
                                    	var text ={};
									var tesa = JSON.stringify(test);
									var tesj = JSON.parse(tesa);
                                   
									var bodis = tesj[0];
                                    
                                    connection.query('SELECT * FROM `HSK` WHERE `hanzi`='+query+''
					         		, function(err, hsk, fields) {
					            	if (err) throw err;

										var teshsk = JSON.stringify(hsk);
										var tesjhsk = JSON.parse(teshsk);

										if(tesjhsk.length){
											text.hsk_number = tesjhsk[0].hsk;
										
										}else{
											test.hsk = 0;
										}
                                   
							
												text.length =item.length;
												text.uok_id = item.word_id;
												if(item.pinyin){
												var pinnum = item.pinyin;
												text.pinyin_number= pinnum.replace(/[^\d.-]/g, '');
												}
												text.frequency_id = item.word_id;
												text.pinyin_input = item.pinyin_input;
												text.Wmillion = item.Wmillion;
												text.dominant_pos = item.dominant_pos;
												text.simplified = item.spelling;
                                                 
												text.pinyin_visual = pinyin(item.spelling);

                                            
								if(tesj.length){
                                    
                                   
                                      var arra ={};
                                              var i = 0;
                                            text.traditional = tesj[i].traditional;
											console.log('HEy there!')
											var pinpin = JSON.stringify(tesj[i].pinyin);
											text.pinyin = pinpin.replace(']', '');
										
											text.translation_1 = tesj[i].translation_1;
											text.translation_2 = tesj[i].translation_2;
											text.translation_3 = tesj[i].translation_3;
											text.translation_4 = tesj[i].translation_4;
											text.translation_5 = tesj[i].translation_5;
											text.translation_6 = tesj[i].translation_6;
											text.translation_7 = tesj[i].translation_7;
											text.translation_8 = tesj[i].translation_8;
											text.translation_9 = tesj[i].translation_9;
											text.translation_10 = tesj[i].translation_10;
											text.translation_11 = tesj[i].translation_11;
											text.translation_12 = tesj[i].translation_12;
											text.translation_13 = tesj[i].translation_13;
											text.translation_14 = tesj[i].translation_14;
											text.translation_15 = tesj[i].translation_15;
										
                                            console.log('this is first:'+ text.translation_1);
											

                                          console.log('This word has multiple cedict entries:  '+ tesj.length);
                                      if(tesj.length > 1){
                                           console.log('This word has multiple cedict entries:  '+ tesj.length);
                                       
                                       for(var i = 1; i < tesj.length; i++){
                                          console.log(tesj[1].translation_1)
                                  
                                           
                                           if (i===1){
                                                var pinpin = JSON.stringify(tesj[i].pinyin);
											    text.pinyin1 = pinpin.replace(']', '');
                                                text.translation_101 = tesj[i].translation_1;
                                                text.translation_102 = tesj[i].translation_2;
                                                text.translation_103 = tesj[i].translation_3;
                                                text.translation_104= tesj[i].translation_4;
                                                text.translation_105 = tesj[i].translation_5;

                                                console.log('this is first:'+ text.translation_1);
                                                console.log('this is second:'+ text.translation_101);
                                           }

                                           if(i===2){
                                                var pinpin = JSON.stringify(tesj[i].pinyin);
											    text.pinyin2 = pinpin.replace(']', '');
                                                text.translation_201 = tesj[i].translation_1;
                                                text.translation_202 = tesj[i].translation_2;
                                                text.translation_203 = tesj[i].translation_3;
                                                text.translation_204= tesj[i].translation_4;
                                                text.translation_205 = tesj[i].translation_5;

                                                console.log('this is first:'+ text.translation_1);
                                                console.log('this is second:'+ text.translation_101);
                                                console.log('this is third:'+ text.translation_201);

                                           }

                                          if(i===3){
                                                var pinpin = JSON.stringify(tesj[i].pinyin);
											    text.pinyin3 = pinpin.replace(']', '');
                                                text.translation_301 = tesj[i].translation_1;
                                                text.translation_302 = tesj[i].translation_2;
                                                text.translation_303 = tesj[i].translation_3;
                                                text.translation_304= tesj[i].translation_4;
                                                text.translation_305 = tesj[i].translation_5;

                                                console.log('this is first:'+ text.translation_1);
                                                console.log('this is second:'+ text.translation_101);
                                                console.log('this is third:'+ text.translation_201);
                                                console.log('this is fourth:'+ text.translation_301);
                                                console.log('this is fourth:'+ text.dominant_pos);
                                           }
                                          
                                           var comp = _.compact(arra);
                                           //console.log('the number of translations available are:' + _.size(comp));

                                           console.log('Translation:'+ text);
                                           console.log(i);
                                       }
                                      }
                                   
                                    db.units.create(text);
                                    
									
								}else{
									console.log('else entrati')
									
									var quer = JSON.stringify(item.spelling);
									translate(quer).then(function(trans){
											
										
										var tra = JSON.stringify(trans.translation);
										var x =tra.replace(/["\\]/g, "");
									    var parsero = x.replace(/[\[\]']+/g,'');
										text.translation_1= parsero;
										var totraditional = chineseConv.tify(item.spelling);
										text.traditional = totraditional;
                                        console.log(text);
										db.units.create(text);
                                        console.log('this is the end on the other side'+ text);

									},function(e){
										console.log(e);
									});
									
									
								
								}
								
								
							
						
									 });
						});

									
							
						}

					});
				next()
				},function(){
						
			
				});
			});
	});//GET






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

