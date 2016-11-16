$(function () {
    var title = "渲染信息监控<small class='glyphicon'>"+env+"</small>"
    $("#title").html(title);
    //初始化组信息
    initGroupData();
    //显示创建组的模态框Modal
    $('#createGroup').on('click', function () {
        $('#creatGroupModal').modal('show');
    });
    //绑定鼠标点击事件，创建组
    $('#submitinfo').on('click', function () {
        $('#creatGroupModal').modal('hide');
        createGroup();
    });
    //绑定enter事件，创建组
    $('#creatGroupModal').on('keyup', function (event) {
        if (event.keyCode == 13) {
            $('#creatGroupModal').modal('hide');
            createGroup();
        }
    });
    //显示创建机器的模态框Modal
    $('#addSlaves').on('click', function () {

        $('#addSlavesModal').modal('show');

    });
    //绑定鼠标点击事件，创建机器
    $('#createslave').on('click', function () {

        $('#addSlavesModal').modal('hide');
        createSlave();
    })
    //绑定enter事件，创建机器
    $('#addSlavesModal').keyup(function () {
        if (event.keyCode == 13) {
            $('#addSlavesModal').modal('hide');
            createSlave();
        }
    })
    //为提醒Modal绑定enter事件
    $('#alertModal').keyup(function () {
        if (event.keyCode == 13) {
            $('#alertModal').modal('hide');
        }
    })


    //模态框关闭时，解绑点击事件
    $('#addSlaves').on('hidden.bs.modal',function(){
        $('#createslave').off('click');
    });
    $('#updateSlaveModal').on('hidden.bs.modal',function(){
        $('#submitslave').off('click');
    })


});
//初始化组信息
function initGroupData() {
    var groupRequest = {};
    var groupId = '#groupstable';
    loadfile(groupsurl, groupRequest, fillgrouptable, groupId);
}
//创建组
function createGroup() {
    $.ajax({
        type: "POST",
        url: groupcreateurl,
        data: $('#groupinfo').serialize(),
        dataType: "jsonp",
        success: function (data) {
            if (data.status == 1) {
                initGroupData();
                $('#alertModal').find('p').text(data.info);
                $('#alertModal').modal('show');
            } else {
                $('#alertModal').find('p').text(data.info);
                $('#alertModal').modal('show');
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    })
};
//显示更新组的模态框Modal
function updateGroupModal(id, oldname, oldspeed, oldstatus) {
    $('#newname').val(oldname);
    $('#Speed').val(oldspeed);

    if (oldstatus == 0) {
        $("[value='0']").attr('selected', 'selected');
    } else if (oldstatus == 2) {
        $("[value='2']").attr('selected', 'selected');
    }


    $('#updateGroupModal').modal('show');
    $('#submitgroupupdate').one('click', function () {
        $('#updateGroupModal').modal('hide');
        updateGroup(id);
    });

    //绑定enter事件，更新组
    $('#updateGroupModal').bind('keyup', function () {
        if (event.keyCode == 13) {
            $('#updateGroupModal').modal('hide');
            updateGroup(id);
        }
    })
}
//ajax提交信息，更新组
function updateGroup(id) {
    var newname = $('#newname').val();
    var speed = $('#Speed').val();
    var newstatus = $('#status').val();
    var data = {id: id, newname: newname, speed: speed, newstatus: newstatus};
    $.ajax({
        type: 'GET',
        url: groupupdateurl,
        data: data,
        dataType: 'jsonp',
        success: function (json) {
            if (json.status == 1) {
                initGroupData();
                $('#alertModal').find('p').text(json.info);
                $('#alertModal').modal('show');
            } else {
                $('#alertModal').find('p').text(json.info);
                $('#alertModal').modal('show');
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
    $('#updateGroupModal').unbind('keyup');

}

function highLightChoosen(gid) {
    $('tr').removeClass('success');
    $(this).addClass('success');
    searchSlaves(gid);
}

function searchSlaves(gid) {
    var request = {gid: gid};
    var id = '#machinebygroupid';
    loadfile(machinebygroupurl, request, fillslaves, id);
}

function deleteGroup(id) {
    var request = {gid: id};
    $.ajax({
        type: "GET",
        url: slavecounturl,
        data: request,
        dataType: "jsonp",
        success: function (data) {
            if (data.num == 0) {
                var con = confirm('是否确定删除，删除后无法恢复！')
                if (con) {
                    var request = {id: id};
                    $.ajax({
                        type: 'GET',
                        url: groupdeleteurl,
                        data: request,
                        dataType: 'jsonp',
                        success: function (json) {
                            if (json.status == 1) {
                                initGroupData();
                                $('#alertModal').find('p').text(json.info);
                                $('#alertModal').modal('show');
                            } else {
                                $('#alertModal').find('p').text(json.info);
                                $('#alertModal').modal('show');
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    })
                }
            } else {
                alert('组不为空，不能删除！');
            }
        },
        error: function (a, b, c) {
            console.log(a, b, c);
        }
    })


}

function deleteSlave(id, gid,cores) {
    var con = confirm('是否确定删除，删除后无法恢复！')
    if (con) {
        var request = {id: id,gid:gid,cores:cores};
        $.ajax({
            type: 'GET',
            url: slavedeleteurl,
            data: request,
            dataType: 'jsonp',
            success: function (json) {
                if (json.status == 1) {

                    searchSlaves(gid);
                    initGroupData();
                    $('#alertModal').find('p').text(json.info);
                    $('#alertModal').modal('show');
                } else {
                    $('#alertModal').find('p').text(json.info);
                    $('#alertModal').modal('show');
                }

            },
            error: function (err) {
                console.log(err);
            }
        })
    }
};

function showSlaveModal(id, gid,cores,name,master,ip) {
    $("[value='"+gid+"']").attr('selected','selected');
    $("#slavename").text(name);
    //设置主机器单选框选择状态
    if(master==1){//此机器是否为主机器
        document.getElementById("masterslave").checked=true;
    }else{
        document.getElementById("masterslave").checked=false;
    }
    $('#updateSlaveModal').modal('show');//显示模态框


    var slavename="";
    $('#submitslave').on('click', function () {//点击确定按钮后
        var newgid = $('#slaveinfo').find('select').val();
        var isCheck=document.getElementById("masterslave").checked;
        if(isCheck&&gid==newgid&&master==1){
            $('#updateSlaveModal').modal('hide');//没有改变，不请求
        }else if(!isCheck&&gid==newgid&&master==0){
            $('#updateSlaveModal').modal('hide');//没有改变，不请求
        }else{
            if(master==1){//当机器原状态为主机器时，无论是否换组，本组都设置为noassign，其他组设置不变
                slavename="NoAssign";
            }else if(master==0){//当机器原状态为非主机器时，不换组的话，需查询后更改，换组的话，组的masterslave设置都不变
                if(isCheck&&gid==newgid){//在本组内设置为主机，需先查询
                    slavename=name;
                }else{
                    slavename="NoChange"
                }
            }
            var data = {id: id, gid: gid, newgid: newgid,cores:cores,slavename:slavename,ip:ip};
            $('#updateSlaveModal').modal('hide');
            updateSlave(data);
        }
    });
    //绑定enter事件，更新机器信息
   /* $('#updateSlaveModal').bind('keyup', function () {
        if (event.keyCode == 13) {
            var newgid = $('#slaveinfo').find('select').val();
            var data = {id: id, gid: gid, newgid: newgid,cores:cores,slavename: slavename}
            $('#updateSlaveModal').modal('hide');
            updateSlave(data);
        }
    });*/
}

function updateSlave(data) {
    $.ajax({
        type: 'GET',
        url: slaveupdateurl,
        data: data,
        dataType: 'jsonp',
        success: function (json) {
            if (json.status == 1) {
                searchSlaves(data.gid);
                initGroupData()
                $('#alertModal').find('p').text(json.info);
                $('#alertModal').modal('show');

            } else {
                $('#alertModal').find('p').text(json.info);
                $('#alertModal').modal('show');
            }

        },
        error: function (err) {
            console.log(err);
        }
    });
    $('#updateSlaveModal').unbind('keyup');

}

/*function updateGroupBySlave(gid, newgid, cores,status,slavename) {
    var data = {gid: gid, newgid: newgid,cores:cores, status: status,slavename:slavename};
    $.ajax({
        type: 'GET',
        url: groupupdatebyslaveurl,
        data: data,
        dataType: 'jsonp',
        success: function (json) {
            if (json.status == 1) {
                initGroupData()
            }

        },
        error: function (err) {
            console.log(err);
        }
    })
}*/

function createSlave() {
    var gid = $('#slavesinfo').find('select').val();
    $.ajax({
        type: "GET",
        url: slavecreateurl,
        data: $('#slavesinfo').serialize(),
        dataType: "jsonp",
        success: function (json) {
            if (json.status == 1) {
                var cores = $("#cores").val();
                searchSlaves(gid);
                initGroupData()
                $('#alertModal').find('p').text(json.info);
                $('#alertModal').modal('show');

            } else {
                $('#alertModal').find('p').text(json.info);
                $('#alertModal').modal('show');
            }

        },
        error: function (msg) {
            console.log(msg);
        }
    })
    $('#addSlavesModal').unbind('keyup');
}
