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

		this.$scope.$watch(()=>{return this.data}, (data)=>{
			if(data){
				this.createCircles();

				let arr = [], anglesArr = [];

				for(var key in data[0].data){
					arr.push(data[0].data[key].value);
				}

				/**
				 * Создаем сектора. Проценты переводим в радианы
				 * a1 - начало сектора, а2 = конец сектора
				 */
				for(let c=0, i=0; i<arr.length; i+=1){
					anglesArr.push({a1: c*3.6, a2: (c+arr[i])*3.6}); // Переводим градусы в градиенты
					c += arr[i];
				}

				/**
				 * Координаты центра диаграммы
				 */
				let center = {x: this.prs.svgWidth/2, y: this.prs.svgHeight/2};

				for(let i=0; i<anglesArr.length; i+=1){
					let coords = {x1: '', y1: '', x2: '', y2: ''};

					let arr = this.calculateAbsCoord(anglesArr[i].a1, center);
					coords.x1 = arr[0];
					coords.y1 = arr[1];

					arr = this.calculateAbsCoord(anglesArr[i].a2, center);
					coords.x2 = arr[0];
					coords.y2 = arr[1];

					for(let key in coords){
						coords[key] = Math.round(coords[key]);
					}

					/**
					 * Смотрим, какую часть дуги отрисовывать. Если дуга меньше 180 градусов - ставим флаг на отрисовку меньшей стороны
					 */
					let largeArcFlag = (anglesArr[i].a2 - anglesArr[i].a1 > 180) ? 1 : 0;

					/**
					 * Свойство, которое кормим на вьюху для отрисовки сектора
					 */
					let params = 'M '+center.x+','+center.y+' L '+coords.x1+','+coords.y1+' A'+this.prs.radius+','+this.prs.radius+' 0 '+largeArcFlag+', 1 '+coords.x2+','+coords.y2+'';

					this.pathes.push({
						id: 'g_' + (i+1),
						settings: params,
						color: this.prs.pathColors[i],
						textPosition: {
							x: '',
							y: ''
						}
					});

					/**
					 * Для каждого следующего сектора режем радиус
					 */
					this.prs.radius = this.prs.radius-20;
				}

				this.showSvg = true;
			}
		});
	};

	/**
	 * Функция возвращает массив из двух чисел (координаты x и у)
	 * Координаты рассчитываются для определённого угла относительно центра диаграммы.
	 * Учитываем радиус
	 */
	ngDiagrammCtrl.prototype.calculateAbsCoord = function(angle, center){
		let arr = [];
		if(angle >= 0 && angle < 90){
			arr[0] = center.x + Math.abs(this.prs.radius*+Math.sin(angle*Math.PI/180).toPrecision(3));
			arr[1] = center.y - Math.abs(this.prs.radius*+Math.cos(angle*Math.PI/180).toPrecision(3));
		} else if(angle >= 90 && angle < 180){
			arr[0] = center.x + Math.abs(this.prs.radius*+Math.sin(angle*Math.PI/180).toPrecision(3));
			arr[1] = center.y + Math.abs(this.prs.radius*+Math.cos(angle*Math.PI/180).toPrecision(3));
		} else if(angle >= 180 && angle < 270){
			arr[0] = center.x - Math.abs(this.prs.radius*+Math.sin(angle*Math.PI/180).toPrecision(3));
			arr[1] = center.y + Math.abs(this.prs.radius*+Math.cos(angle*Math.PI/180).toPrecision(3));
		} else if(angle >= 270 && angle <= 360){
			arr[0] = center.x - Math.abs(this.prs.radius*+Math.sin(angle*Math.PI/180).toPrecision(3));
			arr[1] = center.y - Math.abs(this.prs.radius*+Math.cos(angle*Math.PI/180).toPrecision(3));
		}
		return arr;
	};

	/**
	 * Создаем массив пунктирных колец
	 */
	ngDiagrammCtrl.prototype.createCircles = function(){
		for(let i=30; i<this.prs.svgWidth; i+=30){
			this.circles.push({
				center: {
					x: this.prs.svgWidth/2,
					y: this.prs.svgHeight/2
				},
				radius: i
			});
		}
	};

	/**
	 * Коллбек клика
	 */
	ngDiagrammCtrl.prototype.pathClick = function(e, item){
		e.preventDefault();
		console.log('---=== item ===---', item);
	}
})();