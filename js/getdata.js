//加载数据的函数，需要地址，请求参数，回调函数，和表格的id
function loadfile(url, redata, callback, id) {
    $.ajax({
        type: "GET",
        url: url,
        data: redata,
        dataType: "jsonp",
        success: function (data) {
            callback(id, data);
        },
        error: function (msg) {
            console.log(msg);
        }
    })
}
function filljobstable(id, json) {
    var html = "";
    var row = json.rows;
    var jobsTotalNumber = json.total;
    for (var i = 0; i < row.length; i++) {
        html += "<tr  id=\"index" + i + "\">";
        html += "<td id='jobid'>" + row[i]._id + "</td>";
        html += "<td><button type='button' class=\"" + jobbuttonStatus[row[i].Status] + "\">" + jobsStatus[row[i].Status] + "</button></td>";
        html += "<td>" + timeFormat(row[i].StartTime) + "</td>";
        html += "<td>" + row[i].Elapsed + "</td>";
        html += "<td>" + row[i].Width + "*" + row[i].Height + "</td>";
        html += "<td>" + row[i].ModelPath + "</td>";
        html += "<td>" + row[i].OutDir + "</td>";
        html += "<td>" + row[i].Camera + "</td>";
        html += "</tr>";
    }
    $(id).html(html);

    $('#jobPage').jqPaginator('option', {
        totalCounts: jobsTotalNumber
    });


}

