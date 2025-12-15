$(document).ready(function(){
	$("nav.gnb>.gnbw>ul>li").mouseenter(function(){
		if($(this).find(".depth2").size()==1){
			$("header>.gnbBg").show();
		}else{
			$("header>.gnbBg").hide();
		};
	});
	$("nav.gnb>.gnbw>ul").mouseleave(function(){
		$("header>.gnbBg").hide();
		$("nav.gnb .depth2").hide();
		$(this).find(">li>a").removeClass("on");
	});
	$("nav.gnb>.gnbw>ul>li").on("mouseenter",function(){
		//$(this).parent().addClass("active");
		$(this).find(">a").addClass("on");
		$(this).siblings().find(">a").removeClass("on");
		$(this).find("ul.depth2").show();
		$(this).siblings().find("ul.depth2").hide();
	});
	$("nav.gnb>.gnbw>ul>li").on("focusin",function(){
		if($(this).find(".depth2").size()==0){
			$(this).find("a").addClass("on");
			$(this).siblings().find("a").removeClass("on");
			$("header>.gnbBg").hide();
		};
		if($(this).find("ul.depth2").is(":hidden")){
			$("header>.gnbBg").show();
			$(this).find("a").addClass("on");
			$(this).siblings().find("a").removeClass("on");
			$(this).find("ul.depth2").show();
		};
		if($(this).siblings().find("ul.depth2").is(":visible")){
			$(this).siblings().find("ul.depth2").hide();
			//$(this).siblings().find("a").removeClass("on");
		};
	});
	$("nav.gnb>.gnbw>ul>li a:last").on("focusout",function(){
		$("header>.gnbBg").hide();
		$("nav.gnb>.gnbw>ul>li").find("ul.depth2").hide();
		$("nav.gnb>.gnbw>ul>li>a").removeClass("on");
	});
});

function slider(selector){
	var slideNum = 0;
	var slideNum1;
	var timer=5000;
	var slideMaxNum = $("#container ."+selector+" ul.slideimg li:last").index();
	$("#container ."+selector+" ul.slideimg li").each(function(index){
		$("#container ."+selector+" .bullWrap").append("<a href='#'><span class='blind'>"+eval($(this).index()+1)+"</span></a>");
	});
	$("#container ."+selector+" .bullWrap").css("margin-left",-($("#container ."+selector+" .bullWrap").width()+11)/2);
	$("#container ."+selector+" ul.slideimg li:first").show();
	$("#container ."+selector+" .bullWrap a:first").addClass("on");
	var slideinter = setInterval(slideinterr,timer);
	function slideinterr(){
		if(slideNum<slideMaxNum){
			++slideNum;
		}else{
			slideNum=0;
		}
		//console.log(slideNum);
		$("#container ."+selector+" .bullWrap a").removeClass("on");
		$("#container ."+selector+" .bullWrap a:eq("+slideNum+")").addClass("on");
		//$("#container ."+selector+" ul.slideimg li").fadeOut(300); 
		$("#container ."+selector+" ul.slideimg li:eq("+slideNum+")").fadeIn(500).siblings().fadeOut(500);
	};
	$("#container ."+selector+" .bullWrap a").on("click",function(){
		slideNum = $(this).index()-1;
		//alert(slideNum);
		$("#container ."+selector+" .bullWrap a").removeClass("on");
		$("#container ."+selector+" .bullWrap a:eq("+slideNum+")").addClass("on");
		$("#container ."+selector+" ul.slideimg li:eq("+slideNum+")").fadeIn(500).siblings().fadeOut(500);
	});
//	$("#container ."+selector).mouseenter(function(){
//		clearInterval(slideinter);
//	}).mouseleave(function(){
//		slideinter = setInterval(slideinterr,timer);
//	});
};

function nowpage(d2,d3){
	var dp2=d2-1;
	var dp3=d3-1;
	$("ul.lnb>li").eq(dp2).find(">a").addClass("on");
	if($("ul.lnb>li").eq(dp2).find(">ul.dp2").size()>0){
		$("ul.lnb>li").eq(dp2).find("ul.dp2").show();
		$("ul.lnb>li>ul.dp2>li").eq(dp3).find(">a").addClass("on");
	};
	$("ul.lnb>li").on("click",function(){
		if($(this).find(">ul.dp2").size()>0){
			$(this).find(">a").addClass("on");
			$(this).find("ul.dp2").slideDown(300);
			$(this).siblings().find(">a").removeClass("on");
			$(this).siblings().find(">.dp2").slideUp(300);
			return false;
		};
	});
};
