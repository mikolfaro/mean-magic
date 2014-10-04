'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    https = require('https'),
    Expansion = mongoose.model('Expansion'),
    Card = mongoose.model('Card'),
    Print = mongoose.model('Print'),
    _ = require('lodash');

exports.run = function(req, res) {

    var url = 'https://sites.google.com/site/mtgfamiliar/manifests/patches.json';
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

    resolve(url, function(response) {
        var content = '';
        response.on('data', function(chunk) {
            content += chunk;
        });
        response.on('end', function () {
            JSON.parse(content).Patches.forEach(function (toBeImportedExpansion) {
                var expansion = new Expansion({
                    name: toBeImportedExpansion.Name,
                    code: toBeImportedExpansion.Code
                });
                expansion.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    });
};
