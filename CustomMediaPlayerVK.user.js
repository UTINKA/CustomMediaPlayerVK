// ==UserScript==
// @date			01.01.2022
// @name			CustomMediaPlayerVK
// @namespace		https://github.com/UTINKA/CustomMediaPlayerVK/
// @version			1.1
// @description		Изменённый плеер в верхнем меню для ВК
// @author			UTINKA
// @include			https://vk.com/*

// @icon
// @homepage		https://greasyfork.org/ru/scripts/376022-custommediaplayervk
// @supportURL		

// @grant			none
// @require			http://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require			https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js

// @run-at			document-end
// ==/UserScript==

(function()
{
	var 
		CMP = [],
		SettingsAdd = false,
		AnimTimerState = false,
		AnimTimer = undefined
	;
	var main_box = $('#top_audio_player');
	


	function Start()
	{
		var mObserver = new MutationObserver(function(m) 
		{
			m.forEach(function(m) 
			{
				CMPUpdate();
				CMPVKsetState(true);
				if(AnimTimerState == false)
				{
					AnimTimerState = true;
					Animates();
				}					
				/*
				var sbox = $('.settings_panel');
				if(location.href.search(/settings/) > 1 && location.href.search(/act/) == -1)
				{
					var WaitTimer = setTimeout(function()
					{
						if(SettingsAdd == false)
						{
							SettingsAdd = true;
						}
						clearTimeout(WaitTimer);
					}, 1000);
				}
				else
				{
					SettingsAdd = false;		
				}*/
			});
		});
		
		mObserver.observe(document.documentElement, 
		{
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true,
			attributeOldValue: true,
			characterDataOldValue: true
		});
	}
	
	function CMPVKsetState(state)
	{
		if(state == false)
		{
			main_box.css({
				'width': 'unset',
				'padding': '0 20px 0 8px'
			});
			//
			main_box.find('.top_audio_player_img').css('display','none');
			// prev
			main_box.find('.top_audio_player_prev').css({
				'position': 'relative',
				'top': 'unset',
				'bottom': 'unset',
				'left': 'unset',
				'margin': '12px 2px'
			});
			// play/pause
			main_box.find('.top_audio_player_play').css({
				'position': 'relative',
				'top': 'unset',
				'bottom': 'unset',
				'left': 'unset',
				'margin': '12px 2px'
			});
			// next
			main_box.find('.top_audio_player_next').css({
				'position': 'relative',
				'top': 'unset',
				'bottom': 'unset',
				'left': 'unset',
				'margin': '12px 2px'
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
			main_box.find('.top_audio_player_cmp_author').css('display','none');
			main_box.find('.top_audio_player_cmp_name').css('display','none');
		}
		else
		{
			main_box.css({
				'width':'100%',
				'padding':'0'
			});
			//
			main_box.find('.top_audio_player_img').css('display','block');
			// prev
			main_box.find('.top_audio_player_prev').css({
				'position': 'absolute',
				'top': '0px',
				'bottom': '0px',
				'left': '60px',
				'filter': 'grayscale(1) brightness(1000%)'
			});
			// play/pause
			main_box.find('.top_audio_player_play').css({
				'position': 'absolute',
				'top': '0px',
				'bottom': '0px',
				'left': 'calc(60px + (60px / 2))',
				'filter': 'grayscale(1) brightness(1000%)'
			});
			// next
			main_box.find('.top_audio_player_next').css({
				'position': 'absolute',
				'top': '0px',
				'bottom': '0px',
				'left': 'calc(60px + 60px)',
				'filter': 'grayscale(1) brightness(1000%)'
			});
			//
			main_box.find('.top_audio_player_title_wrap').css({
				'position': 'absolute',
				'left': 'calc(24px*3 + 48px + 10px*3)',
				'top': '0',
				'right': '0',
				'bottom': '0',
				'height': '100%',
				'margin': '0'
			});
			main_box.find('.top_audio_player_title').css('display','none');
			main_box.find('.top_audio_player_cmp_author').css('display','unset');
			main_box.find('.top_audio_player_cmp_name').css('display','unset');
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
		width: 48px;\
		height: 48px;\
		background-color: rgba(0,0,0,0);\
		background-image: url(/images/audio_row_placeholder.png);\
		background-repeat: no-repeat;\
		background-size: cover;\
		transition: 0.5s;\
	}\
	.top_audio_player_img_bg_cover{\
		display: block;\
		width: 100%;\
		height: 100%;\
		z-index: -1;\
		position: absolute;\
		background: rgb(0 0 0 / 10%);\
	}\
	.top_audio_player_img_bg{\
		background-image: url(/images/audio_row_placeholder.png);\
		background-size: cover;\
		background-position-x: 0px;\
		background-position-y: 0px;\
		display: block;\
		position: absolute;\
		width: 400px;\
		height: 160px;\
		z-index: -2;\
		filter: blur(15px);\
		transition: 3s;\
	}\
	.top_audio_player_cmp_author{\
		opacity: 0;\
		position: absolute;\
		top: calc(48px / 2 + 2px);\
		left: 5px;\
		right: 0;\
		bottom: 0;\
		overflow: hidden;\
		white-space: nowrap;\
		text-overflow: ellipsis;\
		cursor: pointer;\
		color: rgb(255 255 255);\
		font-weight: bold;\
		transition: 0.2s;\
	}\
	.top_audio_player_cmp_name{\
		opacity: 0;\
		position: absolute;\
		top: calc(48px / 2 - 15px);\
		left: 5px;\
		right: 0;\
		bottom: 0;\
		overflow: hidden;\
		white-space: nowrap;\
		text-overflow: ellipsis;\
		cursor: pointer;\
		color: rgb(255 255 255);\
		font-weight: bold;\
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
		background: #2787f5;\
		transition: 0.5s;\
	}\
	.top_audio_player_download{\
		width: 48px;\
		height: 48px;\
		background: rgb(0 0 0 / 0%);\
		display: block;\
		transition: 0.5s;\
	}\
	.top_audio_player_download:hover{\
		width: 48px;\
		height: 48px;\
		background: rgb(0 0 0 / 50%);\
		display: block;\
	}\
	.top_audio_player_download i{\
		padding: 12px;\
		transform: scale(0);\
		transition: 0.5s;\
		user-select: none;\
		pointer-events: none;\
	}\
	.top_audio_player_download:hover i{\
		transform: scale(1);\
	}\
	</style>';
	
	window.addEventListener('load',function()
	{
		main_box.find('.top_audio_player_title_wrap').append('\
		<div class="top_audio_player_cmp_author"></div>\
		<div class="top_audio_player_cmp_name"></div>\
		');
		main_box.append('\
		<div class="top_audio_player_img">\
			<!--a class="top_audio_player_download"><i class="material-icons">play_for_work</i></a-->\
		</div>\
		<div class="top_audio_player_img_bg_cover"></div>\
		<div class="top_audio_player_img_bg"></div>\
			<div class="top_audio_player_download_state">\
		</div>\
		' + CMP_CSS);
			
		// Bind
		/*main_box.find('.top_audio_player_download').click(function(e)
		{
			var aid = getAudioID();
			var aURL = '';
			var obj = $(this);
			var aName = obj.attr('aName');
			
			get_data(aid).then(result => 
			{
				aURL = result.url;
				console.log(aURL);
				download_file(aURL, aName, "audio/mp3", window.download_audio);
			});
		});*/
		// Start updater
		Start();
	});
	
	CMP[1] = 0;
	CMP[2] = '';
	
	function Animates()
	{
		clearTimeout(AnimTimer);
		var X = RandXY(30, 20, 0, 100)[0];
		var Y = RandXY(20, 30, 0, 150)[1];

		CMP[0] = getAudioPlayer()._currentAudio;
		if(CMP[0] != false)
		{
			main_box.find('.top_audio_player_img_bg').css('background-position-x', X + 'px');
			main_box.find('.top_audio_player_img_bg').css('background-position-y', Y + 'px');
		}
		AnimTimer = setTimeout(function()
		{
			Animates();
		}, 2000);
	}
	
	function RandXY(X, Y, Min, Max) 
	{
		var result = [0,0];
		var X = Math.floor(Math.random() * ((X - Max) - Min) ) + Min;
		var Y = Math.floor(Math.random() * ((Y - Max) - Min) ) + Min;
		if(X != Y) result = [X,Y];
		else result = [0,0];
		return result;
	}
	
	
	function CMPUpdate()
	{
		CMP[0] = getAudioPlayer()._currentAudio;
		if(CMP[0] != false)
		{
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
					main_box.find('.top_audio_player_img_bg').css('background-image', 'url(' + CMP[0][14].split(',')[1] + ')');
				}
				else 
				{
					main_box.find('.top_audio_player_img').css('background-image', 'url(/images/audio_row_placeholder.png)');
					main_box.find('.top_audio_player_img_bg').css('background-image', 'url(/images/audio_row_placeholder.png)');
				}
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
						//
						var download_name = main_box.find('.top_audio_player_cmp_author').text() + ' - ' + main_box.find('.top_audio_player_cmp_name').text();
						main_box.find('.top_audio_player_download').attr('title','Скачать ' + download_name).attr('aName', download_name);
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
	}
	
	function getAudioID()
	{
		var i = AudioUtils.asObject(getAudioPlayer()._currentAudio);
		return `${i['fullId']}_${i['actionHash']}_${i['urlHash']}`;
	}
	
	function encode_url(t) 
	{
        let c = {
            'v': t=> t.split('').reverse().join(''),
            'r': (t, e) => {
                t = t.split('');
                for (let i, o = _ + _, a = t.length; a--; )
                    ~(i = o.indexOf(t[a])) && (t[a] = o.substr(i - e, 1));
                return t.join('')
            },
            's': (t,e)=> {
                let i = t.length;
                if (i) {
                    let o = ((t, e)=> {
                        let i = t.length,o = [];
                        if (i) {let a = i;
                        for (e = Math.abs(e); a--; )
                            e = (i * (a + 1) ^ e + a) % i,o[a] = e
                        }
                        return o
                    })(t, e), a = 0;
                    for (t = t.split(''); ++a < i; )
                        t[a] = t.splice(o[i - 1 - a], 1, t[a]) [0];
                    t = t.join('')}
                return t
            },
            'i': (t, e) => c['s'](t, e ^ vk.id),
            'x': (t, e,i=[])=> {
                return e = e.charCodeAt(0),
                    e(t.split(''), (t, o) =>
                    {i.push(String.fromCharCode(o.charCodeAt(0) ^ e))}),
                    i.join('')
            }
        },_ = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=',
            h=t=>{
            if (!t || t.length % 4 == 1)
                return !1;
            for (var e, i, o = 0, a = 0, s = ''; i = t.charAt(a++); )
                ~(i = _.indexOf(i)) &&
                (e = o % 4 ? 64 * e + i : i, o++ % 4) &&
                (s += String.fromCharCode(255 & e >> ( - 2 * o & 6)));
            return s
        };
        if ((!window['wbopen'] || !~(window.open + '').indexOf('wbopen')) && ~t.indexOf('audio_api_unavailable')) {
            let e = t.split('?extra=')[1].split('#'),i=''===e[1]?'':h(e[1]);
            if (e = h(e[0]), 'string' != typeof i || !e)
                return t;
            for (var o, a, s = (i = i ? i.split(String.fromCharCode(9))  : []).length; s--; ) {
                if (o = (a = i[s].split(String.fromCharCode(11))).splice(0, 1, e) [0], !c[o])
                    return t; e = c[o].apply(null, a)}if (e && 'http' === e.substr(0, 4)) return e
        }
        return t
	}
	
	function _g(url)
	{
		if(url.indexOf(".mp3?")!==-1) return url;
		else return url.replace("/index.m3u8",".mp3").replace(/\/\w{11}\//,'/');
	}

	function get_data(aid)
	{
		return new Promise(onSuccess => 
		{
			var data = undefined;
			ajax.post("/al_audio.php", {'act': 'reload_audio', 'al': '1', 'ids': aid + ""}, 
			{
				'onDone': a => 
				{
					each(a, (i, c) => 
					{
						c = AudioUtils.asObject(c);
						c['url'] = _g(encode_url(c['url']));
						data = c;
					});
					onSuccess(data);
				}
			})
		})
	}*/
	
})();
