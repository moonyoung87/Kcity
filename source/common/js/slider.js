//컨텐츠 상단이미지
$(document).ready(function(){
	var spd=1000;//속도
	var count=5000;//자동롤링시간
	var eft="easeInOutQuint"//이펙트
	var slideinter = setInterval(slideinterr,count);
	var slideNum = 0;
	var slideNum1;
	var slideMaxNum = $(".slide_box > ul.slide > li:last").index();
	$(".slide_box div.w").append("<div class='bull'></div>")
	$(".slide_box .slide>li").each(function(index){
		$(".slide_box div.w .bull").append("<button type='button'></button>");
	});
	$(".slide_box div.w .bull button:eq(0)").addClass("on");
	$(".slide_box").mouseenter(function(){
		clearInterval(slideinter);
	}).mouseleave(function(){
		slideinter = setInterval(slideinterr,count);
	});
	function slideinterr(){
		if(slideNum<slideMaxNum){
			++slideNum;
			slideNum1 = slideNum-1;
		}else{
			slideNum=0;
			slideNum1=slideMaxNum;
		}
		//alert("보일꺼"+slideNum+" 사라질꺼"+slideNum1);
		$(".slide_box div.w .bull button").removeClass("on");
		$(".slide_box div.w .bull button").eq(slideNum).addClass("on");
		$("ul.content > li").eq(slideNum).css({"top":"100%","left":"100%"}).stop(true,true).animate({top:"0",left:"0"},spd,eft);
		$("ul.content > li").eq(slideNum1).stop(true,true).animate({top:"-100%",left:"-100%"},spd,eft);
		$("ul.slide > li").eq(slideNum).css({"top":0,"left":0,"z-index":2});
		$("ul.slide > li").eq(slideNum).find("img").css({top:"80%",left:"80%"}).stop(true,true).animate({top:"0",left:"50%"},spd,eft);
		$("ul.slide > li").eq(slideNum1).css("z-index",3).stop(true,true).animate({top:"-100%",left:"-100%"},spd,eft);
	}
	function slideinterrminor(){
		if(slideNum<=0){
			slideNum=slideMaxNum;
			slideNum1=0;
		}else{
			--slideNum;
			slideNum1=slideNum+1;
		}
		//alert("보일꺼"+slideNum+" 사라질꺼"+slideNum1);
		$(".slide_box div.w .bull button").removeClass("on");
		$(".slide_box div.w .bull button").eq(slideNum).addClass("on");
		$("ul.content > li").eq(slideNum).css({"top":"-100%","left":"-100%"}).stop(true,true).animate({top:"0",left:"0"},spd,eft);
		$("ul.content > li").eq(slideNum1).stop(true,true).animate({top:"100%",left:"100%"},spd,eft);
		$("ul.slide > li").eq(slideNum).css({"top":0,"left":0,"z-index":2});
		$("ul.slide > li").eq(slideNum).find("img").css({top:"-80%",left:"-80%"}).stop(true,true).animate({top:"0",left:"50%"},spd,eft);
		$("ul.slide > li").eq(slideNum1).css("z-index",3).stop(true,true).animate({top:"100%",left:"100%"},spd,eft);
	}
	$(".slide_box button.btn.prev").click(function(){
		if(!$(".slide_box .slide>li").is(":animated")){
			slideinterrminor();
		};
		return false;
	});
	$(".slide_box button.btn.next").click(function(){
		if(!$(".slide_box .slide>li").is(":animated")){
			slideinterr();
		};
		return false;
	});
	$(".slide_box .bull button").click(function(){
		if(!$(".slide>li").is(":animated")){
			$(this).addClass("on").siblings().removeClass("on");
			if(slideNum==$(this).index()){
				//alert('중복임니다');
				return false;
			}else if(slideNum>$(this).index()){
				slideNum1=slideNum;
				slideNum=$(this).index();
				$("ul.content > li").eq(slideNum).css({"top":"-100%","left":"-100%"}).stop(true,true).animate({top:"0",left:"0"},spd,eft);
				$("ul.content > li").eq(slideNum1).stop(true,true).animate({top:"100%",left:"100%"},spd,eft);
				$("ul.slide > li").eq(slideNum).css({"top":0,"left":0,"z-index":2});
				$("ul.slide > li").eq(slideNum).find("img").css({top:"-80%",left:"-80%"}).stop(true,true).animate({top:"0",left:"50%"},spd,eft);
				$("ul.slide > li").eq(slideNum1).css("z-index",3).stop(true,true).animate({top:"100%",left:"100%"},spd,eft);
				//alert("보일꺼"+slideNum+" 사라질꺼"+slideNum1+"위로");
			}else{
				slideNum1=slideNum;
				slideNum=$(this).index();
				$("ul.content > li").eq(slideNum).css({"top":"100%","left":"100%"}).stop(true,true).animate({top:"0",left:"0"},spd,eft);
				$("ul.content > li").eq(slideNum1).stop(true,true).animate({top:"-100%",left:"-100%"},spd,eft);
				$("ul.slide > li").eq(slideNum).css({"top":0,"left":0,"z-index":2});
				$("ul.slide > li").eq(slideNum).find("img").css({top:"80%",left:"80%"}).stop(true,true).animate({top:"0",left:"50%"},spd,eft);
				$("ul.slide > li").eq(slideNum1).css("z-index",3).stop(true,true).animate({top:"-100%",left:"-100%"},spd,eft);
				//alert("보일꺼"+slideNum+" 사라질꺼"+slideNum1+"아래로");
			};
		};
	});
});