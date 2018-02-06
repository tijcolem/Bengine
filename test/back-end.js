const chai = require('chai');
const chaihttp = require('chai-http');
const should = chai.should();
chai.use(chaihttp);

const fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json'));
var server = require('../server.js')(config);

describe('Class',function() {

    before(function() {
        // runs before all tests in this block
    });

    after(function() {
        // runs after all tests in this block
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    describe('#method',function() {
        it('should test',function(done) {
            chai.request(server)
            .post('/save')
            .send('{"fpath":1000}')
            .end(function(err,res) {
                //should.not.exist(err);
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('msg');
                res.body.msg.should.equal('Invalid Type: assets path');
                done();
            });
        });
    });
});