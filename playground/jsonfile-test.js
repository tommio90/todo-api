var fs = require('fs');
var _ = require('underscore');
var asyncLoop = require('node-async-loop');
var obj;


fs.readFile('db.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
  console.log(obj);

asyncLoop(obj, function (item, next)
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
					
					
				}, function(e){
					res.status(400).json(e);
				});
			
		
				}).catch(function (error) {
					console.log(error);
				});
		
        next();
		
	}, function ()
	{
		console.log('Finished!');
	});
	});



