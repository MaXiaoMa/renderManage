$(function(){
    var title = "渲染信息监控<small class='glyphicon'>"+env+"</small>"
    $("#title").html(title);
   init();

})
function init(){
    $('#change').one('click', function () {
        $('#confirmModal').modal('show');
        $('#confirm').one('click', function () {
            $('#confirmModal').modal('hide');
            change();
        })
    });
    $.ajax({
        type:'GET',
        url:serverstatusurl,
        dataType:'jsonp',
        success:function(json){
            console.log(json);
            if(json.status==0){
                $('#status').text("关闭");
                $('#change').text("开启");
            }else if(json.status==1){
                $('#status').text("开启");
                $('#change').text("关闭");
            }else{
                $('#status').text("无法获取状态");
                $('#change').text("不可用");
                $('#change').attr('disabled','disabled');
            }
        }
    });
}
function change(){
    $.ajax({
        type:'GET',
        url:serverstatuschangeurl,
        dataType:'jsonp',
        success:function(json){
            console.log(json);
            if(json.status==1){
                init();
                $('#alertModal').find('p').text(json.info);
                $('#alertModal').modal('show');
            }else if(json.status==0){
                $('#alertModal').find('p').text(json.info);
                $('#alertModal').modal('show');
            }

        }
    });
}