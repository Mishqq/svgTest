(function(){
	angular.module('app').factory('ngDgPresetsFactory', function(){
		let presets = {
			pathColors: ['#f58a41', '#f0d367', '#e64d1b'],
			svgWidth: 500,
			svgHeight: 500,
			svgStyles: {
				'width': 500 +'px',
				'height': 500 + 'px',
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