function filljobsinfotable(id, json) {
    var html = "";
    var standardTime = new Date().getTime()-50*1000;//因为50秒刷新一次，所以此时对照的时间应为50秒之前

    var row = json.rows;
    for (var i = 0; i < row.length; i++) {
        var subtime = row[i].SubmitTime;
        var starttime = row[i].StartTime;
        var endtime = row[i].FinishTime;
        var totaltime = totalTime(starttime, endtime, row[i].Status);
        var waittime = waitTime(subtime, starttime,row[i].Status);

        html += "<tr id=\"index" + i + "\">";
        /*
         如果是预渲染，则加一个小图标，否则不加
         */
        if(row[i].IsPre==1){
        //html += "<td id='jobid' class='previewImg'>" + row[i]._id + "</td>";
        html += "<td id='jobid' style='width: 230px;;'>" + row[i]._id + "<img src='../css/images/preview.png' width='20px' height='20px' alt='preview' style='vertical-align: middle'></td>";
        }else{
        html += "<td id='jobid'>" + row[i]._id + "</td>";
        }
        html += "<td><button type='button' class=\"" + jobbuttonStatus[row[i].Status] + "\">" + jobsStatus[row[i].Status] + "</button></td>";
        if(row[i].Status== 2){
            /*
            如果状态为2，即任务完成，
            如果图片格式支持，则加上类名group1，
            如果格式不支持，则不加，(如果为预渲染，则均加group1类名)
            */
            //预览图的url
            if(row[i].ControlShare.match(/252/)){
                var previewUrl = img2url+row[i]._id+"/"+row[i].Camera+"_"+zfill(row[i].Frame,4)+"."+row[i].Format;
            }else{
                var previewUrl = imgurl+row[i]._id+"/"+row[i].Camera+"_"+zfill(row[i].Frame,4)+"."+row[i].Format;
            }

            if(row[i].Format.toLowerCase().match(/jpg|png|gif|bmp/)){
                    html +="<td ><a style='color:dodgerblue' class='group1' title='"+row[i].Camera+"' href='"+previewUrl+"'>"+row[i].MaxFileName+"</a></td>"
            }else{
                if(row[i].IsPre==1){
                    previewUrl = previewUrl.slice(0,-3)+"jpg";//如果是预渲染，则不论什么格式，均为jpg
                    html +="<td ><a style='color:dodgerblue' class='group1' title='"+row[i].Camera+"' href='"+previewUrl+"'>"+row[i].MaxFileName+"</a></td>"
                }else{
                    html +="<td ><a style='color:dodgerblue'  title='"+row[i].Camera+"' href='"+previewUrl+"'>"+row[i].MaxFileName+"</a></td>"
                }
            }
        }else if(row[i].Status== 1){
            html +="<td ><a style='color:green' class = 'group2' title='"+row[i].Camera+"' href='javascript:void(0)' onclick=\"openPreview('"+row[i]._id+"')\">"+row[i].MaxFileName+"</a></td>"
        }else{
            html += "<td>" + row[i].MaxFileName + "</td>";
        }
        if(row[i].Frame==undefined){//如果没有值，则用--填充
            html += "<td>" + "--" + "</td>";
        }else{
            html += "<td>" + row[i].Frame + "</td>";
        };
        html += "<td>" + row[i].Camera + "</td>";
        if (row[i].Group == undefined) {
            html += "<td>" + "--" + "</td>";
        } else {
            html += "<td>" + row[i].Group + "</td>";
        }
        html += "<td>" + timeFormat(row[i].SubmitTime) + "</td>";
        html += "<td>" + timeFormat(row[i].StartTime) + "</td>";
        html += "<td>" + waittime + "</td>";
        html += "<td>" + totaltime + "</td>";
        html += "<td>" + (row[i].Cores?row[i].Cores:"--") + "</td>";
        html += "<td>" + (row[i].TruePrice?(row[i].TruePrice/100).toFixed(2):"--") + "</td>";
        html += "<td><button type='button' class='btn btn-sm btn-success' onclick=\"jobsdetail('"+row[i]._id+"','"+row[i].TaskId+"')\">详情</button></td>";
        html += "</tr>";

        //判断是否有新任务，或者有任务结束
        if(millsecond(starttime)>=standardTime){
            notifyMe(row[i].MaxFileName,row[i].Camera,"start",row[i]._id);
        };
        if(millsecond(endtime)>=standardTime){
            notifyMe(row[i].MaxFileName,row[i].Camera,"finish",row[i]._id);
        }
    }
    $(id).html(html);
    $(".group1").colorbox({maxWidth:800,maxHeight:800});
    /*for (var i = 0; i < row.length; i++){
     var index="#index"+i;
     $(index).on('click', function () {

         var  jobid=$(this).find('#jobid').text();
         $.ajax({
             type: "GET",
             url: jobidurl,
             data: {jobid:jobid},
             dataType: "jsonp",
             success: function (data) {
                 var jobhtml="";
                 jobhtml+="<p>"+"文件名："+data.MaxFileName+"</p>";
                 jobhtml+="<p>"+"Max版本："+data.MaxVersion+"</p>";
                 jobhtml+="<p>"+"VRay版本："+data.VrayVersion+"</p>";
                 jobhtml+="<p>"+"图片格式："+data.Format+"</p>";
                 jobhtml+="<p>"+"图片尺寸："+data.Width+"*"+data.Height+"</p>";
                 jobhtml+="<p>"+"帧序列："+data.Frame+"</p>";

                 if(data.UseVrmap==0){
                     jobhtml+="<p>"+"渲染方式：硬渲"+"</p>";
                 }else if(data.UseVrmap==1){
                     jobhtml+="<p>"+"渲染方式：使用本地光子"+"</p>";
                     if(data.VrMode==1){
                         jobhtml+="<p>"+"发光贴图："+data.VrMap+"</p>";
                         jobhtml+="<p>"+"灯光缓存："+data.VrlMap+"</p>";
                     }else{
                         jobhtml+="<p>"+"发光贴图："+data.VrMap+"</p>";
                     }
                 }else if(data.UseVrmap==2){
                     jobhtml+="<p>"+"渲染方式：先渲光子后渲图"+"</p>";
                     jobhtml+="<p>"+"光子尺寸"+data.VrWidth+"*"+data.VrHeight+"</p>";
                 };
                 jobhtml+="<p>"+"单价："+(data.PriceRate?data.PriceRate:"--")+"分/核分钟"+"</p>";
                 jobhtml+="<p>"+"核心数："+(data.Cores?data.Cores:"--")+"</p>";
                 jobhtml+="<p>"+"进程号："+(data.ProcessId?data.ProcessId:"--")+"</p>";

                 $('#jobdetail').html(jobhtml);
                 $('#jobDetailModal').modal('show');
             },
             error: function (msg) {
                 console.log(msg);
             }

         })
     })
     }*/
}
//当任务正在渲染的时候，打开预览图
function openPreview(jobid){
    $.ajax({
        type: "GET",
        url: jobprocessurl,
        data: {jobid:jobid},
        dataType: "jsonp",
        success: function (data) {
            if (data.base64 != "") {
                var imgString = "<img src='data:image/jpg;base64,"+data.base64+"'/>";
                $.colorbox({maxWidth:800,maxHeight:800,html:imgString,title:data.process});
            } else {
                alert("图像获取失败")
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    })
}
//图片的序号，前面填充0
function zfill(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

//桌面提示，任务完成或者刚提交的时候，在桌面提示
function notifyMe(fileName,cameraName,status,tagId) {
    if (!Notification) {
        alert('你的浏览器不支持桌面通知，试试chrome？');
        return;
    }
    if(status=="start") {
        var extra = "新任务提交";
        var imageAddress = "../css/images/submit.png";
    }else{
        var extra = "任务完成";
        var imageAddress = "../css/images/complete.png";
    }
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification('渲染农场新消息', {
            icon: imageAddress,
            body: fileName+"中的"+cameraName+extra,
            tag:tagId
        });

        notification.onclick = function () {
            window.focus();
        };

        setTimeout(notification.close.bind(notification), 5000);

    }

}

//填充数据，并打开任务详情模态框
function jobsdetail(jobid,taskid){
    $.ajax({
        type: "GET",
        url: jobidurl,
        data: {jobid:jobid,taskid:taskid},
        dataType: "jsonp",
        success: function (json) {
            var data = json.job;
            var taskname = json.task;
            var appver = json.appver;
            var jobhtml="";
            jobhtml+="<p>"+"任务名："+taskname+"</p>";
            jobhtml+="<p>"+"客户端版本："+appver+"</p>";
            jobhtml+="<p>"+"文件名："+data.MaxFileName+"</p>";
            jobhtml+="<p>"+"Max版本："+data.MaxVersion+"</p>";
            jobhtml+="<p>"+"VRay版本："+data.VrayVersion+"</p>";
            jobhtml+="<p>"+"图片格式："+data.Format+"</p>";
            jobhtml+="<p>"+"图片尺寸："+data.Width+"*"+data.Height+"</p>";
            jobhtml+="<p>"+"帧序列："+data.Frame+"</p>";

            if(data.UseVrmap==0){
                jobhtml+="<p>"+"渲染方式：硬渲"+"</p>";
            }else if(data.UseVrmap==1){
                jobhtml+="<p>"+"渲染方式：使用本地光子"+"</p>";
                if(data.VrMode==1){
                    jobhtml+="<p>"+"发光贴图："+data.VrMap+"</p>";
                    jobhtml+="<p>"+"灯光缓存："+data.VrlMap+"</p>";
                }else{
                    jobhtml+="<p>"+"发光贴图："+data.VrMap+"</p>";
                }
            }else if(data.UseVrmap==2){
                jobhtml+="<p>"+"渲染方式：先渲光子后渲图"+"</p>";
                jobhtml+="<p>"+"光子尺寸"+data.VrWidth+"*"+data.VrHeight+"</p>";
            };
            jobhtml+="<p>"+"单价："+(data.PriceRate?data.PriceRate:"--")+"分/核分钟"+"</p>";
            jobhtml+="<p>"+"核心数："+(data.Cores?data.Cores:"--")+"</p>";
            jobhtml+="<p>"+"进程号："+(data.ProcessId?data.ProcessId:"--")+"</p>";

            $('#jobdetail').html(jobhtml);
            $('#jobDetailModal').modal('show');
        },
        error: function (msg) {
            console.log(msg);
        }

    })
}
//获取返回指定日期的时间戳
function millsecond(time) {
    var y = time.substring(0, 4);
    var m = time.substring(5, 7)-1;
    var d = time.substring(8, 10);
    var h = parseInt(time.substring(11, 13)) + 8;
    var mi = time.substring(14, 16);
    var s = time.substring(17, 19);
    var sm = time.substring(20, 23);
    var dd = new Date(y, m, d, h, mi, s, sm);
    return dd.getTime();
}
function totalTime(submit, end, status) {
    if (status==0){
        return "正在排队";
    }else if(status==1){
        return "渲染未结束";
    }else if(status==2){
        var startT = millsecond(submit);
        var endT = millsecond(end);
        var diff = ((endT - startT) / 1000 / 60).toFixed(2);
        return diff;
    }else{
        return "--";
    }


}

function waitTime(submit, starttime,status) {
    if(status==0){
        return "正在排队";
    }else if(status==1||status==2){
        var start = millsecond(submit);
        var end = millsecond(starttime);
        var diff = ((end - start) / 1000 / 60).toFixed(2);
        return diff;
    } else {
        return "--";
    }

}

function timeFormat(time) {
    if (time != undefined && time != "0001-01-01T00:00:00.000Z") {
        var y = time.substring(0, 4);
        var m = parseInt(time.substring(5, 7)) - 1;
        var d = time.substring(8, 10);
        var h = parseInt(time.substring(11, 13)) + 8;
        var mi = time.substring(14, 16);
        var s = time.substring(17, 19);
        var sm = time.substring(20, 23);
        var dd = new Date(y, m, d, h, mi, s, sm);
        var time = dd.toLocaleString();
        return time;
    } else {
        return "无时间记录";
    }

}


function filltaskstable(id, json) {
    var html = "";
    var row = json.rows;
    var tasksTotalNumber = json.total;
    for (var i = 0; i < row.length; i++) {
        html += "<tr>";
        html += "<td>" + row[i]._id + "</td>";
        html += "<td>" + row[i].SlaveKey + "</td>";
        html += "<td><button type='button' class=\"" + taskbuttonStatus[row[i].Status] + "\">" + tasksStatus[row[i].Status] + "</button></td>";
        html += "<td>" + row[i].StartTime + "</td>";
        html += "<td>" + row[i].FinishTime + "</td>";
        html += "<td>" + row[i].ElapsedMinues + "</td>";
        html += "<td>" + row[i].StripIndex + "</td>";
        html += "<td>" + row[i].TotalStrip + "</td>";
        html += "</tr>";
    }

    $(id).html(html);
    $('#taskPage').jqPaginator('option', {
        totalCounts: tasksTotalNumber
    });
}
function filltasksinfotable(id, json) {
    var html = "";
    var row = json.rows;
    for (var i = 0; i < row.length; i++) {
        html += "<tr>";
        html += "<td>" + row[i]._id + "</td>";
        //html += "<td>" + row[i].SlaveKey + "</td>";
        html += "<td><button type='button' class=\"" + taskbuttonStatus[row[i].Status] + "\">" + tasksStatus[row[i].Status] + "</button></td>";
        html += "<td>" + row[i].ElapsedMinues + "</td>";
        html += "<td>" + row[i].StripIndex + "</td>";
        //html += "<td>" + row[i].TotalStrip + "</td>";
        html += "</tr>";
    }

    $(id).html(html);


}
function fillslavestable(id, json) {
    var html = "";
    var row = json.rows;
    var slavesTotalNumber = json.total;
    for (var i = 0; i < row.length; i++) {
        html += "<tr>";
        html += "<td>" + row[i].HostName + "</td>";
        html += "<td id='mid'>" + row[i]._id + "</td>";
        html += "<td><button type='button' class=\"" + slavebuttonStatus[row[i].Status] + "\">" + slavesStatus[row[i].Status] + "</button></td>";
        html += "<td>" + row[i].Ip + "</td>";
        /* html += "<td>" + row[i].cpu0.cores + "</td>";
         html += "<td>" + toG(row[i].Memory.total) + "</td>";
         html += "<td>" + toG(row[i].DiskC.total) + "</td>";
         if(typeof(row[i].DiskD)!="undefined"){
         html += "<td>" + toG(row[i].DiskD.total) + "</td>";
         }else{
         html += "<td>" + "无D盘" + "</td>";
         }

         html += "<td>" + "<span id='start' class='glyphicon glyphicon-expand glyphicon-m'></span>" + "</td>";
         html += "<td>" + "<span id='close' class='glyphicon glyphicon-remove glyphicon-m'></span>" + "</td>";
         html += "<td>" + "<span id='restart' class='glyphicon glyphicon-refresh glyphicon-m'></span>" + "</td>";
         html += "</tr>";*/

    }

    $(id).html(html);

    $('#slavePage').jqPaginator('option', {
        totalCounts: slavesTotalNumber
    });

    for (var i = 0; i < row.length; i++) {
        //var index="#index"+i;
        $("#start").on('click', function () {
            var slaveid = $(this).find('#mid').text();
            showTable(slaveid);
        })
    }

}
function fillslavesinfotable(id, json) {
    var html = "";
    var row = json.rows;
    for (var i = 0; i < row.length; i++) {
        html += "<tr >";
        html += "<td>" + row[i].HostName + "</td>";
        html += "<td><button type='button' class=\"" + slavebuttonStatus[row[i].Status] + "\">" + slavesStatus[row[i].Status] + "</button></td>";
        html += "<td>" + row[i].Ip + "</td>";
        html += "</tr>";

    }
    $(id).html(html);
}

function fillqueuesinfotable(id, json) {
    var html = "";
    var row = json;
    for (var i = 0; i < row.length; i++) {
        html += "<tr >";
        html += "<td>" + row[i].name + "</td>";
        html += "<td><button type='button' class=\"" + queuesbuttonStatus[row[i].state] + "\">" + queuesStatus[row[i].state] + "</td>";
        // html += "<td><button type='button' class=\"" + slavebuttonStatus[row[i].Status] + "\">" + slavesStatus[row[i].Status] + "</button></td>";
        html += "<td>" + row[i].messages + "</td>";
        html += "<td>" + row[i].node + "</td>";
        html += "<td>" + row[i].vhost + "</td>";
        html += "</tr>";
    }
    $(id).html(html);
}

function fillstatistic(id, json) {
    $('#totaljob').text(json.total);
    $('#progress').text(json.progress);
    $('#complete').text(json.complete);
    $('#wait').text(json.wait);
}


function jobclick(index) {

    $(index).on('click', function () {
        console.log(12);
        $('#taskbyidmodal').modal('show');
    })


}
function showTable(jobid) {
    //var jobid = $(index).find('#jobid').text();
    var reply = {limit: 10, offset: 0, jobid: jobid};
    var id = '#taskbyid';

    loadfile(taskbyidurl, reply, filltaskstable, id);
};
function showtaskinfoTable(jobid) {
    //var jobid = $(index).find('#jobid').text();
    var reply = {limit: 10, offset: 0, jobid: jobid};
    var id = '#taskbyid';

    loadfile(taskbyidurl, reply, filltasksinfotable, id);
};

function toG(data) {
    var g = data / 1024 / 1024 / 1024;
    return g.toFixed(2)
};

function fillchart(id, data) {
    var chart = $(id).highcharts();
    var chart1 = $('#time_avg').highcharts();
    var chart2 = $('#time_price').highcharts();
    //数据类型为数组[[a,b],[a,b],[a,b]],a为字符串，显示为x轴刻度，b为数字，显示在y轴数值，y轴刻度自动生成
    //数据类型为数组[[1,2,3],[10,20,30],[100,200,300]],每个数组都是一个分类的数据
    //为每日渲染数量表填充数据
    chart.xAxis[0].setCategories(data.data.categories);//填充x轴分类
    chart.series[0].setData(data.data.series[0]);//将三个数据分别填充进三个数据列
    chart.series[1].setData(data.data.series[1]);
    chart.series[2].setData(data.data.series[2]);
    //为每日平均渲染时间表填充数据
    //chart1.series[0].setData(data.data[1]);
    //为每日金额表填充数据
    //chart2.series[0].setData(data.data[2]);

};
function fillTS(id, data) {
    var chart = $(id).highcharts();
    var datalist = [];
    for (var i = 0; i < data.length; i++) {
        var list = [];
        if (data[i].VrmapSize != '0kb') {
            list.push(data[i].Elapsed);
            list.push(parseUnit(data[i].VrmapSize));
            datalist.push(list);
        }

    }
    chart.series[0].setData(datalist);
};
function parseUnit(limit) {

    var limit = limit.toUpperCase();//转换为大写
    if (limit.indexOf('B') != -1) { //如果无单位,加单位递归转换
        limit = parseFloat(limit.substring(0, (limit.length - 1))) / 1024;
    } else if (limit.indexOf('K') != -1) {
        limit = parseFloat(limit.substring(0, (limit.length - 1)));
    } else if (limit.indexOf('M') != -1) {
        limit = parseFloat(limit.substring(0, (limit.length - 1))) * 1024;
    } else {
        limit = 0;
    }

    limit = Math.ceil(limit)
    return limit;
}
//group设置表格
function fillgrouptable(id, json) {
    var html = "";
    var html1 = "";
    var row = json;
    var groupIdList = [];
    var groupNameList = [];
    if (json.length == 0) {
        alert('暂无组信息，请点击[创建组]按钮创建!');
    } else {
        for (var i = 0; i < row.length; i++) {

            html += "<tr onClick=\"highLightChoosen(" + "\'" + row[i]._id + "\'" + ")\">";
            html += "<td>" + row[i].GroupName + "</td>";
            html += "<td><button type='button' class=\"" + taskbuttonStatus[row[i].Status] + "\">" + groupsStatus[row[i].Status] + "</button></td>";
            html += "<td>" + row[i].Num + "</td>";
            html += "<td>" + row[i].Speed + "</td>";
            html += "<td>" + row[i].SumCores + "</td>";
            html += "<td>" + row[i].MasterSlave + "</td>";
            if (row[i].Status == 1) {
                html += "<td>" + "--" + "</td>";
                html += "<td>" + "--" + "</td>";
            } else {
                html += "<td onClick=\"updateGroupModal(" + "\'" + row[i]._id + "\'" + ",\'" + row[i].GroupName + "\'" + ",\'" + row[i].Speed + "\'" + ",\'" + row[i].Status + "\'" + ")\">" + "编辑" + "</td>";
                html += "<td onClick=\"deleteGroup(" + "\'" + row[i]._id + "\'" + ")\">" + "删除" + "</td>";
            }
            html += "</tr>";
            groupIdList.push(row[i]._id);
            groupNameList.push(row[i].GroupName);
        }
        $(id).html(html);
    }
    for (var j = 0; j < groupNameList.length; j++) {
        html1 += "<option value=\'" + groupIdList[j] + "\'>" + groupNameList[j] + "</option>";
    }
    $('#groupname').html(html1);
    $('#group').html(html1);
}

function fillslaves(id, json) {
    var html = "";
    var row = json;
    if (row.length == 0) {
        $(id).html(html);
    } else {
        for (var i = 0; i < row.length; i++) {
            if(row[i].Master==1){
                html += "<tr style='color:lawngreen';'>";
                html += "<td>" + row[i].HostName +"<span class='glyphicon glyphicon-leaf' aria-hidden='true' style='color: lawngreen'></span>"+ "</td>";
            }else{
                html += "<tr>";
                html += "<td>" + row[i].HostName + "</td>";
            };
            html += "<td>" + row[i].Ip + "</td>";
            if(row[i].Cores==undefined){
                html += "<td>" + "--" + "</td>";
            }else{
                html += "<td>" + row[i].Cores + "</td>";
            };
            html += "<td onClick=\"showSlaveModal(" + "\'" + row[i]._id + "\'" + ",\'" + row[i].Gid + "\'" + ",\'" + row[i].Cores + "\'" + ",\'" + row[i].HostName + "\'"+ ",\'" + row[i].Master + "\'"+ ",\'" + row[i].Ip + "\'" + ")\">" + "更改" + "</td>";
            if(row[i].Master==1){
                html += "<td>" + "--" + "</td>"
            }else{
                html += "<td onClick=\"deleteSlave(" + "\'" + row[i]._id + "\'" + ",\'" + row[i].Gid + "\'"+",\'" + row[i].Cores + "\'" + ")\">" + "删除" + "</td>";
            };
            html += "</tr>";
        }
        $(id).html(html);
    }
};


//查询错误信息
function fillerrorstable(id, json) {
    var html = "";
    var row = json.rows;
    var errorsTotalNumber = json.total;


    if(row.length==0){
        $('#alertModal').find('p').text("未查询到该job编号，请确认后再次查询");
        $('#alertModal').modal('show');
    }else{
        for (var i = 0; i < row.length; i++) {
            html += "<tr>";
            html += "<td>" + row[i].jobid + "</td>";
            html += "<td>" + timeFormat(row[i].time) + "</td>";
            html += "<td>" + row[i].message + "</td>";
            html += "</tr>";
        };
    };
    $(id).html(html);
    $('#errorPage').jqPaginator('option', {
        totalCounts: errorsTotalNumber
    });

}

