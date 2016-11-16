$(function(){
    var title = "渲染信息监控<small class='glyphicon'>"+env+"</small>"
    $("#title").html(title);
    if (Notification.permission !== "granted"){
        Notification.requestPermission();
    }

function indexData(){
    var reply={};
    var id=0;
    loadfile(statisticurl,reply,fillstatistic,id);

    var jobreply ={limit:100,offset:0}
    var jobid='#indexjobstable';
    setTimeout(function(){
        loadfile(joburl,jobreply,filljobsinfotable,jobid);
    },100)


/*
    $('#taskbyidmodal').on('shown-bs-modal',function (e) {
        showTable();
    })

    if(jobtaskid!==""){
        //var taskreply ={limit:100,offset:0}
        //var taskid='#tasksinfotable';
        setTimeout(function(){
         showtaskinfoTable(jobtaskid)
         },300)
    }

*/


/*
    var slavereply ={limit:100,offset:0};
    var slaveid='#slavesinfotable';
    setTimeout(function(){
        loadfile(slaveurl,slavereply,fillslavesinfotable,slaveid);
    },500)
*/
    var queuesjobreply ={limit:100,offset:0};
    var queuesjobid='#queuesinfotable';
    setTimeout(function(){
        loadfile(queuesjoburl,queuesjobreply,fillqueuesinfotable,queuesjobid);
    },100)
}

    indexData();
    setInterval(function(){indexData()},50000);


$("#toggle").on('click',function(){
    if($("#queuesinfotable").hasClass('hidden')){
        $("#queuesinfotable").removeClass('hidden');
    }else{
        $("#queuesinfotable").addClass('hidden');
    }

})


})