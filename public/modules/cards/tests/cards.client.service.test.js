'use strict';

(function() {
    // Cards Controller Spec
    describe('Cards Service Tests', function () {
        var ManaCostManipulator;

        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_ManaCostManipulator_) {
            ManaCostManipulator = _ManaCostManipulator_;
        }));

        it('ManaCostManipulatpr.split() should split the mana cost in representable elements', function () {
            expect(ManaCostManipulator.split('2RR')).toEqual(['2', 'R', 'R']);
            expect(ManaCostManipulator.split('2{WP}')).toEqual(['2', '{WP}']);
            expect(ManaCostManipulator.split('{2/B}{2/B}{2/B}')).toEqual(['{2/B}', '{2/B}', '{2/B}']);
            expect(ManaCostManipulator.split('2{G/U}W')).toEqual(['2', '{G/U}', 'W']);
            expect(ManaCostManipulator.split('X1B')).toEqual(['X', '1', 'B']);
            expect(ManaCostManipulator.split('14')).toEqual(['14']);
        });
    });
}());
