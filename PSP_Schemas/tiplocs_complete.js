const mongoose = require('mongoose');

const tiplocsCompleteSchema = new mongoose.Schema({
    TIPLOC: {type: String, required: true}, //, unique: true
},{collection: 'tiplocs_complete'});

const tiplocs_complete = mongoose.model("tiplocs_complete", tiplocsCompleteSchema);
module.exports = tiplocs_complete;
