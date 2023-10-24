// 文字彈跳視窗

var textBorderId = null;

function setTextPopup(obj) {
    NewCanvas(obj);
    var canvas = $('#canvas')[0];
    canvas.id = obj.Identifier;
    canvas.width = obj.Width * MainObj.Scale;
    canvas.height = obj.Height * MainObj.Scale;
    $(canvas).css({
        'left': obj.Left * MainObj.Scale + MainObj.CanvasL,
        'top': obj.Top * MainObj.Scale + MainObj.CanvasT
    })
    var cxt = canvas.getContext('2d');
    drawButtonImage(obj, cxt, canvas.width, canvas.height);
    $(canvas).click(function (e) {
        e.preventDefault();
        if ($('#div' + obj.Identifier)[0]) {
            $('#div' + obj.Identifier).remove();
            return;
        }
        var btnSize = 36;

        var div = document.createElement('div');
        div.id = 'div' + obj.Identifier;
        $('#HamastarWrapper').append(div);
        $(div)
            .css({
                'position': 'absolute',
                'border-style': 'solid',
                'border-color': obj.ViewBorderBrush || '#ffff00',
                'border-width': btnSize + 'px 3px 3px 3px',
                'width': obj.Position.W * MainObj.Scale * ToolBarList.ZoomScale,
                'height': obj.Position.H * MainObj.Scale * ToolBarList.ZoomScale - btnSize,
                'left': obj.Position.X * MainObj.Scale * ToolBarList.ZoomScale + MainObj.CanvasL + MainObj.dragCanvasPosition.left,
                'top': obj.Position.Y * MainObj.Scale * ToolBarList.ZoomScale + MainObj.CanvasT + MainObj.dragCanvasPosition.top
            })
            .addClass('textPopup')
            .attr('Identifier', obj.Identifier)
            .attr({
                'tempwidth': obj.Position.W * MainObj.Scale,
                'tempheight': obj.Position.H * MainObj.Scale,
                'left': obj.Position.X * MainObj.Scale + MainObj.CanvasL,
                'top': obj.Position.Y * MainObj.Scale + MainObj.CanvasT
            })

        var title = document.createElement('label');
        $(div).append(title);
        title.id = 'title' + obj.Identifier;
        $(title).text(obj.Title);
        $(title).css({
            'position': 'absolute',
            'top': -btnSize,
            'font-size': btnSize,
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap'
        })

        var contentDiv = document.createElement('div');
        contentDiv.id = 'text' + obj.Identifier;
        $(div).append(contentDiv);
        $(contentDiv).css({
            'width': '100%',
            'height': '100%',
            'background-color': '#fff',
            'overflow': 'auto'
        });
        contentDiv.innerHTML = obj.Content;

        $('#div' + obj.Identifier)
            .draggable({
                scroll: false
            }).resizable({
                minHeight: 100,
                minWidth: 100,
                start: function () {
                    $(window).off("resize", resizeInit);
                },
                resize: function () {
                    // CKEDITOR.instances['text' + obj.Identifier].resize($('#div' + obj.Identifier).width(), $('#div' + obj.Identifier).height());
                    $('#title' + obj.Identifier).css('width', $('#div' + obj.Identifier).width());
                },
                stop: function () {
                    $(window).resize(resizeInit);
                }
            });



        setTextCloseBtn(div, obj.Identifier, btnSize);
        setTextEditBtn(div, obj, btnSize);
        // setTextBorderBtn(div, obj.Identifier, btnSize, obj.ViewBorderBrush || '#ffff00');
    });
}

// 文字彈跳視窗關閉按鈕設置
function setTextCloseBtn(div, id, btnSize) {
    var closeBtn = document.createElement('div');
    closeBtn.id = 'closeBtn';
    $(div).append(closeBtn);
    var closeImg = new Image();
    $(closeBtn).append(closeImg);
    closeImg.onload = function () {
        closeImg.width = btnSize;
        closeImg.height = btnSize;
    }
    $(closeBtn).css({
        'top': -btnSize
    });
    closeImg.src = 'ToolBar/txtclose.png';
    $(closeBtn).click(function (e) {
        e.preventDefault();
        $('#div' + id).remove();
    })
}

// 文字彈跳視窗編輯按鈕設置
function setTextEditBtn(div, obj, btnSize) {
    var narrowBtn = document.createElement('div');
    narrowBtn.id = 'narrowBtn';
    $(div).append(narrowBtn);
    var narrowImg = new Image();
    $(narrowBtn).append(narrowImg);
    narrowImg.onload = function () {
        narrowImg.width = btnSize;
        narrowImg.height = btnSize;
        $(narrowBtn).css({
            'right': narrowImg.width,
            'top': -btnSize
        });
    }
    narrowImg.src = 'ToolBar/txtpen.png';
    $(narrowBtn).click(function (e) {
        e.preventDefault();
        textPopupNoteLayer(obj);
        $('#div' + obj.Identifier).remove();
    })
}

