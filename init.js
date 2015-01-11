define(function (require, exports, module) {

var util = require('util');

var sample = window.sample || 'sample.jpg';

var $canvas = $('#canvas'),
    canvas = $canvas[0],
    ctx = canvas.getContext('2d');

var $targetCanvas = $('#target-canvas'),
    targetCanvas = $targetCanvas[0],
    targetCtx = targetCanvas.getContext('2d');

// 绑定打开图片方法
var $input = $('#input'),
    input = $input[0],
    reader = new FileReader(),
    defaultProcessor = null; // 默认处理函数

reader.onload = function(e) {
    var data = e.target.result;
    loadImage(data);
};

$canvas.on('click', function () {
    $input.click();
});

$input.on('change', function () {
    reader.readAsDataURL(input.files[0]);
});

// 获取数据
function getData() {
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// 获取高度
function getImageHeight() {
    return canvas.height;
}

// 获取宽度
function getImageWidth() {
    return canvas.width;
}

// 拉普拉斯算子
function laplacian() {
    var imgData = getData(),
        data = imgData.data,
        newData = [];
    var a, b, c, d; // 上、下、左、右四个分量
    data = util.arrToMap(data, canvas.width);
    for (var y = 0, len = data.length; y < len; y++) {
        for (var x = 0, len2 = data[y].length; x < len2; x++) {
            a = b = c = d = p = data[y][x];
            if (y > 0) {
                a = data[y-1][x];
            } else if (y !== len - 1) {
                b = data[y+1][x];
            }
            if (x > 0) {
                c = data[y][x-1];
            } else if (x !== len2 - 1) {
                d = data[y][x+1];
            }
            newData.push(p.r - (a.r + b.r + c.r + d.r - 4 * p.r));
            newData.push(p.g - (a.g + b.g + c.g + d.g - 4 * p.g));
            newData.push(p.b - (a.b + b.b + c.b + d.b - 4 * p.b));
            newData.push(255);
        }
    }
    imgData.data.set(newData);
    setData(imgData);
}

// 加载图片
function loadImage(src, cb) {
    cb = cb || defaultProcessor;
    if (!cb) {
        cb = function () {
            this.processRgb(function (r, g, b) {
                return {
                    r: r,
                    g: g,
                    b: b
                };
            });
        }
    }
    var image = new Image();
    image.src = src;
    image.onload = function () {
        targetCanvas.width = canvas.width = image.width;
        targetCanvas.height = canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        cb.apply(exports);
    }
}

// 中值滤波器
function medianFilter(n) {
    var imgData = getData(),
        data = imgData.data,
        newData = [];
    data = util.arrToMap(data, canvas.width);
    for (var y = 0, len = data.length; y < len; y++) {
        for (var x = 0, len2 = data[y].length; x < len2; x++) {
            // 获取点(x,y)周围以n为半径的数据
            var points = {
                r: [],
                g: [],
                b: []
            };
            for (var i = y - n; i < y + n + 1; i++) {
                for (var j = x - n; j < x + n + 1; j++) {
                    var p = data[y][x];
                    // 处理越界情况
                    if (i > 0 && i < len && j > 0 && j < len2) {
                        p = data[i][j];
                    }
                    points.r.push(p.r);
                    points.g.push(p.g);
                    points.b.push(p.b);
                }
            }
            newData.push(util.median(points.r));
            newData.push(util.median(points.g));
            newData.push(util.median(points.b));
            newData.push(255);
        }
    }
    imgData.data.set(newData);
    setData(imgData);
}

// 均值滤波器
function meanFilter(n) {
    var imgData = getData(),
        data = imgData.data,
        newData = [],
        num = Math.pow(2 * n + 1, 2);
    data = util.arrToMap(data, canvas.width);
    for (var y = 0, len = data.length; y < len; y++) {
        for (var x = 0, len2 = data[y].length; x < len2; x++) {
            // 获取点(x,y)周围以n为半径的数据
            var total = {
                r: 0, 
                g: 0, 
                b: 0
            };
            for (var i = y - n; i < y + n + 1; i++) {
                for (var j = x - n; j < x + n + 1; j++) {
                    var p = data[y][x];
                    // 处理越界情况
                    if (i > 0 && i < len && j > 0 && j < len2) {
                        p = data[i][j];
                    }
                    total.r += p.r;
                    total.g += p.g;
                    total.b += p.b;
                }
            }
            newData.push(total.r / num);
            newData.push(total.g / num);
            newData.push(total.b / num);
            newData.push(255);
        }
    }
    imgData.data.set(newData);
    setData(imgData);
}

// 傅立叶变换
function dft() {
    var imgData = getData(),
        data = imgData.data;

    var newData = util.dft(data, canvas.width, canvas.height);

    imgData.data.set(newData);
    setData(imgData);
}

/* 对cb传递r,g,b
 * 将处理后的结果写回canvas中去
 */
function process(cb, type) {
    var r, g, b, a, result,
        imgData = getData(),
        data = imgData.data;
    for (var i = 0, len = data.length; i < len; i += 4) {
        r = data[i];
        g = data[i+1];
        b = data[i+2];
        if (type === 'yuv') {
            var yuv = util.rgbToYuv(r, g, b);
            result = cb(yuv.y, yuv.u, yuv.v);
            result = util.yuvToRgb(result.y, result.u, result.v);
        } else {
            result = cb(r, g, b);
        }
        data[i] = result.r;
        data[i+1] = result.g;
        data[i+2] = result.b;
    }
    setData(imgData);
}

function processRgb(cb) {
    process(cb, 'rgb');
}

function processYuv(cb) {
    process(cb, 'yuv');
}

// 图片载入
function ready(cb) {
    loadImage(sample, cb);
}

// 设置数据
function setData(data) {
    targetCtx.putImageData(data, 0, 0);
}

// 设置默认处理函数
function setDefaultProcessor(cb) {
    defaultProcessor = cb;
    return exports;
}

var exports = {
    laplacian: laplacian,
    medianFilter: medianFilter,
    meanFilter: meanFilter,
    processRgb: processRgb,
    processYuv: processYuv,
    dft: dft,
    ready: ready,
    setDefaultProcessor: setDefaultProcessor
};

// 输出方法
module.exports = exports; 

});