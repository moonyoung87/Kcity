//접근성 포커스 강제 이동
function accessibilityFocus() {
  
  $(document).on('keydown', '[data-focus-prev], [data-focus-next]', function(e){
    var next = $(e.target).attr('data-focus-next'),
        prev = $(e.target).attr('data-focus-prev'),
        target = next || prev || false;
    
    if(!target || e.keyCode != 9) {
      return;
    }
    
    if( (!e.shiftKey && !!next) || (e.shiftKey && !!prev) ) {
      setTimeout(function(){
        $('[data-focus="' + target + '"]').focus();
      }, 1);
    }
    
  });
  
}

function lypop() {
  var openBtn = '[data-lypop]',
      closeBtn = '.layer_close';
  
  function getTarget(t) {
    return $(t).attr('data-lypop');
  }
  
  function open(t) {
    var showTarget = $('[data-lypop-con="' + t + '"]');
    showTarget.show().focus();
    showTarget.find('.layer_close').data('activeTarget', t);
  }
  
  function close(t) {
    var activeTarget = $('[data-lypop-con="' + t + '"]');
    activeTarget.hide();
    $('[data-lypop="' + t + '"]').focus();
  }
  
  $(document)
    .on('click', openBtn, function(e){
      e.preventDefault();
      open(getTarget(e.target));
    })
    .on('click', closeBtn, function(e) {
      e.preventDefault();
      close($(this).data('activeTarget'));
    })
  
}


$(document).ready(function(){
    lypop();
    accessibilityFocus();
});
