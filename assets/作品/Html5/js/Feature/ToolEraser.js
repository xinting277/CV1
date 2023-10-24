//橡皮擦

var Eraser = {
    Drag: false,
    IsMove: false,
    CenterDist: 10,
    Down: {
        X: 0,
        Y: 0
    }, //滑鼠點擊的座標
    Move: {
        X: 0,
        Y: 0
    }, //滑鼠移動的座標
    SelLine: [],
    Mouse: {
        opt: null,
        npt: null
    },
    Color: "#999999",
    Width: 9
}


function StartEraser(event, canvas) {
    event.preventDefault();

    var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;

    Eraser.Down.X = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
    Eraser.Down.Y = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

    Eraser.Down.X = (Eraser.Down.X - rect.left) * scaleX;
    Eraser.Down.Y = (Eraser.Down.Y - rect.top) * scaleY;

    Eraser.Drag = true;
}

function EraserMove(event, canvas) {
    if (Eraser.Drag) {
        var rect = canvas.getBoundingClientRect(),
            scaleX = canvas.width / rect.width,
            scaleY = canvas.height / rect.height;

        Eraser.Move.X = event.type == 'touchmove' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
        Eraser.Move.Y = event.type == 'touchmove' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);

        Eraser.Move.X = (Eraser.Move.X - rect.left) * scaleX;
        Eraser.Move.Y = (Eraser.Move.Y - rect.top) * scaleY;

        var width = Eraser.Move.X - Eraser.Down.X;
        var height = Eraser.Move.Y - Eraser.Down.Y;

        var cxt = canvas.getContext('2d');

        // IE不支援copy參數，所以只能清除重畫了
        cxt.clearRect(0, 0, canvas.width, canvas.height);

        cxt.lineWidth = 5; //線寬度
        cxt.setLineDash([15, 20]); //虛線
        cxt.strokeRect(Eraser.Down.X, Eraser.Down.Y, width, height);
        cxt.stroke();

        var X1 = FindMin(Eraser.Down.X, Eraser.Move.X), //橡皮擦左上角的X
            Y1 = FindMin(Eraser.Down.Y, Eraser.Move.Y), //橡皮擦左上角的Y
            X2 = FindMax(Eraser.Down.X, Eraser.Move.X), //橡皮擦右下角的X
            Y2 = FindMax(Eraser.Down.Y, Eraser.Move.Y); //橡皮擦右下角的Y

        if (!BoardMainobj.Canvas.Show) {
            colorPen.LineList.map(function (res) {
                if (res.page == MainObj.NowPage) {
                    if (res.BrushType == 'arbitrarily') {
                        $(res.points).each(function () {

                            var Xpoint = this.X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                            var Ypoint = this.Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);

                            if (Xpoint >= X1 && Xpoint <= X2 && Ypoint >= Y1 && Ypoint <= Y2) {
                                res.isEraserSelect = true;
                                return false;
                            } else {
                                res.isEraserSelect = false;
                            }

                        });
                    } else if (res.BrushType == 'line' || res.BrushType == 'highlighter') {
                        var lineX1 = res.points[0].X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL),
                            lineY1 = res.points[0].Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT),
                            lineX2 = res.points[1].X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL),
                            lineY2 = res.points[1].Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);

                        if (!(FindMin(lineX1, lineX2) > X2 || FindMax(lineX1, lineX2) < X1 || FindMin(lineY1, lineY2) > Y2 || FindMax(lineY1, lineY2) < Y1)) {
                            res.isEraserSelect = true;
                        } else {
                            res.isEraserSelect = false;
                        }
                    } else if (res.BrushType == "rect" || res.BrushType == "circle") {
                        var left = res.points[0].X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                        var top = res.points[0].Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                        var right = res.object.width * MainObj.Scale * ToolBarList.ZoomScale + left;
                        var down = res.object.height * MainObj.Scale * ToolBarList.ZoomScale + top;
                        if (!(FindMin(left, right) > X2 || FindMax(left, right) < X1 || FindMin(top, down) > Y2 || FindMax(top, down) < Y1)) {
                            res.isEraserSelect = true;
                        } else {
                            res.isEraserSelect = false;
                        }
                    }


                    if (res.isEraserSelect) {
                        if (!res.isEraserSelectPen) {
                            if (colorPen.CustomizeMain.defaultModel) {
                                var EraserShape = MainEaselJS.PenContainer.getChildByName(res.id);
                                EraserShape.alpha = res.object.opacity / 2;
                                colorPen.PenStage.update()
                            } else {
                                $("#" + res.id).css('opacity', res.object.opacity / 2);
                            }

                            res.isEraserSelectPen = true;
                        }
                    } else {
                        if (res.isEraserSelectPen) {
                            if (colorPen.CustomizeMain.defaultModel) {
                                var EraserShape = MainEaselJS.PenContainer.getChildByName(res.id);
                                EraserShape.alpha = res.object.opacity;
                                colorPen.PenStage.update()
                            } else {
                                $("#" + res.id).css('opacity', res.object.opacity);
                            }

                            res.isEraserSelectPen = false;
                        }
                    }
                }
            });
        }

        Eraser.IsMove = true;
    }
}

