var code = require('./routes/code.js');
var revert = require('./routes/revert.js');
var save = require('./routes/save.js');
var upload = require('./routes/upload.js');

module.exports = {
	code: code.process,
	revert: revert.process,
    save: save.process,
    upload: upload.process
};