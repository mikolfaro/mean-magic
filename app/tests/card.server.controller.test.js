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
    Card = mongoose.model('Expansion');

/**
 * Unit tests
 */
describe('Card Controller Unit Tests:', function() {
    beforeEach(function (done) {
        nock('https://sites.google.com')
            .get('/site/mtgfamiliar/patches/AXP.json.gzip')
            .reply(200, {})
            .get('/site/mtgfamiliar/patches/OXP.json.gzip')
            .reply(200, {});

        done();
    });

    it ('should be able to import cards from MTGsalvation json.gz', function (done) {
        request(app)
            .post('/cards/import')
            .send({ targetUrl: 'https://sites.google.com/site/mtgfamiliar/patches/AXP.json.gzip' })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err) {
                should.not.exist(err);

                Card.findOne({ code: 'AXP' }, function (err, expansion) {
                    should.not.exist(err);
                    should.exist(expansion);
                    expansion.should.have.property('code', 'AXP');

                    Card.findOne({ code: 'OXP'}, function (err, expansion2) {
                        should.not.exist(err);
                        should.exist(expansion2);
                        expansion2.should.have.property('code', 'OXP');
                        done();
                    });
                });
            });
    });

    afterEach(function (done) {
        Card.remove().exec();
        User.remove().exec();

        done();
    });
});