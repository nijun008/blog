/*博客JS*/


$(function() {

  
  //内容切换
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

  //展开/收起全文
  $(".more").click(function() {
    if($(this).html() == "展开全文") {
      $(this).prev().css("height","auto");
      $(this).html("收起全文");
    } else {
      $(this).prev().css("height","3em");
      $(this).html("展开全文");
    }
  });
  //点击标题
  $(".art-title").click(function() {
    if($(this).parent().parent().children('.more').html() == "展开全文") {
      $(this).parent().parent().children('.txt').css("height","auto");
      $(this).parent().parent().children(".more").html("收起全文");
    } else {
      $(this).parent().parent().children('.txt').css("height","3em");
      $(this).parent().parent().children(".more").html("展开全文");
    }
  });

});

