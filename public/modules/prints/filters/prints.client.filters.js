'use strict';

// Cards filters
angular.module('prints')

    .filter('iconifyExpansion', [function () {
        return function (expansionCode) {
            if (!expansionCode || expansionCode.length === 0) {
                return '';
            }

            var codeMap = {
                'ARB' : 'ARB_symbol.png'
            };

            return '<img class="expansion-symbol" src="modules/expansions/img/symbol/' + codeMap[expansionCode] + '" alt="' + expansionCode + '" />';
        }
    }]);
