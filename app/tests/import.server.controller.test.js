'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mocks = require('mocks'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Expansion = mongoose.model('Expansion'),
    Card = mongoose.model('Card'),
    Creature = mongoose.model('Creature'),
    Planeswalker = mongoose.model('Planeswalker'),
    Print = mongoose.model('Print'),
    importController = require('../../app/controllers/import');

describe('Import Controller Unit Tests:', function() {

    describe('Method Import', function() {
        it('should fetch the patches.json file', function (done) {

            done();
        });
    });

    afterEach(function(done) {
        Print.remove().exec(function(err) {
            should.not.exist(err);
            Expansion.remove(function(err) {
                should.not.exist(err);
                Card.remove(function(err) {
                    should.not.exist(err);
                    User.remove(function(err) {
                        should.not.exist(err);
                        done();
                    });
                });
            });
        });
    });
});
