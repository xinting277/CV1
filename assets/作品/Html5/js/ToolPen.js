//畫筆

var colorPen = {
    Color: 'rgb(255,0,0)', //畫筆顏色
    Width: 3, //畫筆寬度
    Opacity: 1.0, //畫筆透明度
    Drag: false,
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
    BrushType: 'arbitrarily',
    selectedType: 'arbitrarily',
    size: {
        width: 0,
        height: 0
    },
    lastPoint: {}
};

var comment = {
    Down: {
        X: 0,
        Y: 0
    }, //滑鼠點擊的座標
    Move: {
        X: 0,
        Y: 0
    }, //滑鼠移動的座標
    Drag: false,
    lastPoint: {},
    saveList: [],
    positionList: {}
}


function StartPen(event, canvas) {

    colorPen.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    colorPen.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    colorPen.Drag = true;

    var cxt = canvas.getContext('2d');
    if (colorPen.BrushType == 'arbitrarily') {
        cxt.beginPath();
        cxt.moveTo(colorPen.Down.X, colorPen.Down.Y);
        if (MainObj.IsTwoPage) {
            var x = (Number(colorPen.Down.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale;
            var y = (Number(colorPen.Down.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale;
        } else {
            var x = (Number(colorPen.Down.X) - $('#CanvasLeft').offset().left) / MainObj.Scale / ToolBarList.ZoomScale;
            var y = (Number(colorPen.Down.Y) - $('#CanvasLeft').offset().top) / MainObj.Scale / ToolBarList.ZoomScale;
        }

        colorPen.Line.X.push(x);
        colorPen.Line.Y.push(y);
    }
}

function canvasPadMove(event, canvas) {

    // colorPen.Move.X = event.clientX;
    // colorPen.Move.Y = event.clientY;
    colorPen.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    colorPen.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    colorPen.size.width = colorPen.Move.X - colorPen.Down.X;
    colorPen.size.height = colorPen.Move.Y - colorPen.Down.Y;

    var cxt = canvas.getContext('2d');
    // resizeCanvas(canvas, cxt);

    if (colorPen.Drag) {
        if (colorPen.BrushType == 'arbitrarily') {
            cxt.lineTo(colorPen.Move.X, colorPen.Move.Y);
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            cxt.stroke();
            if (MainObj.IsTwoPage) {
                var x = (Number(colorPen.Move.X) - MainObj.CanvasL) / MainObj.Scale / ToolBarList.ZoomScale;
                var y = (Number(colorPen.Move.Y) - MainObj.CanvasT) / MainObj.Scale / ToolBarList.ZoomScale;
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
        } else if (colorPen.BrushType == 'rect') {
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            cxt.strokeRect(colorPen.Down.X, colorPen.Down.Y, colorPen.size.width, colorPen.size.height);
            cxt.stroke();
        } else {
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            var width = Math.abs(colorPen.size.width);
            var height = Math.abs(colorPen.size.height);

            DrawEllipse(cxt, colorPen.Down.X, colorPen.Down.Y, width / 2, height / 2);
        }
    }
}

//canvasPad為畫板
//newCanvas為畫完後呈現的結果
function canvasPadUp(canvas) {
    if (colorPen.Drag) {
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
            // $(newCanvas).css({
            //     'left': left * MainObj.Scale + MainObj.CanvasL,
            //     'top': top * MainObj.Scale + MainObj.CanvasT,
            //     'pointer-events': 'none'
            // })

            $(newCanvas)
                .css({
                    'left': 0,
                    'top': 0,
                    'pointer-events': 'none'
                })
                .attr({
                    'tempScale': ToolBarList.ZoomScale
                });

            // $('#canvasPad').remove();

            if (ToolBarList.AddWidgetState == 'IRSpen') {
                $(newCanvas).addClass('IRSpen');
            }

            if ($('#discussCanvas')[0] == undefined) {
                GalleryStartMove();
            }

        } else if (colorPen.BrushType == 'line') {
            // 直線
            var newCxt = newSharpSet(id);
            newCxt.lineCap = 'round';
            newCxt.lineJoin = 'round';
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
        } else if (colorPen.BrushType == 'rect') {
            // 矩形
            var newCxt = newSharpSet(id);
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

        } else {
            // 圓形
            var newCxt = newSharpSet(id);
            var width = Math.abs(colorPen.size.width);
            var height = Math.abs(colorPen.size.height);

            DrawEllipse(newCxt, colorPen.Down.X, colorPen.Down.Y, width / 2, height / 2);

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

            var width = width / 2 / MainObj.Scale;
            var height = height / 2 / MainObj.Scale;
        }

        if (!isIRS) {
            canvasList = {
                id: id,
                type: 'pen',
                BrushType: colorPen.BrushType,
                object: {
                    width: Math.abs(width),
                    height: Math.abs(height),
                    left: left,
                    top: top,
                    penwidth: colorPen.Width,
                    color: colorPen.Color,
                    opacity: Number(colorPen.Opacity)
                },
                page: MainObj.NowPage,
                points: canvasList.points,
                isIRS: false,
                isZoom: ToolBarList.ZoomScale
            };

            if (canvasList.points.length) {
                colorPen.LineList.push(canvasList);
                MainObj.saveList.push(canvasList);
                $('#recovery').css('background-image', 'url("ToolBar/recoverybefore.png")');
                if (MainObj.saveList.length > 3) {
                    MainObj.saveList.splice(0, 1);
                }
            }
        }

        colorPen.Line = {
            X: [],
            Y: []
        };

        var syncXML = toSyncXML();
        var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
        rmcall(message);

        var tempCxt = canvas.getContext('2d');
        tempCxt.clearRect(0, 0, canvas.width, canvas.height);

    }
}

// 畫形狀的canvas
function newSharpSet(id) {
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
    newCxt.strokeStyle = colorPen.Color;
    newCxt.lineWidth = colorPen.Width;
    newCxt.globalAlpha = colorPen.Opacity;
    return newCxt;
}

//回來此頁面時，若原本有畫筆，則在重新建一個canvas畫出來
//gotoPage最後執行
function DrawPen(page) {

    $('.pen').remove();

    if (!isHiddenNote) {
        $(colorPen.LineList).each(function () {
            var that = this;
            if (!MainObj.trashList.find(function (res) {
                if (res.id == that.id) {
                    return res;
                }
            })) {
                if (this.page == page && this.type == 'pen') {
                    // console.log(this.id);

                    if (!$('#' + this.id)[0]) {

                        reDoPen(this);
                    }
                }
            }
        });
    }
}

function reDoPen(obj) {
    var left = (MainObj.CanvasL * ToolBarList.ZoomScale - ZoomList.DistX) - MainObj.CanvasL;
    var top = (MainObj.CanvasT * ToolBarList.ZoomScale - ZoomList.DistY) - MainObj.CanvasT;

    left += ZoomList.IsAreaZoom ? ZoomList.AreaDistX : 0;
    top += ZoomList.IsAreaZoom ? ZoomList.AreaDistY : 0;

    if (obj.BrushType == 'arbitrarily') {
        NewCanvas();
        var canvas = $('#canvas')[0];

        var width = obj.object.width * MainObj.Scale;
        var height = obj.object.height * MainObj.Scale;
        var left = (MainObj.CanvasL * ToolBarList.ZoomScale - ZoomList.DistX) - MainObj.CanvasL;
        var top = (MainObj.CanvasT * ToolBarList.ZoomScale - ZoomList.DistY) - MainObj.CanvasT;

        left += ZoomList.IsAreaZoom ? ZoomList.AreaDistX : 0;
        top += ZoomList.IsAreaZoom ? ZoomList.AreaDistY : 0;

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
            cxt.lineCap = 'round';
            cxt.lineJoin = 'round';
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
        });

        newCxt.clearRect(0, 0, canvas.width, canvas.height);
        newCxt.strokeStyle = obj.object.color;
        newCxt.lineWidth = obj.object.penwidth;
        newCxt.globalAlpha = obj.object.opacity;
        newCxt.lineCap = 'round';
        newCxt.lineJoin = 'round';
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
        });

        newCxt.strokeStyle = obj.object.color;
        newCxt.lineWidth = obj.object.penwidth;
        newCxt.globalAlpha = obj.object.opacity;
        var x1 = (obj.points[0].X * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasL;
        var y1 = (obj.points[0].Y * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasT;
        var width = (obj.points[1].X - obj.points[0].X) * MainObj.Scale * ToolBarList.ZoomScale;
        var height = (obj.points[1].Y - obj.points[0].Y) * MainObj.Scale * ToolBarList.ZoomScale;
        newCxt.strokeRect(x1, y1, width, height);
        newCxt.stroke();
    } else {
        // 圓形
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
        });

        newCxt.strokeStyle = obj.object.color;
        newCxt.lineWidth = obj.object.penwidth;
        newCxt.globalAlpha = obj.object.opacity;
        var x1 = (obj.points[0].X * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasL;
        var y1 = (obj.points[0].Y * MainObj.Scale) * ToolBarList.ZoomScale + MainObj.CanvasT;
        var width = (obj.points[1].X - obj.points[0].X) * MainObj.Scale * ToolBarList.ZoomScale;
        var height = (obj.points[1].Y - obj.points[0].Y) * MainObj.Scale * ToolBarList.ZoomScale;
        DrawEllipse(newCxt, x1, y1, width / 2, height / 2);
    }
}

function checkPen() {
    for (var i = 0; i < colorPen.LineList.length; i++) {
        for (var j = 0; j < MainObj.trashList.length; j++) {
            if (colorPen.LineList[i]) {
                if (colorPen.LineList[i].id == MainObj.trashList[j].id) {
                    // colorPen.LineList.splice(i, 1);
                    delete colorPen.LineList[i];
                }
            }
        }
    }
    colorPen.LineList = colorPen.LineList.filter(function (res) {
        if (res) {
            return res;
        }
    });
}

/** 開始畫註解 */
function startComment(event, canvas) {

    // 取得Canvas元素跟瀏覽器上邊界在left、top、bottom、right之間距離與元素本身width、height
    var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width, // 計算Canvas元素本身寬度跟原生元素本身寬度(包含考量邊框與縮排，要考量左右兩邊的邊框與縮排)之實際縮放範圍
        scaleY = canvas.height / rect.height; // 計算Canvas元素本身高度跟原生元素本身高度(包含考量邊框與縮排，要考量左右兩邊的邊框與縮排)之實際縮放範圍

    // 取得註記 X軸，'touchstart'觸控螢幕觸控事件，event.clientX--> 滑鼠點擊目前位置 X軸(看瀏覽器內滑鼠跟內容框距離)
    comment.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    // 取得註記 Y軸，'touchstart'觸控螢幕觸控事件，event.clientY--> 滑鼠點擊目前位置 Y軸(看瀏覽器內滑鼠跟內容框距離)
    comment.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    // 設置註記正在被畫線
    comment.Drag = true;

    // 取得註記在滑鼠點擊時最終 X點起始值( (滑鼠下放X點-Canvas實際左邊點(X)) * 實際縮放範圍值)
    comment.Down.X = (comment.Down.X - rect.left) * scaleX;
    // 取得註記在滑鼠點擊時 Y點起始值( (滑鼠下放Y點-Canvas實際上邊點(Y)) * 實際縮放範圍值)
    comment.Down.Y = (comment.Down.Y - rect.top) * scaleY;

    // 紀錄註記最後停留X與Y點
    comment.lastPoint = {
        x: comment.Down.X,
        y: comment.Down.Y
    };

}

function moveComment(event, canvas) {

    // 取得Canvas元素跟瀏覽器上邊界在left、top、bottom、right之間距離與元素本身width、height
    var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width, // 計算Canvas元素本身寬度跟原生元素本身寬度(包含考量邊框與縮排，要考量左右兩邊的邊框與縮排)之實際縮放範圍
        scaleY = canvas.height / rect.height; // 計算Canvas元素本身高度跟原生元素本身高度(包含考量邊框與縮排，要考量左右兩邊的邊框與縮排)之實際縮放範圍

    // 取得註記 X軸，'touchstart'觸控螢幕觸控事件，event.clientX--> 滑鼠移動位置 X軸(看瀏覽器內滑鼠跟內容框距離)
    comment.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);

    // 取得註記 Y軸，'touchstart'觸控螢幕觸控事件，event.clientY--> 滑鼠移動位置 Y軸(看瀏覽器內滑鼠跟內容框距離)
    comment.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    // 取得註記在滑鼠移動時最終 X點範圍值( (滑鼠移動X點-Canvas實際左邊點(X)) * 實際縮放範圍值)
    comment.Move.X = (comment.Move.X - rect.left) * scaleX;

    // 取得註記在滑鼠移動時最終 Y點範圍值( (滑鼠移動Y點-Canvas實際上邊點(Y)) * 實際縮放範圍值)
    comment.Move.Y = (comment.Move.Y - rect.top) * scaleY;

    var cxt = canvas.getContext('2d');

    // 如果還在畫線就更新座標位置
    if (comment.Drag) {
        // 清除Canvas 矩形內部顏色
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        // 開啟繪圖模式
        cxt.beginPath();

        // 移動畫筆
        cxt.moveTo(comment.Down.X, comment.Down.Y);

        // 取得最後確定座標點
        comment.lastPoint = getLastPoint(comment.Down, comment.Move);

        // 將畫筆路過的地方都補上點形成線條
        cxt.lineTo(comment.lastPoint.x, comment.lastPoint.y);

        // 將線條補上邊框
        cxt.stroke();

        // 結束繪圖模式，正理來說畫完應該都要關掉
        // ctx.closePath()
    }
}

