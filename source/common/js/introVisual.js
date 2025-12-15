$(document).ready(function(){
	$("ul.pin > li").each(function(i){
		var _count=i*200;
		setTimeout(function(){
			$("ul.pin > li").eq(i).find("img").stop(true,true).fadeIn(300).animate({"margin-top":0},{duration:800,easing:"easeOutBounce",queue:false});
			$("ul.pin > li").eq(i).stop(true,true).animate({"background-size":47},800,"easeOutBounce");
		},_count);		
	});
	$(".close, h1").click(function(){
		var s=$("ul.loc > li:visible").index();
		$("ul.txt > li").eq(s).fadeOut(300).animate({"margin-top":"-22px"},{duration:300,easing:"easeInCubic",queue:false});
		$("ul.loc > li").eq(s).find("img").stop(true,true).animate({"margin-top":"22px"},"300","easeInCubic",function(){
			$("ul.pin > li").fadeIn(300);
			$("ul.loc > li").fadeOut(300);
			$("ul.nav > li").find("img").addClass("on",300);
			$(".bBg").fadeOut(300);
		});
		return false;
	});
});

function show(i){
	if(!$("#container *").is(":animated")){
		if($("ul.loc > li:visible").size()==0){
			$(".bBg").fadeIn(300);
			$("ul.nav > li").find("img").removeClass("on",300);
			$("ul.nav > li").eq(i).find("img").addClass("on",300);
			$("ul.pin > li").eq(i).siblings().fadeOut(300);
			$("ul.loc > li").eq(i).fadeIn(300,function(){
				$("ul.txt > li").eq(i).fadeIn(300).animate({"margin-top":0},{duration:300,easing:"easeOutCubic",queue:false});
				$(this).find("img").stop(true,true).animate({"margin-top":0},"300","easeOutCubic");
			});
		}else if(i==$("ul.loc > li:visible").index()){
			return false
		}else{
			var s=$("ul.loc > li:visible").index();
			$("ul.pin > li").eq(s).fadeOut(300);
			$("ul.txt > li").eq(s).fadeOut(300).animate({"margin-top":"-22px"},{duration:300,easing:"easeInCubic",queue:false});
			$("ul.loc > li").eq(s).find("img").stop(true,true).animate({"margin-top":"22px"},"300","easeInCubic",function(){
				$("ul.pin > li").eq(i).fadeIn(300);
				$("ul.nav > li").find("img").removeClass("on",300);
				$(this).parent().fadeOut(300,function(){
					$("ul.nav > li").eq(i).find("img").addClass("on",300);
					$("ul.loc > li").eq(i).fadeIn(300,function(){
						$("ul.txt > li").eq(i).fadeIn(300).animate({"margin-top":0},{duration:300,easing:"easeOutCubic",queue:false});
						$(this).find("img").stop(true,true).animate({"margin-top":0},"300","easeOutCubic");
					});
				});
			});
		};
	};
	return false;
}