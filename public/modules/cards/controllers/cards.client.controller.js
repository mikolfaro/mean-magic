'use strict';

// Cards controller
angular.module('cards').controller('CardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cards',
	function($scope, $stateParams, $location, Authentication, Cards ) {
		$scope.authentication = Authentication;

		// Create new Card
		$scope.create = function() {
			// Create new Card object
			var card = new Cards ({
				name: this.name,
                manaCost: this.manaCost,
                convertedManaCost: this.convertedManaCost,
                type: this.type,
                rules: this.rules,
                transformsInto: this.transformsInto
			});

            if (this._type !== null) {
                card._type = this._type;
                if (card._type === 'creature') {
                    card.power = this.power;
                    card.toughness = this.toughness;
                } else if (card._type === 'planeswalker') {
                    card.loyalty = this.loyalty;
                }
            }

			// Redirect after save
			card.$save(function(response) {
				$location.path('cards/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Card
		$scope.remove = function( card ) {
			if ( card ) { card.$remove();

				for (var i in $scope.cards ) {
					if ($scope.cards [i] === card ) {
						$scope.cards.splice(i, 1);
					}
				}
			} else {
				$scope.card.$remove(function() {
					$location.path('cards');
				});
			}
		};

		// Update existing Card
		$scope.update = function() {
			var card = $scope.card;

			card.$update(function() {
				$location.path('cards/' + card._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cards
		$scope.find = function() {
			$scope.cards = Cards.query();
		};

		// Find existing Card
		$scope.findOne = function() {
			$scope.card = Cards.get({ 
				cardId: $stateParams.cardId
			});
		};

        // Check if the card is a Creature or a Planeswalker
        $scope.checkCardType = function() {
            var obj = this.card || this;

            if (obj.type.indexOf('Planeswalker') !== -1) {
                obj._type = 'planeswalker';
            } else if (obj.type.indexOf('Creature') !== -1) {
                obj._type = 'creature';
            } else {
                obj._type = null;
            }
        };
	}
]);
