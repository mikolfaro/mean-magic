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
            var result = stringCost.split('');
            _.forEach(result, function (char, startIndex) {
                if (char === '{' ) {
                    var endIndex = _.indexOf(result, '}', startIndex);
                    result[startIndex] = result.splice(startIndex, endIndex - startIndex).join('') + '}';
                }
            });
            result = _.compact(result);
            return result;
        }
    };
}]);
