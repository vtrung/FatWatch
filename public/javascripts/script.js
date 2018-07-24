function GetList(){
  $.ajax({
    url: "group/list",
    cache: false
  }).done(function(result) {
    console.log(result);
    result.forEach((gp) =>{
      if(gp.groupname){
        $("#group-list").append('<li><a href="group/id/' + gp._id + '">' + gp.groupname + '</a></li>');
      }
    })
  });
}

function groupGetUsers(groupid){
  $.ajax({
    url: "group/list",
    post: {},
    cache: false
  }).done(function(result) {
    console.log(result);
    result.forEach((gp) =>{
      if(gp.groupname){
        $("#group-list").append('<li><a href="group/id/' + gp._id + '">' + gp.groupname + '</a></li>');
      }
    })
  });
}

function sanitizeData(entries){
    var hasht = {};
    var result = [];

    entries.forEach(function(e){
      console.log(e);
      console.log(e.datetime);
      if(e.datetime){
        console.log("good");
        var date = new Date(e.datetime);
        var d = customDateFormat(date);
        console.log(d);
        if(!(d in hasht)){
          console.log("test");
          console.log(d);
          hasht[d] = true;
          var count = 1;
          var sum = e.weight;
          entries.forEach(function(j){
            if(j.datetime){
              var datej = new Date(j.datetime);
              var jd = customDateFormat(datej);
              if(j.datetime){
                count++;
                sum = sum + j.weight;
              }
            }
            
          });
          var avg = sum/count;
          var newitem = {
            x: d,
            y: avg
          }
          result.push(newitem);
        }
          
      } else {
        console.log("bad");
      }
    })
    
    console.log(hasht);
    console.log(result);
    return result;
  }