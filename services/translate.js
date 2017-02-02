var request = require('request');

var hasChinese = require('has-chinese');
module.exports = function (translation) {
	return new Promise(function (resolve, reject) {
		var encodedTranslation = encodeURIComponent(translation);
		var url = 'http://fanyi.youdao.com/openapi.do?keyfrom=edugora&key=1877262899&type=data&doctype=json&version=1.1&q='+ encodedTranslation;

	

		request({
			url: url,
			json: true
		}, function (error, response, body) {
			if (error) {
				reject('Unable to translate');
			} else {
        var hanziString = JSON.stringify(body.translation);
  
           var hanziString = JSON.stringify(body.query);
           //var sound = pinyin(hanziString);
		   var traduzione = JSON.stringify(body.translation);
		   var explain = JSON.stringify(body);
		   var word ={hanzi: body.query, translation: traduzione };
           resolve(word);
         
			}
		});
		
	});
}