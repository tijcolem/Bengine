var revert = require('./routes/revert.js');
var save = require('./routes/save.js');
var upload = require('./routes/upload.js');

module.exports = {
    revert: revert.process,
    save: save.process,
    upload: upload.process
};