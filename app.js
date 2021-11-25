var express = require('express');
require('dotenv').config();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//connect to MongoDB
// mongoose.connect('mongodb://localhost/booklibrary');
mongoose.connect(`mongodb+srv://ductrinh123:${process.env.PASSWORD}@cluster0.ppl2y.mongodb.net/booklibrary?retryWrites=true&w=majority`);
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connected!')
});
//use sessions for tracking logins
app.use(session({
  secret: 'LeDucTrinh',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  cookie: {
    // httpOnly:true,
    sameSite:'none',
    secure: true
  }
}));

/* CROS middleware */
const cors = require('cors');
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}
app.use(cors(corsOptions));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
app.use(express.static(__dirname + '/public'));

// include routes
var routes = require('./routes');
app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

port = process.env.PORT||8080
// listen on port 3000
app.listen(port, function () {
  console.log(`Express app listening on port ${port}`);
});