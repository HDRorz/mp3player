/*
 * jquery.mp3player
 * author: HDRorz
 * 20160229
 * 
 * discuz空间音乐播放器html5实现
 *
 * xml 样例见foo.xml
 * 
 *
 */
 
 
 
 
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.mp3player = factory(root.jQuery);
  }
}(this, function($) {

//audio的html代码
var ahtmlhead = '<audio src="';
var ahtmlfoot = '" preload="auto" />';
var playerhtml = '\
	<div id="mp3player"> \
		<div id="title"></div> \
		<div id="player"> \
			<div id="playerbar"> \
				<div id="playerbtn"> \
					<span id="prev">←</span> \
					<span id="play">P</span> \
					<span id="pause">||</span> \
					<span id="next">→</span> \
					<div id="volume"> \
						<span id="voldown">-</span> \
						<span id="volup">+</span> \
					</div> \
				</div> \
				<div id="time"> \
					<span id="played">00:00</span> \
					<span style="margin: 0 -2px">/</span> \
					<span id="duration">00:00</span> \
				</div> \
			</div> \
			<div id="progress"> \
				<div id="loaded" class="progress"></div> \
				<div id="curprog" class="progress"></div> \
			</div> \
		</div> \
		<div id="mp3source"> \
		</div> \
	</div> \
';

var PLAYLIST = new Object();
PLAYLIST['title'] = new Array();
PLAYLIST['image'] = new Array();
PLAYLIST['duration'] = new Array();
var SETTING = new Object();
var timeoutProcess;


//播放器初始化
var _init = function(data) {
	//console.log(data);
	
	$('#mp3player').mouseover(function() {
		clearTimeout(timeoutProcess);
		$('#title').fadeIn(600);
		$('#player').fadeIn(600);
	});
	$('#mp3player').mouseleave(function() {
		timeoutProcess = setTimeout(function() {
			$('#title').fadeOut(1000);
			$('#player').fadeOut(1000);
		}, 1500);
	});
	$('#play').click(function() {
		_play(SETTING['play']);
	});
	$('#pause').click(function() {
		_pause(SETTING['play']);
	});
	$('#prev').click(function() {
		_play(SETTING['prev']);
	});
	$('#next').click(function() {
		_play(SETTING['next']);
	});
	$('#voldown').click(function() {
		SETTING['volume'] = (SETTING['volume'] - 0.1)<0 ? 0 : SETTING['volume'] - 0.1;
		_setvolume(SETTING['volume']);
	});
	$('#volup').click(function() {
		SETTING['volume'] = (SETTING['volume'] + 0.1)>1 ? 1 : SETTING['volume'] + 0.1;
		_setvolume(SETTING['volume']);
	});
	$('#progress').click(function(e) {
		var thisleft = 0;
		var ele = this;
        if (ele.offsetParent) {
			do { 
				thisleft += ele.offsetLeft; 
			} 
			while (ele = ele.offsetParent);
		}
		var curleft = e.pageX - thisleft;
		PLAYLIST['source'][SETTING['play']].currentTime = PLAYLIST['source'][SETTING['play']].duration * (curleft / this.offsetWidth);
	});
	
	var mp3config = $(data).find('mp3config');
	mp3config.children().each(function(i, ele) {
		SETTING[ele.tagName] = ele.textContent;
	});
	SETTING['play'] = 0;
	
	var trackList = $(data).find('trackList').find('track');
	trackList.each(function(i, ele) {
		$('#mp3source').append(ahtmlhead + $(ele).find('location').text() + ahtmlfoot);
		PLAYLIST['title'][i] = $(ele).find('annotation').text();
		PLAYLIST['image'][i] = $(ele).find('image').text();
	});
	PLAYLIST['source'] = $('#mp3source audio');
	PLAYLIST['source'].each(function(){
		$(this).bind('loadedmetadata', function() {
			var m = Math.floor(this.duration / 60);
			var s = Math.floor(this.duration % 60);
			var index = $(this).index();
			PLAYLIST['duration'][index] = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
			if(index == SETTING['play']) {
				$('#duration').text(PLAYLIST['duration'][index]);
			}
		});
	});
	
	SETTING['count'] = trackList.length;
	if(SETTING['shuffle'] == 'true') {
		SETTING['next'] = (0 +  Math.floor(Math.random() * SETTING['count'])<1 ? 1 :  Math.floor(Math.random() * SETTING['count'])) % SETTING['count'];
	} else {
		SETTING['next'] = (0 + 1) % SETTING['count'];
	}
	SETTING['prev'] = SETTING['count'] + 0 - 1;
	SETTING['status'] = 'stop';
	
	SETTING['volume'] = SETTING['volume'] != "" ? SETTING['volume']/100 : 0.5;
	_setvolume(SETTING['volume']);
	
	if(SETTING['autostart'] == "true") {
		_play(SETTING['play']);
	}
};

//播放歌曲
var _play = function(index) {
	if(isNaN(index)) {
		return;
	}
	var music = PLAYLIST['source'][index];
	
	$('#play').hide();
	$('#pause').show();
	if(index == SETTING['play'] && SETTING['status'] == 'pause') {
		music.play();
		return;
	}
	
	if(SETTING['status'] == 'play') {
		_stop(SETTING['play']);
	}
	
	if(SETTING['shuffle'] == 'true') {
		SETTING['next'] = (index +  Math.floor(Math.random() * SETTING['count'])<1 ? 1 :  Math.floor(Math.random() * SETTING['count'])) % SETTING['count'];
		SETTING['prev'] = SETTING['play'];
	} else {
		SETTING['next'] = (index + 1) % SETTING['count'];
		SETTING['prev'] = (SETTING['count'] + index - 1) % SETTING['count'];
	}
	SETTING['play'] = index;
	$('#title').text(PLAYLIST['title'][index]);
	$('#mp3player').css('background-image', 'url("' + PLAYLIST['image'][index] + '")');
	$('#duration').text(PLAYLIST['duration'][index]);
	$('#title').show();
	$('#player').show();
	timeoutProcess = setTimeout(function() {
		$('#title').fadeOut(1000);
		$('#player').fadeOut(1000);
	}, 1500);
	
	$(music).bind('progress', function() {
		$('#loaded').css('width', (music.buffered.length>1 ? 1 : music.buffered.length)*100 + '%');
	});
	$(music).bind('timeupdate', function() {
		var m = Math.floor(music.currentTime / 60);
		var s = Math.floor(music.currentTime % 60);
		$('#played').text((m<10?'0':'')+m+':'+(s<10?'0':'')+s);
		$('#curprog').css('width', music.currentTime/music.duration*100 + '%');
		//$('#curprog').css('width', music.played.length*100 + '%');
	});
	$(music).bind('ended', function() {
		$(music).unbind();
		_play(SETTING['next']);
	});
	
	music.play();
	SETTING['status'] = 'play';
};

//停止歌曲
var _stop = function(index) {
	if(isNaN(index)) {
		return;
	}
	PLAYLIST['source'][index].pause();
	PLAYLIST['source'][index].currentTime = 0;
	SETTING['status'] = 'stop';
};

//暂停歌曲
var _pause = function(index) {
	if(isNaN(index)) {
		return;
	}
	PLAYLIST['source'][index].pause();
	$('#play').show();
	$('#pause').hide();
	SETTING['status'] = 'pause';
};

//设置音量
var _setvolume = function(value) {
	if(isNaN(value)) {
		return;
	}
	PLAYLIST['source'].each(function(i, ele) {
		ele.volume = value;
	});
};

var mp3player = function(selector, sourceurl) {
	
	$(selector).append(playerhtml);
	
	var PLAYXML = $.ajax({
		url: sourceurl,
		async: true,
		dataType: 'xml',
		success: function(data){
			_init(data);
		}
	});
};

$.fn.mp3player = function(sourceurl) {
	return mp3player(this, sourceurl);
};

return mp3player;
}));