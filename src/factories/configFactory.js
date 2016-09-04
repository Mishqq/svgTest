(function(){
	angular.module('app').factory('configFactory', function(){
		let path = {
			fixtures: './src/fixtures/',
			components: './src/components/'
		};

		return {
			fixtures: path.fixtures,
			components: path.components
		}
	})
})();