function upComment(canvas) {

    // 設置註記已畫完線
    comment.Drag = false;

    // 產生一個空的Canvas
    var newCxt = newSharpSet();

    // 產生放置線條與球兩個Canvas - div 區塊
    var commentDiv = document.createElement('div');
    // 在'#HamastarWrapper' div 內部加入放置線條與球的Canvas
    $('#HamastarWrapper').append(commentDiv);
    commentDiv.id = newCxt.canvas.id;
    $(commentDiv).attr('class', 'commentBox');

    //  div 區塊加入空的Canvas
    $(commentDiv).append(newCxt.canvas);

    // 產生畫線註記線條Canvas
    newCxt.canvas.id = 'pen' + newCxt.canvas.id;

    // 設置Canvas 寬度，以Browser View Content 區塊寬度去乘主縮放比例 
    newCxt.canvas.width = $(window).width() * ToolBarList.ZoomScale;
    // 設置Canvas 高度，以Browser View Content 區塊高度去乘主縮放比例 
    newCxt.canvas.height = $(window).height() * ToolBarList.ZoomScale;

    $(newCxt.canvas)
        .attr({
            'class': 'commentNote commentObj',
            'left': 0 + MainObj.CanvasL,
            'top': 0 + MainObj.CanvasT,
            'tempwidth': newCxt.canvas.width / ToolBarList.ZoomScale,
            'tempheight': newCxt.canvas.height / ToolBarList.ZoomScale,
        })
        .css({
            'z-index': 99,
            'left': ZoomList.IsZoom ? ZoomList.Left : 0,
            'top': ZoomList.IsZoom ? ZoomList.Top : 0
        });

    newCxt.strokeStyle = '#000000';
    newCxt.lineWidth = 3;

    newCxt.clearRect(0, 0, canvas.width, canvas.height);
    newCxt.beginPath();
    newCxt.moveTo(comment.Down.X, comment.Down.Y);
    newCxt.lineTo(comment.lastPoint.x, comment.lastPoint.y);
    newCxt.stroke();

    var tempCxt = canvas.getContext('2d');
    tempCxt.clearRect(0, 0, canvas.width, canvas.height);

    NewCanvas();
    var commentBall = $('#canvas')[0];
    $(commentDiv).append(commentBall);
    commentBall.id = 'ball' + commentDiv.id;

    commentBall.width = 10;
    commentBall.height = 10;


    var ballLeft = (((comment.lastPoint.x + comment.Down.X) / 2) - 5) + (ZoomList.IsZoom ? ZoomList.Left : 0);
    var ballTop = (((comment.lastPoint.y + comment.Down.Y) / 2) - 5) + (ZoomList.IsZoom ? ZoomList.Top : 0);

    $(commentBall)
        .attr({
            'class': 'commentNote commentBall',
            'left': ToolBarList.ZoomScale > 1 ? ((ballLeft - ZoomList.Left) / ToolBarList.ZoomScale + MainObj.CanvasL) : ballLeft,
            'top': ToolBarList.ZoomScale > 1 ? ((ballTop - ZoomList.Top) / ToolBarList.ZoomScale + MainObj.CanvasT) : ballTop,
            'tempwidth': 10 / ToolBarList.ZoomScale,
            'tempheight': 10 / ToolBarList.ZoomScale,
        })
        .css({
            'z-index': 99,
            'left': ballLeft + 'px',
            'top': ballTop + 'px'
        })
        .draggable({
            scroll: false,
            drag: function () {
                // console.log(this);
                var ballmove = {
                    left: $(this).offset().left - ballLeft,
                    top: $(this).offset().top - ballTop
                };
                $(newCxt.canvas).css({
                    left: ballmove.left + 'px',
                    top: ballmove.top + 'px'
                });
            },
            stop: function () {
                saveComment();
            }
        });
    var commentBallCxt = commentBall.getContext('2d');
    commentBallCxt.fillStyle = '#ff0000';
    commentBallCxt.beginPath();
    commentBallCxt.arc(5, 5, 5, 0, 2 * Math.PI);
    commentBallCxt.fill();

    var commentList = document.createElement('div');
    commentList.id = newguid();
    $(commentList).attr('class', 'commentBoxArea');
    $(commentList).attr('originalid', commentDiv.id);
    $('#HamastarWrapper').append(commentList);

    var textDiv = document.createElement('div');
    textDiv.id = 'textDiv' + commentDiv.id;
    $(commentList).append(textDiv);

    $(textDiv)
        .draggable({
            handle: '.commentBtns'
        })
        .resizable({
            minHeight: 286,
            minWidth: 500,
            alsoResize: '#cke_text' + commentDiv.id + '>.cke_inner>.cke_contents',
            start: function () {
                $(window).off("resize", resizeInit);
                $('.cke').css('pointer-events', 'none');
            },
            stop: function (event, ui) {
                $(window).resize(resizeInit);
                $('.cke').css('pointer-events', 'auto');
            }
        }).click(function () {
            CommentLast(commentDiv.id, commentList.id);
        });
    $(textDiv).attr({
        'class': 'commentTextDiv commentNote',
        'left': ToolBarList.ZoomScale > 1 ? ((ballLeft - ZoomList.Left) / ToolBarList.ZoomScale + MainObj.CanvasL) : ballLeft,
        'top': ToolBarList.ZoomScale > 1 ? ((ballTop + 30 - ZoomList.Top) / ToolBarList.ZoomScale + MainObj.CanvasT) : ballTop + 30,
    });
    // $(textDiv).addClass('commentTextDiv');
    // $(textDiv).addClass('canvasObj');
    // $(textDiv).addClass('commentNote');
    $(textDiv).css({
        'z-index': 99,
        'left': ballLeft + 'px',
        'top': (ballTop + 30) + 'px',
        'position': 'absolute',
        'width': 500,
        'height': 286
    });

    $(textDiv).append(
        '<div class=\"commentBtns\"><img class=\"commentNarrow\" onClick=\"commentNarrow(\'' + commentDiv.id + '\')\" src=\"ToolBar/txtnarrow.png\"><img class=\"commentClose\" onClick=\"commentClose(\'' + commentDiv.id + '\')\" src=\"ToolBar/txtclose.png\"></div>'
    );

    var commentText = document.createElement('textarea');
    commentText.id = 'text' + commentDiv.id;
    $(textDiv).append(commentText);

    try {
        var editor = CKEDITOR.replace(commentText.id, {
            on: {
                instanceReady: function (e) {
                    editor.on('change', function (e) {
                        saveComment();
                    })
                    $('.cke_resizer').css('border-width', '30px 30px 0 0')
                }
            },
            startupFocus: true
        });
    } catch (error) {
        console.log(error);
    }

    $(commentBall).click(function (e) {
        e.preventDefault();
        $('#textDiv' + commentDiv.id).toggle();

        CommentLast(commentDiv.id, commentList.id);
        saveComment();
        saveUndoComment(commentDiv.id, 'edit');
    });

    if (ToolBarList.ZoomScale > 1) {
        comment.positionList[commentDiv.id] = {
            position: {
                from: {
                    x: (comment.Down.X - ZoomList.Left) / ToolBarList.ZoomScale / MainObj.Scale,
                    y: (comment.Down.Y - ZoomList.Top) / ToolBarList.ZoomScale / MainObj.Scale
                },
                to: {
                    x: (comment.lastPoint.x - ZoomList.Left) / ToolBarList.ZoomScale / MainObj.Scale,
                    y: (comment.lastPoint.y - ZoomList.Top) / ToolBarList.ZoomScale / MainObj.Scale
                }
            }
        };
    } else {
        comment.positionList[commentDiv.id] = {
            position: {
                from: {
                    x: ((comment.Down.X - MainObj.CanvasL) / MainObj.Scale),
                    y: ((comment.Down.Y - MainObj.CanvasT) / MainObj.Scale)
                },
                to: {
                    x: ((comment.lastPoint.x - MainObj.CanvasL) / MainObj.Scale),
                    y: ((comment.lastPoint.y - MainObj.CanvasT) / MainObj.Scale)
                }
            }
        };
    }

    // 儲存註記位置
    saveComment();
    saveUndoComment(commentDiv.id, 'add');

    changeAllBtnToFalse(insertToolBar);

    GalleryStartMove();
    ToolBarList.AddWidgetState = 'none';

    // 移除掉畫註記線條Canvas
    $('#canvasPad').remove();

    $('#recovery').css('background-image', 'url("ToolBar/recoverybefore.png")');
    if (MainObj.saveList.length > 3) {
        MainObj.saveList.splice(0, 1);
    }

}

