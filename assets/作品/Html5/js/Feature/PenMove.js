var PenMove = {
    SelLine: [],
    Color: "#000000",
    Width: 5,
    MoveMouse: {
        oPt: null,
        nPt: null,
        X: 0,
        Y: 0
    },
    Mouse: {
        oPt: null,
        nPt: null
    },
    OneEnable: false,
    SelectEnable: false,
    CustomizeMain: {
        defaultModel: false
    }
};

function setPenMove() {
    if (PenMove.OneEnable) {
        $(colorPen.PenStage.canvas).css({
            'pointer-events': 'auto'
        });
    } else {
        $(colorPen.PenStage.canvas).css({
            'pointer-events': 'none'
        });
    }
}

function Penmousedown(evt) {
    evt.target.offset = {
        x: evt.target.x - evt.stageX,
        y: evt.target.y - evt.stageY
    };
    PenMove.MoveMouse.oPt = new createjs.Point(MainEaselJS.Drawstage.mouseX, MainEaselJS.Drawstage.mouseY);
}

function Penpressmove(evt) {
    evt.target.x = evt.stageX + evt.target.offset.x;
    evt.target.y = evt.stageY + evt.target.offset.y;
    PenMove.MoveMouse.nPt = new createjs.Point(MainEaselJS.Drawstage.mouseX, MainEaselJS.Drawstage.mouseY);

    if (PenMove.CustomizeMain.defaultModel) {
        for (let i = 0; i < PenMove.SelLine.length; i++) {
            var tmpShape = MainEaselJS.PenContainer.getChildByName(PenMove.SelLine[i]);
            tmpShape.x = -(PenMove.MoveMouse.oPt.x - PenMove.MoveMouse.nPt.x);
            tmpShape.y = -(PenMove.MoveMouse.oPt.y - PenMove.MoveMouse.nPt.y);
        }
    }

    MainEaselJS.Drawstage.update();
    colorPen.PenStage.update();
}

function Penpressup(evt) {
    if (PenMove.CustomizeMain.defaultModel) {
        for (let i = 0; i < PenMove.SelLine.length; i++) {
            var tmpShape = MainEaselJS.PenContainer.getChildByName(PenMove.SelLine[i]);
            MainEaselJS.PenContainer.removeChild(tmpShape);
            PenMove.MoveMouse.X = tmpShape.x;
            PenMove.MoveMouse.Y = tmpShape.y;

            for (let j = 0; j < colorPen.LineList.length; j++) {
                if (PenMove.SelLine[i] == colorPen.LineList[j].id) {
                    var points = colorPen.LineList[j].points;

                    for (let k = 0; k < points.length; k++) {
                        var point = points[k];
                        points[k] = {
                            X: point.X - (PenMove.MoveMouse.oPt.x - PenMove.MoveMouse.nPt.x),
                            Y: point.Y - (PenMove.MoveMouse.oPt.y - PenMove.MoveMouse.nPt.y)
                        };
                    }

                    handleRedraw(colorPen.LineList[j]);
                }
            }
        }
    } else {
        var obj = colorPen.LineList.filter(function (res) {
            return res.id == evt.target.name;
        });

        for (let i = 0; i < obj.length; i++) {
            var points = obj[i].points;

            for (let j = 0; j < points.length; j++) {
                var point = points[j];
                points[j] = {
                    X: point.X + evt.target.x,
                    Y: point.Y + evt.target.y
                };
            }
        }
    }

    MainEaselJS.PenShape.removeEventListener("mousedown", Penmousedown);
    MainEaselJS.PenShape.removeEventListener("pressmove", Penpressmove);
    MainEaselJS.PenShape.removeEventListener("pressup", Penpressup);
    MainEaselJS.Drawstage.update();
    colorPen.PenStage.update();
    $('#canvasMove').remove();
}

function MoveMouseDown(event) {
    if (!event.primary) {
        return;
    }

    PenMove.Mouse.oPt = new createjs.Point(MainEaselJS.Drawstage.mouseX, MainEaselJS.Drawstage.mouseY);
    MainEaselJS.Drawstage.addEventListener("stagemousemove", MoveMouseMove);
    MainEaselJS.Drawstage.update();
}

