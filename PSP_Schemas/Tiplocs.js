const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TiplocsSchema = new Schema({
    Name: {type: String, required: true} // , unique: true
}, {collection: 'tiplocs'});

const Tiplocs = mongoose.model('Tiplocs', TiplocsSchema);

module.exports = Tiplocs;