(function(){
	angular.module('app').service('ngDgService', ()=>{return new ngDgService()});

	class ngDgService {
		constructor(){}

		/**
		 * Метод возвращает массив из двух чисел (координаты x и у)
		 * Координаты рассчитываются для определённого угла относительно центра диаграммы.
		 * Учитываем радиус
		 */
		calculateAbsCoord(angle, center, radius){
			let arr = [];
			if(angle >= 0 && angle < 90){
				arr[0] = center.x + Math.abs(radius*+Math.sin(angle*Math.PI/180).toPrecision(10));
				arr[1] = center.y - Math.abs(radius*+Math.cos(angle*Math.PI/180).toPrecision(10));
			} else if(angle >= 90 && angle < 180){
				arr[0] = center.x + Math.abs(radius*+Math.sin(angle*Math.PI/180).toPrecision(10));
				arr[1] = center.y + Math.abs(radius*+Math.cos(angle*Math.PI/180).toPrecision(10));
			} else if(angle >= 180 && angle < 270){
				arr[0] = center.x - Math.abs(radius*+Math.sin(angle*Math.PI/180).toPrecision(10));
				arr[1] = center.y + Math.abs(radius*+Math.cos(angle*Math.PI/180).toPrecision(10));
			} else if(angle >= 270 && angle <= 360){
				arr[0] = center.x - Math.abs(radius*+Math.sin(angle*Math.PI/180).toPrecision(10));
				arr[1] = center.y - Math.abs(radius*+Math.cos(angle*Math.PI/180).toPrecision(10));
			}
			return arr;
		};


		/**
		 * Метод возвращает массив с объектами, которые содержат данные о кольцах - координаты центра и радиус
		 */
		createCircles(config){
			let arr = []; // Массив колец
			for(let i=config.sRadius; i<config.width; i+=config.sRadius){
				arr.push({
					center: {
						x: config.width/2,
						y: config.height/2
					},
					radius: i
				});
			}
			return arr;
		};
	}
})();