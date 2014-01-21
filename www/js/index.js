function getStats(callback){
  var request = $.ajax({
    url: 'http://epicstats.herokuapp.com/stats/all',
    type: 'GET',
    beforeSend: function(xhr){xhr.setRequestHeader('Accept', 'application/json');}
  });

  request.done(function (res, textStatus, jqXHR){
    callback(null,res,textStatus, jqXHR);
  });

  request.fail(function (jqXHR, textStatus, errorThrown){
    callback(errorThrown,jqXHR, textStatus);
  });
}

function percentToColor(per){
  if(per > 60){
    return 'danger';
  }else if(per <= 60 && per > 40){
    return 'warning';
  }else{
    return 'success';
  }
}

var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var month=new Array();
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December";



function setPage(page){
  //$(".page").hide();
  //console.log('setting page ' + page)
  $('#myTab a[href="#'+page+'"]').tab('show')
}

function formatDate(d){
  d = new Date(d);
  return days[d.getDay()] + ' ' + month[d.getMonth()] + ' ' + d.getDate();
}

function drawUI(data){

  $("#resort-list").empty();

  data.forEach(function(r){

  var per = Math.round(r.busyIndex*100);
  
  var html = '<div class="list-group-item">';
  html += '<div class="row">';
    html += '<div class="col-xs-7"><h4>'+r.mountain+'</h4><p><b>Busiest Day</b><br>'+formatDate(r.max.lDate)+' ('+r.max.value+')</p></div>';
    html += '<div class="col-xs-5">';
        html += '<div class="progress">';
            html += '<div class="progress-bar progress-bar-'+percentToColor(per)+'" role="progressbar" aria-valuenow="'+per+'" aria-valuemin="0" aria-valuemax="100" style="width: '+per+'%">';
            html += '</div>';
        html += '</div>';
        html += '<p><b>Lifts/Minute</b><br>'+r.mean+'</p>';
    html += '</div></div></div>';

    $("#resort-list").append(html);
  });

  setPage('main');
}

var tries = 0;

function loadData(){
  if(tries >= 2){
    setPage('error-loading');
    return;
  }
  
  setPage('loading');

  tries++;
  getStats(function(err,results){
    if(err){
      alert('Failed to load data from remote server.')
      return loadData();
    }
    tries = 0;
    drawUI(results);
  });
}

$(document).ready(function(){

  $("#homeBtn").click(function(){
    loadData();
    return false;
  });

  $("#aboutBtn").click(function(){
    setPage('aboutpage');
    return false;
  });

  loadData();
});