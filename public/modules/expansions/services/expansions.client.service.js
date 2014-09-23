'use strict';

//Expansions service used to communicate Expansions REST endpoints
angular.module('expansions').factory('Expansions', ['$resource',
	function($resource) {
		return $resource('expansions/:expansionId', { expansionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);