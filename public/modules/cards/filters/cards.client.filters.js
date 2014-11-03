'use strict';

// Cards filters
angular.module('cards').filter('iconifyMana', ['ManaCostManipulator', function (ManaCostManipulator) {
    return function (input) {
        if (!input || input.length === 0) {
            return '';
        }

        var manaMap = {
            '{0}' : 'mana_0.png',
            '{1}' : 'mana_1.png',
            '{2}' : 'mana_2.png',
            '{3}' : 'mana_3.png',
            '{4}' : 'mana_4.png',
            '{5}' : 'mana_5.png',
            '{6}' : 'mana_6.png',
            '{7}' : 'mana_7.png',
            '{8}' : 'mana_8.png',
            '{9}' : 'mana_9.png',
            '{10}' : 'mana_10.png',
            '{11}' : 'mana_11.png',
            '{12}' : 'mana_12.png',
            '{13}' : 'mana_13.png',
            '{14}' : 'mana_14.png',
            '{15}' : 'mana_15.png',

            '{B}' : 'mana_B.png',
            '{R}' : 'mana_R.png',
            '{U}' : 'mana_U.png',
            '{W}' : 'mana_W.png',
            '{G}' : 'mana_G.png',

            '{BR}' : 'mana_BR.png',
            '{BG}' : 'mana_BG.png',
            '{WB}' : 'mana_WB.png',
            '{BU}' : 'mana_BU.png',
            '{RG}' : 'mana_RG.png',
            '{RW}' : 'mana_RW.png',
            '{RU}' : 'mana_RU.png',
            '{GW}' : 'mana_GW.png',
            '{GU}' : 'mana_GU.png',
            '{WU}' : 'mana_WU.png',

            '{2/B}' : 'mana_2B.png',
            '{2/R}' : 'mana_2R.png',
            '{2/U}' : 'mana_2U.png',
            '{2/W}' : 'mana_2W.png',
            '{2/G}' : 'mana_2G.png',

            '{BP}' : 'mana_BP.png',
            '{RP}' : 'mana_RP.png',
            '{UP}' : 'mana_UP.png',
            '{WP}' : 'mana_WP.png',
            '{GP}' : 'mana_GP.png',

            '{X}' : 'mana_X.png',
            '{Y}' : 'mana_Y.png',
            '{Z}' : 'mana_Z.png'
        };

        return ManaCostManipulator.split(input).map(function(value) {
            return '<img src="modules/cards/img/mana/' + manaMap[value] + '" alt="' + value + '" class="img-responsive" />';
        }).join('');
    };
}]);
