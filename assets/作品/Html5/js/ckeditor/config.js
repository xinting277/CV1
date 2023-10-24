/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

	config.contentsCss = ["body {font-size: 20px;}"];
	config.fontSize_sizes = '12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px;';
	config.removePlugins = 'elementspath';
	config.resize_dir = 'both';
	config.resize_enabled = false;
	config.allowedContent = true;
	config.font_names = 'Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif;新細明體;標楷體;微軟正黑體';  
	config.toolbarGroups = [{
			"name": "basicstyles",
			"groups": ["basicstyles"]
		},
		{
			"name": "colors",
			"groups": ["colors"]
		},
		{
			"name": "styles",
			"groups": ["styles"]
		}
	];
	config.removeButtons = 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar,BGColor,Underline';
};