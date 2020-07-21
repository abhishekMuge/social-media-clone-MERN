const express = require('express');
const app = express();
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./config/keys').mongoURI;
const passport = require('passport');
const user = require('./routes/api/user');
const post = require('./routes/api/post')
const profile = require('./routes/api/profile')
//mongoose connection
mongo
    .connect(db, {
        useUnifiedTopology:true,
        useNewUrlParser: true,
        useFindAndModify: false 
    })
    .then(() => console.log('mongodb connected!'))
    .catch(err => console.log(err));


//body parser middleware
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//passport init
app.use(passport.initialize());

//initial jwt strategy
require('./config/passport')(passport);

//use routes
app.use('/api/users', user);
app.use('/api/post', post);
app.use('/api/profile', profile);

//app listen
const port = process.env.PORT || 5000;
app.listen(port , () => console.log(`Server running on ${port} port`));