function CommentLast(id, listid) {
    var Commentlast = $('#HamastarWrapper').children().last();
    if (Commentlast[0].id !== listid) {
        $('#' + listid).insertAfter($(Commentlast));

        try {
            var data = CKEDITOR.instances['text' + id].getData()
            CKEDITOR.instances['text' + id].destroy();

            CKEDITOR.replace('text' + id, {
                on: {
                    instanceReady: function (e) {
                        CKEDITOR.instances['text' + id].setData(data);
                        $('#cke_text' + id).css({
                            height: '100%'
                        });
                        $('#cke_text' + id + ' .cke_inner').css({
                            height: '100%'
                        });
                        e.editor.document.on('keyup', function (event) {
                            setTimeout(function () {
                                saveComment();
                            }, 100);
                        });
                    }
                },
                startupFocus: true
            });
        } catch (error) {
            console.log(error);
        }
    }
}

/** 結束畫註解 */
function saveUndoComment(id, undo) {
    if (MainObj.saveList.length) {
        if (MainObj.saveList[MainObj.saveList.length - 1].id == id && MainObj.saveList[MainObj.saveList.length - 1].value == CKEDITOR.instances['text' + id].getData()) return;
    }

    MainObj.saveList.push({
        id: id,
        page: MainObj.NowPage,
        type: 'comment',
        value: CKEDITOR.instances['text' + id].getData(),
        position: getCommentPosition(id),
        undo: undo,
        isShow: $('#textDiv' + id).css('display') != 'none',
        left: (($('#ball' + id).offset().left - MainObj.CanvasL) / MainObj.Scale),
        top: (($('#ball' + id).offset().top - MainObj.CanvasT) / MainObj.Scale),
        color: $('#textDiv' + id).css('background-color')
    });
    $('#recovery').css('background-image', 'url("ToolBar/recoverybefore.png")');
    if (MainObj.saveList.length > 3) {
        MainObj.saveList.splice(0, 1);
    }
}

