'use strict';

//Cards service used to communicate Cards REST endpoints
angular.module('cards').factory('Cards', ['$resource',
	function($resource) {
		return $resource('cards/:cardId', { cardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('cards').factory('ManaCostManipulator', ['lodash', function(_) {
    return {
        'split': function (stringCost) {
            var result = stringCost.split(/(\{[^\{\}]*\})/);
            result = _.compact(result);
            return result;
        }
    };
}]);
