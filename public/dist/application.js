'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngSanitize',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ngLodash',
        'autocomplete'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('cards');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('expansions');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('prints');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('cards').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Cards', 'cards', 'dropdown', '/cards(/create)?');
    Menus.addSubMenuItem('topbar', 'cards', 'List Cards', 'cards');
    Menus.addSubMenuItem('topbar', 'cards', 'New Card', 'cards/create');
  }
]);'use strict';
//Setting up route
angular.module('cards').config([
  '$stateProvider',
  function ($stateProvider) {
    // Cards state routing
    $stateProvider.state('listCards', {
      url: '/cards',
      templateUrl: 'modules/cards/views/list-cards.client.view.html'
    }).state('createCard', {
      url: '/cards/create',
      templateUrl: 'modules/cards/views/create-card.client.view.html'
    }).state('viewCard', {
      url: '/cards/:cardId',
      templateUrl: 'modules/cards/views/view-card.client.view.html'
    }).state('editCard', {
      url: '/cards/:cardId/edit',
      templateUrl: 'modules/cards/views/edit-card.client.view.html'
    });
  }
]);'use strict';
// Cards controller
angular.module('cards').controller('CardsController', [
  '$scope',
  '$stateParams',
  '$location',
  '$state',
  'Authentication',
  'Cards',
  'Prints',
  function ($scope, $stateParams, $location, $state, Authentication, Cards, Prints) {
    $scope.authentication = Authentication;
    // Create new Card
    $scope.create = function () {
      // Create new Card object
      var card = new Cards({
          name: this.name,
          manaCost: this.manaCost,
          convertedManaCost: this.convertedManaCost,
          type: this.type,
          rules: this.rules,
          transformsInto: this.transformsInto
        });
      if (this._type !== null) {
        card._type = this._type;
        if (card._type === 'creature') {
          card.power = this.power;
          card.toughness = this.toughness;
        } else if (card._type === 'planeswalker') {
          card.loyalty = this.loyalty;
        }
      }
      // Redirect after save
      card.$save(function (response) {
        $location.path('cards/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Card
    $scope.remove = function (card) {
      if (card) {
        card.$remove();
        for (var i in $scope.cards) {
          if ($scope.cards[i] === card) {
            $scope.cards.splice(i, 1);
          }
        }
      } else {
        $scope.card.$remove(function () {
          $location.path('cards');
        });
      }
    };
    // Update existing Card
    $scope.update = function () {
      var card = $scope.card;
      card.$update(function () {
        $location.path('cards/' + card._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Prepare pagination defaults
    $scope.page = 1;
    $scope.count = 10;
    $scope.pageChanged = function () {
      $scope.find();
    };
    // Find a list of Cards
    $scope.find = function () {
      $scope.cards = Cards.query({
        page: $scope.page,
        count: $scope.count,
        q: $scope.query
      }, function (cards, headers) {
        $scope.totalItems = headers('X-Item-Count');
      });
    };
    // Find existing Card
    $scope.findOne = function () {
      $scope.card = Cards.get({ cardId: $stateParams.cardId });
      $scope.prints = Prints.query({ card: $stateParams.cardId }, function (prints) {
        if (prints) {
          $scope.print = prints[0];
        }
      });
    };
    // Select expansion
    $scope.changePrint = function (print) {
      console.log(print);
      $scope.print = print;
    };
    // Check if the card is a Creature or a Planeswalker
    $scope.checkCardType = function () {
      var obj = this.card || this;
      if (obj.type.indexOf('Planeswalker') !== -1) {
        obj._type = 'planeswalker';
      } else if (obj.type.indexOf('Creature') !== -1) {
        obj._type = 'creature';
      } else {
        obj._type = null;
      }
    };
    // Transform card
    $scope.transform = function () {
      if ($scope.card.transformsInto) {
        $state.go('viewCard', { 'cardId': $scope.card.transformsInto._id });
      }
    };
  }
]);/**
 * Created by mikol on 28/09/14.
 */
'use strict';
// Cards filters
angular.module('cards').filter('iconifyMana', [
  'ManaCostManipulator',
  function (ManaCostManipulator) {
    return function (text) {
      if (!text || text.length === 0) {
        return '';
      }
      var manaMap = {
          '{0}': 'mana_0.png',
          '{1}': 'mana_1.png',
          '{2}': 'mana_2.png',
          '{3}': 'mana_3.png',
          '{4}': 'mana_4.png',
          '{5}': 'mana_5.png',
          '{6}': 'mana_6.png',
          '{7}': 'mana_7.png',
          '{8}': 'mana_8.png',
          '{9}': 'mana_9.png',
          '{10}': 'mana_10.png',
          '{11}': 'mana_11.png',
          '{12}': 'mana_12.png',
          '{13}': 'mana_13.png',
          '{14}': 'mana_14.png',
          '{15}': 'mana_15.png',
          '{B}': 'mana_B.png',
          '{R}': 'mana_R.png',
          '{U}': 'mana_U.png',
          '{W}': 'mana_W.png',
          '{G}': 'mana_G.png',
          '{BR}': 'mana_BR.png',
          '{BG}': 'mana_BG.png',
          '{WB}': 'mana_WB.png',
          '{BU}': 'mana_BU.png',
          '{RG}': 'mana_RG.png',
          '{RW}': 'mana_RW.png',
          '{UR}': 'mana_UR.png',
          '{GW}': 'mana_GW.png',
          '{GU}': 'mana_GU.png',
          '{WU}': 'mana_WU.png',
          '{2/B}': 'mana_2B.png',
          '{2/R}': 'mana_2R.png',
          '{2/U}': 'mana_2U.png',
          '{2/W}': 'mana_2W.png',
          '{2/G}': 'mana_2G.png',
          '{BP}': 'mana_BP.png',
          '{RP}': 'mana_RP.png',
          '{UP}': 'mana_UP.png',
          '{WP}': 'mana_WP.png',
          '{GP}': 'mana_GP.png',
          '{X}': 'mana_X.png',
          '{Y}': 'mana_Y.png',
          '{Z}': 'mana_Z.png',
          '{T}': 'mana_T.png'
        };
      return text.replace(/(\{[\{\dWPXTURBG\}]*\})/g, function (matched) {
        return ManaCostManipulator.split(matched).map(function (value) {
          return '<img class="mana" src="modules/cards/img/mana/' + manaMap[value] + '" alt="' + value + '" />';
        }).join('');
      });
    };
  }
]).filter('markReminderText', [function () {
    return function (reminderText) {
      if (!reminderText || reminderText.length === 0) {
        return '';
      }
      return reminderText.replace(/(\(.*?\))/g, function (matched) {
        return '<span class="reminder-text">' + matched + '</span>';
      });
    };
  }]);'use strict';
//Cards service used to communicate Cards REST endpoints
angular.module('cards').factory('Cards', [
  '$resource',
  function ($resource) {
    return $resource('cards/:cardId', { cardId: '@_id' }, { update: { method: 'PUT' } });
  }
]);
angular.module('cards').factory('ManaCostManipulator', [
  'lodash',
  function (_) {
    return {
      'split': function (stringCost) {
        var result = stringCost.split(/(\{[^\{\}]*\})/);
        result = _.compact(result);
        return result;
      }
    };
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Articles module
angular.module('expansions').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Expansions', 'expansions', 'dropdown', '/expansions(/create)?');
    Menus.addSubMenuItem('topbar', 'expansions', 'List Expansions', 'expansions');
    Menus.addSubMenuItem('topbar', 'expansions', 'New Expansion', 'expansions/create');
  }
]);'use strict';
//Setting up route
angular.module('expansions').config([
  '$stateProvider',
  function ($stateProvider) {
    // Expansions state routing
    $stateProvider.state('listExpansions', {
      url: '/expansions',
      templateUrl: 'modules/expansions/views/list-expansions.client.view.html'
    }).state('createExpansion', {
      url: '/expansions/create',
      templateUrl: 'modules/expansions/views/create-expansion.client.view.html'
    }).state('viewExpansion', {
      url: '/expansions/:expansionId',
      templateUrl: 'modules/expansions/views/view-expansion.client.view.html'
    }).state('editExpansion', {
      url: '/expansions/:expansionId/edit',
      templateUrl: 'modules/expansions/views/edit-expansion.client.view.html'
    });
  }
]);'use strict';
// Expansions controller
angular.module('expansions').controller('ExpansionsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Expansions',
  function ($scope, $stateParams, $location, Authentication, Expansions) {
    $scope.authentication = Authentication;
    // Create new Expansion
    $scope.create = function () {
      // Create new Expansion object
      var expansion = new Expansions({
          name: this.name,
          code: this.code
        });
      // Redirect after save
      expansion.$save(function (response) {
        $location.path('expansions/' + response._id);
        // Clear form fields
        $scope.name = '';
        $scope.code = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Expansion
    $scope.remove = function (expansion) {
      if (expansion) {
        expansion.$remove();
        for (var i in $scope.expansions) {
          if ($scope.expansions[i] === expansion) {
            $scope.expansions.splice(i, 1);
          }
        }
      } else {
        $scope.expansion.$remove(function () {
          $location.path('expansions');
        });
      }
    };
    // Update existing Expansion
    $scope.update = function () {
      var expansion = $scope.expansion;
      expansion.$update(function () {
        $location.path('expansions/' + expansion._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Expansions
    $scope.find = function () {
      $scope.expansions = Expansions.query();
    };
    // Find existing Expansion
    $scope.findOne = function () {
      $scope.expansion = Expansions.get({ expansionId: $stateParams.expansionId });
    };
  }
]);'use strict';
//Expansions service used to communicate Expansions REST endpoints
angular.module('expansions').factory('Expansions', [
  '$resource',
  function ($resource) {
    return $resource('expansions/:expansionId', { expansionId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('prints').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Prints', 'prints', 'dropdown', '/prints(/create)?');
    Menus.addSubMenuItem('topbar', 'prints', 'List Prints', 'prints');
    Menus.addSubMenuItem('topbar', 'prints', 'New Print', 'prints/create');
  }
]);'use strict';
//Setting up route
angular.module('prints').config([
  '$stateProvider',
  function ($stateProvider) {
    // Prints state routing
    $stateProvider.state('listPrints', {
      url: '/prints',
      templateUrl: 'modules/prints/views/list-prints.client.view.html'
    }).state('createPrint', {
      url: '/prints/create',
      templateUrl: 'modules/prints/views/create-print.client.view.html'
    }).state('viewPrint', {
      url: '/prints/:printId',
      templateUrl: 'modules/prints/views/view-print.client.view.html'
    }).state('editPrint', {
      url: '/prints/:printId/edit',
      templateUrl: 'modules/prints/views/edit-print.client.view.html'
    });
  }
]);'use strict';
// Prints controller
angular.module('prints').controller('PrintsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Prints',
  'Cards',
  'Expansions',
  function ($scope, $stateParams, $location, Authentication, Prints, Cards, Expansions) {
    $scope.authentication = Authentication;
    //Cards.query({ page: 1, count: 10 }, function (cards) {
    //	$scope.cards = cards;
    //});
    $scope.searchCards = function (cardQuery) {
      console.log(cardQuery);
      return Cards.query({
        page: 1,
        count: 10,
        q: cardQuery
      }).$promise.then(function (cards) {
        console.log(cards);
        return cards;
      });
    };
    Expansions.query(function (expansions) {
      $scope.expansions = expansions;
    });
    // Create new Print
    $scope.create = function () {
      // Create new Print object
      var print = new Prints({
          card: $scope.card._id,
          expansion: $scope.expansion._id,
          collectorNumber: this.collectorNumber,
          flavorText: this.flavorText,
          illustrator: this.illustrator
        });
      // Redirect after save
      print.$save(function (response) {
        $location.path('prints/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Print
    $scope.remove = function (print) {
      if (print) {
        print.$remove();
        for (var i in $scope.prints) {
          if ($scope.prints[i] === print) {
            $scope.prints.splice(i, 1);
          }
        }
      } else {
        $scope.print.$remove(function () {
          $location.path('prints');
        });
      }
    };
    // Update existing Print
    $scope.update = function () {
      var print = $scope.print;
      print.$update(function () {
        $location.path('prints/' + print._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Prints
    $scope.find = function () {
      $scope.prints = Prints.query();
    };
    // Find existing Print
    $scope.findOne = function () {
      $scope.print = Prints.get({ printId: $stateParams.printId });
    };
  }
]);'use strict';
// Cards filters
angular.module('prints').filter('iconifyExpansion', [function () {
    return function (expansionCode) {
      if (!expansionCode || expansionCode.length === 0) {
        return '';
      }
      return '<img class="expansion-symbol" src="modules/expansions/img/symbol/' + expansionCode + '_symbol.png" alt="' + expansionCode + '" />';
    };
  }]);'use strict';
//Prints service used to communicate Prints REST endpoints
angular.module('prints').factory('Prints', [
  '$resource',
  function ($resource) {
    return $resource('prints/:printId', { printId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [
  'lodash',
  function (_) {
    var _this = this;
    _this._data = {
      user: window.user,
      isAdmin: function () {
        return _.intersection(window.user.roles, ['admin']).length > 0;
      }
    };
    return _this._data;
  }
]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);