'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var expansions = require('../../app/controllers/expansions');

	// Expansions Routes
	app.route('/expansions')
		.get(expansions.list)
		.post(users.requiresLogin, expansions.create);

	app.route('/expansions/:expansionId')
		.get(expansions.read)
		.put(users.requiresLogin, expansions.hasAuthorization, expansions.update)
		.delete(users.requiresLogin, expansions.hasAuthorization, expansions.delete);

	// Finish by binding the Expansion middleware
	app.param('expansionId', expansions.expansionByID);
};