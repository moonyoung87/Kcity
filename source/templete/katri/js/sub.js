$(document).ready(function () {
	
	function gallerySlide() {
		$('.gallery-slide').slick({
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  fade: true,
		  arrows:false,
		  asNavFor: '.gallery-slide-nav'
		});
		$('.gallery-slide-nav').slick({
		  slidesToShow: 8,
		  slidesToScroll: 1,
		  asNavFor: '.gallery-slide',
		  focusOnSelect: true,
		  centerMode: true,	
		  responsive: [
				{
				  breakpoint: 1400,
				  settings: {
					slidesToShow:6
				  }
				},
				{
				  breakpoint: 1000,
				  settings: {
					slidesToShow:3
				  }
				},
				{
				  breakpoint: 768,
				  settings: {
					slidesToShow:2
				  }
				}
			]
		});
	}
	gallerySlide();
	
	
});

 $(function () {
   /*신청 및 예약 상세 - 예약 가능날짜 선택 달력 */
   $("calendarBox .calendar td > a").attr("title", "예약가능");
   $(".calendarBox .calendar td > a").removeClass("selected");
   $(".calendarBox .calendar td").on("click", ">a", function (e) {
     e.preventDefault();
     if ($(this).hasClass("able")) {
       if (!$(this).hasClass("selected")) {
         $(".calendarBox .calendar td > a").removeClass("selected");
         $(this).addClass("selected");
         $(this).attr("title", "예약가능 선택됨");

       } else {

         $(this).removeClass("selected");
         $(this).attr("title", "예약가능");
       }

     };
     return false;
   });
 });



$(document).ready(function() {
   
    /*신청 및 예약 상세 - 예약 가능시간 선택 목록 */   
    $(".reg_time_list .list li").on("click",">a",function(e){
        //e.preventDefault();        
        
        if($(this).hasClass("able")){            
            if(!$(this).hasClass("selected")){
                $(this).addClass("selected");   
                $(this).attr("title","예약가능 선택됨");
            }else{
                $(this).removeClass("selected"); 
                $(this).attr("title","예약가능");
            }
            
        };
        return false;
        
        
    });    
    
});




$(document).ready(function() {
   
    /*마이페이지 예약 내역 - 승인불가 사유 툴팁*/
    $(".reason_tooltip .view_btn").on("click mouseenter focusin",function(e){
        //e.preventDefault();
        $(this).addClass("on");        
        return false;
    });
    $(".reason_tooltip").on("mouseleave focusout",function(e){        
        $(this).children(".view_btn").removeClass("on");        
    });      
    
});





/*3depth tab*/
$(function () {
  var $tab_info01 = $(".info_dept01 li > a");
  $(".info_dept01 > li:first-child").addClass("on");



  $tab_info01.on("click focus", function (e) {
	 
    e.preventDefault();
	 var btemTxt = $(this).text();
	

    $(".info_dept01 > li").removeClass("on");
    $(this).parent(".info_dept01 > li").addClass("on");	
	$(this).parent(".info_dept01 > li").find(".info_dept03 span").text(btemTxt);

  });

  

});







