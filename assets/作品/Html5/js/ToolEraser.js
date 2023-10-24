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

        // cxt.globalCompositeOperation = 'copy'; //只顯示新畫的圖

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

    //刪除畫筆
    colorPen.LineList.map(function (res) {
        if (res.page == MainObj.NowPage) {
            if (res.BrushType == 'arbitrarily') {
                $(res.points).each(function () {
                    //若是線的其中一點座標有在橡皮擦的範圍內，則記錄到Obj裡

                    var Xpoint = this.X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                    var Ypoint = this.Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);

                    if (Xpoint >= X1 && Xpoint <= X2 && Ypoint >= Y1 && Ypoint <= Y2) {
                        Obj.push(res.id);
                    }
                });
            } else if (res.BrushType == 'line') {
                var lineX1 = res.points[0].X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL),
                    lineY1 = res.points[0].Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT),
                    lineX2 = res.points[1].X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL),
                    lineY2 = res.points[1].Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);

                if (!(FindMin(lineX1, lineX2) > X2 || FindMax(lineX1, lineX2) < X1 || FindMin(lineY1, lineY2) > Y2 || FindMax(lineY1, lineY2) < Y1)) {
                    Obj.push(res.id);
                }
            } else if (res.BrushType == "rect" || res.BrushType == "circle") {
                var left = res.points[0].X * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                var top = res.points[0].Y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                var right = res.object.width * MainObj.Scale * ToolBarList.ZoomScale + left;
                var down = res.object.height * MainObj.Scale * ToolBarList.ZoomScale + top;
                if (!(FindMin(left, right) > X2 || FindMax(left, right) < X1 || FindMin(top, down) > Y2 || FindMax(top, down) < Y1)) {
                    Obj.push(res.id);
                }
            }
        }
    });

    var boardLine = [];
    var boardText = [];

    // 刪除手寫白板&白板
    canvasboard.saveList.map(function (res, index) {
        res.points.map(function (p) {
            //若是線的其中一點座標有在橡皮擦的範圍內，則記錄到Obj裡

            if (
                p.x + $('.' + canvasboard.style).offset().left > X1 &&
                p.x + $('.' + canvasboard.style).offset().left < X2 &&
                p.y + $('.' + canvasboard.style).offset().top > Y1 &&
                p.y + $('.' + canvasboard.style).offset().top < Y2
            ) {
                boardLine.push(index);
            }
        });
    });

    //刪除白板文字
    canvasboard.textList.map(function (res, index) {
        if (
            res.left + $('.whiteboard-texts').offset().left > X1 &&
            res.left + $('.whiteboard-texts').offset().left < X2 &&
            res.top + $('.whiteboard-texts').offset().top > Y1 &&
            res.top + $('.whiteboard-texts').offset().top < Y2
        ) {
            boardText.push(index);
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
    FindWidget(Obj, Point, Recoding.SaveList);
    FindWidget(Obj, Point, ToolBarList.searchWeb);
    FindWidget(Obj, Point, hyperLink.saveList);
    FindWidget(Obj, Point, fileObj.saveList);
    FindWidget(Obj, Point, comment.saveList);

    if (Obj.length > 0 || boardLine.length > 0 || boardText.length > 0) {
        confirmShow('是否確定刪除物件', function (res) {
            if (res) {

                if (boardLine.length > 0) {
                    //刪除白版的線
                    boardLine.map(function (res) {
                        if (canvasboard.saveList[res]) {
                            delete canvasboard.saveList[res];
                        }
                    });
                    replyCavnasboard();
                }
                if (boardText.length > 0) {
                    boardText.map(function (res) {
                        if (canvasboard.textList[res]) {
                            replyTextboard(canvasboard.textList[res].id);
                            delete canvasboard.textList[res];
                        }
                    });
                }

                //一次刪除有框到的線
                var temp = [];
                for (var objid = 0; objid < Obj.length; objid++) {

                    $('#' + Obj[objid]).remove();

                    DeleteList(Obj, colorPen.LineList, objid, temp); //畫筆             
                    DeleteList(Obj, txtNote.SaveList, objid, temp); //文字便利貼
                    DeleteList(Obj, txtCanvas.SaveList, objid, temp); //便利貼
                    DeleteList(Obj, InsertImg.SaveList, objid, temp); //插入圖片
                    DeleteList(Obj, Recoding.SaveList, objid, temp); //錄音
                    DeleteList(Obj, ToolBarList.searchWeb, objid, temp); //搜外網
                    DeleteList(Obj, hyperLink.saveList, objid, temp); //超連結
                    DeleteList(Obj, fileObj.saveList, objid, temp); //檔案
                    DeleteList(Obj, comment.saveList, objid, temp); //畫線註記

                    SaveCanvas();
                    SaveNote();

                    removeComment(Obj[objid]);
                }
                MainObj.saveList.push(temp);
                $('#recovery').css('background-image', 'url("ToolBar/recoverybefore.png")');
                if (MainObj.saveList.length > 3) {
                    MainObj.saveList.splice(0, 1);
                }
                changeAllBtnToFalse();
                recoveryLight();
            }
        })
    }

    // $('#canvasEraser').remove();
    var cxt = canvas.getContext('2d');
    cxt.clearRect(0, 0, canvas.width, canvas.height);

    Eraser.Drag = false;
    Eraser.IsMove = false;
    GalleryStartMove();

    var syncXML = toSyncXML();
    var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
    rmcall(message);
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
                        left = obj.position.from.x * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                        top = obj.position.from.y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                        right = obj.position.to.x * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasL);
                        down = obj.position.to.y * MainObj.Scale * ToolBarList.ZoomScale + (ZoomList.IsZoom ? 0 : MainObj.CanvasT);
                    } else {
                        left = Number(obj.left.split('px')[0]) * ToolBarList.ZoomScale;
                        top = Number(obj.top.split('px')[0]) * ToolBarList.ZoomScale;
                        right = Number(obj.width.split('px')[0]) * ToolBarList.ZoomScale + left;
                        down = Number(obj.height.split('px')[0]) * ToolBarList.ZoomScale + top;
                    }

                    if (!(FindMin(left, right) > Point.X2 || FindMax(left, right) < Point.X1 || FindMin(top, down) > Point.Y2 || FindMax(top, down) < Point.Y1)) {
                        Obj.push(obj.id);
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
function DeleteList(obj, list, objid, temp) {
    for (var i = 0; i < list.length; i++) {
        //刪掉canvas之外，還要把原本有記錄到的刪掉
        if (list[i] != undefined) {
            if (list[i].id == obj[objid]) {
                var item = JSON.parse(JSON.stringify(list[i]));
                item.undo = 'remove';
                temp.push(item);
                list.splice(i, 1);
            }
        }
    }

}