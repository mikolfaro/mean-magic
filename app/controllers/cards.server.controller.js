'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    users = require('./users'),
    Card = mongoose.model('Card'),
    Creature = mongoose.model('Creature'),
    Planeswalker = mongoose.model('Planeswalker'),
    _ = require('lodash');

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
    var q = {};
    if (req.query.q) {
        q.name = new RegExp(req.query.q, 'i');
    }

    Card
        .paginate(q, req.query.page, req.query.count, function (err, pageCount, cards, itemCount) {
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
	if (!req.card.user || (req.card.user.id !== req.user.id)) {
        // Maybe he's an admin
        users.hasAuthorization(['admin'])(req, res, next);
		// return res.status(403).send('User is not authorized');
	} else {
        next();
    }
};
