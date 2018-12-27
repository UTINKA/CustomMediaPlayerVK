// ==UserScript==
// @date			27.12.2018
// @name			CustomMediaPlayerVK
// @namespace		https://github.com/KJ86/VKDownloadMedia
// @version			0.1
// @description		Изменённый плеер в верхнем меню для ВК
// @author			UTINKA
// @include			https://vk.com/*

// @icon
// @homepage		https://greasyfork.org/ru/scripts/7385-vkdownloadmedia
// @downloadURL		https://greasyfork.org/scripts/7385-vkdownloadmedia/code/VKDownloadMedia.user.js
// @supportURL		https://vk.com/vkdownloadmedia

// @grant			none
// @require			http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require			https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.7/download.min.js
// @run-at			document-end
// ==/UserScript==

(function()
{
	var CMP = [];
	var main_box = $('#top_audio_player');
	
	// css
	var CMP_CSS = '<style>\
	.top_audio_player_img{\
		display: block;\
		width: 42px;\
		height: 42px;\
		background-color: #3d6898;\
		background-image: url(/images/audio_row_placeholder.png);\
		background-repeat: no-repeat;\
		background-size: cover;\
		transition: 0.5s;\
	}\
	.top_audio_player_img div{\
		opacity: 0;\
		width: 100%;\
		height: 100%;\
		background: rgba(0, 0, 0, 0.3);\
		transition: 0.5s;\
	}\
	.top_audio_player_img:hover div{\
		opacity: 1;\
	}\
	.top_audio_player_img div .top_audio_player_download{\
		display: block;\
		margin: 0;\
		width: 24px;\
		height: 24px;\
		padding: 9px;\
		color: #fff;\
	}\
	.top_audio_player_cmp_author{\
		position: absolute;\
		top: 61px;\
		left: 0;\
		right: 0;\
		bottom: 0;\
		overflow: hidden;\
		white-space: nowrap;\
		text-overflow: ellipsis;\
		cursor: pointer;\
		transition: 0.5s;\
	}\
	.top_audio_player_cmp_name{\
		position: absolute;\
		top: 47px;\
		left: 0;\
		right: 0;\
		bottom: 0;\
		overflow: hidden;\
		white-space: nowrap;\
		text-overflow: ellipsis;\
		cursor: pointer;\
		transition: 0.5s;\
	}\
	</style>';
	
	window.addEventListener('load',function()
	{
		if(location.href.search(/widget/)==-1)
		{
			main_box.find('.top_audio_player_title').css('display','none');
			//
			$('.top_audio_player .top_audio_player_btn').css('position','absolute'); // all buttons
			// prev 
			main_box.find('.top_audio_player_btn.top_audio_player_prev').css({
				'top': '0',
				'bottom': '0',
				'left': '42px'
			});
			// play/pause
			main_box.find('.top_audio_player_btn.top_audio_player_play._top_audio_player_play').css({
				'top': '0',
				'bottom': '0',
				'left': '77px'
			});
			// next
			main_box.find('.top_audio_player_btn.top_audio_player_next').css({
				'top': '0',
				'bottom': '0',
				'left': '101px'
			});
			//
			main_box.find('.top_audio_player_title_wrap').css({
				'position': 'absolute',
				'top': '-40px',
				'left': '130px',
				'right': '0',
				'bottom': '0'
			})
			main_box.find('.top_audio_player_title_wrap').css('margin','0');
			//
			main_box.find('.top_audio_player_title_wrap').append('\
			<div class="top_audio_player_cmp_author"></div>\
			<div class="top_audio_player_cmp_name"></div>\
			');
            main_box.append('\
			<div class="top_audio_player_img">\
				<div>\
					<a class="top_audio_player_btn top_audio_player_download" title="Скачать" href="">\
						<i class="material-icons">play_for_work</i>\
					</a>\
				</div>\
			</div>\
			<link rel="stylesheet" href="https://utinka.github.io/materialdesignlib.github.io/css/icons.css" type="text/css"/>' + CMP_CSS);

			main_box.find('.top_audio_player_img').find('div a').click(function(e)
			{
				e.stopPropagation();
				e.preventDefault();
				
				download_file(main_box.find('.top_audio_player_img').find('div a')[0].href, CMP[1][4] + ' - ' +CMP[1][3], "audio/mp3", window.download_audio);
				
				$('.top_audio_player.top_audio_player_enabled').click();
			});

			// Start updater
			CMPUpdate();
		}
	});
	
	function CMPUpdate()
	{
		CMP[1] = getAudioPlayer()._currentAudio;
		
		main_box.find('.top_audio_player.top_audio_player_title').css('color','rgba(0, 0, 0, 0)');
		main_box.find('.top_audio_player_title').css('color','rgba(0, 0, 0, 0)');
		main_box.find('.top_audio_player_cmp_author').html(CMP[1][4]); // author
		main_box.find('.top_audio_player_cmp_name').html(CMP[1][3]); // music name
		//
		main_box.find('.top_audio_player_img').find('div a')[0].href = getAudioPlayer()._impl._currentAudioEl.src;
		//
		if(CMP[1][14].split(',')[1] != undefined)
		{
			main_box.find('.top_audio_player_img')[0].src = CMP[1][14].split(',')[1];
			main_box.find('.top_audio_player_img').css('background-image', 'url(' + CMP[1][14].split(',')[1] + ')');
		}
		else if(CMP[1][14].split(',')[1] == undefined)
		{
			main_box.find('.top_audio_player_img').css('background-image', 'url(/images/audio_row_placeholder.png)');
		}
		
		CMP[0] = setTimeout(CMPUpdate, 500);
	}
	
	function download_file(url, name, type, callback) 
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.responseType = "blob";
		xhr.onload = function () 
		{
			download(xhr.response, name + ".mp3", type);
		};
		/*xhr.onprogress = function (e) {
			var progress = e.loaded * 100 / e.total;
			console.log( name, Math.round(progress, 2) + "%" );
		};*/
		xhr.send();
	}
	
})();