// 用四個象限判斷畫直線或橫線
function getLastPoint(start, end) {
    if (end.X < start.X && end.Y < start.Y) {
        // 左上
        if (start.X - end.X > start.Y - end.Y) {
            return {
                x: end.X,
                y: start.Y
            }
        } else {
            return {
                x: start.X,
                y: end.Y
            }
        }
    } else if (end.X > start.X && end.Y < start.Y) {
        // 右上
        if (end.X - start.X > start.Y - end.Y) {
            return {
                x: end.X,
                y: start.Y
            }
        } else {
            return {
                x: start.X,
                y: end.Y
            }
        }
    } else if (end.X > start.X && end.Y > start.Y) {
        // 右下
        if (end.X - start.X > end.Y - start.Y) {
            return {
                x: end.X,
                y: start.Y
            }
        } else {
            return {
                x: start.X,
                y: end.Y
            }
        }
    } else if (end.X < start.X && end.Y > start.Y) {
        // 左下
        if (start.X - end.X > end.Y - start.Y) {
            return {
                x: end.X,
                y: start.Y
            }
        } else {
            return {
                x: start.X,
                y: end.Y
            }
        }
    } else {
        return {
            x: start.X,
            y: start.Y
        }
    }
}

// 儲存註記資訊
function saveComment() {
    for (var i = 0; i < $('.commentBox').length; i++) {
        var obj = $('.commentBox')[i];
        for (var x = 0; x < comment.saveList.length; x++) {
            if (obj.id == comment.saveList[x].id) {
                comment.saveList.splice(x, 1);
            }
        }
        var temp = {
            id: obj.id,
            page: MainObj.NowPage,
            type: 'comment',
            // value: CKEDITOR.instances['text' + obj.id].getData(),
            value: CKEDITOR.instances['text' + obj.id].getData(),
            position: comment.positionList[obj.id].position,
            left: (($('#ball' + obj.id).offset().left - MainObj.CanvasL) / MainObj.Scale),
            top: (($('#ball' + obj.id).offset().top - MainObj.CanvasT) / MainObj.Scale),
            isShow: $('#textDiv' + obj.id).css('display') != 'none',
            color: $('#textDiv' + obj.id).css('background-color')
        };
        comment.saveList.push(temp);

    }
}

