//modulo terceros
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const fileUpload = require('express-fileupload');
const session = require('express-session');
var cors = require('cors');

console.log(`${ __dirname }`);
console.log(`--${process.env.NODE_ENV}--`);

if (process.env.NODE_ENV === 'development'){
  console.log('Desarrollo');
  require('dotenv').config({
    path: `${__dirname}/../.env.development`
  })
}else{
  console.log('Produccion');
  require('dotenv').config()
}

//modulo locales
const routersV1 = require('./routers/v1/index');

const URL_MONGO = process.env.URL_MONGO;

//////// expres/////////////
const app = express();

app.use(cors({
  credentials: true,
  origin: true
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 1 * 1024 * 1024 },
}));


app.use(session({
  secret: 'session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  httpOnly: false
}))


routersV1(app);


//////// handler /////////////
app.use( (error, req, res, next) =>{
  console.log(error);
  
  const status= error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    result: false,
    message: message,
    data: data
  })

});


mongoose.connect(URL_MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then( ()=> {
  console.log('Mongo OK');
  app.listen(process.env.PORT, () => {
    console.log('Server Ok');
  })
  
}).catch( (err)=> console.log(err) );


