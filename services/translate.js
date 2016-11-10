var request = require('request');
var pinyin = require("chinese-to-pinyin");
var hasChinese = require('has-chinese');
module.exports = function (translation) {
	return new Promise(function (resolve, reject) {
		var encodedTranslation = encodeURIComponent(translation);
		var url = 'http://fanyi.youdao.com/openapi.do?keyfrom=edugora&key=1877262899&type=data&doctype=json&version=1.1&q='+ encodedTranslation;

		if (!translation) {
			return reject('No translation provided');
		}

		request({
			url: url,
			json: true
		}, function (error, response, body) {
			if (error) {
				reject('Unable to translate');
			} else {
        var hanziString = JSON.stringify(body.translation);
         if(hasChinese(hanziString)){
            var sound = pinyin(hanziString);
            resolve('Translation is: ' + body.translation + '  Pinyin: '+ sound );
        
         }else{
          
           var hanziString = JSON.stringify(body.query);
           var sound = pinyin(hanziString);
		   var traduzione = JSON.stringify(body.translation);
		   var word ={hanzi: body.query, pinyin_tone: sound, translation: traduzione };
           resolve(word);
         }
			}
		});
		
	});
}