'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users');
    var importer = require('../../app/controllers/import');

    // Prints Routes
    app.route('/import')
        .post(importer.run);

};
