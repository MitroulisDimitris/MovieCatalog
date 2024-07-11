
const bodyParser = require('body-parser');
var express = require('express');
var toDoController = require('./controller/moviePageController');
var app = express();

//template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
//listen to port
app.use(express.json());



toDoController(app);