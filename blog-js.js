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

  //绘制时钟
  var canvas = document.getElementById("clock");
  var clock = canvas.getContext('2d');
  function canvasClock() {
    //清除画布
    clock.clearRect(0,0,150,150);
    //获取时间
    var now = new Date();
    var secd = now.getSeconds();
    var min = now.getMinutes();
    var hour = now.getHours();
    hour = hour + (min / 60);           //浮点型小时
    hour = hour > 12 ? hour - 12 : hour;//12小时制
    //表盘
    clock.beginPath();
    clock.lineWidth = 1;
    clock.strokeStyle = "#000";
    clock.arc(75,75,73,0,360,false);
    clock.stroke();
    clock.closePath();
    //时刻度
    for(var i=0;i<12;i++) {
      clock.save();
      clock.lineWidth = 1;
      clock.strokeStyle = "#000";
      clock.translate(75,75);
      clock.rotate(i*30*Math.PI/180);
      clock.beginPath();
      clock.moveTo(0,-58);
      clock.lineTo(0,-70);
      clock.stroke();
      clock.closePath();
      clock.restore();
    }
    //分刻度
    for (var i = 0; i < 60; i++) {
      clock.save();
      clock.lineWidth = 1;
      clock.strokeStyle = "#333";
      clock.translate(75, 75);
      clock.rotate((i * 6) * Math.PI / 180);
      clock.beginPath();
      clock.moveTo(0,-66);
      clock.lineTo(0,-70);
      clock.closePath();
      clock.stroke();
      clock.restore();
    }
    //时针
    clock.save();
    clock.lineWidth = 4;
    clock.strokeStyle = "#000";
    clock.translate(75, 75);
    clock.rotate(hour * 30 * Math.PI / 180);
    clock.beginPath();
    clock.moveTo(0, -40);
    clock.lineTo(0, 1);
    clock.stroke();
    clock.closePath();
    clock.restore();
    //分针
    clock.save();
    clock.lineWidth = 3;
    clock.strokeStyle = "#000";
    clock.translate(75, 75);
    clock.rotate(min * 6 * Math.PI / 180);
    clock.beginPath();
    clock.moveTo(0, -53);
    clock.lineTo(0, 1);
    clock.stroke();
    clock.closePath();
    clock.restore();
    //秒针
    clock.save();
    clock.lineWidth = 2;
    clock.strokeStyle = "#bd2d30";
    clock.translate(75, 75);
    clock.rotate(secd * 6 * Math.PI / 180);
    clock.beginPath();
    clock.moveTo(0, -60);
    clock.lineTo(0, 1);
    clock.closePath();
    clock.stroke();
    //指针交叉点
    clock.beginPath();
    clock.arc(0, 0, 3, 0, 360, false);
    clock.closePath();
    clock.fillStyle = "#bd2d3o";
    clock.fill();
    clock.stroke();

    clock.restore();
  }
  canvasClock();
  setInterval(canvasClock,1000);
  
});