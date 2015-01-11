define(function (require, exports, module) {

var canvas = require('init'),
    util = require('util'),
    gui = new dat.GUI();;

canvas.ready();

var param = {
	'应用离散傅立叶变换': function () {
		canvas.dft();
	}
};

gui.add(param, '应用离散傅立叶变换');

});