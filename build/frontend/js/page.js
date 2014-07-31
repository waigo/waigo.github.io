$(document).ready(function() {
  
  // smooth scrolling
  var $root = $('html, body');
  var mainContentOffset = $('main#content').offset().top - 30;
  $('a').click(function() {
      var href = $.attr(this, 'href');
      $root.animate({
          scrollTop: $(href).offset().top - mainContentOffset
      }, 500, function () {
          window.location.hash = href;
      });
      return false;
  });

  $('body').scrollspy({ 
    target: '.waigo-content-menu',
    offset: 100
  });    

  /* Home page */
  if ($('body').hasClass('index')) {
    // let's make the content section has high as the window
    $("#banner").height($('#banner .text').height() + 100);
  }

  /* Guide page */
  if (0 < $('#guide').size()) {
    $('.waigo-content-menu').affix({
      offset: {
        top: $('#guide').offset().top
      }
    });
  } 
  /* API page */
  else if (0 < $('#api').size()) {
    $('.waigo-content-menu').affix({
      offset: {
        top: 0
      }
    });
  }


});
