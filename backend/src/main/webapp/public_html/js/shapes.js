var DEBUG = false;

//<editor-fold defaultstate="collapsed" desc="shape canvas">
function ShapeCanvas(selector) {
    var canvas = document.querySelector(selector);
    var context = canvas.getContext('2d');

    function dimensions() {
        return {
            width: canvas.width,
            height: canvas.height,
            center: {
                x: canvas.width / 2,
                y: canvas.height / 2
            }
        };
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        return this;
    }

    function width(lw) {
        context.lineWidth = lw;
        return this;
    }

    function style(stroke, fill) {
        context.strokeStyle = stroke || 'black';
        context.fillStyle = fill || 'white';
        return this;
    }

    function move(point) {
        context.beginPath();
        context.moveTo(point.x, point.y);
        return this;
    }

    function line(startPoint, endPoint) {
        this.move(startPoint);
        context.lineTo(endPoint.x, endPoint.y);
        context.closePath();
        this.stroke();
        return this;
    }

    function stroke() {
        context.stroke();
        return this;
    }

    function fill() {
        context.fill();
        return this;
    }

    function rect(box) {
        context.beginPath();
        context.rect(box.x, box.y, box.w, box.h);
        context.closePath();
        this.fill();
        this.stroke();
        return this;
    }

    function circle(circle) {
        context.beginPath();
        context.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
        context.closePath();
        this.fill();
        this.stroke();
        return this;
    }

    function quad(startPoint, controlPoint, endPoint) {
        this.move(startPoint);
        context.quadraticCurveTo(controlPoint.x, controlPoint.y,
                endPoint.x, endPoint.y);
        this.stroke();
        return this;
    }

    function bezier(startPoint, control1Point, control2Point, endPoint) {
        this.move(startPoint);
        context.bezierCurveTo(control1Point.x, control1Point.y,
                control2Point.x, control2Point.y,
                endPoint.x, endPoint.y);
        this.stroke();
        return this;
    }

    return {
        dimensions: dimensions,
        clear: clear,
        width: width,
        style: style,
        move: move,
        line: line,
        stroke: stroke,
        fill: fill,
        rect: rect,
        circle: circle,
        quad: quad,
        bezier: bezier,
        context: function() {
            return context;
        }
    };
};
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="utils">
function extend(obj, newObj) {
    for (var i in newObj) {
        if (newObj.hasOwnProperty(i)) {
            obj[i] = newObj[i];
        }
    }

    return obj;
}
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="image">
function MyImage(shapeCanvas, opts) {
    var opts = extend({
        x: 0, y: 0,
        w: 10, h: 10,
        url: ''
    }, opts || {});

    this.shapeCanvas = shapeCanvas;
    this.w = opts.w;
    this.h = opts.h;
    this.url = opts.url;

    this.img = new Image();
    this.img.src = this.url;

    var that = this;
    this.img.onload = function () {
        that.ready = true;
    };
};

MyImage.prototype.setXY = function(xy) {
    this.x = xy.x;
    this.y = xy.y;
};

MyImage.prototype.paint = function() {
    if (this.ready) {
        this.shapeCanvas.context().drawImage(this.img,
                this.x - (this.w / 2), this.y - (this.h / 2),
                this.w, this.h);
    }
};
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="rectangle">
function Rectangle(shapeCanvas, opts) {
    var opts = extend({
        x: 0, y: 0,
        w: 10, h: 10,
        stroke: 'black',
        fill: 'white'
    }, opts || {});

    this.shapeCanvas = shapeCanvas;
    this.x = opts.x;
    this.y = opts.y;
    this.w = opts.w;
    this.h = opts.h;
    this.stroke = opts.stroke;
    this.fill = opts.fill;
}

Rectangle.prototype.paint = function() {
    this.shapeCanvas.style(this.stroke, this.fill).rect({
        x: this.x, y: this.y,
        w: this.w, h: this.h
    });
};
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="circle">
function Circle(shapeCanvas, opts) {
    var opts = extend({
        x: 0, y: 0, r: 10,
        stroke: 'black',
        fill: 'white'
    }, opts || {});

    this.shapeCanvas = shapeCanvas;
    this.x = opts.x;
    this.y = opts.y;
    this.r = opts.r;
    this.stroke = opts.stroke;
    this.fill = opts.fill;
}

