$(function(){
    var title = "渲染信息监控<small class='glyphicon'>"+env+"</small>"
    $("#title").html(title);

    $('#errorPage').jqPaginator({
        totalCounts:50,
        pageSize:100,
        visiblePages:5,
        currentPage:1,
        first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
        prev: '<li class="prev"><a href="javascript:void(0);">上一页</a></li>',
        next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
        last: '<li class="last"><a href="javascript:void(0);">末页</a></li>',
        page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
        onPageChange: function (num,type) {
            var limit=10;
            var offset=(num-1)*limit
            var reply ={limit:limit,offset:offset}
            var id='#errorstable';
            //if(type=="init") return;
            loadfile(errorurl,reply,fillerrorstable,id);
        }
    });

    $('#search').on('click',function(){
        var jobid=$('#jobid').val();
        if(jobid==undefined){
            $('#alertModal').find('p').text("job编号不能为空,请重新输入");
            $('#alertModal').modal('show');
        }else if(jobid.length>24){
            $('#alertModal').find('p').text("job编号长度不正确，请重新输入");
            $('#alertModal').modal('show');
        }else{
            var quest={jobid:jobid};
            var id='#errorstable';

            loadfile(errorbyidurl,quest,fillerrorstable,id);
        }

    });

});
