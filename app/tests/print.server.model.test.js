'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Print = mongoose.model('Print'),
    Expansion = mongoose.model('Expansion'),
    Card = mongoose.model('Card');

/**
 * Globals
 */
var user, card, expansion, expansion2,
    print1, print2;

/**
 * Unit tests
 */
describe('Print Model Unit Tests:', function() {
	beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        expansion = new Expansion({
            name: 'Alpha',
            code: 'A'
        });
        expansion2 = new Expansion({
            name: 'Beta',
            code: 'B'
        });

        card = new Card({
            name: 'Æther Vial',
            manaCost: '1',
            convertedManaCost: '1',
            type: 'Artifact',
            rules: 'At the beginning of your upkeep, you may put a charge counter on Æther Vial.\n\n' +
                'T: You may put a creature card with converted mana cost equal to the number of charge counters on Æther Vial from your hand onto the battlefield.'
        });

		user.save(function() {
            expansion.save(function () {
                expansion2.save(function () {
                    card.save(function () {

                        print1 = new Print({
                            card: card,
                            expansion: expansion,
                            collectorNumber: 1,
                            user: user,
                            rarity: 'Common',
                            illustrator: 'Dino Bovino'
                        });

                        print2 = new Print({
                            card: card,
                            expansion: expansion,
                            collectorNumber: 1,
                            rarity: 'Uncommon',
                            user: user
                        });

                        done();
                    });
                });
            });
        });
	});

	describe('Method Save', function() {

        it('should begin without prints', function(done) {
            Print.find({}, function(err, expansions) {
                expansions.should.have.length(0);
                done();
            });
        });

        it('should be able to save without problems', function(done) {
			return print1.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without card', function(done) {
			print1.card = null;

			return print1.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should be able to show an error when try to save without expansion', function(done) {
            print1.expansion = null;

            return print1.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without collector number', function(done) {
            print1.collectorNumber = null;

            return print1.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without rarity', function(done) {
            print1.rarity = null;

            return print1.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save a printing with same expansion and collector number', function(done) {
            return print1.save(function(err) {
                should.not.exist(err);

                print2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        it('should be able to save two cards with same collector number but different expansion', function(done) {
            print2.expansion = expansion2;
            return print1.save(function(err) {
                should.not.exist(err);
                print2.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });
        });
	});

	afterEach(function(done) {
		Print.remove().exec(function(err) {
            should.not.exist(err);
            Expansion.remove(function(err) {
                should.not.exist(err);
                Card.remove(function(err) {
                    should.not.exist(err);
                    User.remove(function(err) {
                        should.not.exist(err);
                        done();
                    });
                });
            });
        });
		// done();
	});
});
