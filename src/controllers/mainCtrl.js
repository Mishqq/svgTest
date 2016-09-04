class mainCtrl{
	constructor($scope){
		this.$scope = $scope;
		this.hello = 'Hellow from mainCtrl';

		this.init();
	}

	init(){
		console.log('---=== init app ===---');
		console.log('---=== init app ===---');
	};
}

mainCtrl.$inject = ['$scope'];

export {mainCtrl}