'use strict';

(function() {
	// Prints Controller Spec
	describe('Prints Controller Tests', function() {
		// Initialize global variables
		var PrintsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
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

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Prints controller.
			PrintsController = $controller('PrintsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Print object fetched from XHR', inject(function(Prints) {
			// Create sample Print using the Prints service
			var samplePrint = new Prints({
				name: 'New Print'
			});

			// Create a sample Prints array that includes the new Print
			var samplePrints = [samplePrint];

			// Set GET response
			$httpBackend.expectGET('prints').respond(samplePrints);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.prints).toEqualData(samplePrints);
		}));

		it('$scope.findOne() should create an array with one Print object fetched from XHR using a printId URL parameter', inject(function(Prints) {
			// Define a sample Print object
			var samplePrint = new Prints({
				name: 'New Print'
			});

			// Set the URL parameter
			$stateParams.printId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/prints\/([0-9a-fA-F]{24})$/).respond(samplePrint);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.print).toEqualData(samplePrint);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Prints) {
			// Create a sample Print object
			var samplePrintPostData = new Prints({
				name: 'New Print'
			});

			// Create a sample Print response
			var samplePrintResponse = new Prints({
				_id: '525cf20451979dea2c000001',
				name: 'New Print'
			});

			// Fixture mock form input values
			scope.name = 'New Print';

			// Set POST response
			$httpBackend.expectPOST('prints', samplePrintPostData).respond(samplePrintResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Print was created
			expect($location.path()).toBe('/prints/' + samplePrintResponse._id);
		}));

		it('$scope.update() should update a valid Print', inject(function(Prints) {
			// Define a sample Print put data
			var samplePrintPutData = new Prints({
				_id: '525cf20451979dea2c000001',
				name: 'New Print'
			});

			// Mock Print in scope
			scope.print = samplePrintPutData;

			// Set PUT response
			$httpBackend.expectPUT(/prints\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/prints/' + samplePrintPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid printId and remove the Print from the scope', inject(function(Prints) {
			// Create new Print object
			var samplePrint = new Prints({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Prints array and include the Print
			scope.prints = [samplePrint];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/prints\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePrint);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.prints.length).toBe(0);
		}));
	});
}());