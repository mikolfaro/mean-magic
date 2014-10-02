'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Print = mongoose.model('Print'),
	_ = require('lodash');

/**
 * Create a Print
 */
exports.create = function(req, res) {
	var print = new Print(req.body);
	print.user = req.user;

	print.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(print);
		}
	});
};

/**
 * Show the current Print
 */
exports.read = function(req, res) {
	res.jsonp(req.print);
};

/**
 * Update a Print
 */
exports.update = function(req, res) {
	var print = req.print ;

	print = _.extend(print , req.body);

	print.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(print);
		}
	});
};

/**
 * Delete an Print
 */
exports.delete = function(req, res) {
	var print = req.print ;

	print.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(print);
		}
	});
};

/**
 * List of Prints
 */
exports.list = function(req, res) { Print.find().sort('-created').populate('user', 'displayName').exec(function(err, prints) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(prints);
		}
	});
};

/**
 * Print middleware
 */
exports.printByID = function(req, res, next, id) { Print.findById(id).populate('user', 'displayName')
    .populate('card').populate('expansion').exec(function(err, print) {
		if (err) return next(err);
		if (! print) return next(new Error('Failed to load Print ' + id));
		req.print = print ;
		next();
	});
};

/**
 * Print authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.print.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