function getCommentPosition(id) {
    var left = ($('#ball' + id).offset().left + 5 - MainObj.CanvasL) / MainObj.Scale;
    var top = ($('#ball' + id).offset().top + 5 - MainObj.CanvasT) / MainObj.Scale;
    var position = comment.positionList[id].position;
    var lineLength = 0;
    var lineHalf = 0;
    if (position.from.x == position.to.x) {
        // 直線
        lineLength = Math.abs(position.from.y - position.to.y);
        lineHalf = lineLength / 2;
        position.from.y = (top - lineHalf);
        position.to.y = (position.from.y + lineLength);
        position.from.x = position.to.x = (left);
    } else {
        // 橫線
        lineLength = Math.abs(position.from.x - position.to.x);
        lineHalf = lineLength / 2;
        position.from.x = (left - lineHalf);
        position.to.x = (position.from.x + lineLength);
        position.from.y = position.to.y = (top);
    }
    return position;
}

// 回復註記
function replyComment(page) {
    $('.commentNote').remove();
    if (!isHiddenNote) {
        $(comment.saveList).each(function () {
            if (this.page == page && this.type == 'comment') {
                reDrawComment(this, function (editor, obj) {
                    editor.on('change', function (e) {
                        saveComment();

                        saveUndoComment(obj.id, 'edit');
                    })
                });
            }
        });
    }
}

