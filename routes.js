var code = require('./routes/code.js');
var files = require('./routes/files.js');
var revert = require('./routes/revert.js');
var save = require('./routes/save.js');
var upload = require('./routes/upload.js');

module.exports = {
	code: code.process,
	files: files.process,
	revert: revert.process,
    save: save.process,
    upload: upload.process
};