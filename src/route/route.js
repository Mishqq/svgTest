(function(){
	angular.module('app').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
		let pathToComponents = './src/components/'

		$urlRouterProvider.otherwise('/');

		let mainView = {
			"main": {
				templateUrl: pathToComponents + 'main/index.html'
				//templateUrl: configFactory.components + 'diagrammPage/diagrammPage.html'
			}
		};

		$stateProvider
			.state('home', {
				url: '/',
				views: mainView
			});
	}]);
})();