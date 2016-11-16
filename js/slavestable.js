$(function(){
    var title = "渲染信息监控<small class='glyphicon'>"+env+"</small>"
    $("#title").html(title);
/*    var reply ={limit:10,offset:0}
    var id='#slavestable';
    loadfile(slaveurl,reply,fillslavestable,id);*/

    $('#slavePage').jqPaginator({
        totalCounts:50,
        pageSize:10,
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
            var id='#slavestable';
            //if(type=="init") return;
            loadfile(slaveurl,reply,fillslavestable,id);
        }
    })
})
