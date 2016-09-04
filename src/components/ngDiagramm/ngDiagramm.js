(function(){
	angular.module('app').controller('ngDiagrammCtrl', ngDiagrammCtrl);

	angular.module('app').directive('ngDiagramm', function(configFactory){
		let ngDg = 'ngDiagramm';

		function ngDiagrammLink($scope, $element, $attrs){

		}

		return {
			link: ngDiagrammLink,
			scope: {},
			templateUrl: configFactory.components + ngDg + '/' + ngDg + '.html',
			controller: ngDiagrammCtrl,
			controllerAs: 'dg',
			bindToController: {
				data: '=?',
				styles: '=?'
			}
		};
	});

	function ngDiagrammCtrl($scope, $element, $compile){
		this.$scope = $scope;
		this.$element = $element;
		this.$compile = $compile;

		this.svgStyles = {
			'width': '300px',
			'height': '300px'
		};
		this.showSvg = false;

		this.init();
	}

	ngDiagrammCtrl.prototype.init = function(){
		this.pathes = [];

		this.$scope.$watch(()=>{return this.data}, (data)=>{
			if(data){
				let arr = [], anglesArr = [], pathArr = [];

				for(var key in data[0].data){
					arr.push(data[0].data[key]);
				}

				for(let c=0, i=0; i<arr.length; i+=1){
					anglesArr.push({a1: c, a2: c+arr[i]});
					anglesArr[i].a1*=3.6;
					anglesArr[i].a2*=3.6;
					c += arr[i];
				}

				let radius = 100;
				let center = {x: 150, y: 150};

				let cash = 0;
				let colors = ['yellow', 'blue', 'green'];

				for(let i=0; i<anglesArr.length; i+=1){
					let coords = {dx1: '', dy1: '', dx2: '', dy2: ''};

					if(anglesArr[i].a1 >= 0 && anglesArr[i].a1 < 90){
						coords.dx1 = center.x + Math.abs(radius*+Math.sin(anglesArr[i].a1*Math.PI/180).toPrecision(3));
						coords.dy1 = center.y - Math.abs(radius*+Math.cos(anglesArr[i].a1*Math.PI/180).toPrecision(3));
					} else if(anglesArr[i].a1 >= 90 && anglesArr[i].a1 < 180){
						coords.dx1 = center.x + Math.abs(radius*+Math.sin(anglesArr[i].a1*Math.PI/180).toPrecision(3));
						coords.dy1 = center.y + Math.abs(radius*+Math.cos(anglesArr[i].a1*Math.PI/180).toPrecision(3));
					} else if(anglesArr[i].a1 >= 180 && anglesArr[i].a1 < 270){
						coords.dx1 = center.x - Math.abs(radius*+Math.sin(anglesArr[i].a1*Math.PI/180).toPrecision(3));
						coords.dy1 = center.y + Math.abs(radius*+Math.cos(anglesArr[i].a1*Math.PI/180).toPrecision(3));
					} else if(anglesArr[i].a1 >= 270 && anglesArr[i].a1 <= 360){
						coords.dx1 = center.x - Math.abs(radius*+Math.sin(anglesArr[i].a1*Math.PI/180).toPrecision(3));
						coords.dy1 = center.y - Math.abs(radius*+Math.cos(anglesArr[i].a1*Math.PI/180).toPrecision(3));
					}

					if(anglesArr[i].a2 >= 0 && anglesArr[i].a2 < 90){
						coords.dx2 = center.x + Math.abs(radius*+Math.sin(anglesArr[i].a2*Math.PI/180).toPrecision(3));
						coords.dy2 = center.y - Math.abs(radius*+Math.cos(anglesArr[i].a2*Math.PI/180).toPrecision(3));
					} else if(anglesArr[i].a2 >= 90 && anglesArr[i].a2 < 180){
						coords.dx2 = center.x + Math.abs(radius*+Math.sin(anglesArr[i].a2*Math.PI/180).toPrecision(3));
						coords.dy2 = center.y + Math.abs(radius*+Math.cos(anglesArr[i].a2*Math.PI/180).toPrecision(3));
					} else if(anglesArr[i].a2 >= 180 && anglesArr[i].a2 < 270){
						coords.dx2 = center.x - Math.abs(radius*+Math.sin(anglesArr[i].a2*Math.PI/180).toPrecision(3));
						coords.dy2 = center.y + Math.abs(radius*+Math.cos(anglesArr[i].a2*Math.PI/180).toPrecision(3));
					} else if(anglesArr[i].a2 >= 270 && anglesArr[i].a2 <= 360){
						coords.dx2 = center.x - Math.abs(radius*+Math.sin(anglesArr[i].a2*Math.PI/180).toPrecision(3));
						coords.dy2 = center.y - Math.abs(radius*+Math.cos(anglesArr[i].a2*Math.PI/180).toPrecision(3));
					}

					for(let key in coords){
						coords[key] = Math.round(coords[key]);
					}

					let largeArcFlag = (anglesArr[i].a2 - anglesArr[i].a1 > 180) ? 1 : 0;

					let params = 'M '+center.x+','+center.y+' L '+coords.dx1+','+coords.dy1+' A'+radius+','+radius+' 0 '+largeArcFlag+', 1 '+coords.dx2+','+coords.dy2+'';

					this.pathes.push({
						settings: params,
						color: colors[i]
					});
				}

				this.showSvg = true;
			}
		});
	};

	ngDiagrammCtrl.prototype.calculateAbsCoord = function(angle){

	};

	ngDiagrammCtrl.prototype.pathClick = function(e, item){
		e.preventDefault();
		console.log('---=== item ===---', item);
	}
})();