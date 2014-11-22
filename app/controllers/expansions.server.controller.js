'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	users = require('./users'),
	Expansion = mongoose.model('Expansion'),
	_ = require('lodash'),
	http = require('http'),
	JSONStream = require('JSONStream'),
	Promise = require("promise").Promise;

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
var importExpansions = function (expansions) {
    var writtenExpansions = [];
    _.forEach(expansions, function (importableExpansion) {
		var promise = new Promise();
		writtenExpansions.push(promise);
        Expansion.findOne({ code: importableExpansion.code }, function (err, expansion) {
			if (!expansion) {
				expansion = new Expansion({
					name: importableExpansion.name,
					code: importableExpansion.code
				});
				expansion.save(function (err) {
					if (err) {
						console.log('Failed import: ' + expansion.name);
						promise.reject(err);
					} else {
						promise.resolve(expansion.code);
					}
				});
			}
			promise.resolve();
        });
    });

    return Promise.all(writtenExpansions);
};

exports.importAll = function(req, res) {
    var url = 'http://mtgjson.com/json/AllSets.json';
    console.log('Importing from: ' + url);
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
							console.log(expansions);
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
