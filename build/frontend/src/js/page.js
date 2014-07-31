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
    $("#banner").height($(window).height());
    
    // parallax
    $('.prayerScene').parallax({ 
      originX: 0,
      limitY: 0,
      calibrateY: false,
    });

    // toggle parallax according to scroll pos
    // $(window).on('scroll', function(e) {
    //   var newOpacity = 1 - ($('body').scrollTop() / 100);
    //   if (0 > newOpacity) {
    //     newOpacity = 0;
    //   }
    //   $('.prayerScene').css('opacity', newOpacity);
    // });
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
