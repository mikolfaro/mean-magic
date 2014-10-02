'use strict';

//Prints service used to communicate Prints REST endpoints
angular.module('prints').factory('Prints', ['$resource',
	function($resource) {
		return $resource('prints/:printId', { printId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);