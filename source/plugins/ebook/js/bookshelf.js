(function($){
	
'use strict';	
	
////////////////////////////////////////////////////////////////////////////////

  function BookShelf(instance,options){	  
	  this.element=instance
	  this.options=options;
	  this.id=$(this.element).attr('id');
	   	
	  ///color for Bookshelf	 
	  var color=options['color'];
	  var rgb = toRGB(color.split("#")[1]);	    
	  var r=rgb[0]
	  var g=rgb[1]
	  var b=rgb[2]	  
	  var rgb=r+","+g+","+b;
	  var op_up=1;
	  var op_down=op_up/2.5;	  	  
	  var id=this.id; 
	  $('head').append('<style type="text/css">#'+id+'.bs-container .bs-shelf-background .bs-rectangle{ box-shadow: 0px 7px 1px rgba('+rgb+','+op_up+');                background: -moz-linear-gradient(top,  rgba('+rgb+','+op_up+') 0%, rgba(0,0,0,'+op_down+') 100%);                                        background: -webkit-linear-gradient(top,  rgba('+rgb+','+op_up+') 0%, rgba('+rgb+','+op_down+') 100%);                                                    background: linear-gradient(to bottom,  rgba('+rgb+','+op_up+') 0%, rgba('+rgb+','+op_down+') 100%);                                      }</style>');
	  
	  
	  this.init();
	  this.addWrap()
	  
	
	  
   }
   
////////////////////////////////////////////////////////////////////////////////// 
   
   BookShelf.prototype.addWrap = function () {	
	   
	   //reset before again wrap 
	   $(".bs-shelf-background",this.element).remove();
	   $(".bs-shelf",this.element).contents().unwrap();
	   $(".bs-shelf-images",this.element).contents().unwrap();
	   $('.bs-shelf-image',this.element).removeAttr('style');
	
	 	 
	   //set max width cotainer
	   $(this.element).css('max-width',this.options['width']+'px')
	   
	   //set width image ( container rectangle )
	   $('.bs-shelf-image',this.element).css('width',this.options['max_width']+'px');	
	  
	   //set space image 
	   $('.bs-shelf-image',this.element).css('margin-right',this.options['space']+'px');
	
	
	
	   //OLD add Wrap
	   /*
       var index=0;
       $(".bs-shelf-image",this.element).each(function() {
	      ++index;
		   
          if($(this).prev().length > 0) {			  
             if($(this).offset().top != $(this).prev().offset().top) {	
			    index--;
				return false;
			}}
        });	 
		console.log("index = "+index)
		/*/
		
		
		
		
		/////index new method
		var _current_width=$(this.element).width()
		var _x_space=this.options['space']//parseInt( $('.bs-container .bs-shelf-image').css('margin-right') )
		var _left_margin=this.options['margin_left']
		var _right_margin=this.options['margin_right']
		var _rectangle=this.options['max_width']//parseInt( $('.bs-container .bs-shelf-image').css('width') )
		var free_area=(  (_current_width - _left_margin - _right_margin  ) / (  _rectangle+_x_space  )  )
		var index=Math.floor( free_area );
		if( index < 1 ){ index= 1 }
		
		//alert(free_area)
		
		
        var images = $(".bs-shelf-image",this.element);
        for(var i = 0; i < images.length; i+=index) {
          images.slice(i, i+index).wrapAll("<div class='bs-shelf'><div class='bs-shelf-images'></div></div>");
		}
	   
	    //height
	    $('.bs-shelf',this.element).css('height',this.options['max_height']+'px');
					   
	    //add background
	    $('.bs-shelf',this.element).prepend("<div class='bs-shelf-background'><div class='bs-rectangle'></div></div>");
		
		//add mask
		$('.bs-textbox',this.element).wrap("<div class='bs-mask'></div>");
		
		
		///add margin left and right
		$('.bs-shelf-image:first-child',this.element).css('margin-left',this.options['margin_left']+'px');
	    $('.bs-shelf-image:last-child',this.element).css('margin-right',this.options['margin_right']+'px');
		 
		 
		

}
   
/////////////////////////////////////////////////////////////////////////////////   
   
  
   BookShelf.prototype.init = function () {
        var _this=this;
		$(window).bind('orientationchange resize', function(event){
     	   _this.addWrap()
		});
		
		
		//mouse over
		$("img",this.element).bind('mouseenter',function(){									
			var _bs_shelf_image=$(this).parent();
			if( _bs_shelf_image.attr('class')!="bs-shelf-image" ){
				_bs_shelf_image=_bs_shelf_image.parent();
			}
						
			var textbox=$('.bs-textbox',_bs_shelf_image);
			var textbox_height=textbox.innerHeight();
			var img=$(this);
			var img_width=img.width();
			var img_height=img.height();
			var img_top=img.position().top;
			textbox.css('width',img_width+'px')
            textbox.css('bottom',-textbox_height+'px');
				textbox.animate(
			            {
						  opacity: "1",
						  bottom:0+"px"
						  
						},
						200
				)	
		 })
			 
		///mouse out 
		$("img",this.element).bind('mouseleave',function(){
			var _bs_shelf_image=$(this).parent();
			if( _bs_shelf_image.attr('class')!="bs-shelf-image" ){
				_bs_shelf_image=_bs_shelf_image.parent();
			}			  
			var textbox=$('.bs-textbox',_bs_shelf_image);
			var img=$(this);
	    	textbox.animate(
			            {
						  opacity: "1",
						  bottom:-textbox.innerHeight()+"px"
						    
						},
						200
						)			
		    })
    };
	
	
/////////////////////////////////////////////////////////////////////////////////	


  $.fn.bookshelf = function( options ) {
	  
        var settings = $.extend({
             	color         : '#CCCCCC',
				width         : 800,    //width shelf
				max_height    : 170,    //max width for image
				max_width     : 110,    //max height for image
				space         : 20,      //space image
				margin_left   : 15,     //min margin left
				margin_right  : 15,     //min margin right
        }, options);	
		
		
        return this.each( function() {           
			new BookShelf(this,settings);			
        });

    }
	
///////////////////////////////////////////////////////////////////////////////////	


})(jQuery)




 
