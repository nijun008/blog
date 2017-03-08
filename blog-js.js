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
    //切换后重新延迟获取augular创建的节点
    setTimeout(function () {
      $(".more").click(function() {
        if($(this).html() == "展开全文") {
          $(this).prev().css("height","auto");
          $(this).html("收起全文");
        } else {
          $(this).prev().animate({"height":"3.5em"}, 500);
          $(this).html("展开全文");
        }
      });
    },1500);
  });

  //展开/收起全文
  // $(".more").click(function() {
  //   if($(this).html() == "展开全文") {
  //     $(this).prev().css("height","auto");
  //     $(this).html("收起全文");
  //   } else {
  //     $(this).prev().css("height","3.5em");
  //     $(this).html("展开全文");
  //   }
  // });
  //点击标题
  // $(".art-title").click(function() {
  //   if($(this).parent().parent().children('.more').html() == "展开全文") {
  //     $(this).parent().parent().children('.txt').css("height","auto");
  //     $(this).parent().parent().children(".more").html("收起全文");
  //   } else {
  //     $(this).parent().parent().children('.txt').css("height","3.5em");
  //     $(this).parent().parent().children(".more").html("展开全文");
  //   }
  // });

  //新建博文保存
  $("#edi-submit").click(function () {
    var art_title = $("#edi-art-title").val();
    var art_author = $("#edi-art-author").val();
    var art_tag = $("#edi-art-tag").val();
    var art_time = artgettime(new Date()); 
    var art_txt = CKEDITOR.instances.edi_art_txt.getData();
    var art = getart(art_title,art_author,art_tag,art_time,art_txt);
    var JSONart = JSON.stringify(art);
    console.log(JSONart);
    $.ajax({
      type:"POST",
      url:"http://www.nijun.top:3000/ediart",
      data:JSONart,
      contentType:"application/x-www-form-urlencoded; charset=UTF-8",
      dataType:"text",
      success:function (data) {
        console.log(data);
        if(data=="OK") {
          $("#new-art").hide();
          $("#home").show();
          $(".cont-a").eq(0).addClass("active");
        }
      }
    })
  });

  //新建博文对象
  function getart(title,author,tag,time,txt){
    var newart = {
      "title":title,
      "author":author,
      "tag":tag,
      "time":time,
      "txt":txt,
    }
    return newart;
  }

  //获取年-月-日 小时：分钟 格式的时间
  function artgettime(date){
    var date_year = date.getFullYear();
    var date_month = (date.getMonth() + 1)<10 ? ("0"+(date.getMonth() + 1)) : (date.getMonth() + 1);
    var date_date = date.getDate()<10 ? ("0"+date.getDate()) : date.getDate();
    var date_hours = date.getHours()<10 ? ("0"+date.getHours()) : date.getHours();
    var date_minutes = date.getMinutes()<10 ? ("0"+date.getMinutes()) : date.getMinutes();
    return date_year + "-" + date_month + "-" + date_date + " " + date_hours + ":" + date_minutes
  }

  //延迟获取angular创建的节点
  setTimeout(function () {
    $(".more").click(function() {
    if($(this).html() == "展开全文") {
      $(this).prev().css("height","auto");
      $(this).html("收起全文");
    } else {
      $(this).prev().animate({"height":"3.5em"}, 500);
      $(this).html("展开全文");
    }
  });
  },1500);



});