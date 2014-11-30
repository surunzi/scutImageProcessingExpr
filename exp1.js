define(function (require, exports, module) {

var canvas = require('init'),
    util = require('util'),
    gui = new dat.GUI();

canvas.ready();

var param = {
    'R': 0.5,
    'G': 0.5,
    'B': 0.5,
    '应用RGB变换': function () {
        canvas.processRgb(function (r, g, b) {
            return {
                r: r * param['R'],
                g: g * param['G'],
                b: b * param['B']
            }
        });
    },
    'Y通道': 0.5,
    '应用Y通道': function () {
        canvas.processYuv(function (y, u, v) {
            return {
                y: y * param['Y通道'],
                u: 0,
                v: 0
            }
        });
    },
    'a': 100,
    'b': 150,
    'c': 0,
    'd': 255,
    '应用线性变换': function () {
        canvas.processRgb(function (r, g, b) {
            var yuv = util.rgbToYuv(r, g, b),
                y = yuv.y,
                grey = 0;
            var a = param['a'],
                b = param['b'],
                c = param['c'],
                d = param['d'];
            if (y > b) {
                grey = d;
            } else if (y >= a && a <= b) {
                grey = (d - c) / (b - a) * (y - a) + c;
            } else {
                grey = c;
            }
            return {
                r: grey,
                g: grey,
                b: grey
            };
        });
    }
};

gui.add(param, 'R', 0.1, 1).step(0.1);
gui.add(param, 'G', 0.1, 1).step(0.1);
gui.add(param, 'B', 0.1, 1).step(0.1);
gui.add(param, '应用RGB变换');
gui.add(param, 'Y通道', 0.1, 1).step(0.1);
gui.add(param, '应用Y通道');
gui.add(param, 'a', 1, 100).step(1);
gui.add(param, 'b', 101, 200).step(1);
gui.add(param, 'c', 1, 255).step(1);
gui.add(param, 'd', 1, 255).step(1);
gui.add(param, '应用线性变换');

});