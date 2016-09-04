(function(){
	angular.module('app')
		.directive('ngR', function() {
			return function(scope, elem, attrs) {
				attrs.$observe('ngR', function(r) {
					elem.attr('r', r);
				});
			};
		})
		.directive('ngCx', function() {
			return function(scope, elem, attrs) {
				attrs.$observe('ngCx', function(cx) {
					elem.attr('cx', cx);
				});
			};
		})
		.directive('ngX', function() {
			return function(scope, elem, attrs) {
				attrs.$observe('ngX', function(x) {
					elem.attr('x', x);
				});
			};
		})
		.directive('ngY', function() {
			return function(scope, elem, attrs) {
				attrs.$observe('ngY', function(y) {
					elem.attr('y', y);
				});
			};
		})
		.directive('ngCy', function() {
			return function(scope, elem, attrs) {
				attrs.$observe('ngCy', function(cy) {
					elem.attr('cy', cy);
				});
			};
		})
		.directive('ngD', function() {
			return function(scope, elem, attrs) {
				attrs.$observe('ngD', function(d) {
					elem.attr('d', d);
				});
			};
		})
		.directive('ngFill', function() {
			return function(scope, elem, attrs) {
				attrs.$observe('ngFill', function(fill) {
					elem.attr('fill', fill);
				});
			};
		});
})();