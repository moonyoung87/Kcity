$(document).ready(function () {

	/* main slide banner*/ 
	function mainSlider(item, show, break1, break2, fade, autoplay) {
		var slideWrap = $(item).closest('.slide');
		var prevBtn = slideWrap.find('.slick-prev');
		var nextBtn = slideWrap.find('.slick-next');
		var stopBtn = slideWrap.find('.slick-stop');
		var playBtn = slideWrap.find('.slick-play');
		
		$(item).slick({
			slidesToShow:show,
			autoplaySpeed:8000,
			//speed:2000,
			pauseOnHover: false,
			prevArrow: prevBtn,
			nextArrow: nextBtn,
			fade: fade,
			autoplay:autoplay,
			responsive: [
				{
				  breakpoint: 1000,
				  settings: {
					slidesToShow:break1
				  }
				},
				{
				  breakpoint: 480,
				  settings: {
					slidesToShow:break2
				  }
				}
			]
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
	mainSlider('.main-visual-slide','1','1','1',true,true) //메인비주얼
	mainSlider('.platform-slide','1','1','1',false,true) //플랫폼안내
	mainSlider('.banner-slide','1','1','1',false,true) // 일반배너
	mainSlider('.notice-slide','4','2','1',false,true) // 공지사항 최근글
	mainSlider('.press-slide','4','2','1',false,true) // 보도자료 최근글
	
	
	/*비디오*/
	//$('#video1')[0].play(); 
	
	/*홍보동영상팝업*/
	var video = $('#video');
	var videoOpen = $('.video-box .pop-open-btn');
	var videoClose = $('#videoView .close');
	videoOpen.on('click',function(){
		video.get(0).play();
	});
	videoClose.on('click',function(){
		video.get(0).pause();
	});

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
		}else {
			$('.main-visual .slide-con').css('height','500px')
			$('.sc-box').not('.footer-wrap').css('height','auto')
			$('.sc-box').off('mousewheel DOMMouseScroll');
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
				if(!$('body').hasClass('scroll')){
				    //check_animate1 = true;	
					$('body').addClass('scroll')
				   $("html,body").stop().animate({
						scrollTop: moveTop + 'px'
					}, {
						duration: 500, complete: function () {
							//check_animate1 = false;
							$('body').removeClass('scroll')
						}
					});
				}
			});
		});
	}
	
});
