// 重建單個comment
function reDrawComment(obj, callback) {
    var newCxt = newSharpSet();

    var commentDiv = document.createElement('div');
    $('#HamastarWrapper').append(commentDiv);
    commentDiv.id = obj.id;
    $(commentDiv).attr('class', 'commentBox');

    $(commentDiv).append(newCxt.canvas);
    newCxt.canvas.id = 'pen' + commentDiv.id;
    $(newCxt.canvas)
        .attr('class', 'commentNote commentObj')
        .css({
            'z-index': 99,
            left: 0,
            top: 0
        });
    newCxt.strokeStyle = '#000000';
    newCxt.lineWidth = 3;

    var fromX = ((obj.position.from.x * MainObj.Scale) + MainObj.CanvasL),
        fromY = ((obj.position.from.y * MainObj.Scale) + MainObj.CanvasT),
        toX = ((obj.position.to.x * MainObj.Scale) + MainObj.CanvasL),
        toY = ((obj.position.to.y * MainObj.Scale) + MainObj.CanvasT);

    // var ballLeft = (obj.left * MainObj.Scale) + MainObj.CanvasL;
    // var ballTop = (obj.top * MainObj.Scale) + MainObj.CanvasT;

    newCxt.clearRect(0, 0, newCxt.canvas.width, newCxt.canvas.height);
    newCxt.beginPath();
    // newCxt.moveTo(fromX + (ballLeft - ((toX + fromX) / 2 - 5)), fromY + (ballTop - ((toY + fromY) / 2 - 5)));
    // newCxt.lineTo(toX + (ballLeft - ((toX + fromX) / 2 - 5)), toY + (ballTop - ((toY + fromY) / 2 - 5)));
    newCxt.moveTo(fromX, fromY);
    newCxt.lineTo(toX, toY);
    newCxt.stroke();

    NewCanvas();
    var commentBall = $('#canvas')[0];
    $(commentDiv).append(commentBall);
    commentBall.id = 'ball' + obj.id;
    commentBall.width = 10;
    commentBall.height = 10;

    var ballLeft = (((toX + fromX) / 2) - 5);
    var ballTop = (((toY + fromY) / 2) - 5);
    // $(newCxt.canvas).css({
    //     left: 0 + (ballLeft - ((toX + fromX) / 2 - 10)),
    //     top: 0 + (ballTop - ((toY + fromY) / 2 - 10))
    // });

    $(commentBall)
        .attr('class', 'commentNote commentBall')
        .css({
            'z-index': 99,
            'left': ballLeft,
            'top': ballTop
        })
        .draggable({
            scroll: false,
            drag: function () {
                // console.log(this);
                var ballmove = {
                    left: $(this).offset().left - ballLeft,
                    top: $(this).offset().top - ballTop
                };
                $(newCxt.canvas).css({
                    left: 0 + ballmove.left,
                    top: 0 + ballmove.top
                });
            },
            stop: function () {
                saveComment();
            }
        });
    var commentBallCxt = commentBall.getContext('2d');
    commentBallCxt.fillStyle = '#ff0000';
    commentBallCxt.beginPath();
    commentBallCxt.arc(5, 5, 5, 0, 2 * Math.PI);
    commentBallCxt.fill();

    var commentList = document.createElement('div');
    commentList.id = newguid();
    $(commentList).attr('class', 'commentBoxArea');
    $(commentList).attr('originalid', commentDiv.id);
    $('#HamastarWrapper').append(commentList);

    var textDiv = document.createElement('div');
    textDiv.id = 'textDiv' + obj.id;
    $(commentList).append(textDiv);

    $(textDiv)
        .draggable({
            handle: '.commentBtns'
        })
        .resizable({
            minHeight: 286,
            minWidth: 500,
            alsoResize: '#cke_text' + obj.id + '>.cke_inner>.cke_contents',
            start: function () {
                $(window).off("resize", resizeInit);
                $('.cke').css('pointer-events', 'none');
            },
            stop: function (event, ui) {
                $(window).resize(resizeInit);
                $('.cke').css('pointer-events', 'auto');
            }
        })
        .click(function () {
            CommentLast(obj.id, commentList.id);
        });
    $(textDiv).attr('class', 'commentTextDiv commentNote');
    // $(textDiv).addClass('commentTextDiv');
    // $(textDiv).addClass('canvasObj');
    // $(textDiv).addClass('commentNote');
    $(textDiv).css({
        'z-index': 99,
        'position': 'absolute',
        'left': ballLeft,
        'top': ballTop + 30,
        'display': (obj.isShow == 'true' || obj.isShow == true) ? 'flex' : 'none',
        'width': 500,
        'height': 286
    });

    $(textDiv).append(
        '<div class=\"commentBtns\"><img class=\"commentNarrow\" onClick=\"commentNarrow(\'' + obj.id + '\')\" src=\"ToolBar/txtnarrow.png\"><img class=\"commentClose\" onClick=\"commentClose(\'' + obj.id + '\')\" src=\"ToolBar/txtclose.png\"></div>'
    );

    $('#textDiv' + obj.id).css({
        'border': '3px solid ' + obj.color || '#fdecac',
        'background-color': obj.color || '#fdecac'
    });

    var commentText = document.createElement('textarea');
    commentText.id = 'text' + obj.id;
    $(textDiv).append(commentText);
    $(commentText).css({
        'display': 'none',
        'height': '100%',
        'resize': 'none'
    })
    var that = obj;
    setTimeout(function () {
        try {
            if (CKEDITOR.instances[commentText.id]) {
                CKEDITOR.instances[commentText.id].destroy();
            }
            var editor = CKEDITOR.replace(commentText.id, {
                on: {
                    instanceReady: function (e) {
                        CKEDITOR.instances[commentText.id].setData(that.value);
                        $('.cke_resizer').css('border-width', '30px 30px 0 0');
                        if (callback) {
                            callback(editor, obj);
                        }
                    }
                },
                startupFocus: true
            });
        } catch (error) {
            console.log(error);
        }
    })

    $(commentBall).click(function (e) {
        e.preventDefault();
        $('#textDiv' + obj.id).toggle();

        CommentLast(obj.id, commentList.id);
        saveComment();
        saveUndoComment(obj.id, 'edit');
    });

    comment.positionList[obj.id] = {
        position: {
            from: {
                x: ((fromX - MainObj.CanvasL) / MainObj.Scale),
                y: ((fromY - MainObj.CanvasT) / MainObj.Scale)
            },
            to: {
                x: ((toX - MainObj.CanvasL) / MainObj.Scale),
                y: ((toY - MainObj.CanvasT) / MainObj.Scale)
            }
        }
    };
}

