
// 主要工具列
var mainItem = [
  {
    id: "back1",
    btnText: "回到書櫃",
    Enable: true,
  },
  {
    id: "save",
    btnText: "儲存",
    Enable: true,
  },
  {

    id: "editor",
    btnText: "紀錄存取",
    Enable: true,
  },
  {
    id: "jump",
    btnText: "頁面目錄",
    Enable: true,
  },
  {
    id: "tab",
    btnText: "書籤標記",
    Enable: true,
  },
  {
    id: "inputPage",
    btnText: "輸入頁碼",
    Enable: true,
  },
  {
    id: "colorPen",
    btnText: "畫筆",
    Enable: true,
  },
  {
    id: "ColorsPicker",
    btnText: "調色盤",
    Enable: true,
  },
  {
    id: "eraser",
    btnText: "橡皮擦",
    Enable: true,
  },
  {
    id: "palm",
    btnText: "拖曳",
    Enable: true,
  },
  {
    id: "navigator",
    btnText: "四角放大",
    Enable: true,
  },
  {
    id: "zoom100",
    btnText: "整頁顯示",
    Enable: true,
  },
  {
    id: "recovery",
    btnText: "復原",
    Enable: true,
  },
  {
    id: "notrecovery",
    btnText: "取消復原",
    Enable: true,
  },
  {
    id: "insert",
    btnText: "插入註記",
    Enable: true,
  },
  {
    id: "treasure",
    btnText: "工具箱",
    Enable: true,
  },
  {
    id: "textSearch",
    btnText: "全文檢索",
    Enable: true,
  },
  {
    id: "instructions",
    btnText: "操作手冊",
    Enable: true,
  },
  {
    id: "blackboard",
    btnText: "數位黑板",
    Enable: true,
  },
];
// 紀錄存取
var editorToolBar = [
  {
    id: "uploadEdit",
    btnText: "筆記上傳",
  },
  {
    id: "uploadFile",
    btnText: "附檔上傳",
  },
  {
    id: "downloadEdit",
    btnText: "下載",
  },
  {
    id: "save",
    btnText: "儲存",
  } /*, {
    id: "noteMove",
    btnText: "注記移動"
}, {
    id: "clearAll",
    btnText: "清除所有內容"
}*/,
];

// 導覽器
var navigatorToolBar = [
  {
    id: "zoomLeftTop",
    btnText: "左上",
    class: "border-l-t",
  },
  {
    id: "zoomRightTop",
    btnText: "右上",
    class: "border-r-t",
  },
  {
    id: "zoomLeftBottom",
    btnText: "左下",
    class: "border-l-b",
  },
  {
    id: "zoomRightBottom",
    btnText: "右下",
    class: "border-r-b",
  },
];

// 插入
var insertToolBar = [
  {
    id: "comment",
    btnText: "畫線註記",
  },
  {
    id: "txtnote",
    btnText: "文字便利貼",
  },
  {
    id: "insertFile",
    btnText: "檔案連結",
  },
  {
    id: "insertLink",
    btnText: "超連結",
  },
];

// 工具箱
var treasureToolBar = [
  {
    id: "whiteboard",
    btnText: "白板",
  },
  {
    id: "selector",
    btnText: "選號器",
  },
  {
    id: "noteTimer",
    btnText: "計時器",
  },
  {
    id: "hiddenNote",
    btnText: "隱藏註記",
  },
];

