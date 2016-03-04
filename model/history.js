var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SearchHistory = new Schema({
    term: {
		type: String,
		default: ''
	},
    when: {
		type: Date,
		default: Date.now
	},
});
mongoose.model('SearchHistory', SearchHistory);