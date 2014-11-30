define(function (require, exports, module) {

var canvas = require('init'),
    util = require('util'),
    gui = new dat.GUI();

canvas.ready();

var param = {
    '应用反转变换': function () {
        canvas.processRgb(function (r, g, b) {
            return {
                r: 255 - r,
                g: 255 - g,
                b: 255 - b
            };
        });
    },
    'c': 50,
    '应用对数变换': function () {
        canvas.processRgb(function (r, g, b) {
            var c = param['c'];
            return {
                r: c * Math.log(1 + r),
                g: c * Math.log(1 + g),
                b: c * Math.log(1 + b)
            };
        });
    },
    'c2': 0.5,
    'y': 0.5,
    '应用幂律变换': function () {
        canvas.processRgb(function (r, g, b) {
            var c = param['c2'],
                y = param['y'];
            return {
                r: c * Math.pow(r, y),
                g: c * Math.pow(g, y),
                b: c * Math.pow(b, y)
            };
        });
    },
    'c3': 150,
    'y2': 0.6,
    '应用伽马较正': function () {
        canvas.processRgb(function (r, g, b) {
            var c = param['c3'],
                y = param['y2'];
            return {
                r: Math.pow(r / c, 1 / y) * c,
                g: Math.pow(g / c, 1 / y) * c,
                b: Math.pow(b / c, 1 / y) * c
            };
        });
    }
};

gui.add(param, '应用反转变换');
gui.add(param, 'c', 1, 100).step(1);
gui.add(param, '应用对数变换');
gui.add(param, 'c2', 0.1, 1).step(0.1);
gui.add(param, 'y', 0.1, 1).step(0.1);
gui.add(param, '应用幂律变换');
gui.add(param, 'c3', 1, 255).step(1);
gui.add(param, 'y2', 0.4, 0.8).step(0.2);
gui.add(param, '应用伽马较正');

});