Circle.prototype.paint = function() {
    this.shapeCanvas.style(this.stroke, this.fill).circle({
        x: this.x, y: this.y, r: this.r
    });
};
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="line">
function Line(shapeCanvas, opts) {
    var opts = extend({
        sX: 0, sY: 0,
        eX: 0, eY: 0,
        stroke: 'black'
    }, opts || {});

    this.shapeCanvas = shapeCanvas;
    this.sX = opts.sX;
    this.sY = opts.sY;
    this.eX = opts.eX;
    this.eY = opts.eY;
    this.stroke = opts.stroke;
};

Line.prototype.identifier = function() {
    if (arguments && arguments.length === 1) {
        this.ident = arguments[0];
        return this;
    } else if (this.ident) {
        return this.ident;
    } else {
        return '';
    }
};

// percent is 0 - 1
Line.prototype.pointAtPercent = function(percent) {
    var dx = this.eX - this.sX;
    var dy = this.eY - this.sY;

    var nX = this.sX + dx * percent;
    var nY = this.sY + dy * percent;

    return {
        x: nX,
        y: nY
    };
};

Line.prototype.image = function(myImage, start) {
    this.myImage = myImage;
    this.myImage.setXY({
        x: (start ? this.sX : this.eX),
        y: (start ? this.sY : this.eY)
    });

    return this;
};

Line.prototype.paint = function() {
    this.shapeCanvas.style(this.stroke).line({
        x: this.sX, y: this.sY
    }, {
        x: this.eX, y: this.eY
    });
};

Line.prototype.paintLast = function() {
    if (this.myImage) {
        this.myImage.paint();
    }
};
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="quad curve">
function QuadraticCurve(shapeCanvas, opts) {
    var opts = extend({
        sX: 0, sY: 0,
        cX: 0, cY: 0,
        eX: 0, eY: 0,
        stroke: 'black'
    }, opts || {});

    this.shapeCanvas = shapeCanvas;
    this.sX = opts.sX;
    this.sY = opts.sY;
    this.cX = opts.cX;
    this.cY = opts.cY;
    this.eX = opts.eX;
    this.eY = opts.eY;

    this.stroke = opts.stroke;
};

QuadraticCurve.prototype.identifier = function() {
    if (arguments && arguments.length === 1) {
        this.ident = arguments[0];
        return this;
    } else if (this.ident) {
        return this.ident;
    } else {
        return '';
    }
};

// percent is 0 - 1
QuadraticCurve.prototype.pointAtPercent = function(percent) {
    var x = Math.pow(1 - percent, 2) * this.sX + 2 * (1 - percent) * percent * this.cX + Math.pow(percent, 2) * this.eX;
    var y = Math.pow(1 - percent, 2) * this.sY + 2 * (1 - percent) * percent * this.cY + Math.pow(percent, 2) * this.eY;

    return {
        x: x,
        y: y
    };
};

QuadraticCurve.prototype.image = function(myImage, start) {
    this.myImage = myImage;
    this.myImage.setXY({
        x: (start ? this.sX : this.eX) - (myImage.w / 2),
        y: (start ? this.sY : this.eY) - (myImage.h / 2)
    });

    return this;
};

QuadraticCurve.prototype.paint = function() {
    this.shapeCanvas.style(this.stroke).quad({
        x: this.sX, y: this.sY
    }, {
        x: this.cX, y: this.cY
    }, {
        x: this.eX, y: this.eY
    });
};

QuadraticCurve.prototype.paintLast = function() {
    if (this.myImage) {
        this.myImage.paint();
    }
};
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="bezier curve">
function BezierCurve(shapeCanvas, opts) {
    var opts = extend({
        sX: 0, sY: 0,
        cX: 0, cY: 0,
        cX1: 0, cY1: 0,
        eX: 0, eY: 0,
        stroke: 'black'
    }, opts || {});

    this.shapeCanvas = shapeCanvas;
    this.sX = opts.sX;
    this.sY = opts.sY;
    this.cX = opts.cX;
    this.cY = opts.cY;
    this.cX1 = opts.cX1;
    this.cY1 = opts.cY1;
    this.eX = opts.eX;
    this.eY = opts.eY;

    this.stroke = opts.stroke;
};

