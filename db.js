var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

var host = process.env.RDS_HOSTNAME;
var user = process.env.RDS_USERNAME;
var password = process.env.RDS_PASSWORD;
var port  =process.env.RDS_PORT;
var database = process.env.RSD_DB_NAME;

if(env === 'production'){
     sequelize = new Sequelize('database', 'username', 'password', {
        host: host,
        port: port
});
    console.log( "frociuz" +process.env);
}else{

    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect':'sqlite',
        'storage': __dirname  + '/data/dev-todo-api.sqlite'
    });
    console.log( "fociooo"+process.env.NODE_ENV);
}
var db = {};
db.word_test = sequelize.import(__dirname + '/models/word_test.js');
db.worddb = sequelize.import(__dirname + '/models/worddb.js');
db.wordbook = sequelize.import(__dirname + '/models/wordbook.js');
db.wordzh = sequelize.import(__dirname + '/models/wordzh.js');
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

module.exports =db;