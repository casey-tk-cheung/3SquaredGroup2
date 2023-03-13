const express = require('express');
const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect('mongodb://0.0.0.0:27017/3SquaredProjectDB', options)
.catch(error => handleError(error));

mongoose.connection.on('error', err => {
    logError(err);
});


const app = express();
app.listen(12345, () => {
    console.log(`port 12345 open`);
})