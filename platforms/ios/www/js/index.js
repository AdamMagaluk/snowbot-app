var listTemplate = null;
var $targetList = null;

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

function formatDate(d){
  d = new Date(d);
  return days[d.getDay()] + ' ' + month[d.getMonth()] + ' ' + d.getDate();
}


function cleanupData(r){
  r.max.lDate = formatDate(r.max.lDate);
  r.per = Math.round(r.busyIndex*100);
  r.indicatorColor = percentToColor(r.per);
  if(r.mean < 0)
    r.mean = 0;
  return r;
}

var tries = 0;

function loadData(){
  if(tries >= 2){
    alert('Giving up...')
    return;
  }
  
  tries++;
  getStats(function(err,results){
    if(err){
      alert('Failed to load data from remote server.')
      return loadData();
    }
    tries = 0;

    $targetList.empty();

    results = results.map(cleanupData);

    results.forEach(function(r){
      $targetList.append(listTemplate(r));
    });

    $targetList.listview("refresh");
    $('#content').scrollz('hidePullHeader');
    
    //draw ui
  });
}

function onDeviceReady() {
  



}
  
document.addEventListener('deviceready', onDeviceReady, false);

$(document).ready(function(){

  if(navigator.userAgent.match(/iPhone OS 7/)) {
    $("body").addClass("ios7");
    
    //document.write('<style type="text/css">body{-webkit-transform: translate3d(0,20px,0)}</style>');
  }



  listTemplate = Handlebars.compile($("#list-template").html());

  $targetList = $('#items');

  // Load initial items
  loadData();
    
  $(document).on('pulled', '#content', function() {
    // Reload
    loadData();
  });

});
