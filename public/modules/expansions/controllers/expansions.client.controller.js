'use strict';

// Expansions controller
angular.module('expansions').controller('ExpansionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Expansions',
	function($scope, $stateParams, $location, Authentication, Expansions ) {
		$scope.authentication = Authentication;

		// Create new Expansion
		$scope.create = function() {
			// Create new Expansion object
			var expansion = new Expansions ({
				name: this.name,
                code: this.code
			});

			// Redirect after save
			expansion.$save(function(response) {
				$location.path('expansions/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.code = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Expansion
		$scope.remove = function( expansion ) {
			if ( expansion ) { expansion.$remove();

				for (var i in $scope.expansions ) {
					if ($scope.expansions [i] === expansion ) {
						$scope.expansions.splice(i, 1);
					}
				}
			} else {
				$scope.expansion.$remove(function() {
					$location.path('expansions');
				});
			}
		};

		// Update existing Expansion
		$scope.update = function() {
			var expansion = $scope.expansion ;

			expansion.$update(function() {
				$location.path('expansions/' + expansion._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Expansions
		$scope.find = function() {
			$scope.expansions = Expansions.query();
		};

		// Find existing Expansion
		$scope.findOne = function() {
			$scope.expansion = Expansions.get({ 
				expansionId: $stateParams.expansionId
			});
		};
	}
]);