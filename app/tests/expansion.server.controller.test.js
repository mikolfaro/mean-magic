'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    nock = require('nock'),
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
        nock('https://sites.google.com')
            .get('/site/mtgfamiliar/manifests/patches.json')
            .reply(200, {
                "Patches": [
                    {
                        "Name": "An Expansion",
                        "URL": "https:\/\/sites.google.com\/site\/mtgfamiliar\/patches\/AXP.json.gzip",
                        "Code": "AXP"
                    },
                    {
                        "Name": "An Other Expansion",
                        "URL": "https:\/\/sites.google.com\/site\/mtgfamiliar\/patches\/OXP.json.gzip",
                        "Code": "OXP"
                    }
                ]
            });

        done();
    });

    it ('should be able to import expansions from MTGsalvation patches', function (done) {
        request(app)
            .post('/expansions/import')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err) {
                should.not.exist(err);

                Expansion.findOne({ code: 'AXP' }, function (err, expansion) {
                    should.not.exist(err);
                    should.exist(expansion);
                    expansion.should.have.property('code', 'AXP');

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