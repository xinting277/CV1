// 白板需要用到全域變數
var canvasboard = {
  saveList: [],
  textList: [],
  isMove: false,
  style: String
};


//首頁
function CustomIndex(custom) {
  //頁面目錄-書籤
  var JumpTab = $("#btnTab");
  //頁面目錄-章節
  var JumpChapter = $("#btnChapter");

  JumpChapter.remove();
  JumpTab.remove();
}

//工具列
function CustomToolBar() {
  //主工具列
  var ToolBar = $("#ToolBar");
  //主工具列Icon
  var ToolBarIcon = $("#ToolBarIcon");
  //輔助工具列
  var AssistToolBar = $("#AssistToolBar");
  //輔助工具列Icon
  var AssistToolBarIcon = $("#AssistToolBarIcon");
  //預設調色盤
  var DefaultColor = $("#DefaultColor");
  //客製化調色盤
  var CustomColor = $("#CustomColor");

  ToolBar.show();
  AssistToolBar.remove();
  DefaultColor.show();
}

function CustomPen() {
  //客製化畫筆
  var Pen = false;
  //畫筆寬度(4 ~ 24)
  var PenWidth = 4;
  //畫筆透明度(0 ~ 1)
  var PenOpacity = 1;

  $("#chance_slider").val(PenWidth);
  $("#chance_sliderop").val(PenOpacity * 10);
  colorPen.Width = PenWidth;
  colorPen.Opacity = PenOpacity;
}

/**顯示補助工具列 */
function toggleToolBar(toolBarList, isNav) {
  $(".note-layout").css("display", "none");
  $(".note-border").empty();

  if (isNav) {
    $(".note-border").css({
      "flex-wrap": "wrap",
      width: "205px",
      padding: "10px",
    });
  } else {
    $(".note-border").css({
      "flex-wrap": "nowrap",
      width: "auto",
      padding: "0",
    });
  }

  $(toolBarList).each(function (e) {
    for (var i = 0; i < tempToolBars[0].btns.length; i++) {
      if (this.id == tempToolBars[0].btns[i].id) {
        if (!ReceiveList) {
          // 本機
          /*if (
           // this.id == "uploadEdit" ||
            //this.id == "uploadFile" ||
            //this.id == "downloadEdit"
          ) {
            return;
          }*/
        }

        var that = tempToolBars[0].btns[i];

        var div = document.createElement("div");

        // 如果是屬於四角放大內成員，類別要加上另一個
        if (
          this.id == "zoomLeftTop" ||
          this.id == "zoomRightTop" ||
          this.id == "zoomLeftBottom" ||
          this.id == "zoomRightBottom"
        ) {
          $(div).addClass("note-cont2");
        } else {
          $(div).addClass("note-cont");
        }

        var span = document.createElement("span");
        var img = document.createElement("img");
        img.id = that.id;
        // span.id = that.id;
        // $(span).addClass(that.id);
        img.src = that.beforeStyle["background-image"];
        // $(span).css('background-image':that.beforeStyle['background-image']);
        // span.style.backgroundImage = that.beforeStyle['background-image'];
        // $(span).css('background-image', that.beforeStyle['background-image']);
        // $(span).append(img)
        $(div).append(img);
        // $(div).append(span);
        var label = document.createElement("label");
        $(label).text(that.beforespanTextName);
        $(div).append(label);

        $(div).click(function (e) {
          e.preventDefault();
          if (!that.afterClick) {
            CommandToWPF(
              "UserOperator",
              JSON.stringify({
                message: that.beforespanTextName,
                page: MainObj.NowPage + 1,
              })
            );
          }
          that.action();
        });

        $(".note-border").append(div);

        if (isNav) {
          $(div).addClass(this.class);
        }

        if (that.id == "zoomOut") {
          $(span).css("background-image", that.afterStyle["background-image"]);
          that.afterClick = true;
        }

        if (that.id == "palm") {
          if (ToolBarList.ZoomScale == 1) {
            $(span).css("background-image", "url(ToolBar/arrow.png)");
          } else {
            $(span).css("background-image", "url(ToolBar/palmbefore.png)");
          }
        }

        if (that.id == "textSearch") {
          if (TextlocationList != "") {
            $(span).css("background-image", "url(ToolBar/btnSearchBefore.png)");
            that.beforeStyle = {
              "background-image": "url(ToolBar/btnSearchBefore.png)",
            };
          } else {
            $(span).css("background-image", "url(ToolBar/SearchNo.png)");
            that.beforeStyle = {
              "background-image": "url(ToolBar/SearchNo.png)",
            };
          }
        }

        if (that.id == "hiddenNote") {
          that.afterClick = isHiddenNote;
          $(span).css(
            "background-image",
            isHiddenNote
              ? "url(ToolBar/hiddenNoteAfter.png)"
              : "url(ToolBar/hiddenNoteBefore.png)"
          );
        }
      }
    }
  });
}