function MoveMouseMove(event) {
    if (!event.primary) {
        return;
    }

    PenMove.Mouse.nPt = new createjs.Point(MainEaselJS.Drawstage.mouseX, MainEaselJS.Drawstage.mouseY);
    MainEaselJS.PenShape.graphics.clear().setStrokeStyle(PenMove.Width, 'round', 'round').beginStroke(PenMove.Color).setStrokeDash([20, 15], 0).drawRect(PenMove.Mouse.oPt.x, PenMove.Mouse.oPt.y, PenMove.Mouse.nPt.x - PenMove.Mouse.oPt.x, PenMove.Mouse.nPt.y - PenMove.Mouse.oPt.y);
    var X1 = FindMin(PenMove.Mouse.oPt.x, PenMove.Mouse.oPt.x + (PenMove.Mouse.nPt.x - PenMove.Mouse.oPt.x)),
        //左上角的X
        Y1 = FindMin(PenMove.Mouse.oPt.y, PenMove.Mouse.oPt.y + (PenMove.Mouse.nPt.y - PenMove.Mouse.oPt.y)),
        //左上角的Y
        X2 = FindMax(PenMove.Mouse.oPt.x, PenMove.Mouse.oPt.x + (PenMove.Mouse.nPt.x - PenMove.Mouse.oPt.x)),
        //右下角的X
        Y2 = FindMax(PenMove.Mouse.oPt.y, PenMove.Mouse.oPt.y + (PenMove.Mouse.nPt.y - PenMove.Mouse.oPt.y)); //右下角的Y

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
                colorPen.PenStage.update();
            } else {
                var tempShape = MainEaselJS.PenContainer.getChildByName(res.id);
                tempShape.alpha = res.object.opacity;
                colorPen.PenStage.update();
            }
        }
    });
    MainEaselJS.Drawstage.update();
}

function MoveMouseUp(event) {
    if (!event.primary) {
        return;
    }

    PenMove.SelLine = [];
    var hit = MainEaselJS.PenShape.hitArea = new createjs.Shape();
    hit.graphics.beginFill("#000000").drawRect(PenMove.Mouse.oPt.x, PenMove.Mouse.oPt.y, PenMove.Mouse.nPt.x - PenMove.Mouse.oPt.x, PenMove.Mouse.nPt.y - PenMove.Mouse.oPt.y);
    var X1 = FindMin(PenMove.Mouse.oPt.x, PenMove.Mouse.oPt.x + (PenMove.Mouse.nPt.x - PenMove.Mouse.oPt.x)),
        //左上角的X
        Y1 = FindMin(PenMove.Mouse.oPt.y, PenMove.Mouse.oPt.y + (PenMove.Mouse.nPt.y - PenMove.Mouse.oPt.y)),
        //左上角的Y
        X2 = FindMax(PenMove.Mouse.oPt.x, PenMove.Mouse.oPt.x + (PenMove.Mouse.nPt.x - PenMove.Mouse.oPt.x)),
        //右下角的X
        Y2 = FindMax(PenMove.Mouse.oPt.y, PenMove.Mouse.oPt.y + (PenMove.Mouse.nPt.y - PenMove.Mouse.oPt.y)); //右下角的Y

    colorPen.LineList.map(function (res) {
        if (res.page == MainObj.NowPage) {
            if (res.BrushType == 'arbitrarily') {
                $(res.points).each(function () {
                    var Xpoint = this.X;
                    var Ypoint = this.Y;

                    if (Xpoint >= X1 && Xpoint <= X2 && Ypoint >= Y1 && Ypoint <= Y2) {
                        PenMove.SelLine.push(res.id);
                        return false;
                    }
                });
            } else if (res.BrushType == 'line' || res.BrushType == 'highlighter') {
                var lineX1 = res.points[0].X,
                    lineY1 = res.points[0].Y,
                    lineX2 = res.points[1].X,
                    lineY2 = res.points[1].Y;

                if (!(FindMin(lineX1, lineX2) > X2 || FindMax(lineX1, lineX2) < X1 || FindMin(lineY1, lineY2) > Y2 || FindMax(lineY1, lineY2) < Y1)) {
                    PenMove.SelLine.push(res.id);
                }
            } else if (res.BrushType == "rect" || res.BrushType == "circle") {
                var left = res.points[0].X;
                var top = res.points[0].Y;
                var right = res.object.width * MainObj.Scale + left;
                var down = res.object.height * MainObj.Scale + top;

                if (!(FindMin(left, right) > X2 || FindMax(left, right) < X1 || FindMin(top, down) > Y2 || FindMax(top, down) < Y1)) {
                    PenMove.SelLine.push(res.id);
                }
            }
        }
    });

    if (PenMove.SelLine.length > 0) {
        PenMove.SelLine.filter(function (element, index, arr) {
            return arr.indexOf(element) === index;
        });
        MainEaselJS.PenShape.addEventListener("mousedown", Penmousedown);
        MainEaselJS.PenShape.addEventListener("pressmove", Penpressmove);
        MainEaselJS.PenShape.addEventListener("pressup", Penpressup);
    } else {
        $('#canvasMove').remove();
    }

    MainEaselJS.Drawstage.removeEventListener("stagemousedown", MoveMouseDown);
    MainEaselJS.Drawstage.removeEventListener("stagemousemove", MoveMouseMove);
    MainEaselJS.Drawstage.removeEventListener("stagemouseup", MoveMouseUp);
    MainEaselJS.Drawstage.update();
}