var ItemDetails = [
  {
    //書架
    id: "back",
    beforespanTextName: "書架",
    afterspanTextName: "書架",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/btnBackbefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/btnBackafter.png",
    },
    action: function () {
      if (!this.afterClick) {
        changeAllBtnToFalse();
      }
      checkBtnChange(this);

      if (!ReceiveList) {
        $(".bookstore_upload_btn").remove();
      }

      $(".bookstore-layout").css("display", "flex");
    },
  },
  {
    // 書籤標記
    id: "tab",
    beforespanTextName: "書籤標記",
    afterspanTextName: "書籤標記",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/btnTabBefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/btnTabAfter.png",
    },
    action: function () {
      if (!this.afterClick) {
        changeAllBtnToFalse();
      }

      this.afterClick = !this.afterClick;
      checkBtnChange(this);

      if (this.afterClick) {
        openTabTable();
      } else {
        closeTabTable();
      }
    },
  },
  {
    //畫筆
    id: "colorPen",
    beforespanTextName: "畫筆",
    afterspanTextName: "畫筆",
    afterClick: false,
    type: "pen",
    beforeStyle: {
      "background-image": "ToolBar/btnPenBefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/btnPenAfter.png",
    },
    action: function () {
      if (!this.afterClick) {
        changeAllBtnToFalse();
      }

      this.afterClick = !this.afterClick;
      checkBtnChange(this);

      // 判斷子工具輔助列是否正在顯示
      if ($(".note-layout").css("display") != "none") {
        // 關閉顯示子工具補助列
        $(".note-layout").css("display", "none");
      }

      if (ToolBarList.AddWidgetState == "colorPen") {
        GalleryStartMove();
        ToolBarList.AddWidgetState = "none";
        $("#canvasPad").remove();
      } else {
        ToolBarList.AddWidgetState = "colorPen";

        GalleryStopMove();
        NewCanvas();
        var canvasPad = $("#canvas")[0];
        canvasPad.id = "canvasPad";
        $(canvasPad).attr("class", "canvasPad");
        canvasPad.width = $(window).width() * ToolBarList.ZoomScale;
        canvasPad.height = $(window).height() * ToolBarList.ZoomScale;
        var cxt = canvasPad.getContext("2d");
        cxt.strokeStyle = colorPen.Color;
        cxt.lineWidth = colorPen.Width;
        cxt.globalAlpha = colorPen.Opacity;
        cxt.lineCap = colorPen.BrushType == "rect" ? "butt" : "round";
        cxt.lineJoin = colorPen.BrushType == "rect" ? "miter" : "round";

        $(canvasPad).on("mousedown touchstart", function (e) {
          StartPen(e, canvasPad);
        });
        $(canvasPad).on("mousemove touchmove", function (e) {
          canvasPadMove(e, canvasPad);
        });
        $(canvasPad).on("mouseup touchend", function () {
          canvasPadUp(
            canvasPad,
            cxt.strokeStyle,
            cxt.lineWidth,
            cxt.globalAlpha
          );
        });

        $(canvasPad).on("dblclick", function () {
          GalleryStartMove();
          ToolBarList.AddWidgetState = "none";
          $("#canvasPad").remove();
          changeAllBtnToFalse();
          colorPen.Drag = false;
        });

        Hammer(canvasPad).on("doubletap", function (e) {
          GalleryStartMove();
          ToolBarList.AddWidgetState = "none";
          $("#canvasPad").remove();
          changeAllBtnToFalse();
          colorPen.Drag = false;
        });
      }
    },
  },
  {
    // 儲存本機
    id: "save",
    beforespanTextName: "儲存本機",
    afterspanTextName: "儲存本機",
    afterClick: false,
    type: "save",
    beforeStyle: {
      "background-image": "ToolBar/btnSaveBefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/btnSaveAfter.png",
    },
    action: function () {
      // var indexedDB;
      if (indexedDB == undefined) {
        window.external.saveNoteXML(sendXML(true));
        MainObj.trashList = [];
        MainObj.saveList = [];
      } else {
        SaveAll();
        resetUndo();
      }
      BookAlertShow("儲存成功！");
    },
  },
  {
    // 放大左上
    id: "zoomLeftTop",
    beforespanTextName: "左上",
    afterspanTextName: "左上",
    beforeStyle: {
      "background-image": "ToolBar/zoomLeftTopbefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/zoomLeftTopafter.png",
    },
    afterClick: false,
    action: function () {
      //   console.log(this.afterClick);
      // 如果是false就把它轉為true，因為是觸發點擊
      if (!this.afterClick) {
        changeAllBtnToFalse();
        toggleToolBar(navigatorToolBar, true);
        $(".note-layout").css("display", "none");
      }

      // 更新目前按鈕點擊狀態，如果是false就把它轉為true，因為是觸發點擊
      this.afterClick = !this.afterClick;
      //   checkBtnChange(this);
      let objzoomLeftTop = zoomLeftTop;

      // 點擊後狀態為縮小，點擊前狀態為放置
      if (this.afterClick) {
        zoomCorner(true, true);
      } else {
        zoomOut(true);
      }

      setTimeout(function (e) {
        // objzoomLeftTop.afterClick = !objzoomLeftTop.afterClick;
        // console.log(objzoomLeftTop);
        // 如果是已點擊情況下，要改成點擊前圖片，反之則是點擊後圖片
        if (!objzoomLeftTop.afterClick) {
          checkBtnChange_sub(
            objzoomLeftTop,
            //修改為按放大後視窗不見,所以不需要放圖
            // objzoomLeftTop.beforeStyle["background-image"] 
          );
        } else {
          checkBtnChange_sub(
            objzoomLeftTop,
            //修改為按放大後視窗不見,所以不需要放圖
            // objzoomLeftTop.afterStyle["background-image"]
          );
        }
      }, 300);
    },
  },
  {
    // 放大左下
    id: "zoomLeftBottom",
    beforespanTextName: "左下",
    afterspanTextName: "左下",
    beforeStyle: {
      "background-image": "ToolBar/zoomLeftBottombefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/zoomLeftBottomafter.png",
    },
    afterClick: false,
    action: function () {
      // 如果是false就把它轉為true，因為是觸發點擊
      if (!this.afterClick) {
        toggleToolBar(navigatorToolBar, true);
        $(".note-layout").css("display", "none");
        changeAllBtnToFalse();
      }

      // 更新目前按鈕點擊狀態，如果是false就把它轉為true，因為是觸發點擊
      this.afterClick = !this.afterClick;
      //   checkBtnChange(this);
      let objzoomLeftBottom = this;

      // 點擊後狀態為縮小，點擊前狀態為放置
      if (this.afterClick) {
        zoomCorner(true, false);
      } else {
        zoomOut(true);
      }

      setTimeout(function () {
        // objzoomLeftBottom.afterClick = !objzoomLeftBottom.afterClick;
        // checkBtnChange(objzoomLeftBottom);
        // 如果是已點擊情況下，要改成點擊前圖片，反之則是點擊後圖片
        if (!objzoomLeftBottom.afterClick) {
          checkBtnChange_sub(
            objzoomLeftBottom,
            //修改為按放大後視窗不見,所以不需要放圖
            //objzoomLeftBottom.beforeStyle["background-image"]
          );
        } else {
          checkBtnChange_sub(
            objzoomLeftBottom,
            //修改為按放大後視窗不見,所以不需要放圖
            //objzoomLeftBottom.afterStyle["background-image"]
          );
        }
      }, 300);

      //   zoomCorner(true, false);
    },
  },
  {
    // 放大右上
    id: "zoomRightTop",
    beforespanTextName: "右上",
    afterspanTextName: "右上",
    beforeStyle: {
      "background-image": "ToolBar/zoomRightTopbefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/zoomRightTopafter.png",
    },
    afterClick: false,
    action: function () {
      // 如果是false就把它轉為true，因為是觸發點擊
      if (!this.afterClick) {
        toggleToolBar(navigatorToolBar, true);
        $(".note-layout").css("display", "none");
        changeAllBtnToFalse();
      }

      // 更新目前按鈕點擊狀態，如果是false就把它轉為true，因為是觸發點擊
      this.afterClick = !this.afterClick;
      //   checkBtnChange(this);
      let objzoomRightTop = this;

      // 點擊後狀態為縮小，點擊前狀態為放置
      if (this.afterClick) {
        zoomCorner(false, true);
      } else {
        zoomOut(true);
      }

      setTimeout(function () {
        // objzoomRightTop.afterClick = !objzoomRightTop.afterClick;
        // checkBtnChange(objzoomRightTop);

        if (!objzoomRightTop.afterClick) {
          checkBtnChange_sub(
            objzoomRightTop,
            //修改為按放大後視窗不見,所以不需要放圖
            //objzoomRightTop.beforeStyle["background-image"]
          );
        } else {
          checkBtnChange_sub(
            objzoomRightTop,
            //修改為按放大後視窗不見,所以不需要放圖
            //objzoomRightTop.afterStyle["background-image"]
          );
        }
      }, 300);
      //   zoomCorner(false, true);
    },
  },
  {
    // 放大右下
    id: "zoomRightBottom",
    beforespanTextName: "右下",
    afterspanTextName: "右下",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/zoomRightBottombefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/zoomRightBottomafter.png",
    },
    action: function () {
      // 如果是false就把它轉為true，因為是觸發點擊
      if (!this.afterClick) {
        toggleToolBar(navigatorToolBar, true);
        $(".note-layout").css("display", "none");
        changeAllBtnToFalse();
      }

      // 更新目前按鈕點擊狀態，如果是false就把它轉為true，因為是觸發點擊
      this.afterClick = !this.afterClick;
      //   checkBtnChange(this);
      let objzoomRightBottom = this;

      // 點擊後狀態為縮小，點擊前狀態為放置
      if (this.afterClick) {
        zoomCorner(false, false);
      } else {
        zoomOut(true);
      }

      setTimeout(function () {
        // objzoomRightBottom.afterClick = !objzoomRightBottom.afterClick;
        // checkBtnChange(objzoomRightBottom);
        if (!objzoomRightBottom.afterClick) {
          checkBtnChange_sub(
            objzoomRightBottom,
            //修改為按放大後視窗不見,所以不需要放圖
            //objzoomRightBottom.beforeStyle["background-image"]
          );
        } else {
          checkBtnChange_sub(
            objzoomRightBottom,
            //修改為按放大後視窗不見,所以不需要放圖
            //objzoomRightBottom.afterStyle["background-image"]
          );
        }
      }, 300);
      //   zoomCorner(false, false);
    },
  },
  {
    // 插入
    id: "insert",
    beforespanTextName: "插入",
    afterspanTextName: "插入",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/btnInsertBefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/btnInsertAfter.png",
    },
    action: function () {
      if (!this.afterClick) {
        changeAllBtnToFalse();
      }
      this.afterClick = !this.afterClick;
      checkBtnChange(this);

      if (this.afterClick) {
        // 顯示子功能工具列
        toggleToolBar(insertToolBar);
        $(".note-layout").css("display", "block");
      } else {
        $(".note-layout").css("display", "none");
      }
    },
  },
  {
    // 四角放大
    id: "navigator",
    beforespanTextName: "四角放大",
    afterspanTextName: "四角放大",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/navigatorbefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/navigatorafter.png",
    },
    action: function () {
      if (!this.afterClick) {
        changeAllBtnToFalse();
      }
      this.afterClick = !this.afterClick;
      checkBtnChange(this);

      if (this.afterClick) {
        toggleToolBar(navigatorToolBar, true);

        $(".note-layout").css("display", "block");
      } else {
        // 關閉顯示子工具補助列
        $(".note-layout").css("display", "none");
      }
    },
  },
  {
    // 工具箱
    id: "treasure",
    beforespanTextName: "工具箱",
    afterspanTextName: "工具箱",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/treasurebefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/treasureafter.png",
    },
    action: function () {
      if (!this.afterClick) {
        changeAllBtnToFalse();
      }
      this.afterClick = !this.afterClick;
      checkBtnChange(this);

      if (this.afterClick) {
        toggleToolBar(treasureToolBar);
        $(".note-layout").css("display", "block");
        if (hiddenOpen == true) {
          checkBtnChange_sub(

            hiddenNote,
            "ToolBar/hiddenNoteAfter.png");
        }

      } else {
        $(".note-layout").css("display", "none");
      }
    },
  },
  {
    // 備課存取
    id: "editor",
    beforespanTextName: "備課存取",
    afterspanTextName: "備課存取",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/editorbefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/editorafter.png",
    },
    action: function () {
      if (!this.afterClick) {
        changeAllBtnToFalse();
      }
      this.afterClick = !this.afterClick;
      checkBtnChange(this);

      if (this.afterClick) {
        toggleToolBar(editorToolBar);
        $(".note-layout").css("display", "block");
      } else {
        $(".note-layout").css("display", "none");
      }
    },
  },
  {
    //復原
    id: "recovery",
    beforespanTextName: "復原",
    afterspanTextName: "復原",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/recoverybefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/recoveryafter.png",
    },
    disableStyle: {
      "background-image": "ToolBar/recoverydisable.png",
    },
    action: function () {
      if (!MainObj.saveList.length) return;
      // recoverySave = false;
      zoomOut(true);
      var list = MainObj.saveList[MainObj.saveList.length - 1]; //-1 等於回到第幾步
      MainObj.trashList.push(list);
      MainObj.saveList.splice(MainObj.saveList.length - 1, 1);
      if (!list.length) {
        list = [list];
      }

      for (var i = 0; i < list.length; i++) {
        var temp = list[i];
        switch (temp.type) {
          case "pen": {
            if (temp.undo == 'remove') {
              temp.undo = 'add';
              colorPen.LineList.push(temp);
              reDoPen(temp);
            } else {
              for (var j = 0; j < colorPen.LineList.length; j++) {
                if (colorPen.LineList[j].id == temp.id) {
                  $("#" + temp.id).remove();
                  colorPen.LineList.splice(j, 1);
                }
              }
              // $("#" + temp.id).remove();
            }
            break;
          }
          case "comment":
            if (temp.undo == 'remove') {
              temp.undo = 'add';
              txtComment.saveList.push(temp);
              reDrawComment(temp);
            } else {
              temp.undo = 'edit';
              $("#" + temp.id).remove();
            }
            break;
          case "txtNote":
            if (temp.undo == 'remove') {
              temp.undo = 'add';
              txtNote.SaveList.push(temp);
              reSetNote(temp);
            }
            else {
              $("#" + temp.id).remove();
            }
            break;

          case "hyperLink":
            if (temp.undo == 'remove') {
              temp.undo = 'add';
              hyperLink.saveList.push(temp);
              reSetLink(temp, true);
              //HyperLinkSet(temp);
            }
            else {
              $("#" + temp.id).remove();
            }
            break;
          case "file":
            if (temp.undo == 'remove') {
              temp.undo = 'add';
              fileObj.saveList.push(temp);
              replyFile();
            }


            else {
              temp.undo = 'remove';
              $("#" + temp.id).remove();
              $("#canvas" + temp.id).remove();
            }
            break;


        }


      }

      if (!this.afterClick) {
        changeAllBtnToFalse();
      }
      notRecoveryLight();
      this.afterClick = !this.afterClick;
      checkBtnChange(this);
      var objrecovery = this;
      setTimeout(function () {
        objrecovery.afterClick = !objrecovery.afterClick;
        checkBtnChange(objrecovery);
      }, 100);
    },
  },
  {
    //取消復原
    id: "notrecovery",
    beforespanTextName: "取消復原",
    afterspanTextName: "取消復原",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/notrecoverybefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/notrecoveryafter.png",
    },
    disableStyle: {
      "background-image": "ToolBar/notrecoverydisable.png",
    },
    action: function () {
      if (!MainObj.trashList.length) return;

      var list = MainObj.trashList[MainObj.trashList.length - 1];
      MainObj.saveList.push(list);
      MainObj.trashList.splice(MainObj.trashList.length - 1, 1);

      if (!list.length) {
        list = [list];
      }
      for (var i = 0; i < list.length; i++) {
        var temp = list[i];
        switch (temp.type) {
          case "pen":
            if (temp.undo == 'add') {
              temp.undo = 'remove';
              $('#' + temp.id).remove();
              colorPen.LineList = colorPen.LineList.filter(function (res) {
                if (res.id !== temp.id) {
                  return res;
                }
              });
            } else {
              // 取消復原後也塞回陣列 對應 復原的時候
              colorPen.LineList.push(temp);
              reDoPen(temp);
            }
            /*if (temp.isEraser) {
              $("#" + temp.id).remove();
              var tempObj = $.extend(true, [], MainObj.trashList);
              tempObj.map(function (res, index) {
                if (res.isGroup == temp.isGroup) {
                  $("#" + res.id).remove();
                  MainObj.saveList.push(res);
                  MainObj.trashList.splice(MainObj.trashList.length - 1, 1);
                }
              });
            } else {
              reDoPen(temp);
              colorPen.LineList.push(temp);
            }*/
            break;
          case "comment":
            if (temp.undo == 'add') {
              temp.undo = 'remove';
              $('#' + temp.id).remove();
              txtComment.saveList = txtComment.saveList.filter(function (res) {
                if (res.id !== temp.id) {
                  return res;
                }
              });
            } else {
              reDrawComment(temp);
            } break;
          /*reDrawComment(temp);
          txtComment.saveList.push(temp);
          break;*/
          case "txtNote":
            if (temp.undo == 'add') {
              temp.undo = 'remove';
              $('#' + temp.id).remove();
              txtNote.SaveList.saveList = txtNote.SaveList.filter(function (res) {
                if (res.id !== temp.id) {
                  return res;
                }
              });
            } else {
              reDrawComment(temp);
            } break;
          case "hyperLink":
            if (temp.undo == 'add') {
              temp.undo = 'remove';
              hyperLink.saveList = hyperLink.saveList.filter(function (res) {
                if (res.id !== temp.id) {
                  return res;
                }
              });
            }
            else {
              reSetLink(temp, true);
              //HyperLinkSet(temp);
            }

            break;
          case "file":
            if (temp.undo == 'add') {
              temp.undo = 'remove';
              $('#canvas' + temp.id).remove();
              fileObj.saveList.saveList = fileObj.saveList.filter(function (res) {
                if (res.id !== temp.id) {
                  return res;
                }
              });
            } else {
              replyFile();
            } break;
          /*reSetNote(temp);
          txtNote.SaveList.push(temp);
          break;*/
        }
      }

      if (!this.afterClick) {
        changeAllBtnToFalse();
      }
      recoveryLight();
      this.afterClick = !this.afterClick;
      checkBtnChange(this);
      var objnotrecovery = this;
      setTimeout(function () {
        objnotrecovery.afterClick = !objnotrecovery.afterClick;
        checkBtnChange(objnotrecovery);
      }, 100);
    },
  },
  {
    // 白板 - 三民客製化工能
    id: "whiteboard",
    beforespanTextName: "白板",
    afterspanTextName: "白板",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/textWhiteboardbefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/textWhiteboardafter.png",
    },
    action: function () {
      // 如果是false就把它轉為true，因為是觸發點擊
      if (!this.afterClick) {
        // changeAllBtnToFalse(treasureToolBar);
        changeAllBtnToFalse();
      }

      // 更新目前按鈕點擊狀態，如果是false就把它轉為true，因為是觸發點擊
      this.afterClick = !this.afterClick;
      // checkBtnChange(this);
      let objWhiteboard = this;

      setTimeout(function () {
        // objzoomRightBottom.afterClick = !objzoomRightBottom.afterClick;
        // checkBtnChange(objzoomRightBottom);
        if (!objWhiteboard.afterClick) {
          checkBtnChange_sub(
            objWhiteboard,
            objWhiteboard.beforeStyle["background-image"]
          );
        } else {
          checkBtnChange_sub(
            objWhiteboard,
            objWhiteboard.afterStyle["background-image"]
          );
        }
      }, 300);
      BoardMainobj.Text.Show = this.afterClick;
      BoardMainobj.Canvas.Show = this.afterClick;

      $(".whiteboard-layout").toggle();
      //三民白板在這
      /*if (this.afterClick) {
            var canvas = $('.whiteboardPad')[0];
            canvas.width = $('.whiteboard-cont').width();
            canvas.height = $('.whiteboard-cont').height();
            reDrawWhiteboard();
        }*/
    },
  },
  {
    //隱藏註記 - 三民客製化功能
    id: "hiddenNote",
    beforespanTextName: "隱藏註記",
    afterspanTextName: "隱藏註記",
    afterClick: false,
    beforeStyle: {
      "background-image": "ToolBar/hiddenNoteBefore.png",
    },
    afterStyle: {
      "background-image": "ToolBar/hiddenNoteAfter.png",
    },
    action: function () {
      // 如果是false就把它轉為true，因為是觸發點擊
      if (!this.afterClick) {
        //changeAllBtnToFalse();

      }

      this.afterClick = !this.afterClick;
      //checkBtnChange(this);
      if (hiddenOpen == true) {
        this.afterClick = false;
      }
      let objHiddenNote = this;

      //isHiddenNote = this.afterClick;

      setTimeout(function () {
        // objzoomRightBottom.afterClick = !objzoomRightBottom.afterClick;
        // checkBtnChange(objzoomRightBottom);
        if (!objHiddenNote.afterClick) {

          //window.external.saveNoteXML(sendXML(true));
          checkBtnChange_sub(
            objHiddenNote,
            objHiddenNote.beforeStyle["background-image"]);
          returnAll();
          hiddenOpen = false;

        }
        else {


          //MainObj.trashList = [];
          //MainObj.saveList = [];

          clearAll();


          checkBtnChange_sub(
            objHiddenNote,
            objHiddenNote.afterStyle["background-image"]);

          //LoadNoteXML(); //PC APP讀本機所有檔案
          hiddenOpen = true;
        }

      }, 300);



    },
  },
];

