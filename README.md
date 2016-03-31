# mp3player
html5 audio player for discuz home

因为discuz空间的音乐播放器被爆出跨站脚本漏洞后官方删除了mp3player.swf，只留下空文件。应论坛水友要求新写了一个音乐播放器，基于html5的<audio>标签实现，使用xml获取播放列表等信息。播放文件最好是MP3格式，毕竟支持比较全面，IE9+、FF22+ on winvista（xp好像不能放？）。

嵌入discuz使用需要修改function_space.php的567行，改为：
$playlisturl = >"home.php?mod=space&uid=$uid&do=index&op=getmusiclist&hash=$authcode$view&t=".TIMESTAMP;
>$html = <<<EOD
><script src="\\template\\xxx\js\jquery.min.js"></script>
><script src="\\template\\xxx\js\mp3player\jquery.mp3player.js"></script>
><script>
>	jQuery.noConflict();
>	jQuery('#music_content div').eq(0).mp3player("$playlisturl");
></script>
><link text="text/css" rel="stylesheet" href="\\template\\xxx\js\mp3player\mp3player.css">
>EOD;

[Example on discuz](http://bbs.niuyou5.com/home.php?mod=space&uid=2079457)