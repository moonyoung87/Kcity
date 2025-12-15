$(document).ready(function () {

	/* main slide banner*/ 
	function mainSlider(item) {
		var slideWrap = $(item).closest('.slide');
		var prevBtn = slideWrap.find('.slick-prev');
		var nextBtn = slideWrap.find('.slick-next');
		var stopBtn = slideWrap.find('.slick-stop');
		var playBtn = slideWrap.find('.slick-play');
		
		$(item).slick({
			slidesToShow:1,
			autoplaySpeed:8000,
			//speed:2000,
			dots:true,
			prevArrow: prevBtn,
			nextArrow: nextBtn,
			autoplay:true
		});
		/*control*/
		$(stopBtn).on('click', function() {
			$(item).slick('slickPause');
			$(this).hide();
			$(playBtn).show();
		});
		$(playBtn).on('click', function() {
			$(item).slick('slickPlay');
			$(this).hide();
			$(stopBtn).show();
		});
	}
	mainSlider('.main-banner') //메인배너
	
	
	
	
	
	/*main tab*/
	function mainTab() {
		var tabBtn = $('.main-tab-nav li a');
		tabBtn.on('click',function(e){
			e.preventDefault();
			var tabCon = $(this).attr('href');
			$(tabCon).attr('tabindex',0).focus();
			
			$(this).parent().siblings().removeClass('on');
			$(this).parent().addClass('on');
			$(this).closest('.main-tab').find('.main-tab-con > div').removeClass('on');
			$(tabCon).addClass('on');
			$('.main-tab .slick-slider').slick('refresh');
		});
	}
	mainTab()
	
	
	/* 스크롤 이동*/
	var windowH = $(window).height();
	$(window).on('load scroll resize',function(){
		if($(window).width() > 1000) {
			$('.main-visual .slide-con').css('height',windowH)
			$('.sc-box').not('.footer-wrap').css('height',windowH)
			scrollSection();
		}	
		
	});
	function scrollSection() {
		var elm = ".sc-box";
		$(elm).each(function (index) {
			// 개별적으로 Wheel 이벤트 적용
			$(this).on("mousewheel DOMMouseScroll", function (e) {
				e.preventDefault();
				var delta = 0;
				if (!event) event = window.event;
				if (event.wheelDelta) {
					delta = event.wheelDelta / 120;
					if (window.opera) delta = -delta;
				} 
				else if (event.detail)
					delta = -event.detail / 3;
				var moveTop = $(window).scrollTop();
				var elmSelecter = $(elm).eq(index);
				// 마우스휠을 위에서 아래로
				if (delta < 0) {
					if ($(elmSelecter).next() != undefined) {
						try{
							moveTop = $(elmSelecter).next().offset().top;
						}catch(e){}
					}
				// 마우스휠을 아래에서 위로
				} else {
					if ($(elmSelecter).prev() != undefined) {
						try{
							moveTop = $(elmSelecter).prev().offset().top;
						}catch(e){}
					}
				}
				// 화면 이동 0.8초(800)
				$("html,body").stop().animate({
					scrollTop: moveTop + 'px'
				}, {
					duration: 500, complete: function () {
					}
				});
			});
		});
	}
	
});
















