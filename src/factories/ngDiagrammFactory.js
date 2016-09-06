(function(){
	angular.module('app').factory('ngDgPresetsFactory', function(){
		let width = 500;
		let height = 500;

		let presets = {
			pathColors: {0:'#f58a41', 1:'#f0d367', 2:'#e64d1b'},
			svgWidth: width,
			svgHeight: height,
			svgStyles: {
				'width': width,
				'height': height,
				'fill': 'blue'
			},
			radius: 150,
			animateTime: 500,
			animateStep: 1
		};

		return {
			pathColors: presets.pathColors,
			svgWidth: presets.svgWidth,
			svgHeight: presets.svgHeight,
			svgStyles: presets.svgStyles,
			radius: presets.radius,
			animateTime: presets.animateTime,
			animateStep: presets.animateStep
		}
	})
})();