'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [ 'lodash',

	function(_) {
		var _this = this;

		_this._data = {
			user: window.user,
			isAdmin: function () {
				return _.intersection(window.user.roles, ['admin']).length > 0;
			},
			is: function (userId) {
				if (!userId || !window.user) {
					return false;
				} else {
					return userId === window.user._id;
				}
			}
		};

		return _this._data;
	}
]);
