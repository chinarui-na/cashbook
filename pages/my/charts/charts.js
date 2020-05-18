import F2 from '../../../static/f2-canvas/lib/f2';
const app = getApp()
var store = require('../../../utils/store.js');
let chart = null;



Page({
	data: {
		date: '',
	},
	bindDateChange: function(e) {
		this.getMoneyData(e.detail.value)
		this.setData({
			date: e.detail.value
		})
	},
	onLoad() {
		var timestamp = Date.parse(new Date());
		var date = new Date(timestamp);
		var Y = date.getFullYear();
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
		this.getMoneyData(Y + '-' + M)
		this.setData({
			date: Y + '-' + M
		})
	},
	getMoneyData(date) {
		wx.getStorage({
			key: 'wxtoken',
			success: (res) => {
				var that = this
				var moneyRecord = []
				app.get(store.state.server + '/conf/rest/money/moneyList/' + res.data + '/' + date).then(res => {
					var arr = res.data.data.list
					var moneyRecord = [];
					var aviable = 0
					arr.forEach(function(oldData, i) {
						if (oldData.payOrIncome === 0) {
							var index = -1;
							var alreadyExists = moneyRecord.some(function(newData, j) {
								if (oldData.type === newData.type) {
									index = j;
									return true;
								}
							});
							if (!alreadyExists) {
								moneyRecord.push({
									type: oldData.type,
									cost: oldData.money,
									a: '1'
								});
							} else {
								moneyRecord[index].cost = that.accAdd(moneyRecord[index].cost, oldData.money);
							}
						}
					});
					console.log(moneyRecord)
					this.initChart(moneyRecord)
					this.initChartMountNode(arr)
				}).catch(err => {
					console.log(err)
				})
			}
		});
	},
	initChartMountNode(data) {
		var chart = new F2.Chart({
			el: canvas,
			width,
			height
		});
		chart.source(data, {
			release: {
				min: 1990,
				max: 2010
			}
		});
		chart.tooltip({
			showCrosshairs: true,
			showItemMarker: false,
			background: {
				radius: 2,
				fill: '#1890FF',
				padding: [3, 5]
			},
			nameStyle: {
				fill: '#fff'
			},
			onShow: function onShow(ev) {
				var items = ev.items;
				items[0].name = items[0].title;
			}
		});
		chart.line().position('release*count');
		chart.point().position('release*count').style({
			lineWidth: 1,
			stroke: '#fff'
		});

		chart.interaction('pan');
		// 定义进度条
		chart.scrollBar({
			mode: 'x',
			xStyle: {
				offsetY: -5
			}
		});

		// 绘制 tag
		chart.guide().tag({
			position: [1969, 1344],
			withPoint: false,
			content: '1,344',
			limitInPlot: true,
			offsetX: 5,
			direct: 'cr'
		});
		chart.render();
	},
	initChart(data) {
		var Util = F2.Util;
		var G = F2.G;
		var Group = G.Group;

		function drawLabel(shape, coord, canvas) {
			var center = coord.center;
			var origin = shape.get('origin');
			var points = origin.points;
			var x1 = (points[2].x - points[1].x) * 0.75 + points[1].x;
			var x2 = (points[2].x - points[1].x) * 1.8 + points[1].x;
			var y = (points[0].y + points[1].y) / 2;
			var point1 = coord.convertPoint({
				x: x1,
				y: y
			});
			var point2 = coord.convertPoint({
				x: x2,
				y: y
			});

			var group = new Group();
			group.addShape('Line', {
				attrs: {
					x1: point1.x,
					y1: point1.y,
					x2: point2.x,
					y2: point2.y,
					lineDash: [0, 2, 2],
					stroke: '#808080'
				}
			});
			var text = group.addShape('Text', {
				attrs: {
					x: point2.x,
					y: point2.y,
					text: origin._origin.type + '  ' + origin._origin.cost + ' 元',
					fill: '#808080',
					textAlign: 'start',
					textBaseline: 'bottom'
				}
			});
			var textWidth = text.getBBox().width;
			var baseLine = group.addShape('Line', {
				attrs: {
					x1: point2.x,
					y1: point2.y,
					x2: point2.x,
					y2: point2.y,
					stroke: '#808080'
				}
			});
			if (point2.x > center.x) {
				baseLine.attr('x2', point2.x + textWidth);
			} else if (point2.x < center.x) {
				text.attr('textAlign', 'end');
				baseLine.attr('x2', point2.x - textWidth);
			} else {
				text.attr('textAlign', 'center');
				text.attr('textBaseline', 'top');
			}
			canvas.add(group);
			shape.label = group;
		}
		var that = this;
		var sum = 0;
		// data = data.slice(0,6)
		data.map(function(obj) {
			sum += obj.cost;
		});
		that.chartComponent = that.selectComponent('#borkenLine');
		that.chartComponent.init((canvas, width, height) => {
			const chart = new F2.Chart({
				el: canvas,
				width,
				height,
				animate: false
			});
			chart.source(data);

			var lastClickedShape;
			chart.legend({
				position: 'bottom',
				offsetY: -5,
				marker: 'square',
				align: 'center',
				onClick: function onClick(ev) {
					var clickedItem = ev.clickedItem;
					var dataValue = clickedItem.get('dataValue');
					var canvas = chart.get('canvas');
					var coord = chart.get('coord');
					var geom = chart.get('geoms')[0];
					var container = geom.get('container');
					var shapes = geom.get('shapes'); // 只有带精细动画的 geom 才有 shapes 这个属性

					var clickedShape;
					// 找到被点击的 shape
					Util.each(shapes, function(shape) {
						var origin = shape.get('origin');
						if (origin && origin._origin.type === dataValue) {
							clickedShape = shape;
							return false;
						}
					});

					if (lastClickedShape) {
						lastClickedShape.animate().to({
							attrs: {
								lineWidth: 0
							},
							duration: 200
						}).onStart(function() {
							if (lastClickedShape.label) {
								lastClickedShape.label.hide();
							}
						}).onEnd(function() {
							lastClickedShape.set('selected', false);
						});
					}

					if (clickedShape.get('selected')) {
						clickedShape.animate().to({
							attrs: {
								lineWidth: 0
							},
							duration: 200
						}).onStart(function() {
							if (clickedShape.label) {
								clickedShape.label.hide();
							}
						}).onEnd(function() {
							clickedShape.set('selected', false);
						});
					} else {
						var color = clickedShape.attr('fill');
						clickedShape.animate().to({
							attrs: {
								lineWidth: 5
							},
							duration: 350,
							easing: 'bounceOut'
						}).onStart(function() {
							clickedShape.attr('stroke', color);
							clickedShape.set('zIndex', 1);
							container.sort();
						}).onEnd(function() {
							clickedShape.set('selected', true);
							clickedShape.set('zIndex', 0);
							container.sort();
							lastClickedShape = clickedShape;
							if (clickedShape.label) {
								clickedShape.label.show();
							} else {
								drawLabel(clickedShape, coord, canvas);
							}
							canvas.draw();
						});
					}
				}
			});
			chart.coord('polar', {
				transposed: true,
				innerRadius: 0.7,
				radius: 0.85
			});
			chart.axis(false);
			chart.tooltip(false);
			chart.interval().position('a*cost').color('type', [
				'#1890FF',
				'#13C2C2',
				'#2FC25B',
				'#FACC14',
				'#F04864',
				'#8543E0',
				'#8B2323',
				'#4B0082',
				'#FF00FF',
				'#707070',
				'#8B0000',
				'#8B1C62'
			]).adjust('stack');

			chart.guide().text({
				position: ['50%', '50%'],
				content: sum.toFixed(2),
				style: {
					fontSize: 24
				}
			});
			chart.render();
		});
	},
	accAdd(arg1, arg2) {
		var r1, r2, m, c;
		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		c = Math.abs(r1 - r2);
		m = Math.pow(10, Math.max(r1, r2));
		if (c > 0) {
			var cm = Math.pow(10, c);
			if (r1 > r2) {
				arg1 = Number(arg1.toString().replace(".", ""));
				arg2 = Number(arg2.toString().replace(".", "")) * cm;
			} else {
				arg1 = Number(arg1.toString().replace(".", "")) * cm;
				arg2 = Number(arg2.toString().replace(".", ""));
			}
		} else {
			arg1 = Number(arg1.toString().replace(".", ""));
			arg2 = Number(arg2.toString().replace(".", ""));
		}
		return (arg1 + arg2) / m;
	},
});
