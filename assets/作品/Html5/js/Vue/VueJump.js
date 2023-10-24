var JumpTab = new Vue({
    el: '#JumpDiv',
    delimiters: ['${', '}'],
    data: {
        JumpList: [
            {
                id: 'btnAll',
                src: 'css/Images/allpagebefore.png'
            }, {
                id: 'btnBook',
                src: 'css/Images/bookpagebefore.png'
            }, {
                id: 'btnTab',
                src: 'css/Images/tabpageBefore.png'
            }, {
                id: 'btnChapter',
                src: 'css/Images/chapterpagebefore.png'
            }
        ]
    },
    methods: {
        JumpChange: function (objid) {
            initListpng();

            switch (objid) {
                case 'btnAll':
                    $('#btnAll').attr({
                        'src': "css/Images/allpageafter.png"
                    });
                    ToolBarList.IsChapter = false;
                    btnAllSetting();
                    break;
                case 'btnBook':
                    $('#btnBook').attr({
                        'src': "css/Images/bookpageafter.png"
                    });
                    ToolBarList.IsChapter = false;
                    btnBookSetting();
                    break;
                case 'btnTab':
                    $('#btnTab').attr({
                        'src': "css/Images/tabpageafter.png"
                    });
                    ToolBarList.IsChapter = false;
                    btnTabSetting();
                    break;
                case 'btnChapter':
                    $('#btnChapter').attr({
                        'src': "css/Images/chapterpageafter.png"
                    });
                    ToolBarList.IsChapter = true;
                    btnChapterSetting();
                    toolbarChange();
                    break;
            }

            if (MainObj.IsTwoPage) {
                $('#btnChapter').css('display', 'none');
            }

            ResetEBook();
        }
    },
});