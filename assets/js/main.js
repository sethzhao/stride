var loader = new PxLoader();
var preload = new life.myPlugin({
	// 加载时传出百分比
	onLoad : function(percentage){
		$(".loadingMode .count").text(percentage+"%");
		$(".wheelUp").animate({left: 252*percentage/100},10);
	},
	// 加载完成后执行的函数
	loadCompleteAmi : function(){
		pageAmin();
	},
	// 分享成功后执行的函数
	wxShareSuccess : function(){
		alert('分享成功');
	},	
	viewDirection : "vertical",
	playBgMusic : true,
	wxOpened : true,
	loadOptions : {
		loadImgAssets : [loadImgAssets1,loadImgAssets2], //加载的图片数组
		loadMusicAssets : loadMusicAssets, //加载的音乐数组
		loadMusicSrc : "assets/images/",
		loadImgSrc : "assets/images/"
	},
	wxOptions : {
		wxToken : "orlab",
		wxTitle1 : "炫迈来卖芒",
		wxTitle2 : "炫迈来卖芒",
		wxDesc : "双重果味夹出来！我在炫迈工厂“打工”拿到了尝鲜券哦～", // 分享给朋友的描述
	}
});
preload.init();


function pageAmin(){
	window.addEventListener('orientationchange', function(event){
	    if( window.orientation == 90 || window.orientation == -90 ) {
	        alert("请在竖屏模式下打开");
	    }
	});

	$(".loadingMode").hide();

	$(".factoryAttention").on("click",function(){
		$(".rule").fadeIn();
	});

	setTimeout($(".car2").addClass('car2Move'),1000);
	setTimeout($(".car3").addClass('car3Move'),2000);

	var i=0;
	setInterval(function(){
		i++;
		if(i>=3)
		{
			i=0;
		}
		$(".enterWrap>div").eq(i).fadeIn().siblings().fadeOut();
	},500);
	
	var j=0;
	setInterval(function(){
		j++;
		if(j>=2)
		{
			j=0;
		}
		$(".titleWrap>div").eq(j).fadeIn().siblings().fadeOut();
	},500);

	var m=0;
	setInterval(function(){
		m++;
		if(m>=2)
		{
			m=0;
		}
		$(".adv1>img").eq(m).show().siblings().hide();
	},1000);

	var n=0;
	setInterval(function(){
		n++;
		if(n>=2)
		{
			n=0;
		}
		$(".adv3>img").eq(n).show().siblings().hide();
	},1000);


	$(".enterWrap").on("click",function(){
		window.location.href="./game.html?wechat_card_js=1";
	});
}