/**三民白板客製化功能 */
// 關閉白板
function closeWhiteboard() {
  changeAllBtnToFalse();
  toggleToolBar(treasureToolBar);

  $('.whiteboard-layout').css('display', 'none');

  $('.whiteboardPad').css('pointer-events', 'none'); //將選取功能關閉 但是圖式關閉
  whitheboardSetInitImg();

  // 將畫筆樣式恢復調色盤設定值(顏色、透明度、寬度)
  colorPen.Color = $('.colorStateBar >div')[0].style.backgroundColor;
  colorPen.Opacity = parseInt($('#chance_sliderop').val()) / 10;
  colorPen.Width = parseInt($('#chance_slider').val());
}

/** 白板文字欄設定按鈕 */
function closeTextConfigboard() {
  $('.textconfig-layout').css('display', 'none');
  $('.whiteboard-config-icon').css('display', 'none');
}

/**
 * 白板畫筆顏色調整
 * @param {*} PenColorObj 點選畫筆所屬的DOM物件
 */
function whiteboardStarDraw(PenColorObj) {

  colorPen.Color = PenColorObj.style.color;

  // 設定透明度
  colorPen.Opacity = 1;

  // 設定線條寬度
  colorPen.Width = 4

  // 筆刷樣式-直線
  colorPen.BrushType = "arbitrarily";
}

/**
 * 白板畫筆切換不同樣式
 * @param {*} object  DOM物件本體
 */
function whiteboardPenToggle(object) {
  if (object.attributes.active == undefined) {
    $('.whiteboardPad').css('pointer-events', 'auto');
    $('.whiteboard-texts').css('pointer-events', 'none');
    canvasboard.isMove = false;
    $('.whiteboard-move-icon').css('display', 'none');
    $('.whiteboard-config-icon').css('display', 'none');
    $('.textconfig-layout').css('display', 'none');
    $('.text-block').attr('disabled', false);
    // starDraw(object);
    // 設定白板畫筆樣式
    whiteboardStarDraw(object);
  } else {
    $('.whiteboardPad').css('pointer-events', 'none');

  }

  whiteboardChangImg(object);
}

// 白板文字切換
function whiteboardTextToggle(object) {
  if ($('.whiteboard-texts').css('pointer-events') == 'none' || canvasboard.isMove) {
    $('.whiteboard-texts').css('pointer-events', 'auto');
    $('.whiteboardPad').css('pointer-events', 'none');
    canvasboard.isMove = false;
    $('.whiteboard-move-icon').css('display', 'none');
    $('.whiteboard-config-icon').css('display', 'none');
    $('.textconfig-layout').css('display', 'none');
    $('.text-block').attr('disabled', false);
  } else {
    $('.whiteboard-texts').css('pointer-events', 'none');
  }
  whiteboardChangImg(object);
}

// 白板移動切換
function whiteboardMoveToggle(object) {
  canvasboard.isMove = !canvasboard.isMove;
  if (canvasboard.isMove) {
    $('.whiteboard-texts').css('pointer-events', 'auto');
    $('.whiteboardPad').css('pointer-events', 'none');
    $('.whiteboard-move-icon').css('display', 'block');
    $('.whiteboard-config-icon').css('display', 'none');
    $('.textconfig-layout').css('display', 'none');
    $('.text-block').attr('disabled', true);
  } else {
    $('.whiteboard-texts').css('pointer-events', 'none');
    $('.whiteboard-move-icon').css('display', 'none');
    $('.whiteboard-config-icon').css('display', 'none');
    $('.text-block').attr('disabled', false);
  }
  whiteboardChangImg(object);
}

// 切換白板Icon圖示
function whiteboardChangImg(object) {
  $('.whiteboard-btns>img').map(function (index, element) {
    if (element.name == object.name && element.attributes.active == undefined) {
      object.src = 'ToolBar/' + element.name + 'After.png';
      element.setAttribute("active", true);
    } else {
      element.src = 'ToolBar/' + element.name + 'Before.png';
      element.removeAttribute("active");
    }
  });
}
function whitheboardSetInitImg() {
  $('.whiteboard-btns>img').map(function (index, element) {
    element.src = 'ToolBar/' + element.name + 'Before.png';
    element.removeAttribute("active");
  }
  );

}

