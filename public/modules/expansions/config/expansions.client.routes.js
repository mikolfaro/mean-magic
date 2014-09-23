'use strict';

//Setting up route
angular.module('expansions').config(['$stateProvider',
	function($stateProvider) {
		// Expansions state routing
		$stateProvider.
		state('listExpansions', {
			url: '/expansions',
			templateUrl: 'modules/expansions/views/list-expansions.client.view.html'
		}).
		state('createExpansion', {
			url: '/expansions/create',
			templateUrl: 'modules/expansions/views/create-expansion.client.view.html'
		}).
		state('viewExpansion', {
			url: '/expansions/:expansionId',
			templateUrl: 'modules/expansions/views/view-expansion.client.view.html'
		}).
		state('editExpansion', {
			url: '/expansions/:expansionId/edit',
			templateUrl: 'modules/expansions/views/edit-expansion.client.view.html'
		});
	}
]);