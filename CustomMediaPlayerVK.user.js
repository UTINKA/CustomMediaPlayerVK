// ==UserScript==
// @date			23.04.2019
// @name			CustomMediaPlayerVK
// @namespace		https://github.com/UTINKA/CustomMediaPlayerVK/
// @version			0.7
// @description		Изменённый плеер в верхнем меню для ВК
// @author			UTINKA
// @include			https://vk.com/*

// @icon
// @homepage		https://greasyfork.org/ru/scripts/376022-custommediaplayervk
// @supportURL		

// @grant			none
// @require			http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js

// @run-at			document-end
// ==/UserScript==

(function()
{
	var 
		CMP = [],
		SettingsAdd = false,
		cmpvk = '0,0';
	;
	var main_box = $('#top_audio_player');
	

	function getMem(key)
	{
		var memory = localStorage.getItem(key);
		if(memory != null && memory != 'null' && memory.length != 0) return memory;
		else return false;
	}
	function setMem(key, value)
	{
		return localStorage.setItem(key, value);
	}
	
	function UpdateSettings()
	{
		var settings = cmpvk[0] + ',' + cmpvk[1];
		setMem('cmpvk', settings);
	}

	function Start()
	{
		new MutationObserver(function () 
		{
			CMPUpdate();
			if(getMem('cmpvk') != '')
			{
				cmpvk = getMem('cmpvk');
				cmpvk = cmpvk.split(',');
			}
			else if(getMem('cmpvk') == false)
			{
				var settings_start = new String(cmpvk);
				cmpvk = settings_start.split(',');
			}
			//
			if(cmpvk[0] == 0)
			{
				CMPVKsetState(false);
				if(location.href.search(/settings/) > 1 && location.href.search(/act/) == -1) $('#settings_cmpvk_state').prop("checked", false);
			}
			else if(cmpvk[0] == 1)
			{
				CMPVKsetState(true);
				if(location.href.search(/settings/) > 1 && location.href.search(/act/) == -1) $('#settings_cmpvk_state').prop("checked", true);
			}
			if(cmpvk[1] == 0)
			{
				$('.top_audio_player').css('display','block');
				if(location.href.search(/settings/) > 1 && location.href.search(/act/) == -1) $('#settings_cmpvk_player').prop("checked", false);
			}
			else if(cmpvk[1] == 1)
			{
				$('.top_audio_player').css('display','none');
				if(location.href.search(/settings/) > 1 && location.href.search(/act/) == -1) $('#settings_cmpvk_player').prop("checked", true);
			}
			//
			var sbox = $('.settings_panel');
			if(location.href.search(/settings/) > 1 && location.href.search(/act/) == -1)
			{
				if(SettingsAdd == false)
				{
					SettingsAdd = true;
					var 
						CheckBox, 
						CheckBoxPlayerState
					;
					if(cmpvk[0] == 0) CheckBox = '<input class="blind_label" type="checkbox" id="settings_cmpvk_state">';
					else if(cmpvk[0] == 1) CheckBox = '<input checked class="blind_label" type="checkbox" id="settings_cmpvk_state">';
					
					if(cmpvk[1] == 0) CheckBoxPlayerState = '<input class="blind_label" type="checkbox" id="settings_cmpvk_player">';
					else if(cmpvk[1] == 1) CheckBoxPlayerState = '<input checked class="blind_label" type="checkbox" id="settings_cmpvk_player">';

					sbox.prepend('\
						<div class="settings_line">\
							<div class="settings_info_block">\
								<div class="settings_label">Custom Media Player</br>Настройки</div>\
								<div class="settings_labeled_text">\
									<!--div class="settings_menu_link"></div-->\
									<div class="settings_narrow_row">\
										' + CheckBox + '\
										<label for="settings_cmpvk_state">Использовать плеер</label>\
									</div>\
									<div class="settings_narrow_row">\
										' + CheckBoxPlayerState + '\
										<label for="settings_cmpvk_player">Скрыть плеер</label>\
									</div>\
								</div>\
							</div>\
						</div>\
					');
					$('#settings_cmpvk_state').change(function(e)
					{
						var state = $(this).prop("checked");
						if(state == true)
						{
							cmpvk[0] = 1;
							UpdateSettings();
							CMPVKsetState(true);
						}
						else 
						{

							cmpvk[0] = 0;
							UpdateSettings();
							CMPVKsetState(false);
						}
					});
					$('#settings_cmpvk_player').change(function(e)
					{
						var state = $(this).prop("checked");
						if(state == true)
						{
							cmpvk[1] = 1;
							UpdateSettings();
							$('.top_audio_player').css('display','none');
						}
						else 
						{
							cmpvk[1] = 0;
							UpdateSettings();
							$('.top_audio_player').css('display','block');
						}
					});
				}
			}
			else
			{
				SettingsAdd = false;
			}
		}).observe(document.body, {childList: true, subtree: true});
	}
	
	function CMPVKsetState(state)
	{
		if(state == false)
		{
			main_box.find('.top_audio_player_img').css('display','none');
			// prev
			main_box.find('.top_audio_player_prev').css({
				'position': 'relative',
				'top': 'unset',
				'bottom': 'unset',
				'left': 'unset'
			});
			// play/pause
			main_box.find('.top_audio_player_play').css({
				'position': 'relative',
				'top': 'unset',
				'bottom': 'unset',
				'left': 'unset'
			});
			// next
			main_box.find('.top_audio_player_next').css({
				'position': 'relative',
				'top': 'unset',
				'bottom': 'unset',
				'left': 'unset'
			});
			//
			main_box.find('.top_audio_player_title_wrap').css({
				'position': 'relative',
				'top': 'unset',
				'left': 'unset',
				'right': 'unset',
				'bottom': 'unset',
				'margin': '14px 0 0'
			});
			main_box.find('.top_audio_player_title').css('display','inline-block');
		}
		else
		{
			main_box.find('.top_audio_player_img').css('display','block');
			// prev
			main_box.find('.top_audio_player_prev').css({
				'position': 'absolute',
				'top': '0px',
				'bottom': '0px',
				'left': '42px'
			});
			// play/pause
			main_box.find('.top_audio_player_play').css({
				'position': 'absolute',
				'top': '0px',
				'bottom': '0px',
				'left': '77px'
			});
			// next
			main_box.find('.top_audio_player_next').css({
				'position': 'absolute',
				'top': '0px',
				'bottom': '0px',
				'left': '107px'
			});
			//
			main_box.find('.top_audio_player_title_wrap').css({
				'position': 'absolute',
				'top': '-40px',
				'left': '137px',
				'right': '0px',
				'bottom': '0px',
				'margin': '0px'
			});
			main_box.find('.top_audio_player_title').css('display','none');
		}
	}

	// css
	var CMP_CSS = '\
	<style>\
	\
	@import url(https://fonts.googleapis.com/css?family=Material+Icons);\
	\
	.top_audio_player.top_audio_player_enabled{\
		position: relative;\
		width: 100%;\
	}\
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
		transition: 0.2s;\
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
		transition: 0.2s;\
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
			main_box.find('.top_audio_player_title_wrap').append('\
			<div class="top_audio_player_cmp_author"></div>\
			<div class="top_audio_player_cmp_name"></div>\
			');
            main_box.append('\
			<div class="top_audio_player_img">\
			</div>\
			<div class="top_audio_player_download_state">\
			</div>\
			' + CMP_CSS);
			
			// Start updater
			Start();
		}
	});
	
	CMP[1] = 0;
	CMP[2] = '';
	
	function CMPUpdate()
	{
		CMP[0] = getAudioPlayer()._currentAudio;
		if(CMP[0] != false)
		{
			//main_box.find('.top_audio_player_img').find('div a')[0].href = getAudioPlayer()._impl._currentAudioEl.src;
			//
			var check_track = CMP[0][4] + '_' + CMP[0][3];
			if(CMP[2] == '' || CMP[2] != check_track)
			{
				main_box.find('.top_audio_player_cmp_author').css({
					'opacity': '0',
					'transform': 'translateY(-35px)'
				});
				main_box.find('.top_audio_player_cmp_name').css({
					'opacity': '0',
					'transform': 'translateY(-25px)'
				});
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
					main_box.find('.top_audio_player_cmp_author').css({
						'opacity': '0',
						'transform': 'translateY(35px)'
					});
					main_box.find('.top_audio_player_cmp_name').css({
						'opacity': '0',
						'transform': 'translateY(25px)'
					});
					//
					clearTimeout(CMP[3]);
					CMP[3] = setTimeout(function()
					{
						main_box.find('.top_audio_player_cmp_author').html(CMP[0][4]); // author
						main_box.find('.top_audio_player_cmp_name').html(CMP[0][3]); // music name
						/*var download_str = 'Скачать ' + main_box.find('.top_audio_player_cmp_author').text() + ' - ' + main_box.find('.top_audio_player_cmp_name').text();
						main_box.find('.top_audio_player_download').attr('title', download_str);*/
						//
						main_box.find('.top_audio_player_cmp_author').css({
							'opacity': '1',
							'transform': 'translateY(0px)'
						});
						main_box.find('.top_audio_player_cmp_name').css({
							'opacity': '1',
							'transform': 'translateY(0px)'
						});
					}, 100);
				}, 100);
			}
			//
			/*if(Math.round(CMP[1], 2) == 100)
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
			}*/
		}
	}
	
	/*function download_file(url, name, type, callback) 
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
	}*/
})();