function EraserUp(event, canvas) {

    if (!Eraser.IsMove) {
        Eraser.Move.X = Eraser.Down.X + Eraser.CenterDist;
        Eraser.Move.Y = Eraser.Down.Y + Eraser.CenterDist;
        Eraser.Down.X = Eraser.Down.X - Eraser.CenterDist;
        Eraser.Down.Y = Eraser.Down.Y - Eraser.CenterDist;
    }

    var X1 = FindMin(Eraser.Down.X, Eraser.Move.X), //橡皮擦左上角的X
        Y1 = FindMin(Eraser.Down.Y, Eraser.Move.Y), //橡皮擦左上角的Y
        X2 = FindMax(Eraser.Down.X, Eraser.Move.X), //橡皮擦右下角的X
        Y2 = FindMax(Eraser.Down.Y, Eraser.Move.Y), //橡皮擦右下角的Y
        Obj = []; //要刪除的線存在這裡

    if (BoardMainobj.Canvas.Show) {
        var boardLine = [];

        // 刪除手寫白板
        BoardMainobj.saveList.map(function (res, index) {
            if (res.brushType == "arbitrarily") {
                res.points.map(function (p) {
                    //若是線的其中一點座標有在橡皮擦的範圍內，則記錄到Obj裡
                    if (
                        p.x + $('.canvasboard').offset().left > X1 &&
                        p.x + $('.canvasboard').offset().left < X2 &&
                        p.y + $('.canvasboard').offset().top > Y1 &&
                        p.y + $('.canvasboard').offset().top < Y2
                    ) {
                        boardLine.push(index);
                    }
                });
            } else if (res.brushType == "line" || res.brushType == 'highlighter') {
                var lineX1 = res.points[0].x + $('.canvasboard').offset().left,
                    lineY1 = res.points[0].y + $('.canvasboard').offset().top,
                    lineX2 = res.points[1].x + $('.canvasboard').offset().left,
                    lineY2 = res.points[1].y + $('.canvasboard').offset().top;

                if (!(FindMin(lineX1, lineX2) > X2 || FindMax(lineX1, lineX2) < X1 || FindMin(lineY1, lineY2) > Y2 || FindMax(lineY1, lineY2) < Y1)) {
                    boardLine.push(index);
                }
            } else if (res.brushType == "rect" || res.brushType == "circle") {
                var left = res.points[0].x + $('.canvasboard').offset().left;
                var top = res.points[0].y + $('.canvasboard').offset().top;
                var right = res.size[0].width + left;
                var down = res.size[0].height + top;
                if (!(FindMin(left, right) > X2 || FindMax(left, right) < X1 || FindMin(top, down) > Y2 || FindMax(top, down) < Y1)) {
                    boardLine.push(index);
                }
            }
        });

        if (boardLine.length > 0) {
            //刪除手寫白版的線
            if (boardLine.length > 0) {
                boardLine.map(function (res) {
                    if (BoardMainobj.saveList[res]) {
                        delete BoardMainobj.saveList[res];
                    }
                });
                replyCavnasboard();
            }
        }
    } else {
        //刪除畫筆
        var Gruopid = newguid();
        colorPen.LineList.map(function (res) {
            if (res.page == MainObj.NowPage) {
                if (res.BrushType == 'arbitrarily') {
                    $(res.points).each(function () {
                        //若是線的其中一點座標有在橡皮擦的範圍內，則記錄到Obj裡

                        var Xpoint = this.X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                        var Ypoint = this.Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);

                        if (Xpoint >= X1 && Xpoint <= X2 && Ypoint >= Y1 && Ypoint <= Y2) {
                            Obj.push({
                                id: res.id,
                                type: res.type
                            });

                            MainObj.saveList.map(function (MainObjres) {
                                if (MainObjres.id == res.id) {
                                    MainObjres.isEraser = true;
                                    MainObjres.isGroup = Gruopid;
                                }
                            });
                        }
                    });
                } else if (res.BrushType == 'line' || res.BrushType == 'highlighter') {
                    var lineX1 = res.points[0].X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL),
                        lineY1 = res.points[0].Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT),
                        lineX2 = res.points[1].X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL),
                        lineY2 = res.points[1].Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);

                    if (!(FindMin(lineX1, lineX2) > X2 || FindMax(lineX1, lineX2) < X1 || FindMin(lineY1, lineY2) > Y2 || FindMax(lineY1, lineY2) < Y1)) {
                        Obj.push({
                            id: res.id,
                            type: res.type
                        });

                        MainObj.saveList.map(function (MainObjres) {
                            if (MainObjres.id == res.id) {
                                MainObjres.isEraser = true;
                            }
                        });
                    }
                } else if (res.BrushType == "rect" || res.BrushType == "circle") {
                    var left = res.points[0].X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                    var top = res.points[0].Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                    var right = res.object.width * MainObj.Scale * ToolBarList.ZoomScale + left;
                    var down = res.object.height * MainObj.Scale * ToolBarList.ZoomScale + top;
                    if (!(FindMin(left, right) > X2 || FindMax(left, right) < X1 || FindMin(top, down) > Y2 || FindMax(top, down) < Y1)) {
                        Obj.push({
                            id: res.id,
                            type: res.type
                        });

                        MainObj.saveList.map(function (MainObjres) {
                            if (MainObjres.id == res.id) {
                                MainObjres.isEraser = true;
                            }
                        });
                    }
                }
            }
        });

        var Point = {
            X1: X1,
            Y1: Y1,
            X2: X2,
            Y2: Y2
        };

        FindWidget(Obj, Point, txtNote.SaveList);
        FindWidget(Obj, Point, txtCanvas.SaveList);
        FindWidget(Obj, Point, InsertImg.SaveList);
        FindWidget(Obj, Point, hyperLink.saveList);
        FindWidget(Obj, Point, fileObj.saveList);
        FindWidget(Obj, Point, txtComment.saveList);

        Obj = Obj.reduce(function (init, current) {
            if (init.length === 0 || init[init.length - 1].id !== current.id) {
                init.push(current);
            }
            return init;
        }, []);

        if (Obj.length > 0) {
            //一次刪除有框到的線
            for (var objid = 0; objid < Obj.length; objid++) {

                if (colorPen.CustomizeMain.defaultModel) {
                    if (colorPen.PenStage != undefined) {
                        var EraserShape = MainEaselJS.PenContainer.getChildByName(Obj[objid].id);
                        MainEaselJS.PenContainer.removeChild(EraserShape);
                        colorPen.PenStage.update()
                    }
                }

                $('#' + Obj[objid].id).remove();

                switch (Obj[objid].type) {
                    case "pen":
                        DeleteList(Obj, colorPen.LineList, objid); //畫筆  
                        break;
                    case "txtCanvas":
                        DeleteList(Obj, txtCanvas.SaveList, objid); //便利貼
                        break;
                    case "txtNote":
                        DeleteList(Obj, txtNote.SaveList, objid); //文字便利貼
                        break;
                    case "comment":
                        DeleteList(Obj, txtComment.saveList, objid); //注解
                        break;
                    case "hyperLink":
                        DeleteList(Obj, hyperLink.saveList, objid); //超連結
                        break;
                    case "file":
                        DeleteList(Obj, fileObj.saveList, objid); //檔案
                        break;
                    default:
                        DeleteList(Obj, InsertImg.SaveList, objid); //插入圖片
                        break;
                }
            }

            replyFile();
        }
    }

    var cxt = canvas.getContext('2d');
    cxt.clearRect(0, 0, canvas.width, canvas.height);

    Eraser.Drag = false;
    Eraser.IsMove = false;
    GalleryStartMove();
}