function textPopupNoteLayer(obj) {

    var ID = newguid();

    var divBox = document.createElement('div');
    $('#HamastarWrapper').append(divBox);
    divBox.id = ID;
    $(divBox).attr('class', 'NoteBox');
    $(divBox).addClass('txtNote');

    if (ToolBarList.AddWidgetState == 'IRStxtnote') {
        $(divBox).addClass('IRSnote');
    }

    var div = document.createElement('div');
    $(divBox).append(div);
    div.id = 'Div' + ID;
    $(div).draggable({
        cancel: '.cke',
        //如果有移動，則不觸發click事件
        stop: function (event, ui) {
            $(this).addClass('noclick');
            FindBoundary(ui, div);

            SaveNote();

            var syncXML = toSyncXML();
            var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
            rmcall(message);

        }
    }).resizable({
        minHeight: 300,
        minWidth: 500,
        alsoResize: '#cke_textArea' + ID + '>.cke_inner>.cke_contents',
        start: function () {
            $(window).off("resize", resizeInit);
            $('.cke').removeAttr('style')
            $('.cke').css('pointer-events', 'none');
        },
        stop: function (event, ui) {
            $(window).resize(resizeInit);
            $('.cke').css('pointer-events', 'auto');
        }
    });

    NewCanvas();
    var canvas = $('#canvas')[0];
    $(div).append(canvas);
    var cxt = canvas.getContext('2d');
    canvas.id = 'txtNote' + ID;
    $(canvas).attr('class', 'noteCanvas');


    var img = new Image();
    var Left = $('#div' + obj.Identifier).offset().left,
        Top = $('#div' + obj.Identifier).offset().top,
        width = $('#div' + obj.Identifier).width(),
        height = $('#div' + obj.Identifier).height();
    img.onload = function () {
        canvas.width = width < 500 ? 500 : width;
        canvas.height = img.height;

        $('#' + div.id).css({
            'position': 'absolute',
            'width': canvas.width,
            // 'height': height,
            'left': Left,
            'top': Top,
            'display': 'flex',
            'flex-direction': 'column',
            'border': '3px solid #fdecac',
            'background-color': '#fdecac',
            'z-index': 100
        })

        $(canvas).css({
            'position': 'relative',
            'background-color': '#fdecac'
        });

        txtCloseSetting(div, ID);
        txtNarrowLayer(div, ID);
        txtNoteBackgroundBtn(div, ID);

        NoteNarrowSmall(divBox, img, ID);

        //文字框
        var textArea = document.createElement('textarea');
        textArea.id = 'textArea' + ID;
        $(textArea).attr('class', 'textArea');
        $(div).append(textArea);
        
        try {
            var editor = CKEDITOR.replace(textArea.id, {
                on: {
                    instanceReady: function (e) {
                        MainObj.saveList.push({
                            page: MainObj.NowPage,
                            id: ID,
                            type: 'txtNote',
                            width: $('#Div' + ID).width(),
                            height: $('#Div' + ID).height(),
                            top: (Top - MainObj.CanvasT) / MainObj.Scale + 'px',
                            left: (Left - MainObj.CanvasL) / MainObj.Scale + 'px',
                            value: '',
                            StickyViewVisibility: FindStickyViewVisibility(ID),
                            action: 'add'
                        });
                        $('#recovery').css('background-image', 'url("ToolBar/recoverybefore.png")');
                        if (MainObj.saveList.length > 3) {
                            MainObj.saveList.splice(0, 1);
                        }
                        editor.on('resize', function (res) {
                            // textAreaSetting(res.data.outerWidth, canvas, div, img);
                        });
                        CKEDITOR.instances['textArea' + ID].resize((width < 500 ? 500 : width), (height - canvas.height));
                        editor.setData(obj.Content);
                        SaveNote();
    
                        $('#cke_textArea' + ID + '>.cke_inner>.cke_contents>.cke_wysiwyg_frame').addClass('ck-' + ID);
    
                        e.editor.document.on('keyup', function (event) {
                            setTimeout(function () {
                                if (isUndo) {
                                    isUndo--;
                                    return;
                                }
                                saveUndoNote(ID, 'edit');
                                SaveNote();
                            }, 100);
                        })
                    }
                },
                startupFocus : true
            });
        } catch (error) {
            console.log(error);
        }

        SaveNote();

        var syncXML = toSyncXML();
        var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
        rmcall(message);


    }
    img.src = 'ToolBar/txtbgbtn.png';
}