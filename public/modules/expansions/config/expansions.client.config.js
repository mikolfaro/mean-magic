'use strict';

// Configuring the Articles module
angular.module('expansions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Expansions', 'expansions', 'dropdown', '/expansions(/create)?');
		Menus.addSubMenuItem('topbar', 'expansions', 'List Expansions', 'expansions');
		Menus.addSubMenuItem('topbar', 'expansions', 'New Expansion', 'expansions/create');
	}
]);