function commentNarrow(id) {
    $('#textDiv' + id).toggle();
    saveComment();
    saveUndoComment(id, 'edit');
}

//background color button設置
function commentBg(id, color) {
    if (!color) {
        color = '#fdecac';
    }
    $('.commentBgcolor')[0].value = color;
    $('.commentBgcolor').css('background-color', color);
    $('.bgColorPickerComment').toggle();
    txtNote.selectedCommentBgId = id;
}

function changeCommentBg() {
    $('.bgColorPickerComment').toggle();
    $('#textDiv' + txtNote.selectedCommentBgId).css({
        'border': '3px solid ' + $('.commentBgcolor')[0].value,
        'background-color': $('.commentBgcolor')[0].value
    });

    comment.saveList.map(function (x) {
        if (x.id == txtNote.selectedCommentBgId) {
            x.color = $('.commentBgcolor')[0].value;
        }
    })
}

function commentClose(id) {
    confirmShow('是否確定刪除物件', function (res) {
        if (res) {
            removeComment(id);

            for (var i = 0; i < comment.saveList.length; i++) {
                if (id == comment.saveList[i].id) {
                    var item = JSON.parse(JSON.stringify(comment.saveList[i]));
                    item.undo = 'remove';
                    MainObj.saveList.push(item);
                    comment.saveList.splice(i, 1);
                }
            }
        }
    })
}

function removeComment(id) {
    $('#' + id).remove();
    $('#ball' + id).remove();
    $('#textDiv' + id).remove();
}