'use strict';

// Cards filters
angular.module('prints')

    .filter('iconifyExpansion', [function () {
        return function (expansionCode) {
            if (!expansionCode || expansionCode.length === 0) {
                return '';
            }

            return '<img class="expansion-symbol" src="modules/expansions/img/symbol/' + expansionCode + '_symbol.png" alt="' + expansionCode + '" />';
        };
    }]);
