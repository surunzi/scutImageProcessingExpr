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

// 将数据转换为灰度图
util.gray = function (data) {
    var r, g, b;
    for (var i = 0, len = data.length; i < len; i += 4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = r * 0.299 + g * 0.587 + b * 0.114;
    }
    return data;
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

// 傅立叶变换
util.dft = function (imgData, w, h) {
    var r, g, b, angleTerm, cos, sin, finalResult,
        doublePI = Math.PI * 2,
        c1 = doublePI / w,
        c2 = doublePI / h;
    // 先灰度化
    imgData = util.gray(imgData);
    var data = util.arrToMap(imgData, w);
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            r = 0;
            g = 0;
            b = 0;
            for (var i = 0; i < w; i++) {
                angleTerm = -x * i * c1;
                cos = Math.cos(angleTerm);
                sin = Math.sin(angleTerm);
                r += data[y][i]['r'] * Math.sqrt(cos * cos + sin * sin);
            }
            console.log(Math.sqrt(cos * cos + sin * sin));
            finalResult = r / w;
            data[y][x] = {
                r: finalResult,
                g: finalResult,
                b: finalResult,
                a: 255
            };
        }
    }
    /*for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            r = 0;
            g = 0;
            b = 0;
            for (var i = 0; i < h; i++) {
                angleTerm = -y * i * c2;
                cos = Math.cos(angleTerm);
                r += data[i][x]['r'] * cos;
            }
            data[y][x] = {
                r: r,
                g: g,
                b: b,
                a: 255
            }
        }
    }*/
    return util.mapToArr(data);
};

module.exports = util;

});