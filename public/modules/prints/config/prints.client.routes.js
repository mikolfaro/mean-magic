'use strict';

//Setting up route
angular.module('prints').config(['$stateProvider',
	function($stateProvider) {
		// Prints state routing
		$stateProvider.
		state('listPrints', {
			url: '/prints',
			templateUrl: 'modules/prints/views/list-prints.client.view.html'
		}).
		state('createPrint', {
			url: '/prints/create',
			templateUrl: 'modules/prints/views/create-print.client.view.html'
		}).
		state('viewPrint', {
			url: '/prints/:printId',
			templateUrl: 'modules/prints/views/view-print.client.view.html'
		}).
		state('editPrint', {
			url: '/prints/:printId/edit',
			templateUrl: 'modules/prints/views/edit-print.client.view.html'
		});
	}
]);