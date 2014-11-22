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

});
