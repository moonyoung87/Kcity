/*pc,mobile check*/
$(function(){
	chkpcm();
	$(window).resize(function(){
		chkpcm();
	});
});

function chkpcm(){
	if($("header .u_m").is(":visible")){
		$("body").addClass("pc");
		$("body").removeClass("mobile");
	}else{
		$("body").removeClass("pc");
		$("body").addClass("mobile");
	}
};

if (matchMedia("screen and (min-width: 1030px)").matches) {
	// 1030px 이상에서 사용할 JavaScript
	$(function(){
	  	var maxHeight = Math.max.apply(null, $("#gnb .g_l > li > .dp2").map(function ()
		{
			return $(this).children().size()*30+30;
		}).get());

		$("#gnb .g_l > li > ul").css({
			"height":maxHeight
		});
		$(".gnbBG .innering").css({
			"height":maxHeight
		});
		$("header #gnb .g_l > li > a").hover(function(){
			$("header #gnb .g_l > li > ul").stop().slideDown(150);
			$(".gnbBG").stop().slideDown(150);
		});
		//$(".gnbBG").mouseleave(function(){
		$("header #gnb .g_l").mouseleave(function(){
			$("header #gnb .g_l > li > ul").stop().slideUp(100);
			$(".gnbBG").stop().slideUp(100);
			$("header #gnb .g_l > li > a").parent().children("a").css({"color":"#3a3a3a"});
		});
		$("header #gnb .g_l > li > ul").hover(function(){
			$("header #gnb .g_l > li > a").css({"color":"#3a3a3a"});
			$(this).parent().children("a").css({"color":"#ff6600"});
			$("header #gnb .g_l > li > ul").css({"background":"#fff"});
			$(this).css({"background":"#f4f4f4"});
		});
		$("header #gnb .g_l > li > a").hover(function(){
			$("header #gnb .g_l > li > a").css({"color":"#3a3a3a"});
			$(this).parent().children("a").css({"color":"#ff6600"});
			$("header #gnb .g_l > li > ul").css({"background":"#fff"});
			$(this).parent().children("ul").css({"background":"#f4f4f4"});
		});
  });
}
if(matchMedia("screen and (min-width: 650px)").matches){
	$(function(){
		var menuSize = $(".sitemap > li > ul").size();
		var menuGroupCnt = parseInt(menuSize/4)+1;
		for(i=0;i<menuGroupCnt;i++){
			var startGr = (i*4)-1;
			var endGr = 4;
			var maxHeight = 0;
			if(startGr < 0){
				maxHeight = Math.max.apply(null, $(".sitemap > li:lt("+endGr+") > ul").map(function (index)
					{
						var heigth = $(this).children().size()*30 + $(this).find("ul > li").size()*20;
						//alert("gr["+i+"], UL["+index+"], heigth : "+heigth);
						return heigth;
					}).get());

				$(".sitemap > li:lt("+endGr+") > ul").css({
					"height":maxHeight
				});

			}else{
				maxHeight = Math.max.apply(null, $(".sitemap > li:gt("+startGr+"):lt("+endGr+") > ul").map(function (index)
					{
						var heigth = $(this).children().size()*30 + $(this).find("ul > li").size()*20;
						//alert("gr["+i+"], UL["+index+"], heigth : "+heigth);
						return heigth;
					}).get());
				$(".sitemap > li:gt("+startGr+"):lt("+endGr+") > ul").css({
					"height":maxHeight
				});
			}
		}
	});
}else if(matchMedia("screen and (min-width: 481px)").matches){
	$(function(){
		var menuSize = $(".sitemap > li > ul").size();
		var menuGroupCnt = parseInt(menuSize/3)+1;
		for(i=0;i<menuGroupCnt;i++){
			var startGr = (i*3)-1;
			var endGr = 3;
			var maxHeight = 0;
			if(startGr < 0){
				maxHeight = Math.max.apply(null, $(".sitemap > li:lt("+endGr+") > ul").map(function (index)
					{
						var heigth = $(this).children().size()*30 + $(this).find("ul > li").size()*20;
						//alert("gr["+i+"], UL["+index+"], heigth : "+heigth);
						return heigth;
					}).get());
				$(".sitemap > li:lt("+endGr+") > ul").css({
					"height":maxHeight
				});
			}else{
				maxHeight = Math.max.apply(null, $(".sitemap > li:gt("+startGr+"):lt("+endGr+") > ul").map(function (index)
					{
						var heigth = $(this).children().size()*30 + $(this).find("ul > li").size()*20;
						//alert("gr["+i+"], UL["+index+"], heigth : "+heigth);
						return heigth;
					}).get());
				$(".sitemap > li:gt("+startGr+"):lt("+endGr+") > ul").css({
					"height":maxHeight
				});
			}
		}
	});
}else{
	$(function(){
		var menuSize = $(".sitemap > li > ul").size();
		var menuGroupCnt = parseInt(menuSize/2)+1;
		for(i=0;i<menuGroupCnt;i++){
			var startGr = (i*2)-1;
			var endGr = 2;
			var maxHeight = 0;
			if(startGr < 0){
				maxHeight = Math.max.apply(null, $(".sitemap > li:lt("+endGr+") > ul").map(function (index)
					{
						var heigth = $(this).children().size()*30 + $(this).find("ul > li").size()*20;
						return heigth;
					}).get());
				$(".sitemap > li:lt("+endGr+") > ul").css({
					"height":maxHeight
				});
			}else{
				maxHeight = Math.max.apply(null, $(".sitemap > li:gt("+startGr+"):lt("+endGr+") > ul").map(function (index)
					{
						var heigth = $(this).children().size()*30 + $(this).find("ul > li").size()*20;
						/*alert($(this).parent().children('h3').html());*/
						return heigth;
					}).get());
				$(".sitemap > li:gt("+startGr+"):lt("+endGr+") > ul").css({
					"height":maxHeight
				});
			}
		}
	});
}




