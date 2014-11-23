'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	users = require('./users'),
	_ = require('lodash'),
	http = require('http'),
	JSONStream = require('JSONStream'),
	Promise = require('promise'),
	Expansion = mongoose.model('Expansion'),
	Card = mongoose.model('Card'),
	Creature = mongoose.model('Creature'),
	Planeswalker = mongoose.model('Planeswalker'),
	Print = mongoose.model('Print');

/**
 * Create a Expansion
 */
exports.create = function(req, res) {
	var expansion = new Expansion(req.body);
	expansion.user = req.user;

	expansion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(expansion);
		}
	});
};

/**
 * Show the current Expansion
 */
exports.read = function(req, res) {
	res.jsonp(req.expansion);
};

/**
 * Update a Expansion
 */
exports.update = function(req, res) {
	var expansion = req.expansion ;

	expansion = _.extend(expansion , req.body);

	expansion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(expansion);
		}
	});
};

/**
 * Delete an Expansion
 */
exports.delete = function(req, res) {
	var expansion = req.expansion ;

	expansion.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(expansion);
		}
	});
};

/**
 * List of Expansions
 */
exports.list = function(req, res) { Expansion.find().sort('-created').populate('user', 'displayName').exec(function(err, expansions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(expansions);
		}
	});
};

/**
 * Import Expansions
 */
var importExpansions = function (importableExpansions) {
	var promises = [];
	var exp;
	_.forEach(importableExpansions, function (importableExpansion) {
		promises.push(new Promise(function (resolve, reject) {
			Expansion.findOrCreate({ code: importableExpansion.code },
				{
					name: importableExpansion.name,
					code: importableExpansion.code
				}, function (err, expansion, created) {
					if (err) {
						console.log('Expansion ' + expansion + ' cannot be imported');
						reject(err);
					} else if (created) {
						resolve(expansion.code);
					} else {
						resolve();
					}
				});
		}));
		_.forEach(importableExpansion.cards, function (card) {
			promises.push(new Promise (function (resolve, reject) {
				var cardStub = {
					name: card.name,
					manaCost: card.manaCost,
					convertedManaCost: card.cmc || 0,
					type: card.type,
					rules: card.text
				};
				if (card.type.indexOf('Planeswalker') !== -1) {
					cardStub.loyalty = card.loyalty;
					card = new Planeswalker(cardStub);
				} else if (card.type.indexOf('Creature') !== -1) {
					cardStub.power = card.power;
					cardStub.toughness = card.toughness;
					card = new Creature(cardStub);
				} else {
					card = new Card(cardStub);
				}
				card.save(function (err) {
					if (err) {
						if (err.code === 11000) {
							resolve();
						} else {
							console.log('Card ' + card + ' cannot be imported');
							reject(err);
						}
					} else {
						resolve();
					}
				});
			}));
		});
	});

	return Promise.all(promises).then(function (importedExpansions) {
		return _.compact(importedExpansions);
	});
};

exports.importAll = function(req, res) {
    var url = 'http://mtgjson.com/json/AllSets.json';
	http.get(url, function(response) {
		if (response.statusCode !== 200) {
			console.log(response.statusCode);
			res.end();
		} else {
			response
				//.pipe(unzip.Parse())
				.pipe(JSONStream.parse())
				.on('root', function (root) {
					importExpansions(root)
						.done(function (expansions) {
							res.setHeader('Content-Type', 'application/json');
							res.write(JSON.stringify(expansions));
							res.end();
					});
				});
		}
    });
};

/**
 * Expansion middleware
 */
exports.expansionByID = function(req, res, next, id) { Expansion.findById(id).populate('user', 'displayName').exec(function(err, expansion) {
		if (err) return next(err);
		if (! expansion) return next(new Error('Failed to load Expansion ' + id));
		req.expansion = expansion ;
		next();
	});
};

/**
 * Expansion authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.expansion.user || (req.expansion.user.id !== req.user.id)) {
		// Maybe he's an admin
		users.hasAuthorization(['admin'])(req, res, next);
		// return res.status(403).send('User is not authorized');
	} else {
		next();
	}
};