/** 白板文字區塊大小自適應 */
function textareaAutosize() {
  var el = this;
  setTimeout(function () {
    var obj = canvasboard.textList.find(function (res) {
      if (res != undefined) {
        if (res.id == el.id) {
          return res;
        }
      }
    });
    $(el).css({
      padding: 0,
      height: (obj.top + el.scrollHeight > $('.whiteboard-texts').height() ? $('.whiteboard-texts').offset().height - obj.top : el.scrollHeight),
      left: obj.left + 'px',
      top: obj.top + 'px'
    });
  }, 0);
}

/** 白板輸入框失去焦點時動作 */
function textreaBlur() {
  var el = this;

  // 如果該文字框在失去焦點後，未有任何輸入內容就自動移除掉
  if (!el.value) {
    //$(el).remove();
    //$('#Icon' + objectid).remove();
    //$('#IConfig' + objectid).remove();

    // 移除該文字輸入內容
    $('[id*=' + el.id + ']').remove();
  }
  else {
    // 設置該文字書去區塊寬跟高
    $('#Icon' + el.id).width(el.style.width ? el.style.width : el.style.minWidth);
    $('#Icon' + el.id).height(el.style.height);
  }
}

function textradio(obj, thisvalue) {
  var layout = $('.textconfig-layout')[0];
  if (layout.getAttribute('texareaid')) {
    $('#' + layout.getAttribute('texareaid')).css({
      'font-size': obj.value,
    });
    var text = document.getElementById(layout.getAttribute('texareaid'));
    $('.whiteboard-texts>[id*=' + layout.getAttribute('texareaid') + ']:not(img)').each(function (index) {
      $(this).css('top', text.offsetTop - (text.offsetTop + text.scrollHeight > $('.whiteboard-texts').height() ? Math.abs(text.scrollHeight - text.offsetHeight) : 0));
      $(this).css('height', 'auto');
      $(this).css('height', text.scrollHeight);
    });
  }
}

function textchange(obj, thiscolor) {
  $('#textColor').css("background-color", obj.style.backgroundColor);
  var layout = $('.textconfig-layout')[0];
  if (layout.getAttribute('texareaid')) {
    $('#' + layout.getAttribute('texareaid')).css({
      color: obj.style.backgroundColor
    });
  }
}

