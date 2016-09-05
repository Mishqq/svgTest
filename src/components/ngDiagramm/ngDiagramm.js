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
				settings: '=?',
				data: '=?',
				styles: '=?',
				pathClick: '=?',
				ctx: '=?'
			}
		};
	});

	function ngDiagrammCtrl($scope, $element, $compile, ngDgPresetsFactory){
		this.$scope = $scope;
		this.$element = $element;
		this.$compile = $compile;
		/**
		 * Дефолтные настройки для директивки
		 */
		this.prs = ngDgPresetsFactory;

		this.showSvg = false;

		this.init();
	}

	/**
	 * Стартуем
	 */
	ngDiagrammCtrl.prototype.init = function(){
		/**
		 * Массив тэго <g>, который рендерится в темплейте
		 */
		this.pathes = [];

		/**
		 * Массив тэго <circle>
		 */
		this.circles = [];

		let config = {
			width: this.prs.svgWidth,
			height: this.prs.svgHeight,
			radius: this.prs.radius
		}

		/**
		 * Хранилище координат для анимации
		 */
		this.coordAnimStock = {};

		this.templateStock = {};

		this.$scope.$watch(()=>{return this.data}, (data)=>{
			if(data){
				//TODO: Написать проверку на сумму процентов

				if(this.pathes && this.pathes.length) this.pathes.length = 0;
				config.radius = this.prs.radius;

				if(!this.circles.length) this.createCircles(config);

				let arr = [], anglesArr = [];

				for(var key in data.data){
					arr.push({
						value:data.data[key].value,
						text: data.data[key].text
					});
				}

				/**
				 * Создаем сектора. Проценты переводим в радианы
				 * a1 - начало сектора, а2 = конец сектора
				 */
				for(let c=0, i=0; i<arr.length; i+=1){
					anglesArr.push({a1: c*3.6, a2: (c+arr[i].value)*3.6, text:arr[i].text, value: arr[i].value}); // Переводим градусы в градиенты
					c += arr[i].value;
				}

				/**
				 * Координаты центра диаграммы
				 */
				let center = {x: config.width/2, y: config.height/2};

				for(let i=0; i<anglesArr.length; i+=1){
					let coords = {x1: '', y1: '', x2: '', y2: ''};

					let arr = this.calculateAbsCoord(anglesArr[i].a1, center, config.radius);
					coords.x1 = arr[0];
					coords.y1 = arr[1];

					arr = this.calculateAbsCoord(anglesArr[i].a2, center, config.radius);
					coords.x2 = arr[0];
					coords.y2 = arr[1];

					for(let key in coords){
						coords[key] = Math.round(coords[key]);
					}

					this.coordAnimStock['cAnim_'+i] = {
						startX: coords.x1,
						startY: coords.y1,
						currentX: coords.x1,
						currentY: coords.y1,
						endX: coords.x2,
						endY: coords.y2
					}

					/**
					 * Смотрим, какую часть дуги отрисовывать. Если дуга меньше 180 градусов - ставим флаг на отрисовку меньшей стороны
					 */
					let largeArcFlag = (anglesArr[i].a2 - anglesArr[i].a1 > 180) ? 1 : 0;

					/**
					 * Свойство, которое кормим на вьюху для отрисовки сектора
					 */
					let params = 'M '+center.x+','+center.y+' L '+coords.x1+','+coords.y1+' A'+config.radius+','+config.radius+' 0 '+largeArcFlag+', 1 '+coords.x2+','+coords.y2+'';

					let textCoord = this.calculateAbsCoord( (anglesArr[i].a1+anglesArr[i].a2)/2, center, config.radius/2)

					let template = {
						id: 'g_' + (i+1),
						settings: params,
						color: this.prs.pathColors[i],
						value: anglesArr[i].value,
						text: anglesArr[i].text,
						textPosition: {
							x: textCoord[0],
							y: textCoord[1]
						}
					}

					this.templateStock['path'+i] = {
						id: 'g_' + (i+1),
						settings: params,
						color: this.prs.pathColors[i],
						value: anglesArr[i].value,
						text: anglesArr[i].text,
						textPosition: {
							x: textCoord[0],
							y: textCoord[1]
						}
					}
					
					this.pathes.push(template);

					/**
					 * Для каждого следующего сектора режем радиус
					 */
					config.radius = config.radius-20;

					this.pathAnimation();

					this.showSvg = true;
				}
			}
		});
	};

	/**
	 * Функция возвращает массив из двух чисел (координаты x и у)
	 * Координаты рассчитываются для определённого угла относительно центра диаграммы.
	 * Учитываем радиус
	 */
	ngDiagrammCtrl.prototype.calculateAbsCoord = function(angle, center, radius){
		let arr = [];
		if(angle >= 0 && angle < 90){
			arr[0] = center.x + Math.abs(radius*+Math.sin(angle*Math.PI/180).toPrecision(3));
			arr[1] = center.y - Math.abs(radius*+Math.cos(angle*Math.PI/180).toPrecision(3));
		} else if(angle >= 90 && angle < 180){
			arr[0] = center.x + Math.abs(radius*+Math.sin(angle*Math.PI/180).toPrecision(3));
			arr[1] = center.y + Math.abs(radius*+Math.cos(angle*Math.PI/180).toPrecision(3));
		} else if(angle >= 180 && angle < 270){
			arr[0] = center.x - Math.abs(radius*+Math.sin(angle*Math.PI/180).toPrecision(3));
			arr[1] = center.y + Math.abs(radius*+Math.cos(angle*Math.PI/180).toPrecision(3));
		} else if(angle >= 270 && angle <= 360){
			arr[0] = center.x - Math.abs(radius*+Math.sin(angle*Math.PI/180).toPrecision(3));
			arr[1] = center.y - Math.abs(radius*+Math.cos(angle*Math.PI/180).toPrecision(3));
		}
		return arr;
	};

	/**
	 * Создаем массив пунктирных колец
	 */
	ngDiagrammCtrl.prototype.createCircles = function(config){
		for(let i=30; i<config.width; i+=30){
			this.circles.push({
				center: {
					x: config.width/2,
					y: config.height/2
				},
				radius: i
			});
		}
	};

	/**
	 * Функция анимации
	 */
	ngDiagrammCtrl.prototype.pathAnimation = function(){

	}

	/**
	 * Коллбек клика
	 */
	ngDiagrammCtrl.prototype.pathClick = function(e, item){
		e.preventDefault();
		console.log('---=== item ===---', item);
	}
})();