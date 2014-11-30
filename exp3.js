define(function (require, exports, module) {

var canvas = require('init'),
    util = require('util'),
    gui = new dat.GUI();

canvas.ready();

var param = {
    'N': 1,
    '应用均值滤波器': function () {
        canvas.meanFilter(param['N']);
    },
    'N2': 1,
    '应用中值滤波器': function () {
        canvas.medianFilter(param['N2']);
    }
};

gui.add(param, 'N', 1, 4).step(1);
gui.add(param, '应用均值滤波器');
gui.add(param, 'N2', 1, 4).step(1);
gui.add(param, '应用中值滤波器');

});