const express = require('express');
const app = express();
const mongo = require('mongoose');

const db = require('./config/keys').mongoURI;
const user = require('./routes/api/user');
const post = require('./routes/api/post')
const profile = require('./routes/api/profile')
//mongoose connection
mongo
    .connect(db, {
        useUnifiedTopology:true,
        useNewUrlParser: true
    })
    .then(() => console.log('mongodb connected!'))
    .catch(err => console.log(err));

//use routes
app.use('/api/user', user);
app.use('/api/post', post);
app.use('/api/profile', profile);

//app listen
const port = process.env.PORT || 5000;
app.listen(port , () => console.log(`app running on ${port} port`));