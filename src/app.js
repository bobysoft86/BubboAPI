const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); 

const path = require('path')
const app = express();
app.use(express.json());

//settings
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

app.use(cors());

//routes 
app.use(require('./routes/index'))

//static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
