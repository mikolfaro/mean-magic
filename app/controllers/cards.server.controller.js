'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Card = mongoose.model('Card'),
    Creature = mongoose.model('Creature'),
    Planewalker = mongoose.model('Planeswalker'),
    _ = require('lodash'),
    https = require('https');

/**
 * Create a Card
 */
exports.create = function(req, res) {
	var card = null;
    if (req.body._type === 'creature') {
        card = new Creature(req.body);
    } else if (req.body._type === 'planeswalker') {
        card = new Planewalker(req.body);
    } else {
        card = new Card(req.body);
    }
	card.user = req.user;

	card.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(card);
		}
	});
};

/**
 * Show the current Card
 */
exports.read = function(req, res) {
	res.jsonp(req.card);
};

/**
 * Update a Card
 */
exports.update = function(req, res) {
	var card = req.card ;

	card = _.extend(card , req.body);

	card.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(card);
		}
	});
};

/**
 * Delete an Card
 */
exports.delete = function(req, res) {
	var card = req.card ;

	card.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(card);
		}
	});
};

/**
 * List of Cards
 */
exports.list = function(req, res) { Card.find().sort('-created').populate('user', 'displayName').exec(function(err, cards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cards);
		}
	});
};

/**
 * Import cards
 */
exports.importAll = function(req, res) {
    var resolve = function (url, callback) {
        https.get(url, function(response) {
            console.log(url);
            console.log(response.statusCode);
            console.log('HEADERS: ' + JSON.stringify(response.headers));
            if (response.statusCode === 301 || response.statusCode === 302) {
                resolve(response.headers.location, callback);
            } else {
                callback(response);
            }
        });
    };

    console.log('Importing from: ' + req.targetUrl);
    resolve(req.targetUrl, function(response) {
        var content = '';
        response.on('data', function(chunk) {
            content += chunk;
        });
        response.on('end', function () {
            // var writtenExpansions = importCards(JSON.parse(content).Patches);
            res.jsonp({ expansions: 'something' });
        });
    });
};

/**
 * Card middleware
 */
exports.cardByID = function(req, res, next, id) { Card.findById(id).populate('user', 'displayName').exec(function(err, card) {
		if (err) return next(err);
		if (! card) return next(new Error('Failed to load Card ' + id));
		req.card = card ;
		next();
	});
};

/**
 * Card authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.card.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
