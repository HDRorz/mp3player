# mp3player
html5 audio player for discuz home

��Ϊdiscuz�ռ�����ֲ�������������վ�ű�©����ٷ�ɾ����mp3player.swf��ֻ���¿��ļ���Ӧ��̳ˮ��Ҫ����д��һ�����ֲ�����������html5��<audio>��ǩʵ�֣�ʹ��xml��ȡ�����б����Ϣ�������ļ������MP3��ʽ���Ͼ�֧�ֱȽ�ȫ�棬IE9+��FF22+ on winvista��xp�����ܷţ�����

Ƕ��discuzʹ����Ҫ�޸�function_space.php��567�У���Ϊ��
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