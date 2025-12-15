$(function() {
	$(window).scroll(function() {
		var scroll = $(window).scrollTop();
		if(scroll == "110" || scroll > "110") { // 스크롤이 110보다크면

			$("#left").addClass("fixed");
			$("#right").addClass("fixed");

		} if (scroll == "110" || scroll < "110") {

			$("#left").removeClass("fixed");
			$("#right").removeClass("fixed");


		}

	});

	$(".lnb>li>a").mouseenter(function() {
		var length = $(this).parent().children().length;
		$("#layer").hide();
		$(".lnb>li>ul").hide();
		if(length == 2) {
			//$(this).parent().addClass("on");
			$(this).parents().find("#layer").css("display","block");
			$(this).parent().find(".depth02").css("display","block");
			//$(this).parent().siblings().removeClass("on");
			$(this).parent().siblings().find(".depth02").css("display","none");
		}
		//$(this).parent().addClass("on");
		//$(this).parent().siblings().removeClass("on");
	});


	$(".b_bottom > span > a").click(function(){
		$(".b_bottom_layer").show();

		$left_width = $(window).width();
		$pop_width = $(".b_bottom_layer").width();
		$left_sum = $(window).scrollLeft() + ($left_width - $pop_width) /2;

		$top_height = $(window).height();
		$pop_height = $(".b_bottom_layer").height();
		$top_sum = $(window).scrollTop() + ($top_height - $pop_height) /2;
			
		$(".b_bottom_layer").css('left', $left_sum + "px");
		$(".b_bottom_layer").css('top', $top_sum + "px");
		
		return false;
	
	});

	$(".b_bottom_layer > span > a").click(function(){
		
		$(".b_bottom_layer").hide();
	});


	$("#left").mouseleave(function() {
		
		//$(".lnb").children().removeClass("on")
		$("#layer").css("display","none");
		$(".lnb").children().find(".depth02").css("display","none");
	
	});


});

function NowPage(num) {
	$(".lnb>li").eq(num-1).addClass("on");
}

function NowPageById(id1, id2){
	$("#"+id1).addClass("active");
	$("#"+id2).addClass("active");
}