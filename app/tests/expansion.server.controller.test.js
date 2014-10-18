'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = require('../../server'),
    User = mongoose.model('User'),
    Expansion = mongoose.model('Expansion');

/**
 * Globals
 */
var url = 'http://localhost:3000';

/**
 * Unit tests
 */
describe('Expansion Controller Unit Tests:', function() {
    it ('should be able to import expansions from MTGsalvation patches', function (done) {
        request(app)
            .post('/expansions/import')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                console.log('Ended call');
                should.not.exist(err);
                done();
            });
    });

    afterEach(function (done) {
        Expansion.remove().exec();
        User.remove().exec();

        done();
    });
});