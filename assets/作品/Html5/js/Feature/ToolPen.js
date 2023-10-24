
//畫筆
var colorPen = {
    PenStage: null,
    HighlightColor: 'rgb(255, 240, 0)', //畫筆顏色
    HighlightWidth: 4, //畫筆寬度
    HighlightOpacity: 1, //畫筆透明度
    Color: 'rgb(254,1,0)', //畫筆顏色
    Width: 4, //畫筆寬度
    Opacity: 1, //畫筆透明度
    BrushType: 'arbitrarily',
    selectedType: 'arbitrarily',
    IsSelectType: false,
    Drag: false,
    DragMove: false,
    Down: {
        X: 0,
        Y: 0
    }, //滑鼠點擊的座標
    Move: {
        X: 0,
        Y: 0
    }, //滑鼠移動的座標
    Line: {
        X: [],
        Y: []
    }, //存入畫線的所有座標
    LineList: [], //保存所有畫完的線的資訊(id、大小位置、所在頁數、所有座標)
    size: {
        width: 0,
        height: 0
    },
    ScaleOff: {
        X: null,
        Y: null
    },
    CustomizeMain: {
        defaultModel: false
    }
};

function StartPen(event, canvas) {

    colorPen.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    colorPen.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    colorPen.Drag = true;

    var cxt = canvas.getContext('2d');
    if (colorPen.BrushType == 'arbitrarily') {
        cxt.beginPath();
        cxt.moveTo(colorPen.Down.X, colorPen.Down.Y);
        if (MainObj.IsTwoPage) {
            if(ToolBarList.ZoomScale == 1) {
                var x = (Number(colorPen.Down.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale;
                var y = (Number(colorPen.Down.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale;
            } else {
                var x = (Number(colorPen.Down.X) - $('#CanvasRight').offset().left) / MainObj.Scale / ToolBarList.ZoomScale;
                var y = (Number(colorPen.Down.Y) - $('#CanvasRight').offset().top) / MainObj.Scale / ToolBarList.ZoomScale;
            }
        } else {
            var x = (Number(colorPen.Down.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale;
            var y = (Number(colorPen.Down.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale;
        }

        colorPen.Line.X.push(x);
        colorPen.Line.Y.push(y);
    }

}

function canvasPadMove(event, canvas) {

    colorPen.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    colorPen.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    colorPen.size.width = colorPen.Move.X - colorPen.Down.X;
    colorPen.size.height = colorPen.Move.Y - colorPen.Down.Y;

    var cxt = canvas.getContext('2d');

    if (colorPen.Drag) {
        if (colorPen.BrushType == 'arbitrarily') {
            cxt.lineTo(colorPen.Move.X, colorPen.Move.Y);
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            cxt.stroke();
            if (MainObj.IsTwoPage) {
                if(ToolBarList.ZoomScale == 1) {
                    var x = (Number(colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale;
                    var y = (Number(colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale;
                } else {
                    var x = (Number(colorPen.Move.X) - $('#CanvasRight').offset().left) / MainObj.Scale / ToolBarList.ZoomScale;
                    var y = (Number(colorPen.Move.Y) - $('#CanvasRight').offset().top) / MainObj.Scale / ToolBarList.ZoomScale;
                }
            } else {
                var x = (Number(colorPen.Move.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale;
                var y = (Number(colorPen.Move.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale;
            }

            colorPen.Line.X.push(x);
            colorPen.Line.Y.push(y);
        } else if (colorPen.BrushType == 'line') {
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            cxt.beginPath();
            cxt.moveTo(colorPen.Down.X, colorPen.Down.Y);
            cxt.lineTo(colorPen.Move.X, colorPen.Move.Y);
            cxt.stroke();
            colorPen.DragMove = true;
        } else if (colorPen.BrushType == 'highlighter') {
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            cxt.beginPath();
            cxt.moveTo(colorPen.Down.X, colorPen.Down.Y);
            cxt.lineTo(colorPen.Move.X, colorPen.Move.Y);
            cxt.stroke();
            colorPen.DragMove = true;
        } else if (colorPen.BrushType == 'rect') {
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            cxt.strokeRect(colorPen.Down.X, colorPen.Down.Y, colorPen.size.width, colorPen.size.height);
            cxt.stroke();
            colorPen.DragMove = true;
        } else {
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            BezierEllipse(cxt, colorPen.Down.X, colorPen.Down.Y, colorPen.size.width / 2, colorPen.size.height / 2);
            colorPen.DragMove = true;
        }
    }
}

//canvasPad為畫板
//newCanvas為畫完後呈現的結果
function canvasPadUp(canvas, pencolor, penwidth, penopacity) {
    colorPen.Drag = false;
    var canvasList = {};
    var id = newguid();
    canvasList.points = [];
    if (colorPen.BrushType == 'arbitrarily') {
        for (var i = 0; i < colorPen.Line.X.length; i++) {

            canvasList.points.push({
                X: colorPen.Line.X[i],
                Y: colorPen.Line.Y[i]
            });
        }

        //將線的座標由小至大排序，才能知道canvas的大小
        var ListX = colorPen.Line.X.sort(function (a, b) {
            return a - b;
        });
        ListX = ListX.filter(function (x) {
            if (x) {
                return x;
            }
        })
        var minX = ListX[0];
        var maxX = ListX[ListX.length - 1];

        var ListY = colorPen.Line.Y.sort(function (a, b) {
            return a - b;
        });
        ListY = ListY.filter(function (x) {
            if (x) {
                return x;
            }
        })
        var minY = ListY[0];
        var maxY = ListY[ListY.length - 1];

        NewCanvas();
        var newCanvas = $('#canvas')[0];
        newCanvas.id = id;

        $(newCanvas).addClass('pen');

        var width = maxX - minX + colorPen.Width * 2;
        var height = maxY - minY + colorPen.Width * 2;
        var left = minX - colorPen.Width;
        var top = minY - colorPen.Width;

        if (!width && !height) {
            $(newCanvas).remove();
            return;
        }

        newCanvas.width = $(window).width();
        newCanvas.height = $(window).height();

        var newCxt = newCanvas.getContext('2d');
        newCxt.drawImage(canvas, 0, 0);

        $(newCanvas)
            .css({
                'left': 0,
                'top': 0,
                'pointer-events': 'none'
            })
            .attr({
                'tempScale': ToolBarList.ZoomScale
            });

        GalleryStartMove();
    } else if (colorPen.BrushType == 'line') {
        if (colorPen.DragMove) {
            // 直線
            var newCxt = newSharpSet(id, "Pen", penwidth, penopacity);
            newCxt.clearRect(0, 0, canvas.width, canvas.height);
            newCxt.beginPath();
            newCxt.moveTo(colorPen.Down.X, colorPen.Down.Y);
            newCxt.lineTo(colorPen.Move.X, colorPen.Move.Y);
            newCxt.stroke();
            if (MainObj.IsTwoPage) {
                canvasList.points.push({
                    X: (Number(colorPen.Down.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Down.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale
                }, {
                    X: (Number(colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale
                });
            } else {
                canvasList.points.push({
                    X: (Number(colorPen.Down.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Down.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale
                }, {
                    X: (Number(colorPen.Move.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Move.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale
                });
            }

            colorPen.DragMove = false;
        }
    } else if (colorPen.BrushType == 'highlighter') {
        if (colorPen.DragMove) {
            // 螢光筆
            var newCxt = newSharpSet(id, "Highlight", penwidth, penopacity);
            newCxt.clearRect(0, 0, canvas.width, canvas.height);
            newCxt.beginPath();
            newCxt.moveTo(colorPen.Down.X, colorPen.Down.Y);
            newCxt.lineTo(colorPen.Move.X, colorPen.Move.Y);
            newCxt.stroke();

            if (MainObj.IsTwoPage) {
                canvasList.points.push({
                    X: (Number(colorPen.Down.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Down.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale
                }, {
                    X: (Number(colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale
                });
            } else {
                canvasList.points.push({
                    X: (Number(colorPen.Down.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Down.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale
                }, {
                    X: (Number(colorPen.Move.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Move.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale
                });
            }

            colorPen.DragMove = false;
        }
    } else if (colorPen.BrushType == 'rect') {
        if (colorPen.DragMove) {
            // 矩形
            var newCxt = newSharpSet(id, "Pen", penwidth, penopacity);
            newCxt.strokeRect(colorPen.Down.X, colorPen.Down.Y, colorPen.size.width, colorPen.size.height);
            newCxt.stroke();
            if (MainObj.IsTwoPage) {
                canvasList.points.push({
                    X: (Number(colorPen.Down.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Down.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale
                }, {
                    X: (Number(colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale
                });
            } else {
                canvasList.points.push({
                    X: (Number(colorPen.Down.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Down.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale
                }, {
                    X: (Number(colorPen.Move.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Move.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale
                });
            }

            var width = colorPen.size.width / MainObj.Scale;
            var height = colorPen.size.height / MainObj.Scale;
            colorPen.DragMove = false;
        }
    } else {
        if (colorPen.DragMove) {
            // 圓形
            var newCxt = newSharpSet(id, "Pen", penwidth, penopacity);

            BezierEllipse(newCxt, colorPen.Down.X, colorPen.Down.Y, colorPen.size.width / 2, colorPen.size.height / 2);

            if (MainObj.IsTwoPage) {
                canvasList.points.push({
                    X: (Number(colorPen.Down.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Down.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale
                }, {
                    X: (Number(colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale
                });
            } else {
                canvasList.points.push({
                    X: (Number(colorPen.Down.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Down.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale
                }, {
                    X: (Number(colorPen.Move.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale,
                    Y: (Number(colorPen.Move.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale
                });
            }

            var width = colorPen.size.width / MainObj.Scale;
            var height = colorPen.size.height / MainObj.Scale;
            colorPen.DragMove = false;
        }

    }

    canvasList = {
        id: id,
        type: 'pen',
        BrushType: colorPen.BrushType,
        object: {
            width: width,
            height: height,
            left: left,
            top: top,
            penwidth: penwidth == undefined ? colorPen.Width : penwidth,
            color: pencolor == undefined ? colorPen.Color : pencolor,
            opacity: Number(penopacity == undefined ? colorPen.Opacity : penopacity)
        },
        page: MainObj.NowPage,
        points: canvasList.points,
        isZoom: ToolBarList.ZoomScale,
        isEraser: false,
        isGroup: null,
        isEraserSelect: false,
        isEraserSelectPen: false
    };

    if (canvasList.points.length) {
        colorPen.LineList.push(canvasList);
        MainObj.saveList.push(canvasList);
        recovery();
        if (MainObj.saveList.length > 5) {
            MainObj.saveList.splice(0, 1);
        }
    }

    colorPen.Line = {
        X: [],
        Y: []
    };

    var tempCxt = canvas.getContext('2d');
    tempCxt.clearRect(0, 0, canvas.width, canvas.height);
}

// 畫形狀的canvas
function newSharpSet(id, objtype, SetWidth, SetOpacity) {
    NewCanvas();
    var newCanvas = $('#canvas')[0];
    newCanvas.id = id || newguid();
    newCanvas.width = $(window).width();
    newCanvas.height = $(window).height();
    $(newCanvas).addClass('pen');
    $(newCanvas).css({
        'pointer-events': 'none',
        left: '0px',
        top: '0px'
    });

    var newCxt = newCanvas.getContext('2d');

    if(objtype == 'Pen') {
        newCxt.strokeStyle = colorPen.Color;
        newCxt.lineWidth = SetWidth == undefined ? colorPen.Width : SetWidth;
        newCxt.globalAlpha = SetOpacity == undefined ? colorPen.Opacity : SetOpacity;
    } else if(objtype == "Highlight") {
        newCxt.strokeStyle = colorPen.HighlightColor;
        newCxt.lineWidth = SetWidth == undefined ? colorPen.HighlightWidth : SetWidth;
        newCxt.globalAlpha = SetOpacity == undefined ? colorPen.HighlightOpacity : SetOpacity;
    } 

    newCxt.lineCap = colorPen.BrushType == 'rect' ? 'butt' : 'round';
    newCxt.lineJoin = colorPen.BrushType == 'rect' ? 'miter' : 'round';
    return newCxt;
}

//回來此頁面時，若原本有畫筆，則在重新建一個canvas畫出來
//gotoPage最後執行
function DrawPen(page) {
    $('.pen').remove();
    colorPen.PenStage = null;
    MainEaselJS.PenContainer.removeAllChildren();

    $(colorPen.LineList).each(function () {
        if (this.page == page && this.type == 'pen') {
            if (!$('#' + this.id)[0]) {
                if (colorPen.CustomizeMain.defaultModel) {
                    handleRedraw(this);
                } else {
                    reDoPen(this);
                }
            }
        }
    });
}

function reDoPen(obj) {
    var left = ZoomList.IsZoom ? (MainObj.CanvasL * ToolBarList.ZoomScale - ZoomList.DistX) - MainObj.CanvasL : 0;
    var top = ZoomList.IsZoom ? (MainObj.CanvasT * ToolBarList.ZoomScale - ZoomList.DistY) - MainObj.CanvasT : 0;

    left += ZoomList.IsAreaZoom ? ZoomList.AreaDistX : 0;
    top += ZoomList.IsAreaZoom ? ZoomList.AreaDistY : 0;

    if (obj.BrushType == 'arbitrarily' || obj.BrushType == undefined) {
        NewCanvas();
        var canvas = $('#canvas')[0];

        var width = obj.object.width * MainObj.Scale;
        var height = obj.object.height * MainObj.Scale;

        canvas.id = obj.id;
        canvas.width = $(window).width() * ToolBarList.ZoomScale;
        canvas.height = $(window).height() * ToolBarList.ZoomScale;
        $(canvas).css({
            'left': left,
            'top': top,
            'opacity': obj.object.opacity,
            'pointer-events': 'none'
        })

        $(canvas).addClass('pen');
        var cxt = canvas.getContext('2d');

        for (var i = 1; i < obj.points.length; i++) {
            cxt.strokeStyle = obj.object.color;
            cxt.lineWidth = obj.object.penwidth;
            cxt.globalAlpha = obj.object.opacity;
            cxt.lineCap = obj.BrushType == 'rect' ? 'butt' : 'round';
            cxt.lineJoin = obj.BrushType == 'rect' ? 'miter' : 'round';
            var x1 = (obj.points[i - 1].X * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasL;
            var y1 = (obj.points[i - 1].Y * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasT;
            var x2 = (obj.points[i].X * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasL;
            var y2 = (obj.points[i].Y * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasT;
            cxt.moveTo(x1, y1);
            cxt.lineTo(x2, y2);
            cxt.stroke();
        }
    } else if (obj.BrushType == 'line') {
        // 直線
        if (obj.points.length < 2) {
            return;
        }

        var newCxt = newSharpSet();
        var canvas = newCxt.canvas;

        canvas.width = $(window).width() * ToolBarList.ZoomScale;
        canvas.height = $(window).height() * ToolBarList.ZoomScale;
        canvas.id = obj.id;
        $(canvas).css({
            'left': left,
            'top': top,
            'opacity': obj.object.opacity,
            'pointer-events': 'none'
        })
        newCxt.clearRect(0, 0, canvas.width, canvas.height);
        newCxt.strokeStyle = obj.object.color;
        newCxt.lineWidth = obj.object.penwidth;
        newCxt.globalAlpha = obj.object.opacity;
        newCxt.lineCap = obj.BrushType == 'rect' ? 'butt' : 'round';
        newCxt.lineJoin = obj.BrushType == 'rect' ? 'miter' : 'round';
        newCxt.beginPath();
        var x1 = (obj.points[0].X * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasL;
        var y1 = (obj.points[0].Y * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasT;
        var x2 = (obj.points[1].X * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasL;
        var y2 = (obj.points[1].Y * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasT;
        newCxt.moveTo(x1, y1);
        newCxt.lineTo(x2, y2);
        newCxt.stroke();
    } else if (obj.BrushType == 'highlighter') {
        // 螢光筆
        if (obj.points.length < 2) {
            return;
        }

        var newCxt = newSharpSet();
        var canvas = newCxt.canvas;

        canvas.width = $(window).width() * ToolBarList.ZoomScale;
        canvas.height = $(window).height() * ToolBarList.ZoomScale;
        canvas.id = obj.id;
        $(canvas).css({
            'left': left,
            'top': top,
            'pointer-events': 'none'
        })
        newCxt.clearRect(0, 0, canvas.width, canvas.height);
        newCxt.strokeStyle = obj.object.color;
        newCxt.lineWidth = obj.object.penwidth;
        newCxt.globalAlpha = obj.object.opacity;
        newCxt.lineCap = obj.BrushType == 'rect' ? 'butt' : 'round';
        newCxt.lineJoin = obj.BrushType == 'rect' ? 'miter' : 'round';
        newCxt.beginPath();
        var x1 = (obj.points[0].X * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasL;
        var y1 = (obj.points[0].Y * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasT;
        var x2 = (obj.points[1].X * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasL;
        var y2 = (obj.points[1].Y * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasT;
        newCxt.moveTo(x1, y1);
        newCxt.lineTo(x2, y2);
        newCxt.stroke();
    } else if (obj.BrushType == 'rect') {
        // 矩形
        if (obj.points.length < 2) {
            return;
        }

        var newCxt = newSharpSet();
        var canvas = newCxt.canvas;

        canvas.id = obj.id;
        canvas.width = $(window).width() * ToolBarList.ZoomScale;
        canvas.height = $(window).height() * ToolBarList.ZoomScale;
        $(canvas).css({
            'left': left,
            'top': top,
            'opacity': obj.object.opacity,
            'pointer-events': 'none'
        })
        newCxt.strokeStyle = obj.object.color;
        newCxt.lineWidth = obj.object.penwidth;
        newCxt.globalAlpha = obj.object.opacity;
        newCxt.lineCap = obj.BrushType == 'rect' ? 'butt' : 'round';
        newCxt.lineJoin = obj.BrushType == 'rect' ? 'miter' : 'round';
        var x1 = (obj.points[0].X * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasL;
        var y1 = (obj.points[0].Y * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasT;
        var width = (obj.points[1].X - obj.points[0].X) * MainObj.Scale * ToolBarList.ZoomScale;
        var height = (obj.points[1].Y - obj.points[0].Y) * MainObj.Scale * ToolBarList.ZoomScale;
        newCxt.strokeRect(x1, y1, width, height);
        newCxt.stroke();
    } else {
        // 圓形
        if (obj.points.length < 2) {
            return;
        }

        var newCxt = newSharpSet();
        var canvas = newCxt.canvas;

        canvas.id = obj.id;
        canvas.width = $(window).width() * ToolBarList.ZoomScale;
        canvas.height = $(window).height() * ToolBarList.ZoomScale;
        $(canvas).css({
            'left': left,
            'top': top,
            'opacity': obj.object.opacity,
            'pointer-events': 'none'
        })
        newCxt.strokeStyle = obj.object.color;
        newCxt.lineWidth = obj.object.penwidth;
        newCxt.globalAlpha = obj.object.opacity;
        newCxt.lineCap = obj.BrushType == 'rect' ? 'butt' : 'round';
        newCxt.lineJoin = obj.BrushType == 'rect' ? 'miter' : 'round';
        var x1 = (obj.points[0].X * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasL;
        var y1 = (obj.points[0].Y * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasT;
        var width = (obj.points[1].X - obj.points[0].X) * MainObj.Scale * ToolBarList.ZoomScale;
        var height = (obj.points[1].Y - obj.points[0].Y) * MainObj.Scale * ToolBarList.ZoomScale;
        BezierEllipse(newCxt, x1, y1, width / 2, height / 2);
    }
}

//EaselJS Using
var PenPoints = [];var offset;
function handleMouseDown(event) {
    if (!event.primary) { return; }
    var id = newguid();

    MainEaselJS.PenShape = new createjs.Shape();
    MainEaselJS.PenShape.mouseEnabled = true;
    MainEaselJS.PenShape.alpha = colorPen.Opacity;
    MainEaselJS.PenShape.name = id;

    MainEaselJS.PenShape.scaleX = MainEaselJS.PenContainer.scaleX;
    MainEaselJS.PenShape.scaleY = MainEaselJS.PenContainer.scaleY;
    MainEaselJS.PenShape.x = MainEaselJS.PenContainer.x;
    MainEaselJS.PenShape.y = MainEaselJS.PenContainer.y;

    var PtX = (MainEaselJS.Drawstage.mouseX - MainEaselJS.PenContainer.x) / MainEaselJS.PenContainer.scaleX;
    var PtY = (MainEaselJS.Drawstage.mouseY - MainEaselJS.PenContainer.y) / MainEaselJS.PenContainer.scaleY;

    colorPen.Down.X = PtX;
    colorPen.Down.Y = PtY;

    if (colorPen.BrushType == 'arbitrarily') {
        MainEaselJS.PenShape.graphics.clear()
            .setStrokeStyle(colorPen.Width, 'round', 'round')
            .beginStroke(colorPen.Color)
            .moveTo(colorPen.Down.X, colorPen.Down.Y);

        PenPoints.push({
            X: colorPen.Down.X,
            Y: colorPen.Down.Y
        });
    }

    MainEaselJS.PenShape.addEventListener("mousedown", Penmousedown);
    MainEaselJS.PenShape.addEventListener("pressmove", Penpressmove);
    MainEaselJS.PenShape.addEventListener("pressup", Penpressup);
    MainEaselJS.Drawstage.addEventListener("stagemousemove", handleMouseMove);

    MainEaselJS.Drawstage.addChild(MainEaselJS.PenShape);
    MainEaselJS.Drawstage.update();
}

function handleMouseMove(event) {
    if (!event.primary) { return; }

    colorPen.Move.X = (MainEaselJS.Drawstage.mouseX - MainEaselJS.PenContainer.x) / MainEaselJS.PenContainer.scaleX;
    colorPen.Move.Y = (MainEaselJS.Drawstage.mouseY - MainEaselJS.PenContainer.y) / MainEaselJS.PenContainer.scaleY;

    colorPen.size.width = colorPen.Move.X - colorPen.Down.X;
    colorPen.size.height = colorPen.Move.Y - colorPen.Down.Y;

    if (colorPen.BrushType == 'arbitrarily') {
        MainEaselJS.PenShape.graphics
            .lineTo(colorPen.Move.X, colorPen.Move.Y);

        PenPoints.push({
            X: colorPen.Move.X,
            Y: colorPen.Move.Y
        });
    } else if (colorPen.BrushType == 'line') {
        MainEaselJS.PenShape.graphics.clear()
            .setStrokeStyle(colorPen.Width, 'round', 'round')
            .beginStroke(colorPen.Color)
            .moveTo(colorPen.Down.X, colorPen.Down.Y)
            .lineTo(colorPen.Move.X, colorPen.Move.Y);
    } else if (colorPen.BrushType == 'highlighter') {
        MainEaselJS.PenShape.alpha = colorPen.HighlightOpacity;
        MainEaselJS.PenShape.graphics.clear()
            .setStrokeStyle(colorPen.HighlightWidth, 'round', 'round')
            .beginStroke(colorPen.HighlightColor)
            .moveTo(colorPen.Down.X, colorPen.Down.Y)
            .lineTo(colorPen.Move.X, colorPen.Move.Y);
    } else if (colorPen.BrushType == 'rect') {
        MainEaselJS.PenShape.graphics.clear()
            .setStrokeStyle(colorPen.Width, 'round', 'round')
            .beginStroke(colorPen.Color)
            .drawRect(colorPen.Down.X, colorPen.Down.Y, colorPen.size.width, colorPen.size.height);
    } else if (colorPen.BrushType == 'circle') {
        MainEaselJS.PenShape.graphics.clear()
            .setStrokeStyle(colorPen.Width, 'round', 'round')
            .beginStroke(colorPen.Color)
            .drawEllipse(colorPen.Down.X, colorPen.Down.Y, colorPen.size.width, colorPen.size.height)
    } else {
        MainEaselJS.PenShape.graphics.clear();
    }

    MainEaselJS.Drawstage.update();
}

function handleMouseUp(event) {
    if (!event.primary) { return; }

    if (colorPen.BrushType != 'arbitrarily') {
        PenPoints.push({
            X: colorPen.Down.X,
            Y: colorPen.Down.Y
        }, {
            X: colorPen.Move.X,
            Y: colorPen.Move.Y
        });
    }

    if (colorPen.PenStage == undefined) {
        colorPen.PenStage = handleCanvas();
        colorPen.PenStage.enableMouseOver(10);
        colorPen.PenStage.addChild(MainEaselJS.PenContainer);
    }

    canvasList = {
        id: MainEaselJS.PenShape.name,
        type: 'pen',
        object: {
            penwidth: colorPen.BrushType != 'highlighter'? colorPen.Width : colorPen.HighlightWidth,
            color: colorPen.BrushType != 'highlighter'? colorPen.Color : colorPen.HighlightColor,
            opacity: colorPen.BrushType != 'highlighter'? colorPen.Opacity : colorPen.HighlightOpacity,
            width: colorPen.size.width / MainObj.Scale,
            height: colorPen.size.height / MainObj.Scale
        },
        BrushType: colorPen.BrushType,
        page: MainObj.NowPage,
        points: PenPoints,
        isZoom: ToolBarList.ZoomScale,
        isEraser: false,
        isGroup: null,
        isEraserSelect: false,
        isEraserSelectPen: false
    };

    if (canvasList.points.length) {
        colorPen.LineList.push(canvasList);
        MainObj.saveList.push(canvasList);
        recovery();
        if (MainObj.saveList.length > 5) {
            MainObj.saveList.splice(0, 1);
        }
    }

    PenPoints = [];

    MainEaselJS.PenShape.x -= MainEaselJS.PenShape.x;
    MainEaselJS.PenShape.y -= MainEaselJS.PenShape.y;
    MainEaselJS.PenShape.scaleX /= MainEaselJS.PenShape.scaleX
    MainEaselJS.PenShape.scaleY /= MainEaselJS.PenShape.scaleY

    MainEaselJS.PenContainer.addChild(MainEaselJS.PenShape);
    MainEaselJS.Drawstage.removeChild(MainEaselJS.PenShape);
    MainEaselJS.Drawstage.removeEventListener("stagemousemove", handleMouseMove);

    MainEaselJS.Drawstage.update();
    colorPen.PenStage.update();
}

function handleCanvas() {
    var tmpStage;

    NewCanvas();
    var newCanvas = $('#canvas')[0];
    newCanvas.id = "PenStage";
    newCanvas.width = $(window).width();
    newCanvas.height = $(window).height();
    $(newCanvas).addClass('pen');
    $(newCanvas).css({
        'pointer-events': 'none'
    });

    tmpStage = new createjs.Stage(newCanvas);

    return tmpStage;
}

function handleRedraw(obj) {
    if (colorPen.PenStage == undefined) {
        colorPen.PenStage = handleCanvas();
        colorPen.PenStage.addChild(MainEaselJS.PenContainer);     
    }

    MainEaselJS.PenShape = new createjs.Shape();
    MainEaselJS.PenShape.alpha = obj.object.opacity;
    MainEaselJS.PenShape.name = obj.id;

    MainEaselJS.PenShape.graphics.clear()
        .setStrokeStyle(obj.object.penwidth, 'round', 'round')
        .beginStroke(obj.object.color)

    if (obj.BrushType == 'arbitrarily' || obj.BrushType == undefined) {
        for (var i = 1; i < obj.points.length; i++) {
            var x1 = obj.points[i - 1].X;
            var y1 = obj.points[i - 1].Y;
            var x2 = obj.points[i].X;
            var y2 = obj.points[i].Y;

            MainEaselJS.PenShape.graphics
                .moveTo(x1, y1)
                .lineTo(x2, y2);
        }
    } else if (obj.BrushType == 'line' || obj.BrushType == 'highlighter') {
        if (obj.points.length < 2) {
            return;
        }

        var x1 = obj.points[0].X;
        var y1 = obj.points[0].Y;
        var x2 = obj.points[1].X;
        var y2 = obj.points[1].Y;

        MainEaselJS.PenShape.graphics
            .moveTo(x1, y1)
            .lineTo(x2, y2);
    } else if (obj.BrushType == 'rect') {
        if (obj.points.length < 2) {
            return;
        }

        var x1 = obj.points[0].X;
        var y1 = obj.points[0].Y;
        var width = obj.points[1].X - obj.points[0].X;
        var height = obj.points[1].Y - obj.points[0].Y;

        MainEaselJS.PenShape.graphics
            .drawRect(x1, y1, width, height);
    } else if (obj.BrushType == 'circle') {
        if (obj.points.length < 2) {
            return;
        }

        var x1 = obj.points[0].X;
        var y1 = obj.points[0].Y;
        var width = obj.points[1].X - obj.points[0].X;
        var height = obj.points[1].Y - obj.points[0].Y;

        MainEaselJS.PenShape.graphics
            .drawEllipse(x1, y1, width, height);
    } else {
        MainEaselJS.PenShape.graphics.clear();
    }

    MainEaselJS.PenShape.addEventListener("mousedown", Penmousedown);
    MainEaselJS.PenShape.addEventListener("pressmove", Penpressmove);
    MainEaselJS.PenShape.addEventListener("pressup", Penpressup);

    MainEaselJS.PenContainer.addChild(MainEaselJS.PenShape)
    colorPen.PenStage.update();
}