// 設置白板物件功能監聽事件
function setWhiteboard() {
  $('.whiteboard-block')
    .draggable({
      scroll: false,
      handle: '.inputLink_title'
    });

  var canvas = $('.whiteboardPad')[0];
  $(canvas)
    .on('mousedown', function (e) {
      ToolBarList.canvasboardDrag = true;
      var cxt = this.getContext('2d');
      cxt.strokeStyle = colorPen.Color;
      cxt.lineWidth = colorPen.Width;
      cxt.globalAlpha = colorPen.Opacity;
      cxt.lineCap = 'round';
      cxt.lineJoin = 'round';
      cxt.beginPath();
      cxt.moveTo(e.offsetX, e.offsetY);
      pointList = {
        color: colorPen.Color,
        width: colorPen.Width,
        opacity: colorPen.Opacity,
        points: []
      };
      pointList.points.push({
        x: e.offsetX,
        y: e.offsetY
      });
    }).on('mousemove', function (e) {
      if (ToolBarList.canvasboardDrag) {
        var cxt = this.getContext('2d');
        cxt.lineTo(e.offsetX, e.offsetY);
        pointList.points.push({
          x: e.offsetX,
          y: e.offsetY
        });
        cxt.stroke();
      }
    }).on('mouseup mouseout', function (e) {
      if (!ToolBarList.canvasboardDrag) {
        return;
      }
      canvasboard.saveList.push(pointList);
      canvasboard.style = "whiteboardPad";
      pointList = {};
      ToolBarList.canvasboardDrag = false;
      ToolBarList.canvasboardTemp = $('.whiteboardPad')[0].toDataURL();
    });

  var textDiv = $('.whiteboard-texts');
  $(textDiv)
    .click(function (event) {
      if (canvasboard.isMove) return;
      let left = event.offsetX,
        top = event.offsetY;
      let areaMinW = event.offsetX + 300 > $('.whiteboard-texts').width() ? $('.whiteboard-texts').width() - event.offsetX : 300;
      let areaMaxW = event.offsetX + areaMinW >= $('.whiteboard-texts').width() ? areaMinW : $('.whiteboard-texts').width() - event.offsetX;

      // 產生一個文字輸入區塊
      var textArea = document.createElement('textarea');
      // 產生該文字輸入區塊ID
      textArea.id = newguid();
      $('.whiteboard-texts').append(textArea); //today
      // 設置該文字區塊
      $(textArea)
        .focus()
        .on('keydown', textareaAutosize)
        .on('blur', textreaBlur)
        .click(function (e) {
          //whiteboardTextToggle(this);
          $('.whiteboard-config-icon').css('display', 'block');
          e.stopPropagation();
        })
        .addClass('text-block')
        .css({
          minWidth: areaMinW,
          maxWidth: areaMaxW,
          left: left,
          top: top,
          color: 'rgb(0, 0, 0)',
          'font-size': '16px'
        });

      // 紀錄該輸入內容
      canvasboard.textList.push({
        id: textArea.id,
        left: left,
        top: top
      });

      // 加入該文字輸入區塊
      //$('.whiteboard-texts').append(textArea); //

      // 建立文字框設定Icon物件
      let config = document.createElement('img');
      // 設置文字框設定Icon圖示
      config.src = 'ToolBar/config.png';
      // 設置文字框設定Icon圖示物件ID
      config.id = 'Config' + textArea.id;
      // 加入該文字輸入區塊物件
      $('.whiteboard-cont').append(config);

      $(config)
        .addClass('whiteboard-config-icon')
        .css({
          cursor: 'pointer',
          //display: 'none',
          position: 'absolute',
          left: left,
          top: top - 30,
          width: '30px',
          height: '30px',
          'z-index': 1
        })
        .click(function (e) {
          // 設置文字設定框
          $('.textconfig-layout').css('display', 'block');
          $('.textconfig-block').css({
            left: $(textArea).offset().left - $('#HamastarWrapper').offset().left,
            top: $(textArea).offset().top - $('#HamastarWrapper').offset().top + $(textArea).height()
          }).draggable({
            scroll: false,
            handle: '.inputLink_title'
          });
          $('.textconfig-layout')[0].setAttribute('texAreaid', textArea.id);
          $('.textconfig-cont>div>input').filter(function (index) {
            return this.value == textArea.style.fontSize
          }).prop("checked", true);
          $('#textColor')[0].style.backgroundColor = textArea.style.color;
        });

      var move_div = document.createElement('div');
      //move_icon.src = 'ToolBar/drag_icon.png';
      move_div.id = 'Icon' + textArea.id;
      $('.whiteboard-texts').append(move_div);
      $(move_div)
        .addClass('whiteboard-move-icon')
        .css({
          cursor: 'move',
          display: 'none',
          position: 'absolute',
          left: left,
          top: top,
          border: '2px solid #ccc',
          'z-index': 1
        })
        .draggable({
          scroll: false,
          containment: ".whiteboard-texts",
          drag: function () {
            $(textArea).css({
              left: $(this).offset().left - $('.whiteboard-texts').offset().left,
              top: $(this).offset().top - $('.whiteboard-texts').offset().top
            });
            $(config).css({
              left: $(this).offset().left - $('.whiteboard-texts').offset().left,
              top: $(this).offset().top - $('.whiteboard-texts').offset().top - 30
            });
          },
          stop: function () {
            for (var i = 0; i < canvasboard.textList.length; i++) {
              if (canvasboard.textList[i] != undefined) {
                if (canvasboard.textList[i].id == textArea.id) {
                  canvasboard.textList[i].left = $(this).offset().left - $('.whiteboard-texts').offset().left;
                  canvasboard.textList[i].top = $(this).offset().top - $('.whiteboard-texts').offset().top;
                }
              }
            }
          }
        });

      whiteboardTextToggle(this);
    });
}


// 重畫白板
function reDrawWhiteboard() {
  var canvas = $('.whiteboardPad')[0],
    cxt = canvas.getContext('2d');
  canvas.width = $('.whiteboard-cont').width();
  canvas.height = $('.whiteboard-cont').height();
  canvasboard.saveList.map(function (res) {
    cxt.strokeStyle = res.color;
    cxt.lineWidth = res.width;
    for (var i = 1; i < res.points.length; i++) {
      cxt.lineCap = 'round';
      cxt.lineJoin = 'round';
      var x1 = res.points[i - 1].x;
      var y1 = res.points[i - 1].y;
      var x2 = res.points[i].x;
      var y2 = res.points[i].y;
      cxt.moveTo(x1, y1);
      cxt.lineTo(x2, y2);
      cxt.stroke();
    }
  });
}


