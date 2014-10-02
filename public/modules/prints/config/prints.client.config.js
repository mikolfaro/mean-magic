'use strict';

// Configuring the Articles module
angular.module('prints').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Prints', 'prints', 'dropdown', '/prints(/create)?');
		Menus.addSubMenuItem('topbar', 'prints', 'List Prints', 'prints');
		Menus.addSubMenuItem('topbar', 'prints', 'New Print', 'prints/create');
	}
]);