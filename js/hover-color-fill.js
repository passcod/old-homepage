$(function() {
  $('[data-color]').hover(function() {
    $(this).css('color', $(this).attr('data-color'));
  }, function() {
    $(this).css('color', '');
  });
});