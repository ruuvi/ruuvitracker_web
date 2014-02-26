'use strict';

/* random jQuery stuff
 *
 */
$().ready(function() {
  $('.nav li a').click(function (e) {
    var b = $('#navi-menu-toggle');
    if (b.is(':visible')) {
      b.click();
    }
  });
});
