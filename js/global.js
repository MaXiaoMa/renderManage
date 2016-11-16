//var env = "Production";
//var url = "http://localhost.360xr.cn:3002/monitor";
var env = "development";
//var url = "http://localhost.360xr.cn:3001/monitor";
var url = "http://localhost:3002/monitor";

var imgurl = "http://img.360xr.cn:8086/";
var img2url = "http://img2.360xr.cn:8086/";

var joburl = url+"/jobs";
var jobidurl = url+"/jobs/jobid";
var jobprocessurl = joburl + "/process";
var slaveurl=url+"/slaves";
var taskurl = url+"/tasks";
var statisticurl=url+"/jobs/statistics";
var taskbyidurl = url+"/tasks?";
var queuesjoburl=url+"/queue";

var summaryurl=url+'/summary';
var summaryTSurl=url+'/summary/ts';
var groupsurl=url+'/groups';
var groupcreateurl=url+'/groups/create';
var machinebygroupurl=url+'/slaves/groupname';
var groupdeleteurl=url+'/groups/delete';
var groupupdateurl=url+'/groups/update';
var groupupdatebyslaveurl=url+'/groups/updatebs';
var slavedeleteurl=url+'/slaves/delete';
var slavecreateurl=url+'/slaves/create';
var slavecounturl=url+'/slaves/count';
var slaveupdateurl=url+'/slaves/update';

var serverstatusurl=url+'/settings/getqueue';
var serverstatuschangeurl=url+'/settings/getqueue/change';


var errorurl=url+'/errors';
var errorbyidurl=url+'/errors/id';

var tasksStatus={0:"排队中",1:"渲染中",2:"完成",3:"重新分配"};
var slavesStatus={0:"空闲",1:"忙碌",2:"离线"};
var groupsStatus={0:"空闲",1:"忙碌",2:"不可用"};
var jobsStatus={0:"排队中",1:"渲染中",2:"完成",3:"失败",4:"取消"};
var queuesStatus={"running":"进行中","idle":"空闲"};
var jobbuttonStatus={0:"btn btn-sm btn-info",1:"btn btn-sm  btn-success",2:"btn btn-sm btn-default",3:"btn btn-sm btn-danger",4:"btn btn-sm btn-warning"};
var taskbuttonStatus={0:"btn btn-sm btn-info",1:"btn btn-sm  btn-success",2:"btn btn-sm btn-default",3:"btn btn-sm btn-info"};
var slavebuttonStatus={0:"btn btn-sm btn-info",1:"btn btn-sm btn-success",2:"btn btn-sm btn-danger"};
var queuesbuttonStatus={"idle":"btn btn-sm btn-info","running":"btn btn-sm btn-success"};
var typelist={'折线':'line','曲线':'spline','柱形':'column','饼形':'pie'};
var selectlist={'天':0,'月':1,'年':2};

var date = new Date();

