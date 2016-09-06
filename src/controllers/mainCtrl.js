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
			this.countries = resp.data;
			this.cNum = 0;
		});

		this.$http.get(this.config.fixtures + 'otherinfo.json').then((resp)=>{
			this.info2 = resp.data;
			this.iNum = 0;
		});
	};

	mainCtrl.prototype.setCountry = function(e, idx){
		e.preventDefault();
		this.cNum = idx;
	};

	mainCtrl.prototype.setInfo2Item = function(e, idx){
		e.preventDefault();
		this.iNum = idx;
	};

	mainCtrl.prototype.callbackClick = function(item){
		console.log('---=== item ===---', item);
	};

})();