'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Card = mongoose.model('Card'),
    Creature = mongoose.model('Creature'),
    Planeswalker = mongoose.model('Planeswalker'),
    _ = require('lodash'),
    https = require('https'),
    zlib = require('zlib'),
    JSONStream = require('JSONStream');

/**
 * Create a Card
 */
exports.create = function(req, res) {
	var card = null;
    if (req.body._type === 'creature') {
        card = new Creature(req.body);
    } else if (req.body._type === 'planeswalker') {
        card = new Planeswalker(req.body);
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
exports.list = function(req, res) {
    Card
        .paginate({}, req.query.page, req.query.count, function (err, pageCount, cards, itemCount) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
                res.setHeader('X-Page-Count', pageCount);
                res.setHeader('X-Item-Count', itemCount);
                res.jsonp(cards);
                res.end();
            }
        }, { populate: ['user', 'displayName'], sortBy: { name: 1} });
};

/**
 * Import cards
 */
var importCards = function (toBeImportedCards) {
    var writtenCards = [];
    toBeImportedCards.forEach(function (toBeImportedCard) {
        Card.findOne({ name: toBeImportedCard.a }, function (err, card) {
            if (!card) {
                if (toBeImportedCard.c.indexOf('Creature') > -1) {
                    card = new Creature({
                        power: toBeImportedCard.g,
                        toughness: toBeImportedCard.h
                    });
                } else if (toBeImportedCard.c.indexOf('Planeswalker') > -1) {
                    card = new Planeswalker({
                        loyalty: toBeImportedCard.i
                    });
                } else {
                    card = new Card();
                }
                card.name = toBeImportedCard.a;
                card.manaCost = toBeImportedCard.e;
                card.convertedManaCost = toBeImportedCard.f;
                card.type = toBeImportedCard.c;
                card.rules = toBeImportedCard.j;

                card.save(function (err) {
                    if (err) {
                        console.log ('Failed import: ' + card.name);
                    } else {
                        writtenCards.push(card.name);
                    }
                });
            }
        });
    });
    return writtenCards;
};

exports.importAll = function(req, res) {
    var resolve = function (url, callback) {
        https.get(url, function(response) {
            if (response.statusCode === 301 || response.statusCode === 302) {
                resolve(response.headers.location, callback);
            } else {
                callback(response);
            }
        });
    };

    console.log('Importing from: ' + req.body.targetUrl);

    resolve(req.body.targetUrl, function(response) {
        response
            .pipe(zlib.createGunzip())
            .pipe(JSONStream.parse(['o']))
            .on('root', function (root, count) {
                var cards = importCards(root.t.p.o);
                res.write(JSON.stringify(cards));
                res.end();
            });
    });
};

/**
 * Card middleware
 */
exports.cardByID = function(req, res, next, id) {
    Card
        .findById(id)
        .populate('user', 'displayName')
        .populate('transformsInto')
        .exec(function(err, card) {
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
