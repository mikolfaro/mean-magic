'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Print = mongoose.model('Print'),
    Expansion = mongoose.model('Expansion'),
    Card = mongoose.model('Card'),
	_ = require('lodash'),
    https = require('https'),
    zlib = require('zlib'),
    JSONStream = require('JSONStream');

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
exports.list = function(req, res) { Print.find().sort('-created').populate('user', 'displayName')
    .populate('card').populate('expansion').exec(function(err, prints) {
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
 * Import Prints
 */
var importPrints = function (toBeImportedPrints) {
    var writtenPrints = [];
    Expansion.findOne({ code: toBeImportedPrints[0].b }, function (err, expansion) {
        if (!expansion) {
            console.log('Expansion ' + toBeImportedPrints[0].b + ' not found');
        } else {
            console.log('Importing prints of ' + expansion.name);
            toBeImportedPrints.forEach(function (toBeImportedPrint) {
                Card.findOne({ name: toBeImportedPrint.a}, function (err, card) {
                    if (!card) {
                        console.log('Card named: ' + toBeImportedPrint.a + ' not found');
                    } else {
                        Print.findOne({ collectorNumber:toBeImportedPrint.m, expansion: expansion },
                            function (err, print) {
                                if (!print) {
                                    print = new Print({
                                        card: card,
                                        expansion: expansion,
                                        collectorNumber: toBeImportedPrint.m,
                                        flavorText: toBeImportedPrint.k,
                                        illustrator: toBeImportedPrint.l
                                    });

                                    print.save(function (err) {
                                        if (err) {
                                            console.log('Failed import: ' + card.name);
                                        } else {
                                            writtenPrints.push(card.name);
                                        }
                                    });
                                }
                        });
                    }
                });
            });
        }
    });

    return writtenPrints;
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
                var prints = importPrints(root.t.p.o);
                res.write(JSON.stringify(prints));
                res.end();
            });
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