//取得橡皮擦範圍內的物件(文字便利貼、便利貼、圖片、錄音)
function FindWidget(Obj, Point, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] != undefined) {
            if (list[i].page == MainObj.NowPage) {
                var obj = list[i];
                if (obj.IsPatch != 'true') {
                    var left, top, right, down;
                    if (obj.type == 'txtCanvas' || obj.type == 'txtNote') {
                        left = Number(obj.left.split('px')[0]) * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                        top = Number(obj.top.split('px')[0]) * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                        right = (Number(obj.width.split('px')[0]) + Number(obj.left.split('px')[0])) * MainObj.Scale * ToolBarList.ZoomScale;
                        down = (Number(obj.height.split('px')[0]) + Number(obj.top.split('px')[0])) * MainObj.Scale * ToolBarList.ZoomScale;
                        if (obj.StickyViewVisibility == 'false') {
                            left = Number(obj.left.split('px')[0]) * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                            top = Number(obj.top.split('px')[0]) * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                            right = 50 * MainObj.Scale * ToolBarList.ZoomScale + left;
                            down = 50 * MainObj.Scale * ToolBarList.ZoomScale + top;
                        }
                    } else if (obj.type == 'YouTube' || obj.type == 'Google' || obj.type == 'Wiki') {
                        left = obj.left * ToolBarList.ZoomScale;
                        top = obj.top * ToolBarList.ZoomScale;
                        right = $('#' + obj.id).width() * ToolBarList.ZoomScale + left;
                        down = $('#' + obj.id).height() * ToolBarList.ZoomScale + top;
                    } else if (obj.type == 'hyperLink') {
                        left = obj.left * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                        top = obj.top * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                        right = $('#' + obj.id).width() * ToolBarList.ZoomScale + left;
                        down = $('#' + obj.id).height() * ToolBarList.ZoomScale + top;
                    } else if (obj.type == 'file') {
                        left = obj.left * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                        top = obj.top * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                        right = $('#canvas' + obj.id).width() * ToolBarList.ZoomScale + left;
                        down = $('#canvas' + obj.id).height() * ToolBarList.ZoomScale + top;
                    } else if (obj.type == 'comment') {
                        left = obj.position.from.X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                        top = obj.position.from.Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                        right = obj.position.to.X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                        down = obj.position.to.Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                    } else {
                        left = Number(obj.left.split('px')[0]) * ToolBarList.ZoomScale;
                        top = Number(obj.top.split('px')[0]) * ToolBarList.ZoomScale;
                        right = Number(obj.width.split('px')[0]) * ToolBarList.ZoomScale + left;
                        down = Number(obj.height.split('px')[0]) * ToolBarList.ZoomScale + top;
                    }

                    if (!(FindMin(left, right) > Point.X2 || FindMax(left, right) < Point.X1 || FindMin(top, down) > Point.Y2 || FindMax(top, down) < Point.Y1)) {
                        Obj.push({
                            id: obj.id,
                            type: obj.type
                        });
                    }
                }
            }
        }
    }
}

