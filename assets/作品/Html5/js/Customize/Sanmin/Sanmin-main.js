//客製化列表
//ChineseName:中文名稱
//EnglishName:英文名稱
//Disc:硬碟(否為光碟或其他儲存設備)
var CustomizeList = {
    ChineseName: '三民書局',
    EnglishName: 'Sanmin',
    Disc: true
}

function CustomizeMain(custName) {
    var stylecss = custName + "-style.css";
    var toolbarcss = custName + "-toolbar.css";
    var functionjs = custName + "-function.js";
    var toolbarjs = custName + "-toolbar.js";

    LoadScript("js/Customize/" + custName + "/css/" + stylecss, "css");
    LoadScript("js/Customize/" + custName + "/css/" + toolbarcss, "css");
    LoadScript("js/Customize/" + custName + "/" + functionjs, "js", function () {
        CustomIndex();
        CustomToolBar();
    });
    LoadScript("js/Customize/" + custName + "/" + toolbarjs, "js", function () {
        if (!CustomizeList.Disc) {
        }
        
        // 加入三民工具(Samin-toolbar)至工具列
        ItemDetails.forEach(function (val, index) {           

            tempToolBars[0].btns.push(val);            
        });

        // 更改工具顯示名稱
        // tempToolBars[0].btns.forEach(function (val){
        //     if (val["id"] == "comment"){
        //         // console.log(val["id"]);
        //         val["id"] = insertToolBar[0]["id"];
        //         val["beforespanTextName"] = "畫線註記";
        //         val["afterspanTextName"] = "畫線註記";
        //     }           
        // });

        getFaceModuleList(mainItem);
    });

    opencloseFun();
}

// 上面最愛的開開關關功能
function opencloseFun() {
    //文字便利貼
    txtNote.CustomizeMain.defaultTheme = true;
    txtNote.CustomizeMain.ShowBackground = true;
    txtNote.CustomizeMain.SmallIcon = {
        ShowIcon: true,
        FileName: "Sticky.png"
    }
}