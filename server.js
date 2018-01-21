var express = require('express'),
 app = express(),
 dbConn = require('./conns/dbConn'),
 config = require('./configs/config'),
 port = config.port,
 bodyparser = require('body-parser'),
 morgan = require('morgan'),
 mongoose =require('mongoose'),
 mongoClient = require('mongodb').MongoClient,
 jwt = require('jsonwebtoken'),
 web3Conn = require('./conns/web3conn');
 
//connecting to db
mongoose.Promise = require('bluebird');
console.log('server : Before calling  DbConnection method');
dbConn.connection().then(function(res){
	console.log('server : Connected to Db');
	global.dbConnection = true;
	global.dbQueryObj = res;
}).catch(function(err){
	console.log('server :Error Connected to Db res ='+err);
	global.dbConnection = false;
});

//connecting to ethereum
console.log('server : Before connecting to ethereum');
global.web3 =  web3Conn.web3Meth();
console.log('server : After connecting to ethereum');

//setting secret variable 
console.log('server : Before setting secret key:' + config.secret);
app.set('superSecret',config.secret);
console.log('server : After setting secret key');

//body-parser to get infos from POST URL parameters
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

// app.use(bodyParser.json()) // handle json data
// app.use(bodyParser.urlencoded({ extended: true })) 

//morgan to log requests to the console
app.use(morgan('dev'));

// going to be used by express first
app.use(express.static('public')); 

//View Engine
app.set('views','./app/views');
app.set('view engine','ejs');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === "OPTIONS") 
        res.sendStatus(200)
    else 
        next();
}

app.use(allowCrossDomain);

//Routes configuration ...
app.get('/',function(req,res){res.render('login',{title:'KAPYng | Login'});});
app.get('/login',function(req,res){res.render('login',{title:'KAPYng | Login'});});
app.get('/register',function(req,res){res.render('register',{title:'KAPYng | Register'});});
app.get('/land-register',function(req,res){res.render('land-register',{title:'KAPYng | Land-Registration'});});
app.get('/nurcery-list',function(req,res){res.render('nurcery-list',{title:'KAPYng | Nurcery-List'});});
app.get('/forest-list',function(req,res){res.render('forest-list',{title:'KAPYng | Forest-List'});});
app.get('/chart',function(req,res){res.render('chart',{title:'KAPYng | chart'});});
app.get('/treasurey-list',function(req,res){res.render('treasurey-list',{title:'KAPYng | Treasury-Registration'});});
// app.get('/ballot',function(req,res){res.render('ballot',{title:'KAPYng | Create Ballot'});});
app.use('/api', require('./app/api'));

//listen and start the server
app.listen(port);
