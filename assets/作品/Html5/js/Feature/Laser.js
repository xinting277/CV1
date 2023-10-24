var LaserObj = {
    Stage: null,
    Container: null,
    Shape: null,
    Enable: false,
    WidthEnable: false,
    MousePoint: {
        opt: null,
        ompt: null,
        npt: null,
        nmpt: null
    },
    Color: "rgb(255, 0, 0)",
    Width: 9,
    Opacity: 1,
    TimeOne: 2000,
    TimeTwo: 500,
    TimeThree: 250
}

function LaserInit() {
    LaserObj.Stage = StageCanvas('canvasLaser', $(window).width(), $(window).height());

    createjs.Ticker.on("tick", LaserObj.Stage);

    LaserObj.Container = new createjs.Container();
    LaserObj.Stage.addChild(LaserObj.Container);

    LaserObj.Stage.addEventListener("stagemousedown", LaserMouseDown);
    LaserObj.Stage.addEventListener("stagemouseup", LaserMouseUp);
    LaserObj.Stage.update();

    return LaserObj.Stage;
}

function LaserMouseDown() {
    if (LaserObj.Enable) {
        LaserObj.MousePoint.opt = new createjs.Point(LaserObj.Stage.mouseX, LaserObj.Stage.mouseY)
        LaserObj.MousePoint.ompt = LaserObj.MousePoint.opt.clone();
    } else {
        var id = newguid();
        LaserObj.Shape = new createjs.Shape();
        LaserObj.Shape.name = id;

        LaserObj.Shape.graphics.clear()
            .setStrokeStyle(LaserObj.Width, 1, 1)
            .beginStroke(LaserObj.Color)
            .moveTo(LaserObj.Stage.mouseX, LaserObj.Stage.mouseY);

        LaserObj.Container.addChild(LaserObj.Shape);
    }

    LaserObj.Stage.addEventListener("stagemousemove", LaserMouseMove);
    LaserObj.Stage.update();
}

function LaserMouseMove() {
    if (LaserObj.Enable) {
        var id = newguid();

        LaserObj.MousePoint.nmpt = new createjs.Point(LaserObj.MousePoint.opt.x + LaserObj.Stage.mouseX >> 1, LaserObj.MousePoint.opt.y + LaserObj.Stage.mouseY >> 1);

        LaserObj.Shape = new createjs.Shape();
        LaserObj.Shape.name = id;

        if (LaserObj.WidthEnable) {
            LaserObj.Shape.graphics.clear();
            var Strokecmd = LaserObj.Shape.graphics.setStrokeStyle(LaserObj.Width, 1, 1).command;
            LaserObj.Shape.graphics.beginStroke(LaserObj.Color)
                .moveTo(LaserObj.MousePoint.nmpt.x, LaserObj.MousePoint.nmpt.y)
                .curveTo(LaserObj.MousePoint.opt.x, LaserObj.MousePoint.opt.y, LaserObj.MousePoint.ompt.x, LaserObj.MousePoint.ompt.y);

            createjs.Tween.get(Strokecmd)
                .wait(LaserObj.TimeThree)
                .to({ width: 0, visible: false }, LaserObj.TimeThree, createjs.Ease.circIn)
                .call(handleComplete, null, LaserObj.Shape);
        } else {
            LaserObj.Shape.graphics.clear()
                .setStrokeStyle(LaserObj.Width, 1, 1)
                .beginStroke(LaserObj.Color)
                .moveTo(LaserObj.MousePoint.nmpt.x, LaserObj.MousePoint.nmpt.y)
                .curveTo(LaserObj.MousePoint.opt.x, LaserObj.MousePoint.opt.y, LaserObj.MousePoint.ompt.x, LaserObj.MousePoint.ompt.y);

            createjs.Tween.get(LaserObj.Shape)
                .to({ alpha: 1, visible: false }, LaserObj.TimeTwo, createjs.Ease.linear)
                .call(handleComplete);
        }

        LaserObj.MousePoint.opt.x = LaserObj.Stage.mouseX;
        LaserObj.MousePoint.opt.y = LaserObj.Stage.mouseY;

        LaserObj.MousePoint.ompt.x = LaserObj.MousePoint.nmpt.x;
        LaserObj.MousePoint.ompt.y = LaserObj.MousePoint.nmpt.y;

        LaserObj.Container.addChild(LaserObj.Shape);
    } else {
        LaserObj.Shape.graphics
            .lineTo(LaserObj.Stage.mouseX, LaserObj.Stage.mouseY);
    }

    LaserObj.Stage.update();
}

function LaserMouseUp() {

    if (!LaserObj.Enable) {
        createjs.Tween.get(LaserObj.Shape)
            .to({ alpha: 0 }, LaserObj.TimeOne, createjs.Ease.linear)
            .call(handleComplete);
    }

    LaserObj.Stage.removeEventListener("stagemousemove", LaserMouseMove);
    LaserObj.Stage.update();
}

function handleComplete(obj) {
    LaserObj.Container.removeChild(this);
}