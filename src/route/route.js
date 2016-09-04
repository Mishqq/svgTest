export default function routes($stateProvider) {
	$stateProvider
		.state('home', {
			url: '/',
			template: 'LOL',
			controller: 'mainCtrl',
			controllerAs: 'mainCtrl'
		});
}

routes.$inject = ['$stateProvider'];