var chai = require('chai');
var chaihttp = require('chai-http');
var should = chai.should();
chai.use(chaihttp);

var server = require('../server.js')(3030);

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
            .send("key=value")
            .end(function(err,res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg');
                res.body.msg.should.equal('success');
                done();
            });
        });
    });
});