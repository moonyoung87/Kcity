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
















