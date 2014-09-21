'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Card = mongoose.model('Card'),
    Creature = mongoose.model('Creature'),
    Planeswalker = mongoose.model('Planeswalker');

/**
 * Globals
 */
var user,
    card, card2,
    creature, creature2,
    planeswalker, planeswalker2;

/**
 * Unit tests
 */
describe('Card Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
            card = new Card({
                name: 'Æther Vial',
                manaCost: '1',
                convertedManaCost: '1',
                type: 'Artifact',
                rules: 'At the beginning of your upkeep, you may put a charge counter on Æther Vial.\n\n' +
                    'T: You may put a creature card with converted mana cost equal to the number of charge counters on Æther Vial from your hand onto the battlefield.'
            });
            card2 = new Card({
                name: 'Æther Vial',
                manaCost: '1',
                convertedManaCost: '1',
                type: 'Artifact',
                rules: 'At the beginning of your upkeep, you may put a charge counter on Æther Vial.\n\n' +
                    'T: You may put a creature card with converted mana cost equal to the number of charge counters on Æther Vial from your hand onto the battlefield.'
            });

            creature = new Creature({
                name: 'Withered Wretch',
                manaCost: 'BB',
                convertedManaCost: '2',
                type: 'Creature - Zombie Cleric',
                rules: '1: Exile target card from a graveyard.',
                power: '2',
                toughness: '2'
            });
            creature2 = new Creature({
                name: 'Withered Wretch',
                manaCost: 'BB',
                convertedManaCost: '2',
                type: 'Creature - Zombie Cleric',
                rules: '1: Exile target card from a graveyard.',
                power: '2',
                toughness: '2'
            });

            planeswalker = new Planeswalker({
                name: 'Sorin, Solemn Visitor',
                manaCost: '2WB',
                convertedManaCost: '4',
                type: 'Planeswalker - Sorin',
                rules: '+1: Until your next turn, creatures you control get +1/+0 and gain lifelink.\n\n' +
                    '-2: Put a 2/2 black Vampire creature token with flying onto the battlefield.\n\n' +
                    '-6: You get an emblem with "At the beginning of each opponent\'s upkeep, that player sacrifices a creature."',
                loyalty: '4'
            });
            planeswalker2 = new Planeswalker({
                name: 'Sorin, Solemn Visitor',
                manaCost: '2WB',
                convertedManaCost: '4',
                type: 'Planeswalker - Sorin',
                rules: '+1: Until your next turn, creatures you control get +1/+0 and gain lifelink.\n\n' +
                    '-2: Put a 2/2 black Vampire creature token with flying onto the battlefield.\n\n' +
                    '-6: You get an emblem with "At the beginning of each opponent\'s upkeep, that player sacrifices a creature."',
                loyalty: '4'
            });

            done();
		});
	});

	describe('Method Save', function() {
        it('should begin with no cards', function(done) {
            Card.find({}, function(err, result){
                result.should.have.length(0);
                done();
            });
        });

        it('should be able to save a simple card', function(done) {
            card.save(done);
        });

        it('should fail to save an existing card', function(done) {
            card.save();
            return card2.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should fail to save a card with blank name', function(done) {
            card.name = '';
            return card.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should fail to save a card with blank converted mana cost', function(done) {
            card.convertedManaCost = '';
            return card.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should fail to save a card with blank type', function(done) {
            card.type = '';
            return card.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to save a planeswalker card', function(done) {
            planeswalker.save(done);
        });

        it('should begin with no creatures', function(done) {
            Creature.find({}, function(err, cards){
                cards.should.have.length(0);
                done();
            });
        });

        it('should be able to save a creature card', function(done) {
            creature.save(done);
        });

        it('should fail to save a creature card with blank power', function(done) {
            creature.power = '';
            return creature.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should fail to save a creature card with blank toughness', function(done) {
            creature.toughness = '';
            return creature.save(function(err) {
                should.exist(err);
                done();
            });
        });

        after(function(done) {
            Card.remove().exec();
            done();
        });

    });

    describe('Method Find', function() {

        it('should be able to fetch cards, creatures and planeswalkers', function (done) {
            card2.save(function (err) {
                should.not.exist(err);
                creature2.save(function (err) {
                    should.not.exist(err);
                    planeswalker2.save(function (err) {
                        should.not.exist(err);

                        Card.find({}, function (err, cards) {
                            cards.should.have.length(3);
                            done();
                        });
                    });
                });
            });
        });

        after(function (done) {
            Card.remove().exec();
            Creature.remove().exec();
            Planeswalker.remove().exec();
            done();
        });

    });

	afterEach(function(done) { 
		Card.remove().exec();
		User.remove().exec();

		done();
	});
});