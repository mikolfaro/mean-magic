'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    nock = require('nock'),
    fs = require('fs'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    app = require('../../server'),
    User = mongoose.model('User'),
    Expansion = mongoose.model('Expansion');

/**
* Unit tests
*/
describe('Expansion Controller Unit Tests:', function() {
    beforeEach(function (done) {
        nock('http://mtgjson.com')
            .get('/json/AllSets.json')
            .reply(200, function (uri, requestBody) {
                return fs.createReadStream(__dirname + '/replies/AllSets.json');
            });

        done();
    });

    it ('should be able to import expansions from MTGsalvation patches', function (done) {
        request(app)
            .post('/expansions/import')
            .expect(200)

            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.have.lengthOf(2);
                res.body.should.eql([ 'AXP', 'OXP' ]);

                Expansion.findOne({ code: 'AXP' }, function (err, expansion) {
                    should.not.exist(err);
                    should.exist(expansion);
                    expansion.should.have.property('code', 'AXP');
                    expansion.should.have.property('name', 'An Expansion');

                    Expansion.findOne({ code: 'OXP'}, function (err, expansion2) {
                        should.not.exist(err);
                        should.exist(expansion2);
                        expansion2.should.have.property('code', 'OXP');
                        done();
                    });
                });
            });
    });

    afterEach(function (done) {
        Expansion.remove().exec();
        User.remove().exec();

        done();
    });
});
