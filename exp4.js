define(function (require, exports, module) {

var canvas = require('init'),
    util = require('util'),
    gui = new dat.GUI();

canvas.ready();

var param = {
    '应用拉普拉斯算子': function () {
        canvas.laplacian();
    }
};

gui.add(param, '应用拉普拉斯算子');

});