$(window).resize(function() {
	if ($(window).width() <= 1029){
		$("header").removeClass();
	}
});


if ($(window).width() <= 1029)
{
	$(document).ready(function(){
		$("header").removeClass();
	});
}

/*GNB*/
$(function(){

	$("button.gnbOpen").click(function(){
		if($("body").hasClass("gnbOpen")){
			$("body").removeClass("gnbOpen");
		}else{
			$("body").addClass("gnbOpen");
		}
	});
	$(document).on("touchstart click",".bbg",function(e){
		e.preventDefault();
		$("body").removeClass("gnbOpen");
	});
});


/*LNB*/
$(function(){
	$("#lnb ul.lnb_l > li > a").click(function(){
		$("#lnb ul.lnb_l > li > a").removeClass("active");
		$(this).addClass("active");
		$("#lnb ul.lnb_l .dp2").slideUp(150);
		$(this).parent().find(".dp2").slideDown(150);
	});
});

/*visual*/
$(function(){
	var owls=$(".sliderWrap .bg");
	owls.owlCarousel({
		items:1,
		animateOut: 'fadeOut',
		responsiveClass:true,
		loop:true,
		autoplayTimeout:3000,
		autoplayHoverPause:true,
		autoplay:true,
		dots:true,
		dotsEach:true,
		autoHeight:true
	});
	$(".sliderWrap .bg").on("click",function(e){
		if($(this).hasClass("t1")){
			owls.trigger("prev.owl.carousel");
		}else if($(this).hasClass("t3")){
			owls.trigger("next.owl.carousel");
		}else{
			owls.trigger("stop.owl.autoplay");
		}
	});
	owls.on("focusin",function(){
		owls.trigger("stop.owl.autoplay");
	});
});

/*banner*/
$(function(){
	var owls=$("#banner .b_l");
	owls.owlCarousel({
		items:5,
		margin:15,
		dots:false,
		responsiveClass:true,
		loop:true,
		autoplayTimeout:3000,
		autoplayHoverPause:true,
		autoplay:true
	});
	$("#banner button.bt").on("click",function(e){
		if($(this).hasClass("t1")){
			owls.trigger("prev.owl.carousel");
		}else if($(this).hasClass("t3")){
			owls.trigger("next.owl.carousel");
		}else{
			owls.trigger("stop.owl.autoplay");
		}
	});
	owls.on("focusin",function(){
		owls.trigger("stop.owl.autoplay");
	});
});

