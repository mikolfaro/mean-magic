'use strict';

// Prints controller
angular.module('prints').controller('PrintsController', ['$scope', '$stateParams', '$location', 'Authentication',
    'Prints', 'Cards', 'Expansions',

	function($scope, $stateParams, $location, Authentication, Prints, Cards, Expansions) {
		$scope.authentication = Authentication;

        Cards.query(function (cards) {
            $scope.cards = cards;
            $scope.cardNames = cards.map(function (card) {
                return card.name;
            });
        });

        Expansions.query(function (expansions) {
            $scope.expansions = expansions;
            $scope.expansionNames = expansions.map(function(expansion) {
                return expansion.name;
            });
        });

		// Create new Print
		$scope.create = function() {

            var expansion = $scope.expansions.filter(function (expansion) {
                return expansion.name === $scope.expansionName;
            })[0];

            var card = $scope.cards.filter(function (card) {
                return card.name === $scope.cardName;
            })[0];

            // Create new Print object
			var print = new Prints ({
				card: card._id,
                expansion: expansion._id,
                collectorNumber: this.collectorNumber,
                flavorText: this.flavorText,
                illustrator: this.illustrator
			});

			// Redirect after save
			print.$save(function(response) {
				$location.path('prints/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Print
		$scope.remove = function( print ) {
			if ( print ) { print.$remove();

				for (var i in $scope.prints ) {
					if ($scope.prints [i] === print ) {
						$scope.prints.splice(i, 1);
					}
				}
			} else {
				$scope.print.$remove(function() {
					$location.path('prints');
				});
			}
		};

		// Update existing Print
		$scope.update = function() {
			var print = $scope.print ;

			print.$update(function() {
				$location.path('prints/' + print._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Prints
		$scope.find = function() {
			$scope.prints = Prints.query();
		};

		// Find existing Print
		$scope.findOne = function() {
			$scope.print = Prints.get({ 
				printId: $stateParams.printId
			});
		};
	}
]);
