var life = (function($){
	// "use strict";
	//定义  defaultPlugin 构造函数
	var defaultPlugin = function(opt){
		this.defaults = {
			viewDirection : "vertical", //屏幕方向 横屏 horizontal 竖屏 vertical
			loadImg : true,//是否预加载图片
			playBgMusic : true, //是否播放背景音乐
			wxOpened : true, //是否接入微信JSSDK
			loadOptions : {
				loadImgSrc : "assets/images/", //加载的图片地址
				loadMusicSrc : "assets/images/", //加载的音乐地址
				loadImgAssets : null, //加载的图片数组  数组为二维数组 可将图片分组加载
				loadMusicAssets : null //加载的音乐数组
			},
			musicOptions : {
				musicLoop : false //是否循环播放背景音乐
			},
			wxOptions : {
				wxToken : "orlab", 
				debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    jsApiList :['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','chooseImage','previewImage','uploadImage','downloadImage','startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice'],		    
			    wxTitle1 : "分享到朋友圈标题", // 分享到朋友圈标题
			    wxTitle2 : "分享给朋友标题", // 分享给朋友标题
			    wxDesc : "分享给朋友详细描述", // 分享给朋友的描述
				wxLink : window.location.origin+"/", // 分享的链接
			    wxImgUrl : "assets/images/share.jpg" // 分享的图标
			}
		};
		//true 代表深度拷贝
		this.options=$.extend(true,{},this.defaults,opt);
	};	
	defaultPlugin.prototype = {
		init : function(){
			var _self = this, _options = this.options, _musicOptions=_options.musicOptions,loadImgAssets= _options.loadOptions.loadImgAssets;
			if(_options.loadImg){
				soundManager.setup({
				  	onready: function() {
				  		_self.addMusic();
				  		for(var i=0;i<loadImgAssets.length;i++)
				  		{
				  			if(i==0)
				  			{
				  				_self.addImagesForTag('menu'+i,loadImgAssets[i],true,_options.loadCompleteAmi);
				  			}
				  			else{
				  				_self.addImagesForTag('menu'+i,loadImgAssets[i],false,function(){}); 

				  			}
				  		}
				  	},
				  	defaultOptions : {
				  	  // 设置音乐的默认音量
				  	  volume: 33
				  	},
				});
			}
			
			if(_options.wxOpened)
			{
				_self.wxJSSDK();
			}

			if(_options.viewDirection == "vertical")
			{
				_self.viewInit();
			}
		},

		addMusic : function(){
			var _self = this, _options = this.options, _loadOptions=_options.loadOptions;
			//加载音乐
			var len,url;
	  		for(var i = 0, len = _loadOptions.loadMusicAssets.length; i < len; i++) { 
				url = _loadOptions.loadMusicSrc + _loadOptions.loadMusicAssets[i] + '.mp3'; 
				// queue the sound using the name as the SM2 id 
				loader.addSound(_loadOptions.loadMusicAssets[i], url); 
			} 
		},

		//加载图片 tag为分组的标签 loadImgAttr为加载的图片数组 showLoadNum 为是否输出加载图片的进度 comAni 为加载图片后执行的函数
		addImagesForTag : function(tag,loadImgAttr,showLoadNum,comAni){
			var _self = this, _options = this.options, _loadOptions=_options.loadOptions,_musicOptions=_options.musicOptions;
		    for(var i=0; i <loadImgAttr.length; i++) { 
		        var imageUrl = _loadOptions.loadImgSrc + loadImgAttr[i]; 
		        var pxImage = new PxLoaderImage(imageUrl, tag); 
		        loader.add(pxImage);
		    } 
		    // add a listener to update progress for the tag 
		    loader.addProgressListener(function(e) { 
	        	var number = Math.ceil( e.completedCount / e.totalCount * 100 );
	        	if(showLoadNum)
	        	{
	        		_options.onLoad(number);
	        	}			
		        if (e.completedCount==loadImgAttr.length)
		        {
		        	if(showLoadNum)
		        	{
		        		if(_options.playBgMusic)
						{
				    		_self.playSound("music",_musicOptions.musicLoop);
				    	}
		        	}	
		        	comAni();
		        }
		    }, tag); // scope listener to the current tag only 
			loader.start();
		},

		//播放音乐 sound 表示播放的音乐  loop 表示是否循环播放
		playSound : function(sound,loop){
			var _self = this, _options = this.options;
			soundManager.play(sound,{
			    onfinish: function() {
			    	if(loop)
			    	{
			    		_self.playSound(sound,loop);
			    	}
			    }
			});
		},

		//暂停音乐
		pauseSound : function(sound){
			soundManager.pause(sound);
		},

		//获取URL DATA
		getQueryString : function( name )					
		{
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]); return null;
		},

		//使用微信JS-SDK
		wxJSSDK : function(){
			var _self = this, _options = this.options, _wxOptions=_options.wxOptions;
			jQuery.getScript("http://res.wx.qq.com/open/js/jweixin-1.0.0.js",function() {
				function WeChatSDKjsonpCallback(json) {
					alert(json);
				}
				$.ajax({
					type: "get",
					async: false,
					url: "http://tools.orlab.me/shareunit/",
					data: {
						csrf: _wxOptions.wxToken,
						url: window.location.href.indexOf('#') == -1 ? window.location.href: window.location.href.substring(0, window.location.href.indexOf('#')),
						r: Math.random()
					},
					dataType: "jsonp",
					jsonpCallback: "WeChatSDKjsonpCallback",
					success : function(json){
						wx.config({
						    debug: _wxOptions.debug, 
						    appId: json.appid, 
						    timestamp: json.timeStamp,
						    nonceStr: json.nonceStr,
						    signature: json.signature,
						    jsApiList: _wxOptions.jsApiList
						});
	             	},
				});

				wx.ready(function(){
					// 分享到朋友圈
					wx.onMenuShareTimeline({
					    title: _wxOptions.wxTitle1, // 分享标题
					    link: _wxOptions.wxLink, // 分享链接
					    imgUrl: _wxOptions.wxLink+ _wxOptions.wxImgUrl, // 分享图标
					    success:  _wxOptions.wxShareSuccess
					});
					// 分享给朋友
					wx.onMenuShareAppMessage({
					    title: _wxOptions.wxTitle2, // 分享标题
					    desc: _wxOptions.wxDesc, // 分享描述
					    link: _wxOptions.wxLink, // 分享链接
					    imgUrl: _wxOptions.wxLink+ _wxOptions.wxImgUrl, // 分享图标
					    success:  _wxOptions.wxShareSuccess
					});
				});

				// wx.error(function(res){
				// 	alert("hello"+res);
				// });
			});
		},

		viewInit : function(){
			/*
			*
			* 设备判断
			* 返回对象userAgent;
			*
			*******************************/
			var _self = this, _options = this.options;
			if( _options.viewDirection == "vertical")
			{
				var userAgent = browserRedirect();
				var phoneWidth =  parseInt(window.screen.width);
				var phoneScale = phoneWidth/640;
				var ua = navigator.userAgent;
				if (/Android (\d+\.\d+)/.test(ua)){
					var version = parseFloat(RegExp.$1);
					// andriod 2.3
					if(version>2.3){
						document.write('<meta name="viewport" content="width=640, minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi">');
					// andriod 2.3以上
					}else{
						document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
					}
					// 其他系统
				} else {
					document.write('<meta name="viewport" content="width=640, user-scalable=no,target-densitydpi=device-dpi">');
				}

			}
			else{
				var userAgent = browserRedirect();
				var phoneHeight =  parseInt(window.screen.width);
				var phoneScale = phoneHeight/1138;
				var ua = navigator.userAgent;
				if (/Android (\d+\.\d+)/.test(ua)){
					var version = parseFloat(RegExp.$1);
					// andriod 2.3
					if(version>2.3){
						document.write('<meta name="viewport" content="width=1138, minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi">');
					// andriod 2.3以上
					}else{
						document.write('<meta name="viewport" content="width=1138, target-densitydpi=device-dpi">');
					}
					// 其他系统
				} else {
					document.write('<meta name="viewport" content="width=1138, user-scalable=no,target-densitydpi=device-dpi">');
				}
			}

			function browserRedirect() {
				var userAgent = {};
			    var sUserAgent = navigator.userAgent.toLowerCase();
			    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
			    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
			    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
			    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
			    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
			    var bIsAndroid = sUserAgent.match(/android/i) == "android";
			    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
			    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
			    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)
			    {
			    	if(bIsIpad)
			    		userAgent.equipment = 'ipad';
			    	else
			    		userAgent.equipment = 'mobile';

			    	if(bIsAndroid)
			    		userAgent.system = 'android';

			    	if(bIsIphoneOs)
			    		userAgent.system = 'ios';
				}else{
					userAgent.equipment = 'pc';
			    }

				var userAgentInfo = navigator.userAgent; 
				var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"); 
				userAgent.mobile = false;
				for(var v = 0; v < Agents.length; v++)
				{ 
					if(userAgentInfo.indexOf(Agents[v]) > 0)
					{
						userAgent.mobile = true;
						break;
					} 
				}
			    return userAgent;
			}			
		}
	};
	return {
		myPlugin : defaultPlugin
	};
})(jQuery);


