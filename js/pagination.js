/*$('.pagination').find('li').each(function () {
    $(this).click(function(){
        var currentPage=$(this).text();
        var limit = 10;
//var limit = $('#pageNumber').val();

        //页码变化
        var maxPageNumber =5;
        var middleNumber= Math.floor(maxPageNumber/2)+1;
        if(currentPage>middleNumber){

        }
        var offset = (currentPage-1)*limit;

        var reply={limit:limit,offset:offset}
        var id ="#jobstable";
        loadfile(joburl,reply,filljobstable,id);
    })
})*/

function serach(currentPage){
    $("#currentPage").val(currentPage);
    $("#searchForm1").ajaxSubmit({
        url :'${pageContext.request.contextPath}/jqueryFormPluginSimple/getForm', //默认是form的action，如果申明，则会覆盖
        type : "POST", // 默认值是form的method("GET" or "POST")，如果声明，则会覆盖
        dataType : "json", // html（默认）、xml、script、json接受服务器端返回的类型
        beforeSubmit : function(){
        },
        beforeSerialize: function(){
        },
        success: function(data){
            if (data.success == true) {
                buildTableData(data);

//jqPaginator初始化
                $.jqPaginator('#pagination', {
                    visiblePages: 10,
                    currentPage: data.currentPage,
                    pageSize: data.pageSize,
                    totalCounts: data.totalCounts,
                    onPageChange: function (num, type) {
                        if(type=="init") return;
                        serach(num);
                    }
                });


            }else{
                alert("error:"+data.responseText);
            }
        }

    });
}