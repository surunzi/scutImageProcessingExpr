define(function (require, exports, module) {

var util = {};

util.rgbToYuv = function (r, g, b) {
    var y, u, v;
    y = 0.299 * r + 0.587 * g + 0.114 * b;
    u = 0.564 * (b - y);
    v = 0.713 * (r - y);
    return {
        y: y,
        u: u,
        v: v
    }
};

util.yuvToRgb = function (y, u, v) {
    var r, g, b;
    r = y + 1.042 * v;
    g = y - 0.344 * u - 0.714 * v;
    b = y + 1.772 * u;
    return {
        r: r,
        g: g,
        b: b
    }
};

// 将图像一维数组转换为二维数组
util.arrToMap = function (arr, width) {
    var newArr = [],
        tempArr = [];
    for (var i = 0, len = arr.length; i < len; i += 4) {
        tempArr.push({
            r: arr[i],
            g: arr[i+1],
            b: arr[i+2],
            a: arr[i+3]
        });
    }
    arr = tempArr;
    tempArr = [];
    var count = 0;
    for (var i = 0, len = arr.length; i < len; i++) {
        tempArr.push(arr[i]);
        count++;
        if (count === width) {
            count = 0;
            newArr.push(tempArr);
            tempArr = [];
        }
    }
    return newArr;
};

// 将二维数组转换为图像一维数组
util.mapToArr = function (arr) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        var tempArr = arr[i];
        for (var j = 0, len2 = tempArr.length; j < len2; j++) {
            var point = tempArr[j];
            newArr.push(point.r);
            newArr.push(point.g);
            newArr.push(point.b);
            newArr.push(point.a);
        }
    }
    return newArr;
};

// 对数组取中值
util.median = function (arr) {
    var s = arr.slice().sort(function(a,b){
        return a - b;
    });
    return s[Math.floor((s.length - 1) / 2)];
};

module.exports = util;

});