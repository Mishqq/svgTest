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
				styles: '=?',
				width: '@?',
				height: '@?',
				radius: '@?',
				stepRadius: '@?',
				pathClickCb: '=?',
				ctx: '=?',
				name: '@?'
			}
		};
	});

	function ngDiagrammCtrl($scope, ngDgPresetsFactory){
		this.$scope = $scope;
		if(!this.pathClick) this.pathClick = ()=>{console.log('Коллбек по клику не задан')};
		/**
		 * Дефолтные настройки для директивки
		 */
		this.prs = ngDgPresetsFactory;

		this.init();

		setTimeout(()=>{
			this.paramWatcher();
		}, 1500);
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
			width: +this.width || this.prs.svgWidth,
			height: +this.height || this.prs.svgHeight,
			radius: +this.radius || this.prs.radius,
			sRadius: +this.stepRadius || this.prs.sRadius,
			center: {x: (+this.width || this.prs.svgWidth)/2, y: (+this.height || this.prs.svgHeight)/2}
		};

		this.$scope.$watch(()=>{return this.data}, (data)=>{
			if(data){
				//TODO: Написать проверку на сумму процентов

				if(this.pathes && this.pathes.length) this.pathes.length = 0;

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
					let priority = 0;
					for(let j=0; j<arr.length; j+=1){
						if( arr[i].value < arr[j].value) priority+=1;
					}
					anglesArr.push({a1: c*3.6, a2: (c+arr[i].value)*3.6, text:arr[i].text, value: arr[i].value, sRadius: priority}); // Переводим градусы в градиенты
					c += arr[i].value;
				}

				for(let i=0; i<anglesArr.length; i+=1){
					let coords = {x1: '', y1: '', x2: '', y2: ''};

					let arr = this.calculateAbsCoord(anglesArr[i].a1, config.center, config.radius-anglesArr[i].sRadius*config.sRadius);
					coords.x1 = arr[0];
					coords.y1 = arr[1];

					arr = this.calculateAbsCoord(anglesArr[i].a2, config.center, config.radius-anglesArr[i].sRadius*config.sRadius);
					coords.x2 = arr[0];
					coords.y2 = arr[1];

					for(let key in coords){
						coords[key] = Math.round(coords[key]);
					}

					/**
					 * Свойство, которое кормим на вьюху для отрисовки сектора
					 */
					let textCrd = this.calculateAbsCoord( (anglesArr[i].a1+anglesArr[i].a2)/2, config.center, (config.radius-i*config.sRadius)/2);

					let template = {
						id: 'g_' + (i+1),
						color: this.prs.pathColors[anglesArr[i].sRadius],
						value: anglesArr[i].value,
						text: anglesArr[i].text,
						radius: config.radius-anglesArr[i].sRadius*config.sRadius,
						showTooltip: false,
						angle: {
							start: anglesArr[i].a1,
							end: anglesArr[i].a2
						},
						startPos: {
							x: coords.x1,
							y: coords.y1
						},
						endPos: {
							x: coords.x2,
							y: coords.y2
						},
						textPosition: {
							x: textCrd[0],
							y: textCrd[1]
						}
					};

					this.pathes.push(template);

					this.pathAnimation(this.pathes[i], config);
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
	 * Создаем массив пунктирных колец
	 */
	ngDiagrammCtrl.prototype.createCircles = function(config){
		for(let i=config.sRadius; i<config.width; i+=config.sRadius){
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
	ngDiagrammCtrl.prototype.pathAnimation = function(path, config){
		let _self = this;
		let currentAngle = path.angle.start;
		let timeStep = this.prs.animateTime / ((path.angle.end - path.angle.start) / this.prs.animateStep);

		setTimeout(()=>{
			path.showTooltip = (path.angle.end - path.angle.start) > 15;
			//_self.$scope.$digest();
		}, 500);

		var timeout = setTimeout(function f(){
			if(currentAngle >= path.angle.end){
				clearTimeout(timeout);
				return false;
			}

			/**
			 * Смещаем сектор на заданый шаг и проверяем, чтобы угол не превышал значение угла правого края сектора
			 */
			currentAngle +=_self.prs.animateStep;
			if(currentAngle > path.angle.end) currentAngle = path.angle.end;

			/**
			 * Смотрим, какую часть дуги отрисовывать. Если дуга меньше 180 градусов - ставим флаг на отрисовку меньшей стороны
			 */
			path.flag = (currentAngle-path.angle.start <= 180) ? 0 : 1;

			/**
			 * Текущая координата смещения дуги
			 */
			let currentCoords = _self.calculateAbsCoord(currentAngle, config.center, path.radius);
			path.settings = 'M '+config.center.x+','+config.center.y+' L ' +
					''+path.startPos.x+','+path.startPos.y+' A' +
					''+path.radius+','+path.radius+' 0 ' +
					''+path.flag+', 1 '+currentCoords[0]+','+currentCoords[1]+'';

			/**
			 * Рекурсим таймаут
			 */
			timeout = setTimeout(f, timeStep);

			/**
			 * Обновляем вьюху
			 */
			_self.$scope.$digest();
		}, timeStep);
	};

	/**
	 * Коллбек клика
	 */
	ngDiagrammCtrl.prototype.pathClick = function(e, item){
		e.preventDefault();
		this.pathClickCb.call(this.ctx, item);
	};

	ngDiagrammCtrl.prototype.paramWatcher = function(){
		let defend = false;
		let defTime = 1000;

		this.$scope.$watch(()=>{return this.width}, (width)=>{
			defend = false;
			setTimeout(()=>{defend = true; this.$scope.$digest();}, defTime);
		});

		this.$scope.$watch(()=>{return this.height}, (height)=>{
			defend = false;
			setTimeout(()=>{defend = true; this.$scope.$digest();}, defTime);
		});

		this.$scope.$watch(()=>{return this.radius}, (radius)=>{
			defend = false;
			setTimeout(()=>{defend = true; this.$scope.$digest();}, defTime);
		});

		this.$scope.$watch(()=>{return this.stepRadius}, (stepRadius)=>{
			defend = false;
			setTimeout(()=>{defend = true; this.$scope.$digest();}, defTime);
		});

		this.$scope.$watch(()=>{return defend}, (def)=>{
			if(def) this.init();
		});
	};
})();