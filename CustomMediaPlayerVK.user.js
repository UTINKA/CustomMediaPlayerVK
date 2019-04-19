// ==UserScript==
// @date			27.12.2018
// @name			CustomMediaPlayerVK
// @namespace		https://github.com/UTINKA/CustomMediaPlayerVK/
// @version			0.2
// @description		Изменённый плеер в верхнем меню для ВК
// @author			UTINKA
// @include			https://vk.com/*

// @icon
// @homepage		https://greasyfork.org/ru/scripts/376022-custommediaplayervk
// @downloadURL		https://greasyfork.org/scripts/376022-custommediaplayervk/code/CustomMediaPlayerVK.user.js
// @supportURL		

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
	var CMP_CSS = '\
	<style>\
	\
	@import url(https://fonts.googleapis.com/css?family=Material+Icons);\
	\
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
		transition: 0.6s;\
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
		opacity: 0;\
		position: absolute;\
		top: 61px;\
		left: 0;\
		right: 0;\
		bottom: 0;\
		overflow: hidden;\
		white-space: nowrap;\
		text-overflow: ellipsis;\
		cursor: pointer;\
		transition: 0.1s;\
	}\
	.top_audio_player_cmp_name{\
		opacity: 0;\
		position: absolute;\
		top: 47px;\
		left: 0;\
		right: 0;\
		bottom: 0;\
		overflow: hidden;\
		white-space: nowrap;\
		text-overflow: ellipsis;\
		cursor: pointer;\
		transition: 0.1s;\
	}\
	.top_audio_player_download_state{\
		opacity: 1;\
		display: block;\
		position: absolute;\
		left: 0;\
		bottom: 0;\
		height: 4px;\
		width: 0%;\
		background: #FFFFFF;\
		/*box-shadow: 0 0 10px 0 #000;*/\
		border-bottom: solid .12px #4a76a8;\
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
			<div class="top_audio_player_download_state">\
			</div>\
			' + CMP_CSS);

			main_box.find('.top_audio_player_img').find('div a').click(function(e)
			{
				e.preventDefault();
				download_file(main_box.find('.top_audio_player_img').find('div a')[0].href, CMP[0][4] + ' - ' + CMP[0][3], "audio/mp3", window.download_audio);
			});

			// Start updater
			CMPUpdate();
		}
	});
	
	CMP[1] = 0;
	CMP[2] = '';
	
	function CMPUpdate()
	{
		CMP[0] = getAudioPlayer()._currentAudio;
		if(CMP[0] != false)
		{
			main_box.find('.top_audio_player_img').find('div a')[0].href = getAudioPlayer()._impl._currentAudioEl.src;
			//
			var check_track = CMP[0][4] + '_' + CMP[0][3];
			if(CMP[2] == '' || CMP[2] != check_track)
			{
				main_box.find('.top_audio_player_cmp_author').css('opacity', '0');
				main_box.find('.top_audio_player_cmp_name').css('opacity', '0');
				//
				if(CMP[0][14].split(',')[1] != undefined)
				{
					main_box.find('.top_audio_player_img').css('background-image', 'url(' + CMP[0][14].split(',')[1] + ')');
				}
				else main_box.find('.top_audio_player_img').css('background-image', 'url(/images/audio_row_placeholder.png)');
				CMP[2] = check_track;
				//
				clearTimeout(CMP[3]);
				CMP[3] = setTimeout(function()
				{
					main_box.find('.top_audio_player_cmp_author').html(CMP[0][4]); // author
					main_box.find('.top_audio_player_cmp_name').html(CMP[0][3]); // music name
					//
					main_box.find('.top_audio_player_cmp_author').css('opacity', '1');
					main_box.find('.top_audio_player_cmp_name').css('opacity', '1');
				}, 100);
			}
			//
			if(Math.round(CMP[1], 2) == 100)
			{
				CMP[1] = 0;
				setTimeout(function()
				{
					$('.top_audio_player_download_state').css('opacity', '0');
					setTimeout(function()
					{
						$('.top_audio_player_download_state').css('width', '0%');
					}, 500);
				}, 1000);
			}
		}
		setTimeout(CMPUpdate, 200);
	}
	
	function download_file(url, name, type, callback) 
	{
		$('.top_audio_player_download_state').css('opacity', '1');
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.responseType = "blob";
		xhr.onload = function() 
		{
			download(xhr.response, name + ".mp3", type);
		};
		xhr.onprogress = function(e) 
		{
			CMP[1] = e.loaded * 100 / e.total;
			$('.top_audio_player_download_state').css('width', Math.round(CMP[1], 2) + '%');
		};
		xhr.send();
	}
})();
