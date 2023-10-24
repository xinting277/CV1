var TabPicker = new Vue({
    el: '#TabCtnPicker',
    delimiters: ['${', '}'],
    data: {
        DefaultList: [
            {
                ColorData: {
                    backgroundColor: 'rgb(255,0,0)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(255,165,0)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(255,255,0)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(0,255,0)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(0,0,255'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(128,0,128)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(0,0,0)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(128,128,128)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(255,255,255)'
                }
            },
        ],
        CustomList: [
            {
                ColorData: {
                    backgroundColor: 'rgb(23, 22, 22)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(30, 73, 124)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(191, 1, 0)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(126, 97, 0)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(76, 97, 37)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(112, 49, 159)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(127, 127, 127)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(0, 113, 192)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(254, 1, 0)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(191, 146, 0)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(0, 177, 80)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(128, 55, 124)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(216, 216, 216)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(82, 142, 211)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(225, 110, 7)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(254, 219, 101)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(145, 209, 81)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(208, 142, 201)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(255, 255, 255)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(188, 216, 238)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(247, 151, 70)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(255, 240, 0)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(194, 215, 155)'
                }
            }, {
                ColorData: {
                    backgroundColor: 'rgb(223, 180, 218)'
                }
            },
        ]
    },
    methods: {
        penchane: function (event) {
            var tempPenColor = event.target.style.backgroundColor;
            $("#TextColor").val(rgbToHex(tempPenColor).toUpperCase());

            penCmdStatus = 0;
            $(".colorStateBar").children("div").css("background-color", tempPenColor);
        },
        Highlightchagne: function (event) {
            var tempPenColor = event.target.style.backgroundColor;
            $("#HighlightTextColor").val(rgbToHex(tempPenColor).toUpperCase());

            penCmdStatus = 0;
            $(".HighlightcolorBar").children("div").css("background-color", tempPenColor);
        },
        Laserchagne: function (event) {
            var tempPenColor = event.target.style.backgroundColor;
            $("#LaserTextColor").val(rgbToHex(tempPenColor).toUpperCase());

            penCmdStatus = 0;
            $(".LasercolorBar").children("div").css("background-color", tempPenColor);
        }
    },
});

var BgPicker = new Vue({
    el: '#bgColorPicker',
    delimiters: ['${', '}'],
    data: {
        DefaultList: [
            {
                ColorData: {
                    backgroundColor: 'rgb(255,0,0)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(255,165,0)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(255,255,0)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(0,255,0)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(0,0,255'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(128,0,128)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(0,0,0)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(128,128,128)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(255,255,255)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(253, 236, 172)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(203, 186, 122)'
                }
            },
            {
                ColorData: {
                    backgroundColor: 'rgb(153, 136, 72)'
                }
            },
        ]
    }
})