BezierCurve.prototype.identifier = function() {
    if (arguments && arguments.length === 1) {
        this.ident = arguments[0];
        return this;
    } else if (this.ident) {
        return this.ident;
    } else {
        return '';
    }
};

// percent is 0 - 1
BezierCurve.prototype.pointAtPercent = function(percent) {
    // cubic helper formula at percent distance
    function cubicN(pct, a, b, c, d) {
        var t2 = pct * pct;
        var t3 = t2 * pct;

        return a + (-a * 3 + pct * (3 * a - a * pct))
                * pct + (3 * b + pct * (-6 * b + b * 3 * pct))
                * pct + (c * 3 - c * 3 * pct)
                * t2 + d * t3;
    }

    var x = cubicN(percent, this.sX, this.cX, this.cX1, this.eX);
    var y = cubicN(percent, this.sY, this.cY, this.cY1, this.eY);

    return {
        x: x,
        y: y
    };
};

BezierCurve.prototype.image = function(myImage, start) {
    this.myImage = myImage;
    this.myImage.setXY({
        x: (start ? this.sX : this.eX) - (myImage.w / 2),
        y: (start ? this.sY : this.eY) - (myImage.h / 2)
    });

    return this;
};

BezierCurve.prototype.paint = function() {
    this.shapeCanvas.style(this.stroke).bezier({
        x: this.sX, y: this.sY
    }, {
        x: this.cX, y: this.cY
    }, {
        x: this.cX1, y: this.cY1
    }, {
        x: this.eX, y: this.eY
    });
};

BezierCurve.prototype.paintLast = function() {
    if (this.myImage) {
        this.myImage.paint();
    }
};
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="pipeline builder">
function PipelineBuilder(shapeCanvas) {
    this.shapeCanvas = shapeCanvas;
    this.pipeline = [];
}

PipelineBuilder._log = function(str) {
    DEBUG && console.log('PipelineBuilder -> [' + str + ']');
};

PipelineBuilder.prototype.add = function(type, shapeObj) {
    var initial = this.pipeline.length === 0, obj = {}, prev;

    if (!initial) {
        prev = this.pipeline[this.pipeline.length - 1];
        // set shape start point to prev endpoint
        obj['sX'] = prev['eX'];
        obj['sY'] = prev['eY'];
    }

    this.pipeline.push(new window[type](this.shapeCanvas, shapeObj = extend(shapeObj, obj)));
    PipelineBuilder._log('added new ' + type + ' shape ' + JSON.stringify(shapeObj) + ' to pipeline');

    return this;
};

PipelineBuilder.prototype.line = function(x, y, color) {
    this.add('Line', {
        stroke: color,
        eX: x, eY: y
    });

    return this;
};

PipelineBuilder.prototype.quad = function(cx, cy, ex, ey, color) {
    this.add('QuadraticCurve', {
        stroke: color,
        cX: cx, cY: cy,
        eX: ex, eY: ey
    });

    return this;
};

PipelineBuilder.prototype.bezier = function(cx, cy, cx1, cy1, ex, ey, color) {
    this.add('BezierCurve', {
        stroke: color,
        cX: cx, cY: cy,
        cX1: cx1, cY1: cy1,
        eX: ex, eY: ey
    });

    return this;
};

/**
 * paints an image at the last section
 * @param {type} url
 * @param {type} w
 * @param {type} h
 * @param {type} atStart
 * @returns {PipelineBuilder.prototype}
 */
PipelineBuilder.prototype.image = function(url, w, h, atStart) {
    var image = new MyImage(this.shapeCanvas, {
        url: url,
        w: w, h: h
    });

    var lastPipe = this.pipeline[this.pipeline.length - 1];
    lastPipe.image(image, atStart);

    return this;
};

/**
 * gives a unique identifier to the last section
 * @returns {PipelineBuilder.prototype}
 */
PipelineBuilder.prototype.id = function() {
    var lastPipe = this.pipeline[this.pipeline.length - 1];
    lastPipe.identifier.apply(lastPipe, arguments);

    return this;
};
//</editor-fold>