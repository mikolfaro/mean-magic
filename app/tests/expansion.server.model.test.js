'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Expansion = mongoose.model('Expansion');

/**
 * Globals
 */
var user,
    expansion, expansion2;

/**
 * Unit tests
 */
describe('Expansion Model Unit Tests:', function() {
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
			expansion = new Expansion({
				name: 'Expansion Name',
				user: user
			});

            expansion = new Expansion({
                name: 'Alpha',
                code: 'A'
            });
            expansion2 = new Expansion({
                name: 'An Other Alpha',
                code: 'A'
            });

			done();
		});
	});

	describe('Method Save', function() {
        it('should begin with no expansions', function(done){
            Expansion.find({}, function(err, editions) {
                editions.should.have.length(0);
                done();
            });
        });

		it('should be able to save without problems', function(done) {
			return expansion.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

        it('should fail to save an existing expansion', function(done) {
            expansion.save();
            return expansion2.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should fail to save an expansion without code', function(done) {
            expansion.code = '';

            return expansion.save(function(err) {
                should.exist(err);
                done();
            });
        });

		it('should be able to show an error when try to save without name', function(done) { 
			expansion.name = '';

			return expansion.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Expansion.remove().exec();
		User.remove().exec();

		done();
	});
});
