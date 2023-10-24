var markList = [];

// 註記物件設置
function SetMarkObject(obj) {
    var scale = MainObj.Scale;
    var mark = document.createElement("textarea");
    mark.id = obj.Identifier;
    mark.width = obj.Width * scale;
    mark.height = obj.height * scale;
    mark.value = obj.MarkContent;
    $(mark).attr('class', 'canvasObj');
    $(mark).addClass('noFocus');
    $(mark).addClass('markObj');
    $('#HamastarWrapper').append(mark);
    $(mark).css({
        'position': 'absolute',
        'width': obj.Width * scale,
        'height': obj.Height * scale,
        'left': obj.Left * scale + MainObj.CanvasL,
        'top': obj.Top * scale + MainObj.CanvasT,
        'border': 'unset',
        'background-color': 'transparent',
        'resize': 'none'
    })
    $(mark).on('keyup', function () {
        SaveMark();
    });
    if (obj != undefined) {
        $(mark).css({
            'transform': 'rotate(' + obj.Rotate + 'deg)'
        });
    }

    if (markList.length) {
        for (var i = 0; i < markList.length; i++) {
            if (markList[i]) {
                if (markList[i].id == obj.Identifier) {
                    mark.value = obj.MarkContent;
                }
            }
        }
    }
}

//變更註記內容
function ReplyMark(page) {
    if (markList.length) {
        for (var i = 0; i < markList.length; i++) {
            if (markList[i]) {
                if (Number(markList[i].page) == Number(page)) {
                    for (var a = 0; a < $('.markObj').length; a++) {
                        if (markList[i].id == $('.markObj')[a].id) {
                            $('.markObj')[a].value = markList[i].value;
                        }
                    }
                }
            }
        }
    }
}

// 註記內容儲存
function SaveMark() {
    if (markList.length) {
        for (var x = 0; x < markList.length; x++) {
            if (markList[x]) {
                if (Number(markList[x].page) == Number(MainObj.NowPage)) {
                    delete markList[x];
                }
            }
        }
    }

    for (var i = 0; i < $('.markObj').length; i++) {
        var mark = $('.markObj')[i];
        markList.push({
            page: MainObj.NowPage,
            id: mark.id,
            type: 'mark',
            value: mark.value
        })
    }
}