/*nowpage control*/
function nowpage(d1,d2,d3){
	var dp1=d1-1;
	var dp2=d2-1;
	var dp3=d3-1;

	/*var adddp1="<li class='dp'>";
	adddp1+="<a href='#'></a>";
	adddp1+="<div class='dp2_w'>";
	adddp1+="<ul class='dp2'>";
	adddp1+=$("header .g_l").html();
	adddp1+="</ul>";
	adddp1+="</div>";
	adddp1+="</li>";
	$("#lnb ul.lnb_l").append(adddp1);
	$("#lnb ul.lnb_l>li.dp:eq(0) ul.dp2").find("ul.dp2").remove();*/
	$("#lnb ul.lnb_l>li.dp:eq(0)>a").text($("header .g_l>li:eq("+dp1+")>a").text());
	//$("header .g_l>li:eq("+dp1+")>ul.dp2>li:eq("+dp2+")>a").addClass("mon");

	/*var adddp2="<li class='dp'>";
	adddp2+="<a href='#'></a>";
	adddp2+="<div class='dp2_w'>";
	adddp2+="<ul class='dp2'>";
	adddp2+=$("header .g_l>li:eq("+dp1+")>ul.dp2").html();
	adddp2+="</ul>";
	adddp2+="</div>";
	adddp2+="</li>";
	$("#lnb ul.lnb_l").append(adddp2);
	$("#lnb ul.lnb_l>li.dp:eq(1)").find("ul.dp3").remove();
	$("#lnb ul.lnb_l>li.dp:eq(1)>a").text($("header .g_l>li:eq("+dp1+")>ul.dp2>li:eq("+dp2+")>a").text());*/
	$("header .g_l>li:eq("+dp1+")>ul.dp2>li:eq("+dp2+")>a").addClass("mon");

	/*var adddp3="<li class='dp'>";
	adddp3+="<a href='#'></a>";
	adddp3+="<div class='dp2_w'>";
	adddp3+="<ul class='dp2'>";
	adddp3+=$("header .g_l>li:eq("+dp1+")>ul.dp2>li:eq("+dp2+")>ul.dp3").html();
	adddp3+="</ul>";
	adddp3+="</div>";
	adddp3+="</li>";
	//$("header .g_l>li:eq("+dp1+")").addClass("active");*/
	if($("header .g_l>li:eq("+dp1+")>ul.dp2>li:eq("+dp2+")>ul.dp3").size()>0){
		/*$("header .g_l>li:eq("+dp1+")>ul.dp2>li:eq("+dp2+")>ul.dp3>li:eq("+dp3+")>a").addClass("mon");
		$("#lnb ul.lnb_l").append(adddp3);*/
		$("#lnb ul.lnb_l>li.dp:eq(2)>a").text($("header .g_l>li:eq("+dp1+")>ul.dp2>li:eq("+dp2+")>ul.dp3>li:eq("+dp3+")>a").text());
	}
}


/*$(function(){
	$(".busin_list .thumb").mousemove(function(e){
		var w=$(this).innerWidth()/2;
		var h=$(this).innerHeight()/2;
		var x=(e.pageX-this.offsetLeft)-w;
		var y=(e.pageY-this.offsetTop)-h;
		var px=x*0.03;
		var py=y*0.03;
		$(this).find("img").css("-webkit-transform","translate3d("+px+"px,"+py+"px,0)");
		console.log(x,y);
	}).mouseleave(function(){
		$(this).find("img").removeAttr("style");
	});
});*/

/*main브로슈어*/
function m_broshur(){
	var owls=$(".mbox.t3 ul.b_l");
	owls.owlCarousel({
		items:3,
		margin:20,
		dots:false,
		responsiveClass:true,
		loop:false,
		autoplay:false
	});
	$(".mbox.t3 .r .bbox>button").on("click",function(e){
		if($(this).hasClass("s_prev")){
			owls.trigger("prev.owl.carousel");
		}else{
			owls.trigger("next.owl.carousel");
		}
	});
}

$(function(){
	$("#modalpopup.zip ul.zipTab>li>a").click(function(){
		var _href=$(this).attr("href");
		$("#modalpopup.zip #zip1").hide();
		$("#modalpopup.zip #zip2").hide();
		$("#modalpopup.zip").find(_href).show();
		$(this).parent().addClass("active");
		$(this).parent().siblings().removeClass("active");
		return false;
	});
});

//qna기능
function qnaTabs(elm){
	$(elm).on("click",".answOpen",function(){
		if($(this).closest(".head").next().is(":visible")){
			$(this).closest(".head").next().hide();
		}else{
			$(elm).find(".answ").hide();
			$(this).closest(".head").next().show();
		};
		return false;
	});
};


$(function(){
	$("#container div.s-naviBox").hide()
	$("#container .neviTop a.ic.sharing").click(function(){
  		if($("#container ul.snsList > li").is(":hidden")){
    		$("#container div.s-naviBox").css({"opacity":1}).slideDown("slow");
  		}else{
  			$("#container div.s-naviBox").hide();
		}
	});
})