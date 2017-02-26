/*博客JS*/

//
$(function() {
  $(".cont-a").click(function() {
    $(".cont-a").removeClass("active");
    $(this).addClass("active");
    $(".content").hide();
    var cont_a = $(".cont-a");
    if(this == cont_a[0]) {
      $(".content").eq(0).show();
    } else if(this == cont_a[1]) {
      $(".content").eq(1).show();
    } else if(this == cont_a[2]) {
      $(".content").eq(2).show();
    } else if(this == cont_a[3]) {
      $(".content").eq(3).show();
    } else if(this == cont_a[4]) {
      $(".content").eq(4).show();
    } else {
      $(".content").eq(5).show();
    }
  });
});