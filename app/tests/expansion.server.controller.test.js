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
    Expansion = mongoose.model('Expansion'),
    Card = mongoose.model('Card'),
    Print = mongoose.model('Print');

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

    it ('should be able to import expansions from MTGjson', function (done) {
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

    it ('should be able to import cards from MTGjson', function (done) {
        request(app)
            .post('/expansions/import')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.have.lengthOf(2);
                res.body.should.eql(['AXP', 'OXP']);

                Card.findOne({name: 'Air Elemental'}, function (err, card) {
                    should.not.exist(err);
                    card.should.have.property('name', 'Air Elemental');
                    card.should.have.property('manaCost', '{3}{U}{U}');
                    card.should.have.property('convertedManaCost', '5');
                    card.should.have.property('type', 'Creature — Elemental');
                    card.should.have.property('rules', 'Flying');
                    card.should.have.property('power', '4');
                    card.should.have.property('toughness', '4');

                    done();
                });
            });
    });

    it ('should set cmc of land cards to 0 from MTGjson', function (done) {
        request(app)
            .post('/expansions/import')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.have.lengthOf(2);
                res.body.should.eql(['AXP', 'OXP']);

                Card.findOne({name: 'Zoetic Cavern'}, function (err, card) {
                    should.not.exist(err);
                    card.should.have.property('name', 'Zoetic Cavern');
                    should.not.exist(card.manaCost);
                    card.should.have.property('convertedManaCost', '0');
                    card.should.have.property('type', 'Land');

                    done();
                });
            });
    });

    it ('should be able to import prints from MTGjson', function (done) {
        request(app)
            .post('/expansions/import')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.have.lengthOf(2);

                Print.findOne({ collectorNumber: '317' }, function (err, print) {
                    should.not.exist(err);
                    print.should.have.property('collectorNumber', '317');
                    print.should.have.property('illustrator', 'Lars Grant-West');

                    // Check card reference
                    Card.findOne({ _id: print.card}, function (err, card) {
                        should.not.exist(err);
                        card.should.have.property('name', 'Zoetic Cavern');

                        Expansion.findOne({ _id: print.expansion }, function (err, expansion) {
                            should.not.exist(err);
                            expansion.should.have.property('code', 'OXP');

                            done();
                        });
                    });
                });
            });
    });

    afterEach(function (done) {
        Print.remove().exec();
        Expansion.remove().exec();
        Card.remove().exec();
        User.remove().exec();

        done();
    });
});
