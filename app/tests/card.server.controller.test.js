'use strict';

/**
* Module dependencies.
*/
var should = require('should'),
    nock = require('nock'),
    fs = require('fs'),
    zlib = require('zlib'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    app = require('../../server'),
    User = mongoose.model('User'),
    Expansion = mongoose.model('Expansion'),
    Card = mongoose.model('Card'),
    Creature = mongoose.model('Creature'),
    Planeswalker = mongoose.model('Planeswalker');

/**
* Unit tests
*/
describe('Card Controller Unit Tests:', function() {
    beforeEach(function (done) {
        nock('https://sites.google.com')
            .get('/site/mtgfamiliar/patches/AXP.json.gzip')
            .reply(200, function (uri, requestBody) {
                return fs.createReadStream(__dirname + '/replies/AXP.json')
                    .pipe(zlib.createGzip());
            })
            .get('/site/mtgfamiliar/patches/OXP.json.gzip')
            .reply(200, {});

        Expansion.create({ code: 'AXP', name: 'An Expansion' },  function (err) {
            done(err);
        });

    });

    it ('should be able to import cards from MTGsalvation json.gz', function (done) {
        request(app)
            .post('/cards/import')
            .send({ targetUrl: 'https://sites.google.com/site/mtgfamiliar/patches/AXP.json.gzip' })
            .expect(200)
            .end(function (err) {
                should.not.exist(err);

                Card.findOne({ name: 'A Card' }, function (err, card) {
                    should.not.exist(err);
                    should.exist(card);
                    card.should.have.property('manaCost', '{G}');
                    card.should.have.property('convertedManaCost');
                    card.should.have.property('type', 'Enchantment - Aura');
                    done();
                });
            });
    });

    afterEach(function (done) {
        Card.remove().exec();
        Creature.remove().exec();
        Planeswalker.remove().exec();
        Expansion.remove().exec();
        User.remove().exec();

        done();
    });
});
