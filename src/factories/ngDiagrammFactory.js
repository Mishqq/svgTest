(function(){
	angular.module('app').factory('ngDgPresetsFactory', function(){
		let width = 500;
		let height = 500;

		let presets = {
			pathColors: ['#f58a41', '#f0d367', '#e64d1b'],
			svgWidth: width,
			svgHeight: height,
			svgStyles: {
				'width': width,
				'height': height,
				'fill': 'blue'
			},
			radius: 150
		};

		return {
			pathColors: presets.pathColors,
			svgWidth: presets.svgWidth,
			svgHeight: presets.svgHeight,
			svgStyles: presets.svgStyles,
			radius: presets.radius
		}
	})
})();