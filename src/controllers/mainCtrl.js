(function(){
	angular.module('app').controller('mainCtrl', mainCtrl);

	function mainCtrl($scope, $http, configFactory){
		this.$scope = $scope;
		this.$http = $http;
		this.config = configFactory;

		this.init();
	}

	mainCtrl.prototype.init = function(){
		this.$http.get(this.config.fixtures + 'countries.json').then((resp)=>{
			this.dataForDiagramm = resp.data;
		});
	}
})();