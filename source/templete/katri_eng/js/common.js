$(document).ready(function () {
	
	/* PC Gnb */
    function gnb() {
		var $gnbList = $('.gnb').children();
		var $gnbDep2 = $('.gnb .gnb-dep2');
		var $gnbListLast = $('.gnb > li:last > .gnb-dep2 li:last');
		var $gnbBg = $('.gnb-bg');
		$gnbList.on('mouseenter focusin', function () {
			$gnbDep2.removeClass('on');
			$(this).find('.gnb-dep2').addClass('on');
			$(this).addClass('on').siblings().removeClass('on');
			$gnbBg.addClass('on');			
			$('.header').addClass('on');
		});
		$gnbList.on('mouseleave', function () {
			$(this).removeClass('on');
			$gnbDep2.removeClass('on');
			$gnbBg.removeClass('on');
			$('.header').removeClass('on');
		});		
		$gnbListLast.on('focusout', function () {
			$gnbList.removeClass('on');
			$gnbDep2.removeClass('on');
			$gnbBg.removeClass('on');
			$('.header').removeClass('on');
		});
	}
	gnb();
	
	/* mobile Gnb */
	function mobileGnb() {
		var $gnbDep1 = $('.mobile-gnb > ul > li > a');
		var $gnbDep2 = $('.gnb-dep2 > li > a');
		var $gnbOpen = $('.gnb-open');
		var $gnbClose = $('.gnb-close');
        $gnbDep1.on('click', function () {
			if($(this).closest('li').hasClass('on')){
				$(this).closest('li').find('ul').slideUp();
				$(this).closest('li').find('li').removeClass('on');
				$(this).closest('li').removeClass('on');		
			} else {
				$(this).closest('li').siblings().removeClass('on');
				$(this).closest('li').siblings().find('ul').slideUp();
				$(this).closest('li').find('.gnb-dep2').slideDown();
				$(this).closest('li').addClass('on');
			}
        });
		$gnbDep2.on('click', function () {
			if($(this).closest('li').hasClass('on')){
				$(this).closest('li').find('.gnb-dep3').slideUp();
				$(this).closest('li').removeClass('on');
			} else {
				$(this).closest('li').siblings().removeClass('on')
				$(this).closest('li').siblings().find('ul').slideUp();
				$(this).closest('li').find('.gnb-dep3').slideDown();
				$(this).closest('li').addClass('on');
			}
        });
		$gnbOpen.on('click',function(){
			$('.mobile-gnb').show();
			$gnbClose.show();
		});
		$gnbClose.on('click', function () {
			$gnbClose.hide();
			$('.mobile-gnb').hide();
			$('.mobile-gnb').find('li').removeClass('on');
			$('.gnb-dep2').hide();
			$('.gnb-dep3').hide();
        });	
		$('.mobile-gnb ul li').each(function(){
			if($(this).find('> ul').length){
				$(this).find('> a').addClass('on');
			}
		});
    };
	mobileGnb();


	/*header sticky*/
	$(window).on('scroll',function(){ 
		if ($(document).scrollTop() > 100) {
			$('.header-wrap').addClass('on');
		} else {
			$('.header-wrap').removeClass('on');
		}
	});
	
	/*top search*/
	$('.top-search-btn').on('click',function(e){
		e.preventDefault();
		$(this).toggleClass('on');
		$('.top-search').toggle();
		$(this).text($(this).text() === "검색열기" ? "검색닫기" : "검색열기");
	});
	
	/*relation site*/	
	var relateSiteBtn = $('.relate-site button');
	relateSiteBtn.on('click',function(){
		var relateSite = $(this).closest('.relate-site');
		if(!relateSite.hasClass('on')){
			relateSite.addClass('on');
			relateSite.find('ul').slideDown();
		} else {
			relateSite.removeClass('on');
			relateSite.find('ul').slideUp();
		}
	});
	
	/*drop toggle*/
	function dropToggle() {
		var dropBtn = $('.drop .drop-btn');
		dropBtn.on('click',function(){
			$(this).toggleClass('on');
			$(this).closest('.drop').siblings().find('.drop-btn').removeClass('on');
			$(this).closest('.drop').siblings().find('.drop-list').slideUp();
			$(this).closest('.drop').find('.drop-list').slideToggle('fast');
		});
	}
	dropToggle();
	

	
    /*popup*/
	function layerPopup() {
		var $this;
		$('.pop-open-btn').on('click', function () {
			var modal = $(this).data('modal');
			$('body').css('overflow', 'hidden');
			$(modal).attr('tabindex',0).show().focus();
			$this = $(this);
		});
		$('.popup-wrap .close').on('click', function () {
			$(this).closest('.popup-wrap').hide();
			$('body').css('overflow', 'auto');
			$this.focus();
		});
		$('.popup-wrap .focus-return').on('focus', function () {
			$(this).closest('.popup-wrap').attr('tabindex',0).focus();
		});
    }
	layerPopup();


	/*상단으로 이동*/
    function goTop() {
        $('.btn-gotop').on('click',function(){
           $('html,body').animate({scrollTop:0},500) 
        });
    };
    goTop();
    
	
	/* partner slider */ 
	function partnerSlide(item) {
		var slideWrap = $(item).closest('.slide');
		var prevBtn = slideWrap.find('.slick-prev');
		var nextBtn = slideWrap.find('.slick-next');
		var stopBtn = slideWrap.find('.slick-stop');
		var playBtn = slideWrap.find('.slick-play');
		
		$(item).slick({
			slidesToShow:6,
			autoplaySpeed:6000,
			//speed:2000,
			infinite:true,
			prevArrow: prevBtn,
			nextArrow: nextBtn,
			autoplay:true,
			responsive: [
				{
				  breakpoint: 1240,
				  settings: {
					slidesToShow:5
				  }
				},
				{
				  breakpoint: 1000,
				  settings: {
					slidesToShow:4
				  }
				},
				{
				  breakpoint: 480,
				  settings: {
					slidesToShow:2
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
	partnerSlide('.partner-list') //하단파트너
	partnerSlide('.biz-partner') //메인중간파트너
	
	
	/*sub drop nav*/
	function subDropNav() {
		var dropBtn = $('.mo-drop-tit');
		dropBtn.on('click',function(){
			$(this).siblings('ul').slideToggle();
			$(this).toggleClass('on');
		});
	}
	subDropNav()
	
	/*tabInpage*/
	function tabInpage() {
		var tabBtn = $('.tabInpage ul li a');
		tabBtn.on('click',function(e){
			e.preventDefault();
			var thisTxt = $(this).text();
			var tabCon = $(this).attr('href');
			$(this).parent().addClass('on');
			$(this).parent().siblings().removeClass('on');
			$(tabCon).closest('.tabInpage-con').find('> div').removeClass('on');
			$(tabCon).addClass('on');
			$(this).closest('.tabInpage').find('.mo-drop-tit').text(thisTxt);
			$(this).closest('.tabInpage').find('.mo-drop-tit').removeClass('on');
			if($(window).width() <= 1000) {
				$(this).closest('ul').hide();
				$(this).closest('.tabInpage-con').find('.mo-drop-tit').removeClass('on');
			}
		});
	}
	tabInpage()
	

	/*side quick*/
	$('.side-quick .quick-btn').on('click',function(e){
		e.preventDefault();
		$(this).parent('.side-quick').toggleClass('on');
		//$(this).text($(this).text() === "퀵메뉴열기" ? "퀵메뉴닫기" : "퀵메뉴열기");
	});
	
	/*social share*/
	$('.page-location .page-func .btn-sns').on('click',function(){
		$('.sns-group').slideToggle();
	});
});