//取兩點最大
function FindMax(a, b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

//取兩點最小
function FindMin(a, b) {
    if (a > b) {
        return b;
    } else {
        return a;
    }
}

//刪除有保存到list的各個Widget
function DeleteList(obj, list, objid) {
    for (var i = 0; i < list.length; i++) {
        //刪掉canvas之外，還要把原本有記錄到的刪掉
        if (list[i] != undefined) {
            if (list[i].id == obj[objid].id) {
                list.splice(i, 1);
            }
        }
    }
}

function EraserMouseDown(event) {
    if (!event.primary) { return; }

    Eraser.Mouse.oPt = new createjs.Point(MainEaselJS.Drawstage.mouseX, MainEaselJS.Drawstage.mouseY);

    var id = newguid();

    MainEaselJS.EraserShape = new createjs.Shape();
    MainEaselJS.EraserShape.name = id;
    MainEaselJS.Drawstage.addChild(MainEaselJS.EraserShape);

    MainEaselJS.Drawstage.addEventListener("stagemousemove", EraserMouseMove);
    MainEaselJS.Drawstage.update();
}

function EraserMouseMove(event) {
    if (!event.primary) { return; }

    Eraser.Mouse.nPt = new createjs.Point(MainEaselJS.Drawstage.mouseX, MainEaselJS.Drawstage.mouseY);

    MainEaselJS.EraserShape.graphics.clear()
        .setStrokeStyle(Eraser.Width, 'round', 'round')
        .beginStroke(Eraser.Color)
        .setStrokeDash([15, 20], 0)
        .drawRect(Eraser.Mouse.oPt.x, Eraser.Mouse.oPt.y, Eraser.Mouse.nPt.x - Eraser.Mouse.oPt.x, Eraser.Mouse.nPt.y - Eraser.Mouse.oPt.y);

    var X1 = FindMin(Eraser.Mouse.oPt.x, Eraser.Mouse.oPt.x + (Eraser.Mouse.nPt.x - Eraser.Mouse.oPt.x)), //左上角的X
        Y1 = FindMin(Eraser.Mouse.oPt.y, Eraser.Mouse.oPt.y + (Eraser.Mouse.nPt.y - Eraser.Mouse.oPt.y)), //左上角的Y
        X2 = FindMax(Eraser.Mouse.oPt.x, Eraser.Mouse.oPt.x + (Eraser.Mouse.nPt.x - Eraser.Mouse.oPt.x)), //右下角的X
        Y2 = FindMax(Eraser.Mouse.oPt.y, Eraser.Mouse.oPt.y + (Eraser.Mouse.nPt.y - Eraser.Mouse.oPt.y)); //右下角的Y

    colorPen.LineList.map(function (res) {
        if (res.page == MainObj.NowPage) {
            if (res.BrushType == 'arbitrarily') {
                $(res.points).each(function () {

                    var Xpoint = this.X;
                    var Ypoint = this.Y;

                    if (Xpoint >= X1 && Xpoint <= X2 && Ypoint >= Y1 && Ypoint <= Y2) {
                        res.isSelect = true;
                        return false;
                    } else {
                        res.isSelect = false;
                    }

                });
            } else if (res.BrushType == 'line' || res.BrushType == 'highlighter') {
                var lineX1 = res.points[0].X,
                    lineY1 = res.points[0].Y,
                    lineX2 = res.points[1].X,
                    lineY2 = res.points[1].Y;

                if (!(FindMin(lineX1, lineX2) > X2 || FindMax(lineX1, lineX2) < X1 || FindMin(lineY1, lineY2) > Y2 || FindMax(lineY1, lineY2) < Y1)) {
                    res.isSelect = true;
                } else {
                    res.isSelect = false;
                }
            } else if (res.BrushType == "rect" || res.BrushType == "circle") {
                var left = res.points[0].X;
                var top = res.points[0].Y;
                var right = res.object.width * MainObj.Scale + left;
                var down = res.object.height * MainObj.Scale + top;
                if (!(FindMin(left, right) > X2 || FindMax(left, right) < X1 || FindMin(top, down) > Y2 || FindMax(top, down) < Y1)) {
                    res.isSelect = true;
                } else {
                    res.isSelect = false;
                }
            }

            if (res.isSelect) {
                var tempShape = MainEaselJS.PenContainer.getChildByName(res.id);
                tempShape.alpha = res.object.opacity / 2;
                colorPen.PenStage.update()
            } else {
                var tempShape = MainEaselJS.PenContainer.getChildByName(res.id);
                tempShape.alpha = res.object.opacity;
                colorPen.PenStage.update()
            }
        }
    });

    MainEaselJS.Drawstage.update();
}

function EraserMouseUp(event) {
    if (!event.primary) { return; }

    Eraser.SelLine = [];

    var X1 = FindMin(Eraser.Mouse.oPt.x, Eraser.Mouse.oPt.x + (Eraser.Mouse.nPt.x - Eraser.Mouse.oPt.x)), //左上角的X
        Y1 = FindMin(Eraser.Mouse.oPt.y, Eraser.Mouse.oPt.y + (Eraser.Mouse.nPt.y - Eraser.Mouse.oPt.y)), //左上角的Y
        X2 = FindMax(Eraser.Mouse.oPt.x, Eraser.Mouse.oPt.x + (Eraser.Mouse.nPt.x - Eraser.Mouse.oPt.x)), //右下角的X
        Y2 = FindMax(Eraser.Mouse.oPt.y, Eraser.Mouse.oPt.y + (Eraser.Mouse.nPt.y - Eraser.Mouse.oPt.y)), //右下角的Y
        Obj = [];

    var Gruopid = newguid();
    colorPen.LineList.map(function (res) {
        if (res.page == MainObj.NowPage) {
            if (res.BrushType == 'arbitrarily') {
                $(res.points).each(function () {

                    var Xpoint = this.X;
                    var Ypoint = this.Y;

                    if (Xpoint >= X1 && Xpoint <= X2 && Ypoint >= Y1 && Ypoint <= Y2) {
                        Eraser.SelLine.push(res.id);
                        Obj.push({
                            id: res.id,
                            type: res.type
                        });

                        MainObj.saveList.map(function (MainObjres) {
                            if (MainObjres.id == res.id) {
                                MainObjres.isEraser = true;
                                MainObjres.isGroup = Gruopid;
                            }
                        });
                        return false;
                    }

                });
            } else if (res.BrushType == 'line' || res.BrushType == 'highlighter') {
                var lineX1 = res.points[0].X,
                    lineY1 = res.points[0].Y,
                    lineX2 = res.points[1].X,
                    lineY2 = res.points[1].Y;

                if (!(FindMin(lineX1, lineX2) > X2 || FindMax(lineX1, lineX2) < X1 || FindMin(lineY1, lineY2) > Y2 || FindMax(lineY1, lineY2) < Y1)) {
                    Eraser.SelLine.push(res.id);
                    Obj.push({
                        id: res.id,
                        type: res.type
                    });

                    MainObj.saveList.map(function (MainObjres) {
                        if (MainObjres.id == res.id) {
                            MainObjres.isEraser = true;
                        }
                    });
                }
            } else if (res.BrushType == "rect" || res.BrushType == "circle") {
                var left = res.points[0].X;
                var top = res.points[0].Y;
                var right = res.object.width * MainObj.Scale + left;
                var down = res.object.height * MainObj.Scale + top;
                if (!(FindMin(left, right) > X2 || FindMax(left, right) < X1 || FindMin(top, down) > Y2 || FindMax(top, down) < Y1)) {
                    Eraser.SelLine.push(res.id);
                    Obj.push({
                        id: res.id,
                        type: res.type
                    });

                    MainObj.saveList.map(function (MainObjres) {
                        if (MainObjres.id == res.id) {
                            MainObjres.isEraser = true;
                        }
                    });
                }
            }
        }
    });

    Eraser.SelLine.filter(function (element, index, arr) {
        return arr.indexOf(element) === index;
    });

    var Point = {
        X1: X1,
        Y1: Y1,
        X2: X2,
        Y2: Y2
    };

    FindWidget(Obj, Point, txtNote.SaveList);
    FindWidget(Obj, Point, txtCanvas.SaveList);
    FindWidget(Obj, Point, InsertImg.SaveList);
    FindWidget(Obj, Point, hyperLink.saveList);
    FindWidget(Obj, Point, fileObj.saveList);
    FindWidget(Obj, Point, txtComment.saveList);

    Obj = Obj.reduce(function (init, current) {
        if (init.length === 0 || init[init.length - 1].id !== current.id) {
            init.push(current);
        }
        return init;
    }, []);

    if (Obj.length > 0) {
        //一次刪除有框到的線
        for (var objid = 0; objid < Obj.length; objid++) {

            if (colorPen.CustomizeMain.defaultModel) {
                if (colorPen.PenStage != undefined) {
                    var EraserShape = MainEaselJS.PenContainer.getChildByName(Obj[objid].id);
                    MainEaselJS.PenContainer.removeChild(EraserShape);
                    colorPen.PenStage.update()
                }
            }

            $('#' + Obj[objid].id).remove();

            switch (Obj[objid].type) {
                case "pen":
                    DeleteList(Obj, colorPen.LineList, objid); //畫筆  
                    break;
                case "txtCanvas":
                    DeleteList(Obj, txtCanvas.SaveList, objid); //便利貼
                    break;
                case "txtNote":
                    DeleteList(Obj, txtNote.SaveList, objid); //文字便利貼
                    break;
                case "comment":
                    DeleteList(Obj, txtComment.saveList, objid); //注解
                    break;
                case "hyperLink":
                    DeleteList(Obj, hyperLink.saveList, objid); //超連結
                    break;
                case "file":
                    DeleteList(Obj, fileObj.saveList, objid); //檔案
                    break;
                default:
                    DeleteList(Obj, InsertImg.SaveList, objid); //插入圖片
                    break;
            }
        }

        replyFile();
    }

    MainEaselJS.Drawstage.removeChild(MainEaselJS.EraserShape);
    MainEaselJS.Drawstage.removeEventListener("stagemousemove", EraserMouseMove);
    MainEaselJS.Drawstage.update();
}