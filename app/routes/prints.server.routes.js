'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var prints = require('../../app/controllers/prints');

	// Prints Routes
	app.route('/prints')
		.get(prints.list)
		.post(users.requiresLogin, prints.create);

	app.route('/prints/:printId')
		.get(prints.read)
		.put(users.requiresLogin, prints.hasAuthorization, prints.update)
		.delete(users.requiresLogin, prints.hasAuthorization, prints.delete);

	// Finish by binding the Print middleware
	app.param('printId', prints.printByID);
};
