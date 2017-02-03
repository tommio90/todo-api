var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

var host = process.env.RDS_HOSTNAME;
var user = process.env.RDS_USERNAME;
var password = process.env.RDS_PASSWORD;
var port  =process.env.RDS_PORT;
var database = process.env.RSD_DB_NAME;

// if(env === 'production'){
    
    var sequelize = new Sequelize('play', 'root', 'password', {
        host: "localhost",
        dialect: 'mysql'
});
// }else{

//     sequelize = new Sequelize(undefined, undefined, undefined, {
//         'dialect':'sqlite',
//         'storage': __dirname  + '/data/dev-todo-api.sqlite'
//     });
 
// }
var db = {};



db.base = sequelize.import(__dirname + '/models/base.js');

db.uok = sequelize.import(__dirname + '/models/uok.js');

db.units = sequelize.import(__dirname + '/models/units.js');
db.uok_relationship = sequelize.import(__dirname + '/models/uok_relationship.js');
db.cedict = sequelize.import(__dirname + '/models/cedict.js');
db.hsk = sequelize.import(__dirname + '/models/hsk_seq.js');
db.sentence = sequelize.import(__dirname + '/models/sentence.js');

db.mywords = sequelize.import(__dirname + '/models/mywords.js');
db.many_to_many = sequelize.import(__dirname + '/models/many_to_many.js');

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.uok_relationship.belongsToMany(db.user, {through: db.many_to_many});
db.user.belongsToMany(db.uok_relationship, {through: db.many_to_many});

db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);




module.exports =db;