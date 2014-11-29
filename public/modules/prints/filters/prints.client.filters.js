'use strict';

// Cards filters
angular.module('prints')

    .filter('iconifyExpansion', [function () {
        return function (expansionCode, rarity) {
            if (!expansionCode || expansionCode.length === 0) {
                return '';
            }

            rarity = rarity || 'Common';
            var rarityCode = function (rarity) {
                if (rarity.indexOf('Timeshifted') > -1) {
                    return 't';
                } else if (rarity.indexOf('Mythic') > -1) {
                    return 'm';
                } else if (rarity.indexOf('Rare') > -1) {
                    return 'r';
                } else if (rarity.indexOf('Uncommon') > -1) {
                    return 'u';
                } else {
                    return 'c';
                }
            };

            return '<img class="expansion-symbol" src="http://mtgimage.com/symbol/set/' + expansionCode + '/' + rarityCode(rarity) + '/256.png" />';
        };
    }]);