// // 輔助工具列
// var assistItem = [
//   {
//     id: "uploadEdit",
//     btnText: "筆記上傳",
//     Enable: true,
//   },
//   {
//     id: "uploadFile",
//     btnText: "附檔上傳",
//     Enable: true,
//   },
//   {
//     id: "downloadEdit",
//     btnText: "下載",
//     Enable: true,
//   },
//   {
//     id: "save",
//     btnText: "儲存",
//     Enable: true,
//   },
//   {
//     id: "zoomLeftTop",
//     btnText: "左上",
//     class: "border-l-t",
//     Enable: true,
//     Group: "btnzoomtop",
//   },
//   {
//     id: "zoomRightTop",
//     btnText: "右上",
//     class: "border-r-t",
//     Enable: true,
//     Group: "btnzoomtop",
//   },
//   {
//     id: "zoomLeftBottom",
//     btnText: "左下",
//     class: "border-l-b",
//     Enable: true,
//     Group: "btnzoombtm",
//   },
//   {
//     id: "zoomRightBottom",
//     btnText: "右下",
//     class: "border-r-b",
//     Enable: true,
//     Group: "btnzoombtm",
//   },
//   {
//     id: "comment",
//     btnText: "畫線註記",
//     Enable: true,
//   },
//   {
//     id: "txtnote",
//     btnText: "文字便利貼",
//     Enable: true,
//   },
//   {
//     id: "insertFile",
//     btnText: "檔案連結",
//     Enable: true,
//   },
//   {
//     id: "insertLink",
//     btnText: "超連結",
//     Enable: true,
//   },
//   {
//     id: "whiteboard",
//     btnText: "白板",
//     Enable: true,
//   },
//   {
//     id: "selector",
//     btnText: "選號器",
//     Enable: true,
//   },
//   {
//     id: "noteTimer",
//     btnText: "計時器",
//     Enable: true,
//   },
//   {
//     id: "hiddenNote",
//     btnText: "隱藏註記",
//     Enable: true,
//   },
// ];
