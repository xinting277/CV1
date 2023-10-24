//文字便利貼

var txtNote = {
  SaveList: [],
  selectedNoteBgId: null,
  selectedCommentBgId: null
};




function txtNoteLayer() {
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
    start: function (event) {
      noteToLast(ID);
    },
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
      $('.cke').css('pointer-events', 'none');
    },
    stop: function (event, ui) {
      $(window).resize(resizeInit);
      $('.cke').css('pointer-events', 'auto');
      SaveNote();
    }
  }).click(function () {
    noteToLast(ID);
  })

  NewCanvas();
  var canvas = $('#canvas')[0];
  $(div).append(canvas);
  var cxt = canvas.getContext('2d');
  canvas.id = 'txtNote' + ID;
  $(canvas).attr('class', 'noteCanvas');

  var Left = event.type == 'touchstart' ? event.targetTouches[0].pageX : (event.clientX ? event.clientX : event.originalEvent.clientX);
  var Top = event.type == 'touchstart' ? event.targetTouches[0].pageY : (event.clientY ? event.clientY : event.originalEvent.clientY);


  var img = new Image();
  img.onload = function () {
    canvas.width = 500;
    canvas.height = img.height;

    // var newPosition = txtPosition(Left, Top, canvas);
    // Left = newPosition[0];
    // Top = newPosition[1];

    $('#' + div.id).css({
      'position': 'absolute',
      'width': canvas.width,
      'left': Left,
      'top': Top,
      'display': 'flex',
      'flex-direction': 'column',
      'border': '3px solid #fdecac',
      'background-color': '#fdecac',
      'z-index': 99
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
              width: ($('#Div' + ID).width() / MainObj.Scale) + 'px',
              height: ($('#Div' + ID).height() / MainObj.Scale) + 'px',
              top: (Top - MainObj.CanvasT) / MainObj.Scale + 'px',
              left: (Left - MainObj.CanvasL) / MainObj.Scale + 'px',
              value: '',
              StickyViewVisibility: FindStickyViewVisibility(ID),
              undo: 'add'
            });
            $('#recovery').css('background-image', 'url("ToolBar/recoverybefore.png")');
            if (MainObj.saveList.length > 3) {
              MainObj.saveList.splice(0, 1);
            }
            SaveNote();
            editor.on('resize', function (res) {
              textAreaSetting(res.data.outerWidth, canvas, div, img);
            });

            editor.on('focus', function (res) {
              noteToLast(ID);
            });

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
        startupFocus: true
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

// 儲存便利貼還原資訊
function saveUndoNote(id, undo) {
  if (MainObj.saveList.length) {
    if (MainObj.saveList[MainObj.saveList.length - 1].id == id && MainObj.saveList[MainObj.saveList.length - 1].value == CKEDITOR.instances['textArea' + id].getData()) return;
  }

  var left = ($('#Div' + id).offset().left - MainObj.CanvasL) / MainObj.Scale;
  var top = ($('#Div' + id).offset().top - MainObj.CanvasT) / MainObj.Scale;
  MainObj.saveList.push({
    page: MainObj.NowPage,
    id: id,
    type: 'txtNote',
    width: ($('#Div' + id).width() / MainObj.Scale) + 'px',
    height: ($('#Div' + id).height() / MainObj.Scale) + 'px',
    top: top + 'px',
    left: left + 'px',
    value: CKEDITOR.instances['textArea' + id].getData(),
    StickyViewVisibility: FindStickyViewVisibility(id),
    undo: undo
  });
  $('#recovery').css('background-image', 'url("ToolBar/recoverybefore.png")');
  if (MainObj.saveList.length > 3) {
    MainObj.saveList.splice(0, 1);
  }
}

//關閉按鈕設置
function txtCloseSetting(div, id) {

  //關閉
  var closeBtn = document.createElement('div');
  closeBtn.id = 'closeBtn';
  $(div).append(closeBtn);
  var closeImg = new Image();
  $(closeBtn).append(closeImg);
  closeImg.onload = function () {
    closeImg.width = 36;
    closeImg.height = 36;
  }
  closeImg.src = 'ToolBar/txtclose.png';

  $(closeBtn).click(function (e) {
    e.preventDefault();
    confirmShow('是否確定刪除物件?', function (res) {
      if (res) {
        $('#' + id).remove();

        for (var note = 0; note < txtNote.SaveList.length; note++) {
          //刪掉canvas之外，還要把原本有記錄到txtNote.SaveList的文字便利貼刪掉
          if (txtNote.SaveList[note] != undefined) {
            if (txtNote.SaveList[note].id == id) {
              // delete txtNote.SaveList[note];
              txtNote.SaveList.splice(note, 1);
            }
          }
        }

        for (var can = 0; can < txtCanvas.SaveList.length; can++) {
          //刪掉canvas之外，還要把原本有記錄到txtCanvas.SaveList的便利貼刪掉
          if (txtCanvas.SaveList[can] != undefined) {
            if (txtCanvas.SaveList[can].id == id) {
              delete txtCanvas.SaveList[can];
              for (var i = 0; i < txtCanvas.canvasList.length; i++) {
                if (txtCanvas.canvasList[i]) {
                  if (txtCanvas.canvasList[i][0].id == id) {
                    delete txtCanvas.canvasList[i];
                  }
                }
              }
            }
          }
        }

        SaveCanvas();
        SaveNote();

        var syncXML = toSyncXML();
        var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
        rmcall(message);
      }
    })
  });
}

//縮小按鈕設置
function txtNarrowLayer(div, id) {
  //縮小
  var narrowBtn = document.createElement('div');
  narrowBtn.id = 'narrowBtn';
  $(div).append(narrowBtn);
  var narrowImg = new Image();
  $(narrowBtn).append(narrowImg);
  narrowImg.onload = function () {
    narrowImg.width = 36;
    narrowImg.height = 36;
    $(narrowBtn).css('right', narrowImg.width);
  }
  narrowImg.src = 'ToolBar/txtnarrow.png';

  txtNarrowSetting(narrowBtn, id);
}

//background color button設置
function txtNoteBackgroundBtn(div, id, color) {
  if (!color) {
    color = '#fdecac';
  }
  var narrowBtn = document.createElement('div');
  narrowBtn.id = 'narrowBtn';
  $(div).append(narrowBtn);
  var narrowImg = new Image();
  $(narrowBtn).append(narrowImg);
  narrowImg.onload = function () {
    narrowImg.width = 36;
    narrowImg.height = 36;
    $(narrowBtn).css('right', 36 * 2);
  }
  narrowImg.src = 'ToolBar/palette_icon.png';

  $(narrowBtn).click(function (e) {
    e.preventDefault();
    $('.noteBgcolor')[0].value = color;
    $('.noteBgcolor').css('background-color', color);
    $('.bgColorPickerNote').toggle();
    txtNote.selectedNoteBgId = id;
  })
}

// 變換文字便利貼背景色
function changeNoteBg() {
  $('.bgColorPickerNote').toggle();
  $('#txtNote' + txtNote.selectedNoteBgId).css('background-color', $('.noteBgcolor')[0].value);
  $('#Div' + txtNote.selectedNoteBgId).css({
    'border': '3px solid ' + $('.noteBgcolor')[0].value,
    'background-color': $('.noteBgcolor')[0].value
  });
  $('.color-' + txtNote.selectedNoteBgId).css('background-color', $('.noteBgcolor')[0].value);

  txtNote.SaveList.map(function (x) {
    if (x.id == txtNote.selectedNoteBgId) {
      x.color = $('.noteBgcolor')[0].value;
    }
  });
}

//文字便利貼小圖設置
function NoteNarrowSmall(div, img, id) {
  //note小圖
  var narrowDiv = document.createElement('div');
  $(div).append(narrowDiv);
  narrowDiv.id = 'narrowDiv' + id;
  $(narrowDiv).attr('class', 'narrowDiv');
  $(narrowDiv).css({
    'position': 'absolute',
    'width': 50,
    'height': 50,
    'z-index': 99,
    'cursor': 'pointer'
  })
  var smallImg = new Image();
  $(narrowDiv).append(smallImg);
  smallImg.onload = function () {
    smallImg.width = 50;
    smallImg.height = 50;
  }
  smallImg.src = 'ToolBar/paste2.png';
  $(narrowDiv).css({
    'display': 'none'
  });
  txtNarrowSetting(narrowDiv, id);
  $(narrowDiv).draggable({
    //如果有移動，則不觸發click事件
    stop: function (event, ui) {
      $(this).addClass('noclick');

      var left = ui.offset.left;
      var top = ui.offset.top;
      var width = 50;
      var height = 50;

      var canvasW = $('#CanvasGallery')[0].width + MainObj.CanvasL;
      var canvasH = $('#CanvasGallery')[0].height + MainObj.CanvasT;

      if (left < MainObj.CanvasL) {
        $(narrowDiv).css('left', MainObj.CanvasL);
      } else if (left + width > canvasW) {
        $(narrowDiv).css('left', canvasW - width);
      } else if (top < MainObj.CanvasT) {
        $(narrowDiv).css('top', MainObj.CanvasT);
      } else if (top + height > canvasH) {
        $(narrowDiv).css('top', canvasH - height);
      }

      $('#Div' + id).attr({
        'left': $(narrowDiv)[0].offsetLeft,
        'top': $(narrowDiv)[0].offsetTop
      }).css({
        'left': $(narrowDiv)[0].offsetLeft,
        'top': $(narrowDiv)[0].offsetTop
      })

      $(smallImg).attr({
        'left': ($(narrowDiv)[0].offsetLeft - MainObj.CanvasL) / ToolBarList.ZoomScale + MainObj.CanvasL,
        'top': ($(narrowDiv)[0].offsetTop - MainObj.CanvasT) / ToolBarList.ZoomScale + MainObj.CanvasT
      })

      SaveNote();

      var syncXML = toSyncXML();
      var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
      rmcall(message);
    }
  });
}

function noteToLast(id) {
  var last = $('#HamastarWrapper').children().last();
  if (last[0].id !== id) {
    $('#' + id).insertAfter($(last));

    try {
      var data = CKEDITOR.instances['textArea' + id].getData();
      CKEDITOR.instances['textArea' + id].destroy();
  
      CKEDITOR.replace('textArea' + id, {
        on: {
            instanceReady: function (e) {
                CKEDITOR.instances['textArea' + id].setData(data);
                $('#cke_textArea' + id).css({
                    height: '100%'
                });
                $('#cke_textArea' + id + ' .cke_inner').css({
                    height: '100%'
                });

                e.editor.document.on('keyup', function (event) {
                    setTimeout(function () {
                        if (isUndo) {
                            isUndo--;
                            return;
                        }
                        saveUndoNote(id, 'edit');
                        SaveNote();
                    }, 100);
                })
            }
        },
        startupFocus: true
    });
    } catch (error) {
      console.log(error);
    }
  }
}

//縮小點擊事件
function txtNarrowSetting(btn, id) {
  $(btn).click(function (e) {
    e.preventDefault();
    if ($('#narrowDiv' + id).hasClass('noclick')) {
      $('#narrowDiv' + id).removeClass('noclick');
    } else {
      noteToLast(id);
      if ($('#narrowDiv' + id).css('display') == 'none') {
        $('#narrowDiv' + id).css({
          'display': 'block',
          'left': $('#Div' + id).css('left'),
          'top': $('#Div' + id).css('top'),
        });
        $('#Div' + id).css('display', 'none');

      } else {
        $('#narrowDiv' + id).css('display', 'none');
        $('#Div' + id).css({
          'display': 'block',
          'left': $('#narrowDiv' + id).css('left'),
          'top': $('#narrowDiv' + id).css('top'),
        });
      }
    }
    SaveNote();
    SaveCanvas();

    var syncXML = toSyncXML();
    var message = '[scmd]' + Base64.encode('pgnt' + syncXML);
    rmcall(message);

  });
}

//文字框縮放
function textAreaSetting(width, canvas, div, img) {
  var cxt = canvas.getContext('2d');
  canvas.width = width;
  cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
  $('#' + div.id).css('width', width);
  // resizeCanvas(canvas, cxt);
}

//初始化
function txtNoteReset() {
  $('.NoteBox').remove();
}

//儲存note的資訊於txtNote.SaveList
function SaveNote() {

  if (ToolBarList.AddWidgetState == 'IRStxtnote') return;

  var list = {};
  var note = $('.NoteBox');

  if (txtNote.SaveList.length > 0) {
    txtNote.SaveList = txtNote.SaveList.filter(function (res) {
      if (res.page !== MainObj.NowPage) {
        return res;
      }
    });
    // for (var x = 0; x < txtNote.SaveList.length; x++) {
    //   if (txtNote.SaveList[x] != undefined) {
    //     if (txtNote.SaveList[x].page == MainObj.NowPage) {
    //       // delete txtNote.SaveList[x];
    //       txtNote.SaveList.splice(x, 1);
    //     }
    //   }
    // }
  }

  for (var i = 0; i < note.length; i++) {
    var tmp;
    if (FindStickyViewVisibility(note[i].id) == 'true') {
      var tmp = '#Div';
    } else {
      var tmp = '#narrowDiv';
    }

    var left = ($(tmp + note[i].id).offset().left - MainObj.CanvasL) / MainObj.Scale;
    var top = ($(tmp + note[i].id).offset().top - MainObj.CanvasT) / MainObj.Scale;
    list = {
      page: MainObj.NowPage,
      id: note[i].id,
      color: '#' + rgbToHex($('#Div' + note[i].id).css('background-color')),
      type: 'txtNote',
      width: ($('#Div' + note[i].id).width() / MainObj.Scale) + 'px',
      height: ($('#Div' + note[i].id).height() / MainObj.Scale) + 'px',
      top: top + 'px',
      left: left + 'px',
      // value: note[i].value,
      value: CKEDITOR.instances['textArea' + note[i].id].getData(),
      StickyViewVisibility: FindStickyViewVisibility(note[i].id)
    };

    txtNote.SaveList.push(list);
  }


}

//如有文字便利貼註記，從txtNote.SaveList取得
function ReplyNote(page) {

  $('.txtNote').remove();

  if (!isHiddenNote) {
    $(txtNote.SaveList).each(function () {

      if (this != undefined) {
        if (this.page == page) {
          reSetNote(this);
        }
      }
    })
  }
}

function reSetNote(obj) {
  if ($('#' + obj.id)[0] != undefined) {
    $('#' + obj.id).remove();
  }

  var ID = obj.id;
  var note = obj;

  var divBox = document.createElement('div');
  $('#HamastarWrapper').append(divBox);
  divBox.id = ID;
  $(divBox).attr('class', 'NoteBox');
  $(divBox).addClass('txtNote');

  var div = document.createElement('div');
  $(divBox).append(div);
  div.id = 'Div' + ID;
  $(div).draggable({
    cancel: '.cke',
    //如果有移動，則不觸發click事件
    start: function (event) {
      noteToLast(ID);
    },
    stop: function (event, ui) {
      $(obj).addClass('noclick');
      FindBoundary(ui, div);
      SaveNote();
    }
  }).resizable({
    minHeight: 300,
    minWidth: 500,
    alsoResize: '#cke_textArea' + ID + '>.cke_inner>.cke_contents',
    start: function () {
      $(window).off("resize", resizeInit);
      $('.cke').css('pointer-events', 'none');
    },
    stop: function (event, ui) {
      $(window).resize(resizeInit);
      $('.cke').css('pointer-events', 'auto');
      SaveNote();
    }
  }).click(function () {
    noteToLast(ID);
  });

  NewCanvas();
  var canvas = $('#canvas')[0];
  $(div).append(canvas);
  var cxt = canvas.getContext('2d');
  canvas.id = 'txtNote' + ID;
  $(canvas).attr('class', 'noteCanvas');

  var Left = (Number(note.left.split('px')[0]) * MainObj.Scale) + MainObj.CanvasL;
  var Top = (Number(note.top.split('px')[0]) * MainObj.Scale) + MainObj.CanvasT;
  var img = new Image();
  img.onload = function () {
    // canvas.width = Number(note.width.split('px')[0]) + 5;
    // canvas.height = img.height;
    var width = parseInt(note.width) * MainObj.Scale;
    canvas.width = width > 500 ? width : 500;
    canvas.height = img.height;
    // resizeCanvas(canvas, cxt);
    // cxt.drawImage(img, 0, 0, canvas.width, canvas.height);
    $('#' + div.id).css({
      'position': 'absolute',
      'width': canvas.width,
      // 'height': canvas.height,
      'left': Left,
      'top': Top,
      'display': 'flex',
      'flex-direction': 'column',
      'border': '3px solid ' + obj.color || '#fdecac',
      'background-color': obj.color || '#fdecac',
      'z-index': 99
    })

    $(canvas).css({
      'position': 'relative',
      'background-color': obj.color || '#fdecac'
    });

    txtCloseSetting(div, ID);
    txtNarrowLayer(div, ID);
    NoteNarrowSmall(divBox, img, ID);
    txtNoteBackgroundBtn(div, ID);

    //文字框
    var textArea = document.createElement('textarea');
    textArea.id = 'textArea' + ID;
    $(textArea).attr('class', 'textArea');
    $(div).append(textArea);

    setTimeout(function () {
      try {
        var editor = CKEDITOR.replace(textArea.id, {
          on: {
            instanceReady: function (e) {
              SaveNote();
              editor.on('resize', function (res) {
                textAreaSetting(res.data.outerWidth, canvas, div, img);
              })
              editor.on('focus', function (res) {
                noteToLast(ID);
              })
    
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
          startupFocus: true
        });
    
        CKEDITOR.instances[textArea.id].setData(note.value);
      } catch (error) {
        console.log(error);
      }
    });

    if (note.StickyViewVisibility == 'true') {
      $('#narrowDiv' + note.id).css('display', 'none');
      $('#Div' + note.id).css('display', 'flex');
    } else {
      $('#narrowDiv' + note.id).css({
        'display': 'block',
        'left': $('#Div' + note.id).css('left'),
        'top': $('#Div' + note.id).css('top'),
      });
      $('#Div' + note.id).css('display', 'none');
    }

    SaveNote();


  }
  img.src = 'ToolBar/txtbgbtn.png';
}

//由於文字便利貼及便利貼不能拖移超過書，因此要取得邊界位置
//若拖移超過邊界，則移動至最邊邊
function FindBoundary(obj, div) {
  var left = obj.offset.left;
  var top = obj.offset.top;
  var width = Number($(div).css('width').split('px')[0]) + 10;
  var height = Number($(div).css('height').split('px')[0]) + Number($($(div)[0].childNodes[3]).css('height').split('px')[0]) + 10;

  var canvasW = $('#CanvasGallery')[0].width + MainObj.CanvasL;
  var canvasH = $('#CanvasGallery')[0].height + MainObj.CanvasT;

  if (left < MainObj.CanvasL) {
    $(div).css('left', MainObj.CanvasL);
  } else if (left + width > canvasW) {
    $(div).css('left', canvasW - width);
  } else if (top < MainObj.CanvasT) {
    $(div).css('top', MainObj.CanvasT);
  } else if (top + height > canvasH) {
    $(div).css('top', canvasH - height);
  }
}