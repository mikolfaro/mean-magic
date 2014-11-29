'use strict';

// Cards filters
angular.module('cards')

    .filter('iconifyMana', ['ManaCostManipulator', function (ManaCostManipulator) {
        return function (text) {
            if (!text || text.length === 0) {
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

                '{B/R}' : 'mana_BR.png',
                '{B/G}' : 'mana_BG.png',
                '{W/B}' : 'mana_WB.png',
                '{B/U}' : 'mana_BU.png',
                '{R/G}' : 'mana_RG.png',
                '{R/W}' : 'mana_RW.png',
                '{U/R}' : 'mana_UR.png',
                '{G/W}' : 'mana_GW.png',
                '{G/U}' : 'mana_GU.png',
                '{W/U}' : 'mana_WU.png',

                '{2/B}' : 'mana_2B.png',
                '{2/R}' : 'mana_2R.png',
                '{2/U}' : 'mana_2U.png',
                '{2/W}' : 'mana_2W.png',
                '{2/G}' : 'mana_2G.png',

                '{B/P}' : 'mana_BP.png',
                '{R/P}' : 'mana_RP.png',
                '{U/P}' : 'mana_UP.png',
                '{W/P}' : 'mana_WP.png',
                '{G/P}' : 'mana_GP.png',

                '{X}' : 'mana_X.png',
                '{Y}' : 'mana_Y.png',
                '{Z}' : 'mana_Z.png',

                '{T}' : 'mana_T.png',
                '{Q}' : 'mana_Q.png'
            };

            return text.replace(/(\{[\{\dWPXTQURBG/\}]*\})/g, function (matched) {
                return ManaCostManipulator.split(matched).map(function(value) {
                    return '<img class="mana" src="modules/cards/img/mana/' + manaMap[value] + '" alt="' + value + '" />';
                }).join('');
            });
        };
    }])

    .filter('markReminderText', [function () {
        return function (reminderText) {
            if (!reminderText || reminderText.length === 0) {
                return '';
            }

            return reminderText.replace(/(\(.*?\))/g, function (matched) {
                return '<span class="reminder-text">' + matched + '</span>';
            });
        };
    }]);
