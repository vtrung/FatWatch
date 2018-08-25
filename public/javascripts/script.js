function GetList(){
  $.ajax({
    url: "group/list",
    cache: false
  }).done(function(result) {
    //console.log(result);
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
    cache: false
  }).done(function(result) {
    //console.log(result);
    result.forEach((gp) =>{
      if(gp.groupname){
        $("#group-list").append('<li><a href="group/id/' + gp._id + '">' + gp.groupname + '</a></li>');
      }
    })
  });
}

// pass in groupid and username to addtouser list
function addUserToGroup(groupid, user){

}



function sanitizeData(entries){
    var hasht = {};
    var result = [];
    var group = [];

    entries.forEach(function(e){
      //console.log(e);
      //console.log(e.datetime);
      var user = e.user;
      if(e.datetime){
        //console.log("good");
        var date = new Date(e.datetime);
        var d = customDateFormat(date);
        var dhash = d+e.user;
        //console.log(d);
        if(!(dhash in hasht)){
          //console.log("test");
          //console.log(d);
          
          hasht[dhash] = true;
          var count = 1;
          var sum = e.weight;
          entries.forEach(function(j){

            if(j.datetime && j.user == e.user){
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
            y: avg,
            group:user
          }
          result.push(newitem);
        }
          
      } else {
        //console.log("bad");
      }
    })
    
    //console.log(hasht);
    //console.log(result);
    return result;
  }