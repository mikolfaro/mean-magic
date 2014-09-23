'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Expansion = mongoose.model('Expansion'),
	_ = require('lodash');

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
	if (req.expansion.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};