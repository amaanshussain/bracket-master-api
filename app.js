const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

app.use('/api/teams', require('./routes/teams'));

app.use('/api/brackets', require('./routes/brackets'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});